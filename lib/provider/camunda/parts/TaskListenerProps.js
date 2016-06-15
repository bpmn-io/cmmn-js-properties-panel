'use strict';

var isTaskListenerCapable = require('../../../helper/CmmnElementHelper').isTaskListenerCapable;

var listenerElements = require('./implementation/ListenerElements');

module.exports = function(group, element, cmmnFactory, elementRegistry, itemRegistry, cmmnRules, options) {


  var listenerProps = listenerElements(element, cmmnFactory, {
    id: 'taskListeners',
    label: 'Task Listener',
    type: 'camunda:TaskListener',
    initialEvent: 'create',
    isApplicable: isTaskListenerCapable
  });

  if (listenerProps.entries && listenerProps.entries.length) {
    group.entries = group.entries.concat(listenerProps.entries);
  }

  return {
    register : listenerProps.register,
    getSelectedListener: listenerProps.getSelectedListener
  };

};
