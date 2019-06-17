'use strict';

var escapeHTML = require('../../../../Utils').escapeHTML;

var ModelUtil = require('cmmn-js/lib/util/ModelUtil'),
    getBusinessObject = ModelUtil.getBusinessObject,
    isCasePlanModel = ModelUtil.isCasePlanModel;

var domQuery = require('min-dom').query,
    domClosest = require('min-dom').closest,
    domify = require('min-dom').domify,
    forEach = require('lodash/forEach');

var elementHelper = require('../../../../helper/ElementHelper'),
    cmdHelper = require('../../../../helper/CmdHelper'),
    utils = require('../../../../Utils');

function getSelectBox(node, id) {
  var currentTab = domClosest(node, 'div.cpp-properties-tab');
  var query = 'select[name=selectedExtensionElement]' + (id ? '[id=cam-extensionElements-' + id + ']' : '');
  return domQuery(query, currentTab);
}

function getSelected(node, id) {
  var selectBox = getSelectBox(node, id);
  return {
    value: (selectBox || {}).value,
    idx: (selectBox || {}).selectedIndex
  };
}

function generateElementId(prefix) {
  prefix = prefix + '_';
  return utils.nextId(prefix);
}

var CREATE_EXTENSION_ELEMENT_ACTION = 'create-extension-element',
    REMOVE_EXTENSION_ELEMENT_ACTION = 'remove-extension-element';

module.exports = function(element, cmmnFactory, options) {

  var id = options.id,
      prefix = options.prefix || 'elem',
      label = options.label || id,
      reference = options.reference,
      idGeneration = (options.idGeneration === false) ? options.idGeneration : true;

  var modelProperty = options.modelProperty || 'id';

  var getElements = options.getExtensionElements;

  var createElement = options.createExtensionElement,
      canCreate = typeof createElement === 'function';

  var removeElement = options.removeExtensionElement,
      canRemove = typeof removeElement === 'function';

  var onSelectionChange = options.onSelectionChange;

  var hideElements = options.hideExtensionElements,
      canBeHidden = typeof hideElements === 'function';

  var setOptionLabelValue = options.setOptionLabelValue;

  var defaultSize = options.size || 5,
      resizable = options.resizable;

  var selectionChanged = function(element, node, event, scope) {
    if (typeof onSelectionChange === 'function') {
      return onSelectionChange(element, node, event, scope);
    }
  };

  var createOption = function(value) {
    return '<option value="' + escapeHTML(value) + '" data-value data-name="extensionElementValue">' + escapeHTML(value) + '</option>';
  };

  var initSelectionSize = function(selectBox, optionsLength) {
    if (resizable) {
      selectBox.size = optionsLength > defaultSize ? optionsLength : defaultSize;
    }
  };

  var getBO = function(element, reference) {
    var bo = getBusinessObject(element);

    if (reference) {
      bo = bo && bo.get(reference);

      if (!bo &&
          isCasePlanModel(element) &&
          reference === 'definitionRef') {
        bo = getBusinessObject(element);
      }
    }

    return bo;
  };

  return {
    id: id,
    html: '<div class="cpp-row cpp-element-list" ' +
            (canBeHidden ? 'data-show="hideElements"' : '') + '>' +
            '<label for="cam-extensionElements-' + escapeHTML(id) + '">' + escapeHTML(label) + '</label>' +
            '<div class="cpp-field-wrapper">' +
              '<select id="cam-extensionElements-' + escapeHTML(id) + '"' +
                      'name="selectedExtensionElement" ' +
                      'size="' + escapeHTML(defaultSize) + '" ' +
                      'data-list-entry-container ' +
                      'data-on-change="selectElement">' +
              '</select>' +
              (canCreate ? '<button class="add" ' +
                                   'id="cam-extensionElements-create-' + escapeHTML(id) + '" ' +
                                   'data-action="createElement">' +
                             '<span>+</span>' +
                           '</button>' : '') +
              (canRemove ? '<button class="clear" ' +
                                   'id="cam-extensionElements-remove-' + escapeHTML(id) + '" ' +
                                   'data-action="removeElement" ' +
                                   'data-disable="disableRemove">' +
                             '<span>-</span>' +
                           '</button>' : '') +
            '</div>' +
          '</div>',

    get: function(element, node) {
      var elements = getElements(element, getBO(element, reference));

      var result = [];
      forEach(elements, function(elem) {
        result.push({
          extensionElementValue: elem.get(modelProperty)
        });
      });

      var selectBox = getSelectBox(node.parentNode, id);
      initSelectionSize(selectBox, result.length);

      return result;
    },

    set: function(element, values, node) {
      var action = this.__action;
      delete this.__action;

      var bo = getBO(element, reference);
      var extensionElements = bo.get('extensionElements');

      if (action.id === CREATE_EXTENSION_ELEMENT_ACTION) {
        var commands = [];
        if (!extensionElements) {
          extensionElements = elementHelper.createElement('cmmn:ExtensionElements', { values: [] }, bo, cmmnFactory);
          commands.push(cmdHelper.updateProperties(bo, { extensionElements: extensionElements }, element));
        }
        commands.push(createElement(element, extensionElements, action.value, bo));
        return commands;

      }
      else if (action.id === REMOVE_EXTENSION_ELEMENT_ACTION) {
        return removeElement(element, extensionElements, action.value, action.idx, bo);
      }

    },

    createListEntryTemplate: function(value, index, selectBox) {
      initSelectionSize(selectBox, selectBox.options.length + 1);
      return createOption(value.extensionElementValue);
    },

    deselect: function(element, node) {
      var selectBox = getSelectBox(node, id);
      selectBox.selectedIndex = -1;
    },

    getSelected: function(element, node) {
      return getSelected(node, id);
    },

    setControlValue: function(element, node, option, property, value, idx) {
      node.value = value;

      if (!setOptionLabelValue) {
        node.text = value;
      }
      else {
        var bo = getBO(element, reference);
        setOptionLabelValue(element, node, option, property, value, idx, bo);
      }
    },

    createElement: function(element, node) {
      // create option template
      var generatedId;
      if (idGeneration) {
        generatedId = generateElementId(prefix);
      }

      var selectBox = getSelectBox(node, id);
      var template = domify(createOption(generatedId));

      // add new empty option as last child element
      selectBox.appendChild(template);

      // select last child element
      selectBox.lastChild.selected = 'selected';
      selectionChanged(element, node);

      // update select box size
      initSelectionSize(selectBox, selectBox.options.length);

      this.__action = {
        id: CREATE_EXTENSION_ELEMENT_ACTION,
        value: generatedId
      };

      return true;
    },

    removeElement: function(element, node) {
      var selection = getSelected(node, id);

      var selectBox = getSelectBox(node, id);
      selectBox.removeChild(selectBox.options[selection.idx]);

      // update select box size
      initSelectionSize(selectBox, selectBox.options.length);

      this.__action = {
        id: REMOVE_EXTENSION_ELEMENT_ACTION,
        value: selection.value,
        idx: selection.idx
      };

      return true;
    },

    hideElements: function(element, entryNode, node, scopeNode) {
      return !hideElements(element, entryNode, node, scopeNode);
    },

    disableRemove: function(element, entryNode, node, scopeNode) {
      return (getSelected(entryNode, id) || {}).idx < 0;
    },

    selectElement: selectionChanged
  };

};
