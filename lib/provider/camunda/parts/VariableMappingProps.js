'use strict';

var is = require('cmmn-js/lib/util/ModelUtil').is,
    getDefinition = require('cmmn-js/lib/util/ModelUtil').getDefinition;

var filter = require('lodash/filter');

var extensionElementsHelper = require('../../../helper/ExtensionElementsHelper'),
    cmdHelper = require('../../../helper/CmdHelper'),

    cmmnElementHelper = require('../../../helper/CmmnElementHelper'),
    isInOutBindingCapable = cmmnElementHelper.isInOutBindingCapable;

var extensionElementsEntry = require('./implementation/ExtensionElements');

var entryFactory = require('../../../factory/EntryFactory');


var inOutTypeOptions = [
  {
    name: 'Source',
    value: 'source'
  },
  {
    name: 'Source Expression',
    value: 'sourceExpression'
  },
  {
    name: 'All',
    value: 'variables'
  }
];

/**
  * return depend on parameter 'type' camunda:in or camunda:out extension elements
  */
function getCamundaInOutMappings(bo, type) {
  return (bo && extensionElementsHelper.getExtensionElements(bo, type)) || [];
}

/**
  * return depend on parameter 'type' camunda:in or camunda:out extension elements
  * with source or sourceExpression attribute
  */
function getVariableMappings(bo, type, reference) {
  var camundaMappings = getCamundaInOutMappings(bo, type);
  return filter(camundaMappings, function(mapping) {
    return !mapping.businessKey;
  });
}

function getInOutType(mapping) {
  var inOutType = 'source';

  if (mapping.variables === 'all') {
    inOutType = 'variables';
  }
  else if (typeof mapping.source !== 'undefined') {
    inOutType = 'source';
  }
  else if (typeof mapping.sourceExpression !== 'undefined') {
    inOutType = 'sourceExpression';
  }

  return inOutType;
}

var CAMUNDA_IN_EXTENSION_ELEMENT = 'camunda:In',
    CAMUNDA_OUT_EXTENSION_ELEMENT = 'camunda:Out';


module.exports = function(group, element, cmmnFactory) {

  if (!isInOutBindingCapable(element)) {
    return;
  }

  var isSelected = function(element, node) {
    return !!getSelected(element, node);
  };

  var getSelected = function(element, node) {
    var parentNode = node.parentNode;
    var selection = inEntry.getSelected(element, parentNode);

    var parameter = getVariableMappings(getDefinition(element), CAMUNDA_IN_EXTENSION_ELEMENT)[selection.idx];
    if (!parameter && outEntry) {
      selection = outEntry.getSelected(element, parentNode);
      parameter = getVariableMappings(getDefinition(element), CAMUNDA_OUT_EXTENSION_ELEMENT)[selection.idx];
    }
    return parameter;
  };

  var setOptionLabelValue = function(type) {
    return function(element, node, option, property, value, idx, bo) {
      var label = idx + ' : ';

      var variableMappings = getVariableMappings(bo, type);
      var mappingValue = variableMappings[idx];
      var mappingType = getInOutType(mappingValue);

      if (mappingType === 'variables') {
        label = label + 'all';
      }
      else if (mappingType === 'source') {
        label = label + (mappingValue.source || '<empty>');
      }
      else if (mappingType === 'sourceExpression') {
        label = label + (mappingValue.sourceExpression || '<empty>');
      }
      else {
        label = label + '<empty>';
      }

      option.text = label;
    };
  };

  var newElement = function(type) {
    return function(element, extensionElements, value) {
      var newElem = cmmnFactory.create(type, { source: '' });
      return cmdHelper.updateSemanticParent(newElem, extensionElements, 'values', element);
    };
  };

  var removeElement = function(type) {
    return function(element, extensionElements, value, idx) {
      var variablesMappings= getVariableMappings(getDefinition(element), type);
      var mapping = variablesMappings[idx];
      return extensionElementsHelper.removeEntry(getDefinition(element), element, mapping);
    };
  };

  // in mapping for source and sourceExpression ///////////////////////////////////////////////////////////////

  var inEntry = extensionElementsEntry(element, cmmnFactory, {
    id: 'variableMapping-in',
    label: 'In Mapping',
    modelProperty: 'source',
    prefix: 'In',
    idGeneration: false,
    resizable: true,
    reference: 'definitionRef',

    createExtensionElement: newElement(CAMUNDA_IN_EXTENSION_ELEMENT),
    removeExtensionElement: removeElement(CAMUNDA_IN_EXTENSION_ELEMENT),

    getExtensionElements: function(element, bo) {
      return getVariableMappings(bo, CAMUNDA_IN_EXTENSION_ELEMENT);
    },

    onSelectionChange: function(element, node, event, scope) {
      outEntry && outEntry.deselect(element, node.parentNode);
    },

    setOptionLabelValue: setOptionLabelValue(CAMUNDA_IN_EXTENSION_ELEMENT)
  });
  group.entries.push(inEntry);

  // out mapping for source and sourceExpression ///////////////////////////////////////////////////////

  var outEntry = extensionElementsEntry(element, cmmnFactory, {
    id: 'variableMapping-out',
    label: 'Out Mapping',
    modelProperty: 'source',
    prefix: 'Out',
    idGeneration: false,
    resizable: true,
    reference: 'definitionRef',

    createExtensionElement: newElement(CAMUNDA_OUT_EXTENSION_ELEMENT),
    removeExtensionElement: removeElement(CAMUNDA_OUT_EXTENSION_ELEMENT),

    getExtensionElements: function(element, bo) {
      return getVariableMappings(bo, CAMUNDA_OUT_EXTENSION_ELEMENT);
    },

    onSelectionChange: function(element, node, event, scope) {
      inEntry.deselect(element, node.parentNode);
    },

    setOptionLabelValue: setOptionLabelValue(CAMUNDA_OUT_EXTENSION_ELEMENT)
  });
  group.entries.push(outEntry);

  // label for selected mapping ///////////////////////////////////////////////////////

  group.entries.push(entryFactory.label({
    id: 'variableMapping-typeLabel',
    get: function(element, node) {
      var mapping = getSelected(element, node);

      var value = '';
      if (is(mapping, CAMUNDA_IN_EXTENSION_ELEMENT)) {
        value = 'In Mapping';
      }
      else if (is(mapping, CAMUNDA_OUT_EXTENSION_ELEMENT)) {
        value = 'Out Mapping';
      }

      return {
        label: value
      };
    },

    showLabel: function(element, node) {
      return isSelected(element, node);
    }
  }));


  group.entries.push(entryFactory.selectBox({
    id: 'variableMapping-inOutType',
    label: 'Type',
    selectOptions: inOutTypeOptions,
    modelProperty: 'inOutType',
    reference: 'definitionRef',
    get: function(element, node) {
      var mapping = getSelected(element, node) || {};
      return {
        inOutType: getInOutType(mapping)
      };
    },
    set: function(element, values, node) {
      var inOutType = values.inOutType;

      var props = {
        'source' : undefined,
        'sourceExpression' : undefined,
        'variables' : undefined
      };

      if (inOutType === 'source') {
        props.source = '';
      }
      else if (inOutType === 'sourceExpression') {
        props.sourceExpression = '';
      }
      else if (inOutType === 'variables') {
        props.variables = 'all';
      }

      var mapping = getSelected(element, node);
      return cmdHelper.updateBusinessObject(element, mapping, props);
    },
    disabled: function(element, node) {
      return !isSelected(element, node);
    }

  }));


  group.entries.push(entryFactory.textField({
    id: 'variableMapping-source',
    dataValueLabel: 'sourceLabel',
    modelProperty: 'source',
    reference: 'definitionRef',
    get: function(element, node) {
      var mapping = getSelected(element, node) || {};

      var label = '';
      var inOutType = getInOutType(mapping);
      if (inOutType === 'source') {
        label = 'Source';
      }
      else if (inOutType === 'sourceExpression') {
        label = 'Source Expression';
      }

      return {
        source: mapping[inOutType],
        sourceLabel: label
      };
    },
    set: function(element, values, node) {
      values.source = values.source || undefined;

      var mapping = getSelected(element, node);
      var inOutType = getInOutType(mapping);

      var props = {};
      props[inOutType] = values.source || '';

      return cmdHelper.updateBusinessObject(element, mapping, props);
    },
    // one of both (source or sourceExpression) must have a value to make
    // the configuration easier and more understandable
    // it is not engine conform
    validate: function(element, values, node) {
      var mapping = getSelected(element, node);

      var validation = {};
      if (mapping) {
        if (!values.source) {
          validation.source = 'Mapping must have a ' + values.sourceLabel.toLowerCase() || 'value';
        }
      }

      return validation;
    },
    disabled: function(element, node) {
      var selectedMapping = getSelected(element, node);
      return !selectedMapping || (selectedMapping && selectedMapping.variables);
    }
  }));


  group.entries.push(entryFactory.textField({
    id: 'variableMapping-target',
    label: 'Target',
    modelProperty: 'target',
    reference: 'definitionRef',
    get: function(element, node) {
      return {
        target: (getSelected(element, node) || {}).target
      };
    },
    set: function(element, values, node) {
      values.target = values.target || undefined;
      var mapping = getSelected(element, node);
      return cmdHelper.updateBusinessObject(element, mapping, values);
    },
    validate: function(element, values, node) {
      var mapping = getSelected(element, node);

      var validation = {};
      if (mapping) {
        var mappingType = getInOutType(mapping);
        if (!values.target && mappingType !== 'variables') {
          validation.target = 'Mapping must have a target';
        }
      }

      return validation;
    },
    disabled: function(element, node) {
      var selectedMapping = getSelected(element, node);
      return !selectedMapping || (selectedMapping && selectedMapping.variables);
    }
  }));


  group.entries.push(entryFactory.checkbox({
    id: 'variableMapping-local',
    label: 'Local',
    modelProperty: 'local',
    reference: 'definitionRef',
    get: function(element, node) {
      return {
        local: (getSelected(element, node) || {}).local
      };
    },
    set: function(element, values, node) {
      values.local = values.local || false;
      var mapping = getSelected(element, node);
      return cmdHelper.updateBusinessObject(element, mapping, values);
    },
    disabled: function(element, node) {
      var selectedMapping = getSelected(element, node);
      return !selectedMapping || is(selectedMapping, CAMUNDA_OUT_EXTENSION_ELEMENT);
    }
  }));

};
