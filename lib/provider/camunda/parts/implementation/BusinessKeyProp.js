'use strict';

var entryFactory = require('../../../../factory/EntryFactory');

var extensionElementsHelper = require('../../../../helper/ExtensionElementsHelper'),
    elementHelper = require('../../../../helper/ElementHelper'),
    cmdHelper = require('../../../../helper/CmdHelper');

var ModelUtil = require('cmmn-js/lib/util/ModelUtil'),
    getDefinition = ModelUtil.getDefinition;

var forEach = require('lodash/collection/forEach');


var BUSINESS_KEY_VALUE = '#{caseExecution.caseBusinessKey}';

function getCamundaInWithBusinessKey(element) {
  var camundaIn = [],
      bo = getDefinition(element);

  var camundaInParams = bo && extensionElementsHelper.getExtensionElements(bo, 'camunda:In');
  if (camundaInParams) {
    forEach(camundaInParams, function(param) {
      if (param.businessKey) {
        camundaIn.push(param);
      }
    });
  }
  return camundaIn;
}

function setBusinessKey(element, cmmnFactory) {
  var bo = getDefinition(element),
      commands = [];

  var extensionElements = bo && bo.extensionElements;

  if (!extensionElements) {
    extensionElements = elementHelper.createElement('cmmn:ExtensionElements', { values: [] }, bo, cmmnFactory);

    commands.push(cmdHelper.updateProperties(bo, { extensionElements: extensionElements }));
  }

  var camundaIn = elementHelper.createElement(
    'camunda:In',
    { 'businessKey': BUSINESS_KEY_VALUE },
    extensionElements,
    cmmnFactory
  );

  commands.push(cmdHelper.addAndRemoveElementsFromList(
    element,
    extensionElements,
    'values',
    'extensionElements',
    [ camundaIn ]
  ));

  return commands;
}

function deleteBusinessKey(element) {
  var camundaInExtensions = getCamundaInWithBusinessKey(element),
      commands = [];

  forEach(camundaInExtensions, function(elem) {
    commands.push(extensionElementsHelper.removeEntry(getDefinition(element), element, elem));
  });

  return commands;
}


module.exports = function(element, cmmnFactory, options) {

  options = options || {};

  var id = options.id,
      label = options.label,
      reference = options.reference,
      modelProperty = options.modelProperty;


  var businessKeyEntry = entryFactory.checkbox({
    id: id || 'business-key',
    label: label || 'Business Key',
    modelProperty: modelProperty,
    reference: reference,

    get: function(element, node) {
      var camundaIn = getCamundaInWithBusinessKey(element);

      return {
        callableBusinessKey: !!(camundaIn && camundaIn.length > 0)
      };
    },

    set: function(element, values, node) {
      if (values.callableBusinessKey) {
        return setBusinessKey(element, cmmnFactory);
      } else {
        return deleteBusinessKey(element);
      }
    }
  });

  return businessKeyEntry;

};
