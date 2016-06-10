'use strict';

var entryFactory = require('../../../../factory/EntryFactory');

var isOnPartConnection = require('../../../../helper/CmmnElementHelper').isOnPartConnection;

var ModelUtil = require('cmmn-js/lib/util/ModelUtil'),
    getStandardEvents = ModelUtil.getStandardEvents,
    getTransitions = ModelUtil.getTransitions;

var forEach = require('lodash/collection/forEach');


module.exports = function(element, options) {


  function getOptions(element) {

    var events,
        options = [];

    if (!isOnPartConnection(element)) {
      events = getTransitions(element);
    }
    else {
      events = getStandardEvents(element);
    }

    forEach(events, function(e) {
      options.push({ name: e, value: e });
    });

    return options;
  }


  options = options || {};


  var id = options.id,
      label = options.label,
      modelProperty = options.modelProperty,
      reference = options.reference,
      getter = options.get,
      setter = options.set,
      validator = options.validate,
      disabled = options.disabled,
      emptyParameter = options.emptyParameter;


  var transitionEntry = entryFactory.selectBox({

    id: id || 'transition',
    label: label || 'Transition',
    modelProperty: modelProperty || 'transition',
    reference: reference,
    selectOptions: getOptions(element),
    get: getter,
    set: setter,
    validate: validator,
    disabled: disabled,
    emptyParameter: emptyParameter !== false

  });

  return [ transitionEntry ];

};
