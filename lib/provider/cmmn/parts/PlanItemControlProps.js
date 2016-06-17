'use strict';

var RuleProp = require('./implementation/RuleProp');

var cmdHelper = require('../../../helper/CmdHelper');

var ModelUtil = require('cmmn-js/lib/util/ModelUtil'),
    getBusinessObject = ModelUtil.getBusinessObject,
    isCasePlanModel = ModelUtil.isCasePlanModel,
    getDefinition = ModelUtil.getDefinition;

var CmmnElementHelper = require('../../../helper/CmmnElementHelper'),
    isTask = CmmnElementHelper.isTask,
    isStage = CmmnElementHelper.isStage,
    isMilestone = CmmnElementHelper.isMilestone;

module.exports = function(group, element, cmmnFactory, elementRegistry, itemRegistry, cmmnRules, options) {


  function getItemControl(element) {
    var bo = getBusinessObject(element);
    return bo && bo.get(itemControlProp);
  }

  function getDefaultControl(element) {
    var bo = getDefinition(element);
    return bo && bo.get(defaultControlProp);
  }

  function hasItemControl(element) {
    var bo = getBusinessObject(element);
    return !!(bo && bo.get(itemControlProp));
  }

  function hasDefaultControl(element) {
    var bo = getDefinition(element);
    return !!(bo && bo.get(defaultControlProp));
  }

  function isPlanItemControlAvailable(element, isDefaultControl) {
    return isDefaultControl ? hasDefaultControl(element) : hasItemControl(element);
  }



  function validateRule(prop) {

    return function(element, values, node, definition) {
      var itemControl = getItemControl(element),
          itemRule = itemControl && itemControl.get(prop),
          defaultControl = getDefaultControl(definition),
          defaultRule = defaultControl && defaultControl.get(prop),
          result = {};

      if (itemRule && defaultRule) {
        result[prop] = { warning: 'Rule is overwritten by item control' };
      }

      return result;
    };

  }


  if (isCasePlanModel(element) ||
      (!isTask(element) &&
      !isStage(element) &&
      !isMilestone(element))) {
    return;
  }


  options = options || {};

  var defaultControlProp = 'defaultControl',
      itemControlProp = 'itemControl',
      manualActivationRuleProp = 'manualActivationRule',
      requiredRuleProp = 'requiredRule',
      repetitionRuleProp = 'repetitionRule';

  var isDefaultControl = options.isDefaultControl,
      idPrefix = (isDefaultControl ? 'default' : 'item') + 'Control',
      reference = isDefaultControl ? 'definitionRef' : undefined,
      controlRef = isDefaultControl ? defaultControlProp : itemControlProp;


  group.entries.push({

    id: idPrefix + 'ControlAction',
    html: '<div class="cpp-row cpp-action">' +
             '<div data-show="canBeAdded">' +
                '<label>Add ' + (isDefaultControl ? 'Default' : 'Item') + ' Control</label>' +
                '<button class="add" data-action="add"><span>+</span></button>' +
             '</div>' +
             '<div data-show="canBeRemoved">' +
                '<label>Remove ' + (isDefaultControl ? 'Default' : 'Item') + ' Control</label>' +
                '<button class="clear" data-action="remove"><span>x</span></button>' +
             '</div>' +
          '</div>',

    canBeAdded: function(element) {
      return !isPlanItemControlAvailable(element, isDefaultControl);
    },
    canBeRemoved: function(element) {
      return isPlanItemControlAvailable(element, isDefaultControl);
    },
    add: function() {
      this.__action = 'add';
      return { force: true };
    },
    remove: function() {
      this.__action = 'remove';
      return { force: true };
    },
    set: function(element) {

      var action = this.__action;
      delete this.__action;

      var bo = isDefaultControl ? getDefinition(element) : getBusinessObject(element),
          cmds = [],
          update = {},
          parent,
          control;


      if (action === 'add') {
        control = cmmnFactory.create('cmmn:PlanItemControl');
        update[controlRef] = control;
        parent = bo;
      }
      else if (action === 'remove') {
        control = isDefaultControl ? getDefaultControl(element) : getItemControl(element);
        update[controlRef] = undefined;
        parent = undefined;
      }

      cmds.push(
        cmdHelper.updateProperties(bo, update, itemRegistry.getShapes(bo)),
        cmdHelper.updateSemanticParent(control, parent, null, element)
      );

      return cmds;
    }

  });


  // manual activation rule
  if (cmmnRules.canSetManualActivationRule(element)) {

    group.entries = group.entries.concat(RuleProp(element, cmmnFactory, itemRegistry, {

      id: idPrefix + 'ManualActivationRule',
      label: 'Manual Activation Rule',
      reference: reference,
      controlRef: controlRef,
      ruleType: 'cmmn:ManualActivationRule',
      ruleRef: manualActivationRuleProp,
      modelProperty: manualActivationRuleProp,
      validate: isDefaultControl ? validateRule(manualActivationRuleProp) : undefined,
      disabled: function(element) {
        return !isPlanItemControlAvailable(element, isDefaultControl);
      }

    }));

  }


  // required rule
  if (cmmnRules.canSetRequiredRule(element)) {

    group.entries = group.entries.concat(RuleProp(element, cmmnFactory, itemRegistry, {

      id: idPrefix + 'RequiredRule',
      label: 'Required Rule',
      reference: reference,
      controlRef: controlRef,
      ruleType: 'cmmn:RequiredRule',
      ruleRef: requiredRuleProp,
      modelProperty: requiredRuleProp,
      validate: isDefaultControl ? validateRule(requiredRuleProp) : undefined,
      disabled: function(element) {
        return !isPlanItemControlAvailable(element, isDefaultControl);
      }

    }));

  }


  // repetition rule
  if (cmmnRules.canSetRepetitionRule(element)) {

    group.entries = group.entries.concat(RuleProp(element, cmmnFactory, itemRegistry, {

      id: idPrefix + 'RepetitionRule',
      label: 'Repetition Rule',
      reference: reference,
      controlRef: controlRef,
      ruleType: 'cmmn:RepetitionRule',
      ruleRef: repetitionRuleProp,
      modelProperty: repetitionRuleProp,
      validate: isDefaultControl ? validateRule(repetitionRuleProp) : undefined,
      disabled: function(element) {
        return !isPlanItemControlAvailable(element, isDefaultControl);
      }

    }));

  }

};
