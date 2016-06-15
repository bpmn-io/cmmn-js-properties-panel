'use strict';

var cmdHelper = require('../../../../helper/CmdHelper'),
    entryFactory = require('../../../../factory/EntryFactory');

var ScriptProp = require('./ScriptProp');

var getListenerType = require('../../../../helper/ListenerHelper').getListenerType;


module.exports = function(element, cmmnFactory, options) {

  options = options || {};

  var getListener = options.getListener,
      reference = 'definitionRef',
      classProp = 'class',
      expressionProp = 'expression',
      delegateExpressionProp = 'delegateExpression',
      scriptProp = 'script',
      entries = [];


  var getDelegate = function(prop) {
    return function(element, node) {
      var listener = getListener(element, node),
          value = {};
      value[prop] = (listener && listener.get(prop)) || undefined;
      return value;
    };
  };

  var setDelegate = function(prop) {
    return function(element, values, node) {
      var listener = getListener(element, node),
          update = {};
      update[prop] = values[prop] || '';
      return cmdHelper.updateProperties(listener, update, element);
    };
  };

  var hideDelegateEntry = function(prop) {
    return function(elment, node) {
      var listener = getListener(element, node);
      return !listener || getListenerType(listener) !== prop;
    };
  };

  var validate = function(prop) {
    return function(element, values) {
      var value = values[prop],
          validate = {};

      if (!value) {
        validate[prop] = 'Must provide a value';
      }

      return validate;
    };
  };


  entries.push(entryFactory.selectBox({

    id: 'listenerType',
    label: 'Listener Type',
    modelProperty: 'type',
    reference: reference,
    selectOptions: [
      { value: classProp, name: 'Java Class' },
      { value: expressionProp, name: 'Expression' },
      { value: delegateExpressionProp, name: 'Delegate Expression' },
      { value: scriptProp, name: 'Script' }
    ],
    emptyParameter: false,

    get: function(element, node) {

      var listener = getListener(element, node);
      return {
        type: getListenerType(listener)
      };

    },

    set: function(element, values, node) {

      var listener = getListener(element, node),
          type = values.type || undefined,
          update = {};

      update[classProp] = type === classProp ? '' : undefined;
      update[expressionProp] = type === expressionProp ? '' : undefined;
      update[delegateExpressionProp] = type === delegateExpressionProp ? '' : undefined;
      update[scriptProp] = type === scriptProp ? cmmnFactory.create('camunda:Script') : undefined;

      return cmdHelper.updateProperties(listener, update, element);

    }

  }));


  entries.push(entryFactory.textField({

    id: 'listenerClass',
    label: 'Java Class',
    modelProperty: classProp,
    reference: reference,

    get: getDelegate(classProp),
    set: setDelegate(classProp),
    hideEntry: hideDelegateEntry(classProp),
    validate: validate(classProp)

  }));


  entries.push(entryFactory.textField({

    id: 'listenerExpression',
    label: 'Expression',
    modelProperty: expressionProp,
    reference: reference,

    get: getDelegate(expressionProp),
    set: setDelegate(expressionProp),
    hideEntry: hideDelegateEntry(expressionProp),
    validate: validate(expressionProp)

  }));


  entries.push(entryFactory.textField({

    id: 'listenerDelegateExpression',
    label: 'Delegate Expression',
    modelProperty: delegateExpressionProp,
    reference: reference,

    get: getDelegate(delegateExpressionProp),
    set: setDelegate(delegateExpressionProp),
    hideEntry: hideDelegateEntry(delegateExpressionProp),
    validate: validate(delegateExpressionProp)

  }));


  entries = entries.concat(ScriptProp(element, {
    getScript: function(element, node) {
      var listener = getListener(element, node),
          type = getListenerType(listener);
      return type === scriptProp && listener && listener.get(scriptProp);
    }
  }));


  return entries;
};
