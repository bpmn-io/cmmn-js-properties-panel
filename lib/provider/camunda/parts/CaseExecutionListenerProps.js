'use strict';

var CmmnElementHelper = require('../../../helper/CmmnElementHelper'),
    isCaseExecutionListenerCapable = CmmnElementHelper.isCaseExecutionListenerCapable,
    isMilestone = CmmnElementHelper.isMilestone,
    isEventListener = CmmnElementHelper.isEventListener;

var listenerElements = require('./implementation/ListenerElements');

module.exports = function(group, element, cmmnFactory, elementRegistry, itemRegistry, cmmnRules, options) {

  var initialEvent = isMilestone(element) || isEventListener(element) ? 'occur' : 'complete';

  var listenerProps = listenerElements(element, cmmnFactory, {
    id: 'caseExecutionListeners',
    label: 'Case Execution Listener',
    type: 'camunda:CaseExecutionListener',
    initialEvent: initialEvent,
    isApplicable: isCaseExecutionListenerCapable
  });

  if (listenerProps.entries && listenerProps.entries.length) {
    group.entries = group.entries.concat(listenerProps.entries);
  }

  return {
    register : listenerProps.register,
    getSelectedListener: listenerProps.getSelectedListener
  };

};
