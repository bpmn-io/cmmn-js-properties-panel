'use strict';

var cmdHelper = require('../../../helper/CmdHelper');
var TransitionProp = require('../../cmmn/parts/implementation/TransitionProp');

var ModelUtil = require('cmmn-js/lib/util/ModelUtil'),
    getBusinessObject = ModelUtil.getBusinessObject,
    isCasePlanModel = ModelUtil.isCasePlanModel,
    getDefinition = ModelUtil.getDefinition;

var CmmnElementHelper = require('../../../helper/CmmnElementHelper'),
    isTask = CmmnElementHelper.isTask,
    isStage = CmmnElementHelper.isStage;


module.exports = function(group, element, cmmnFactory, elementRegistry, itemRegistry, cmmnRules, options) {

  function getItemControl(element) {
    var bo = getBusinessObject(element);
    return bo && bo.get('itemControl');
  }

  function getDefaultControl(element) {
    var bo = getDefinition(element);
    return bo && bo.get('defaultControl');
  }

  function getPlanItemControl(element, isDefaultControl) {
    return isDefaultControl ? getDefaultControl(element) : getItemControl(element);
  }

  function getRepetitionRule(element, isDefaultControl) {
    var control = getPlanItemControl(element, isDefaultControl);
    return control && control.get('repetitionRule');
  }

  function getRepeatOnStandardEvent(element, isDefaultControl) {
    var rule = getRepetitionRule(element, isDefaultControl);
    return rule && rule.get('camunda:repeatOnStandardEvent');
  }

  function isEntryCriteriaAttached(element) {
    var bo = getBusinessObject(element),
        criteria = bo.get('entryCriteria');
    return !!(criteria && criteria.length);
  }

  if (isCasePlanModel(element) || (!isTask(element) && !isStage(element))) {
    return;
  }

  options = options || {};

  var isDefaultControl = options.isDefaultControl,
      idPrefix = (isDefaultControl ? 'default' : 'item') + 'Control',
      property = 'camunda:repeatOnStandardEvent';

  var excludeTransitions = [
    'fault',
    'parentResume',
    'parentSuspend',
    'reactivate',
    'resume',
    'suspend',
    'terminate'
  ];


  // repeat on standard event
  group.entries = group.entries.concat(TransitionProp(element, {

    id: idPrefix + 'RepeatOnStandardEvent',
    label: 'Repeat On Standard Event',
    modelProperty: 'repeatOnStandardEvent',
    exclude: excludeTransitions,

    get: function(element, node, bo) {

      var event = getRepeatOnStandardEvent(bo, isDefaultControl) || '';
      return {
        repeatOnStandardEvent: event
      };

    },

    set: function(element, values, node, bo) {

      var rule = getRepetitionRule(bo, isDefaultControl),
          update = {};

      update[property] = values.repeatOnStandardEvent || undefined;
      return cmdHelper.updateProperties(rule, update, itemRegistry.getShapes(bo));

    },

    disabled: function(element) {
      return !getRepetitionRule(element, isDefaultControl);
    },

    validate: function(element, values, node, bo) {

      var itemControlRule = getRepetitionRule(element),
          validate = {},
          warning;


      if (!isDefaultControl) {

        var itemRepeatOnStandardEvent = getRepeatOnStandardEvent(bo);

        if (itemControlRule && itemRepeatOnStandardEvent && isEntryCriteriaAttached(element)) {
          warning = 'Event is ignored due to entry criteria';
        }

      }
      else {

        var defaultControlRule = getRepetitionRule(bo, isDefaultControl),
            defaultRepeatOnStandardEvent = getRepeatOnStandardEvent(bo, isDefaultControl);

        if (defaultControlRule && defaultRepeatOnStandardEvent) {

          if (isEntryCriteriaAttached(element)) {
            warning = 'Event is ignored due to entry criteria';
          }
          else if (itemControlRule) {
            warning = 'Event is overwritten by item control\'s repetition rule';
          }

        }

      }

      if (warning) {
        validate = { repeatOnStandardEvent: { warning: warning } };
      }

      return validate;

    }

  }));

};
