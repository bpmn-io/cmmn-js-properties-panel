'use strict';

var ListenerEventTypeProp = require('./implementation/ListenerEventTypeProp'),
    ListenerDelegateProp = require('./implementation/ListenerDelegateProp');

var CmmnElementHelper = require('../../../helper/CmmnElementHelper'),
    isCaseExecutionListenerCapable = CmmnElementHelper.isCaseExecutionListenerCapable,
    isTaskListenerCapable = CmmnElementHelper.isTaskListenerCapable,
    isVariableListenerCapable = CmmnElementHelper.isVariableListenerCapable;

module.exports = function(group, element, cmmnFactory, elementRegistry, itemRegistry, cmmnRules, translate, options) {


  options = options || {};

  var getListener = options.getListener;


  if (!isCaseExecutionListenerCapable(element) && !isTaskListenerCapable(element) && !isVariableListenerCapable(element)) {
    return;
  }

  group.entries = group.entries.concat(ListenerEventTypeProp(element, translate, {
    getListener: getListener
  }));


  group.entries = group.entries.concat(ListenerDelegateProp(element, cmmnFactory, translate, {
    getListener: getListener
  }));

};
