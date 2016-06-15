'use strict';

var isVariableListenerCapable = require('../../../helper/CmmnElementHelper').isVariableListenerCapable;

var listenerElements = require('./implementation/ListenerElements');

module.exports = function(group, element, cmmnFactory, elementRegistry, itemRegistry, cmmnRules, options) {


  var listenerProps = listenerElements(element, cmmnFactory, {
    id: 'variableListeners',
    label: 'Variable Listener',
    type: 'camunda:VariableListener',
    initialEvent: 'update',
    isApplicable: isVariableListenerCapable
  });

  if (listenerProps.entries && listenerProps.entries.length) {
    group.entries = group.entries.concat(listenerProps.entries);
  }

  return {
    register : listenerProps.register,
    getSelectedListener: listenerProps.getSelectedListener
  };

};
