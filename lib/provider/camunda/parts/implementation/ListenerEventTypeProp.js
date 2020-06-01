'use strict';

var is = require('cmmn-js/lib/util/ModelUtil').is;

var TransitionProp = require('../../../cmmn/parts/implementation/TransitionProp');

var cmdHelper = require('../../../../helper/CmdHelper'),
    entryFactory = require('../../../../factory/EntryFactory');

module.exports = function(element, translate, options) {


  options = options || {};

  var getListener = options.getListener,
      idSuffix = 'EventType',
      label = translate('Event Type'),
      modelProperty = 'eventType',
      reference = 'definitionRef';


  var getEventType = function(element, node) {
    var listener = getListener(element, node),
        value = {};

    value[modelProperty] = (listener && listener.event) || '';

    return value;
  };

  var setEventType = function(element, values, node) {
    var listener = getListener(element, node),
        eventType = values[modelProperty] || undefined;
    return cmdHelper.updateProperties(listener, { event: eventType }, element);
  };

  var hideEntry = function(type) {
    return function(element, node) {
      return !is(getListener(element, node), type);
    };
  };

  var validate = function(element, values) {
    var value = values[modelProperty],
        validate = {};

    if (!value) {
      validate[modelProperty] = {
        warning: translate('Listener is notified for all kinds of events')
      };
    }

    return validate;
  };


  var caseExecutionListenerEventEntry = TransitionProp(element, translate, {

    id: 'caseExecutionListener' + idSuffix,
    label: label,
    modelProperty: modelProperty,
    reference: reference,
    emptyParameter: true,

    get: getEventType,
    set: setEventType,
    hideEntry: hideEntry('camunda:CaseExecutionListener'),
    validate: validate

  })[0];


  var taskListenerEventEntry = entryFactory.selectBox({

    id: 'taskListener' + idSuffix,
    label: label,
    modelProperty: modelProperty,
    reference: reference,
    selectOptions: [
      { name: translate('create'), value: 'create' },
      { name: translate('assignment'), value: 'assignment' },
      { name: translate('complete'), value: 'complete' },
      { name: translate('delete'), value: 'delete' }
    ],
    emptyParameter: true,

    get: getEventType,
    set: setEventType,
    hideEntry: hideEntry('camunda:TaskListener'),
    validate: validate

  });


  var variableListenerEventEntry = entryFactory.selectBox({

    id: 'variableListener' + idSuffix,
    label: label,
    modelProperty: modelProperty,
    reference: reference,
    selectOptions: [
      { name: translate('create'), value: 'create' },
      { name: translate('update'), value: 'update' },
      { name: translate('delete'), value: 'delete' }
    ],
    emptyParameter: true,

    get: getEventType,
    set: setEventType,
    hideEntry: hideEntry('camunda:VariableListener'),
    validate: validate

  });


  return [ caseExecutionListenerEventEntry, taskListenerEventEntry, variableListenerEventEntry ];

};
