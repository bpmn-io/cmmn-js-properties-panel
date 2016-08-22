'use strict';

var elementHelper = require('../../../../helper/ElementHelper'),
    cmdHelper = require('../../../../helper/CmdHelper');

var utils = require('../../../../Utils');

var entryFactory = require('../../../../factory/EntryFactory');

var extensionElementsEntry = require('./ExtensionElements');


var fieldTypeOptions = [
  {
    name: 'String',
    value: 'string'
  },
  {
    name: 'Expression',
    value: 'expression'
  }
];

var CAMUNDA_FIELD_EXTENSION_ELEMENT = 'camunda:Field';

module.exports = function(element, cmmnFactory, options) {

  options = options || {};

  var getSelectedListener = options.getListener,
      reference = 'definitionRef';

  var entries = [];

  var isSelected = function(element, node) {
    return getSelectedField(element, node);
  };

  function getSelectedField(element, node) {
    var selected = fieldEntry.getSelected(element, node.parentNode);

    if (selected.idx === -1) {
      return;
    }

    var formFields = getCamundaListenerFields(element, node);

    return formFields[selected.idx];
  }

  function getCamundaListenerFields(element, node) {
    var selectedListener = getSelectedListener(element, node);
    return selectedListener && selectedListener.fields || [];
  }

  function getFieldType(bo) {
    var fieldType = 'string';

    var expressionValue = bo && bo.expression;
    var stringValue = bo && (bo.string || bo.stringValue);

    if (typeof stringValue !== 'undefined') {
      fieldType = 'string';
    } else if (typeof expressionValue !== 'undefined') {
      fieldType = 'expression';
    }

    return fieldType;
  }

  var setOptionLabelValue = function() {
    return function(element, node, option, property, value, idx) {
      var camundaFields = getCamundaListenerFields(element,node);
      var field = camundaFields[idx];

      value = (field.name) ? field.name : '<empty>';

      var label = idx + ' : ' + value;

      option.text = label;
    };
  };

  var newElement = function() {
    return function(element, extensionElements, value, node) {
      var props = {
        name: '',
        string: ''
      };

      var selectedListener = getSelectedListener(element, node);
      var newFieldElem = elementHelper.createElement(CAMUNDA_FIELD_EXTENSION_ELEMENT, props, selectedListener, cmmnFactory);
      return cmdHelper.addElementsTolist(element, selectedListener, 'fields', [ newFieldElem ]);

    };
  };

  var removeElement = function() {
    return function(element, extensionElements, value, idx, node) {
      var camundaFields= getCamundaListenerFields(element, node);
      var field = camundaFields[idx];
      if (field) {
        var selectedListener = getSelectedListener(element, node);
        return cmdHelper.removeElementsFromList(element, selectedListener, 'fields', null, [ field ]);
      }
    };
  };


  var fieldEntry = extensionElementsEntry(element, cmmnFactory, {
    id : 'listener-fields',
    label : 'Fields',
    modelProperty: 'fieldName',
    reference: reference,
    idGeneration: 'false',

    createExtensionElement: newElement(),
    removeExtensionElement: removeElement(),

    getExtensionElements: function(element, node) {
      return getCamundaListenerFields(element, node);
    },

    setOptionLabelValue: setOptionLabelValue()

  });
  entries.push(fieldEntry);


  entries.push(entryFactory.validationAwareTextField({
    id: 'listener-field-name',
    label: 'Name',
    reference: reference,
    modelProperty: 'fieldName',

    get: function(element, node) {
      return { fieldName: (getSelectedField(element, node) || {}).name };
    },

    set: function(element, values, node) {
      var selectedField = getSelectedField(element, node);
      return cmdHelper.updateBusinessObject(element, selectedField, { name : values.fieldName });
    },

    validate: function(element, values, node) {
      var bo = getSelectedField(element, node);

      var validation = {};
      if (bo) {
        var nameValue = values.fieldName;

        if (nameValue) {
          if (utils.containsSpace(nameValue)) {
            validation.fieldName = 'Name must not contain spaces';
          }
        }
        else {
          validation.fieldName = 'Parameter must have a name';
        }
      }

      return validation;
    },

    disabled: function(element, node) {
      return !isSelected(element, node);
    }

  }));


  entries.push(entryFactory.selectBox({
    id: 'listener-field-type',
    label: 'Type',
    selectOptions: fieldTypeOptions,
    reference: reference,
    modelProperty: 'fieldType',

    get: function(element, node) {
      var bo = getSelectedField(element, node);

      var fieldType = getFieldType(bo);

      return {
        fieldType: fieldType
      };
    },

    set: function(element, values, node) {
      var props = {
        'stringValue': undefined,
        'string': undefined,
        'expression': undefined
      };

      var fieldType = values.fieldType;

      if (fieldType === 'string') {
        props.string = '';
      }
      else if (fieldType === 'expression') {
        props.expression = '';
      }

      return cmdHelper.updateBusinessObject(element, getSelectedField(element, node), props);
    },

    disabled: function(element, node) {
      return !isSelected(element, node);
    }

  }));


  entries.push(entryFactory.textBox({
    id: 'listener-field-value',
    label: 'Value',
    reference: reference,
    modelProperty: 'fieldValue',

    get: function(element, node) {
      var bo = getSelectedField(element, node);
      var fieldType = getFieldType(bo);

      var fieldValue;

      if (fieldType === 'string') {
        fieldValue = bo && (bo.string || bo.stringValue);
      }
      else if (fieldType === 'expression') {
        fieldValue = bo && bo.expression;
      }

      return {
        fieldValue: fieldValue
      };
    },

    set: function(element, values, node) {
      var bo = getSelectedField(element, node);
      var fieldType = getFieldType(bo);

      var props = {};
      var fieldValue = values.fieldValue || undefined;

      if (fieldType === 'string') {
        props.string = fieldValue;
      }
      else if (fieldType === 'expression') {
        props.expression = fieldValue;
      }

      return cmdHelper.updateBusinessObject(element, bo, props);

    },

    validate: function(element, values, node) {
      var bo = getSelectedField(element, node);

      var validation = {};
      if (bo) {
        if (!values.fieldValue) {
          validation.fieldValue = 'Must provide a value';
        }
      }

      return validation;
    },

    show: function(element, node) {
      return isSelected(element, node);
    }

  }));

  return entries;

};
