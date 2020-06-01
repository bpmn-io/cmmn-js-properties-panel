'use strict';

var assign = require('lodash/assign'),
    forEach = require('lodash/forEach');

var extensionElementsEntry = require('./ExtensionElements'),
    extensionElementsHelper = require('../../../../helper/ExtensionElementsHelper'),
    cmdHelper = require('../../../../helper/CmdHelper');

var getDefinition = require('cmmn-js/lib/util/ModelUtil').getDefinition,
    getListenerType = require('../../../../helper/ListenerHelper').getListenerType;

var noop = function() {};


module.exports = function(element, cmmnFactory, translate, options) {

  var LISTENER_TYPE_LABEL = {
    class: translate('Java Class'),
    expression: translate('Expression'),
    delegateExpression: translate('Delegate Expression'),
    script: translate('Script')
  };

  function createListener(type, attrs) {
    return cmmnFactory.create(type, attrs);
  }

  function getListeners(bo, type) {
    return extensionElementsHelper.getExtensionElements(bo, type) || [];
  }

  function getListener(bo, type, idx) {
    var listeners = getListeners(bo, type);
    return listeners[idx];
  }


  options = options || {};

  var type = options.type,
      id = options.id,
      label = options.label,
      isApplicable = options.isApplicable || false,
      initialEvent = options.initialEvent || undefined,
      entries = [],
      listenerElementSiblings = [];


  var listenerEntry,
      register = noop,
      getSelectedListener = noop;


  if (isApplicable && isApplicable(element)) {

    listenerEntry = extensionElementsEntry(element, cmmnFactory, {

      id: id,
      label: label,
      modelProperty: 'name',
      reference: 'definitionRef',
      resizable: true,

      createExtensionElement: function(element, extensionElements, value, bo) {
        var listener = createListener(type, { event: initialEvent });
        return cmdHelper.updateSemanticParent(listener, extensionElements, 'values', element);
      },

      removeExtensionElement: function(element, extensionElements, value, idx, bo) {
        var listener = getListener(bo, type, idx);
        return cmdHelper.updateSemanticParent(listener, null, 'values', element);
      },

      getExtensionElements: function(element) {
        var definition = getDefinition(element);
        return definition && getListeners(definition, type);
      },

      setOptionLabelValue: function(element, node, option, property, value, idx, bo) {
        var listener = getListener(bo, type, idx),
            listenerType = getListenerType(listener),
            event = listener && listener.get('event');

        option.text = (event || '*') + ' : ' + (LISTENER_TYPE_LABEL[listenerType] || '');
      },

      onSelectionChange: function(element, node, event, scope) {
        forEach(listenerElementSiblings, function(sibling) {
          sibling.deselect(element, node);
        });
      }

    });

    // add flag that this entry is a listener element
    assign(listenerEntry, {
      isListenerElements: true
    });


    register = function(groups) {
      forEach(groups, function(group) {
        forEach(group.entries, function(entry) {
          if (entry.isListenerElements && entry.deselect) {
            listenerElementSiblings.push(entry);
          }
        });
      });
    };

    getSelectedListener = function(element, node) {
      var definition = getDefinition(element),
          selection = listenerEntry.getSelected(element, node) || { idx: -1 };

      if (selection && selection.idx > -1) {
        return getListener(definition, type, selection.idx);
      }
    };

    entries.push(listenerEntry);

  }


  return {
    entries: entries,
    register: register,
    getSelectedListener: getSelectedListener
  };

};
