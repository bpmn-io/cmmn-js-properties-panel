'use strict';

var cmdHelper = require('../../../helper/CmdHelper'),
    entryFactory = require('../../../factory/EntryFactory');

var isCallable = require('../../../helper/CmmnElementHelper').isCallable;

var getBusinessObject = require('cmmn-js/lib/util/ModelUtil').getBusinessObject,
    getDefinition = require('cmmn-js/lib/util/ModelUtil').getDefinition;


var ATTR_DECL = {
  'cmmn:CaseTask': {
    'ref': 'caseRef',
    'expression': 'caseRefExpression'
  },

  'cmmn:ProcessTask': {
    'ref': 'processRef',
    'expression': 'processRefExpression'
  },

  'cmmn:DecisionTask': {
    'ref': 'decisionRef',
    'expression': 'decisionRefExpression'
  }
};


module.exports = function(group, element, cmmnFactory, elementRegistry, itemRegistry) {

  if (!isCallable(element)) {
    return;
  }


  function getAttribute(element, prop) {
    var bo = getBusinessObject(element),
        type = bo && bo.$type;
    return (ATTR_DECL[type] || {})[prop];
  }


  var validate = function(prop) {
    return function(element, values, node, bo) {
      var attr = getAttribute(bo, prop),
          validate = {};

      if (!values[attr]) {
        validate[attr] = 'Must provide a value';
      }

      return validate;
    };
  };


  group.entries.push(entryFactory.selectBox({

    id: 'callableRefType',
    label: 'Type',
    selectOptions: [
      { name: 'Reference', value: 'ref' },
      { name: 'Expression', value: 'expression' }
    ],
    modelProperty: 'type',
    reference: 'definitionRef',

    get: function(element, node, bo) {

      var refAttr = getAttribute(bo, 'ref'),
          expAttr = getAttribute(bo, 'expression'),
          ref = bo && bo.get(refAttr),
          expression = bo && bo.get(expAttr);

      return {
        type: (ref || !expression) ? 'ref' : 'expression'
      };

    },

    set: function(element, values, node, bo) {

      var refAttr = getAttribute(bo, 'ref'),
          expAttr = getAttribute(bo, 'expression'),
          type = values.type,
          update = {};

      update[refAttr] = type === 'ref' ? '' : undefined;
      update[expAttr] = type === 'expression' ? cmmnFactory.create('cmmn:Expression') : undefined;

      return cmdHelper.updateProperties(bo, update, element);

    }

  }));


  group.entries.push(entryFactory.textField({

    id: 'callableReference',
    label: 'Reference',
    reference: 'definitionRef',
    modelProperty: getAttribute(getDefinition(element), 'ref'),

    validate: validate('ref'),

    disabled: function(element) {

      var definition = getDefinition(element),
          refAttr = getAttribute(definition, 'ref'),
          refExpAttr = getAttribute(definition, 'expression'),
          ref = definition && definition.get(refAttr),
          expression = definition && definition.get(refExpAttr);

      return !ref && expression;

    }

  }));


  group.entries.push(entryFactory.textField({

    id: 'callableReferenceExpression',
    label: 'Expression',
    reference: 'definitionRef',
    modelProperty: getAttribute(getDefinition(element), 'expression'),

    validate: validate('expression'),

    get: function(element, node, bo) {

      var attr = getAttribute(bo, 'expression'),
          expression = bo.get(attr),
          value = {};

      value[attr] = expression && expression.get('body');

      return value;

    },

    set: function(element, values, node, bo) {

      var attr = getAttribute(bo, 'expression'),
          expression = bo.get(attr),
          value = values[attr] || undefined;

      return cmdHelper.updateProperties(expression, { body: value }, element);

    },

    disabled: function(element) {

      var definition = getDefinition(element),
          refAttr = getAttribute(definition, 'ref'),
          refExpAttr = getAttribute(definition, 'expression'),
          ref = definition && definition.get(refAttr),
          expression = definition && definition.get(refExpAttr);

      return ref || !expression;

    }

  }));


};
