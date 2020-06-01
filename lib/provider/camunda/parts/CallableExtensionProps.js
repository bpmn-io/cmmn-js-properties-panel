'use strict';

var entryFactory = require('../../../factory/EntryFactory');

var BusinessKeyProp = require('./implementation/BusinessKeyProp');

var cmdHelper = require('../../../helper/CmdHelper'),
    cmmnElementHelper = require('../../../helper/CmmnElementHelper'),
    isCallable = cmmnElementHelper.isCallable,
    isInOutBindingCapable = cmmnElementHelper.isInOutBindingCapable;

var ModelUtil = require('cmmn-js/lib/util/ModelUtil'),
    getBusinessObject = ModelUtil.getBusinessObject,
    getDefinition = ModelUtil.getDefinition,
    is = ModelUtil.is;

var assign = require('lodash/assign');


var attributeInfo = {
  'cmmn:CaseTask': {
    binding: 'camunda:caseBinding',
    version: 'camunda:caseVersion',
    tenantId: 'camunda:caseTenantId'
  },

  'cmmn:ProcessTask': {
    binding: 'camunda:processBinding',
    version: 'camunda:processVersion',
    tenantId: 'camunda:processTenantId'
  },

  'cmmn:DecisionTask': {
    binding: 'camunda:decisionBinding',
    version: 'camunda:decisionVersion',
    tenantId: 'camunda:decisionTenantId'
  }
};


module.exports = function(group, element, cmmnFactory, elementRegistry, itemRegistry, translate) {

  if (!isCallable(element)) {
    return;
  }


  function getAttribute(element, prop) {
    var bo = getBusinessObject(element),
        type = bo && bo.$type;
    return (attributeInfo[type] || {})[prop];
  }

  function getCallableBindingValue(element) {
    var definition = getDefinition(element);
    var attr = getAttribute(definition, 'binding');
    return definition && definition.get(attr);
  }


  var getValue = function(modelProp, prop, defaultValue) {
    return function(element, node, bo) {
      var value = {};
      value[modelProp] = (bo && bo.get(prop)) || defaultValue;
      return value;
    };
  };

  var setValue = function(modelProp, prop, defaultValue) {
    return function(element, values, node, bo) {
      var update = {};
      update[prop] = values[modelProp] || defaultValue;
      return cmdHelper.updateProperties(bo, update, element);
    };
  };


  group.entries.push(entryFactory.selectBox({
    id: 'callableBinding',
    label: translate('Binding'),
    selectOptions: [
      {
        name: translate('latest'),
        value: 'latest'
      },
      {
        name: translate('deployment'),
        value: 'deployment'
      },
      {
        name: translate('version'),
        value: 'version'
      }
    ],
    modelProperty: 'callableBinding',
    reference: 'definitionRef',

    get: function(element, node, bo) {

      var attr = getAttribute(bo, 'binding');

      return {
        callableBinding: (attr && bo.get(attr)) || 'latest'
      };

    },

    set: function(element, values, node, bo) {

      var binding = values.callableBinding,
          attr = getAttribute(bo, 'binding'),
          attrVer = getAttribute(bo, 'version');

      var props = {};
      props[attr] = binding;
      // set version value always on undefined to delete the existing value
      props[attrVer] = undefined;

      return cmdHelper.updateProperties(bo, props, element);

    }

  }));


  group.entries.push(entryFactory.textField({
    id: 'callable-version',
    label: translate('Version'),
    modelProperty: 'callableVersion',
    reference: 'definitionRef',

    get: getValue('callableVersion', getAttribute(getDefinition(element), 'version')),
    set: setValue('callableVersion', getAttribute(getDefinition(element), 'version')),

    validate: function(element, values, node) {

      var version = values.callableVersion,
          validate = {};

      if ((getCallableBindingValue(element) === 'version') && !version) {
        validate.callableVersion = translate('Must provide a value');
      }

      return validate;

    },

    disabled: function(element, node) {
      return getCallableBindingValue(element) !== 'version';
    }

  }));


  group.entries.push(entryFactory.textField({
    id: 'tenant-id',
    label: translate('Tenant Id'),
    modelProperty: 'callableTenantId',
    reference: 'definitionRef',

    get: getValue('callableTenantId', getAttribute(getDefinition(element), 'tenantId')),
    set: setValue('callableTenantId', getAttribute(getDefinition(element), 'tenantId'))

  }));


  group.entries.push(entryFactory.textField({
    id: 'dmn-resultVariable',
    label: translate('Result Variable'),
    modelProperty: 'resultVariable',
    reference: 'definitionRef',

    get: getValue('resultVariable', 'camunda:resultVariable'),

    set: function(element, values, node, bo) {
      var resultVariable = values.resultVariable || undefined;

      var props = {
        'camunda:resultVariable': resultVariable
      };

      if (is(bo, 'camunda:DecisionTask') && !resultVariable) {
        assign(props, {
          'camunda:mapDecisionResult': 'resultList'
        });
      }

      return cmdHelper.updateProperties(bo, props, element);
    },

    disabled: function(element, node) {
      var definition = getDefinition(element);
      return !is(definition, 'camunda:DecisionTask');
    }

  }));


  group.entries.push(entryFactory.selectBox({
    id: 'dmn-map-decision-result',
    label: translate('Map Decision Result'),
    selectOptions: [
      {
        name: translate('singleEntry'),
        value: 'singleEntry'
      },
      {
        name: translate('singleResult'),
        value: 'singleResult'
      },
      {
        name: translate('collectEntries'),
        value: 'collectEntries'
      },
      {
        name: translate('resultList'),
        value: 'resultList'
      }
    ],
    modelProperty: 'mapDecisionResult',
    reference: 'definitionRef',

    get: getValue('mapDecisionResult', 'camunda:mapDecisionResult', 'resultList'),

    set: function(element, values, node, bo) {
      var update = { 'camunda:mapDecisionResult': values.mapDecisionResult || 'resultList' };
      return cmdHelper.updateProperties(bo, update, element);
    },

    disabled: function(element, node) {
      var definition = getDefinition(element);
      var resultVariable = definition && definition.get('camunda:resultVariable');
      return !(is(definition, 'camunda:DecisionTask') && typeof resultVariable !== 'undefined');
    }

  }));

  // businessKey only for ProcessTask and CaseTask
  if (isInOutBindingCapable(element)) {
    group.entries.push(BusinessKeyProp(element, cmmnFactory, translate, {

      id: 'callable-business-key',
      label: translate('Business Key'),
      modelProperty: 'callableBusinessKey',
      reference: 'definitionRef'

    }));
  }

};
