'use strict';

var ConditionProp = require('./ConditionProp');

var cmdHelper = require('../../../../helper/CmdHelper');


module.exports = function(element, cmmnFactory, itemRegistry, options) {


  function getPlanItemControl(bo, controlRef) {
    return bo && bo.get(controlRef);
  }

  function getRule(bo, controlRef, ruleRef) {
    var control = getPlanItemControl(bo, controlRef);
    return control && control.get(ruleRef);
  }

  function getRuleCondition(bo, controlRef, ruleRef) {
    var rule = getRule(bo, controlRef, ruleRef);
    return rule && rule.get('condition');
  }


  options = options || {};

  var id = options.id,
      label = options.label,
      reference = options.reference,
      modelProperty = options.modelProperty,
      ruleType = options.ruleType,
      controlRef = options.controlRef,
      ruleRef = options.ruleRef;


  return ConditionProp(element, cmmnFactory, {

    id: id || 'rule',
    label: label || 'Rule',
    reference: reference,
    modelProperty: modelProperty,

    getCondition: function(element, node, bo) {
      return getRuleCondition(bo, controlRef, ruleRef);
    },

    createdCondition: function(condition, element, node, bo) {
      var cmds = [],
          control = getPlanItemControl(bo, controlRef),
          rule = getRule(bo, controlRef, ruleRef);

      if (!rule) {
        var ruleUpdate = {};
        ruleUpdate[ruleRef] = rule = cmmnFactory.create(ruleType);
        cmds.push(
          cmdHelper.updateProperties(control, ruleUpdate, itemRegistry.getShapes(bo)),
          cmdHelper.updateSemanticParent(rule, control, null, element)
        );
      }

      cmds.push(
        cmdHelper.updateProperties(rule, { condition: condition }, element),
        cmdHelper.updateSemanticParent(condition, rule, null, element)
      );

      return cmds;
    },

    removedCondition: function(condition, element, node, bo) {
      var cmds = [],
          control = getPlanItemControl(bo, controlRef),
          rule = getRule(bo, controlRef, ruleRef);

      if (rule) {
        cmds.push(
          cmdHelper.updateProperties(rule, { condition: undefined }, element),
          cmdHelper.updateSemanticParent(rule, null, null, element)
        );
      }

      if (control) {
        var ruleUpdate = {};
        ruleUpdate[ruleRef] = undefined;
        cmds.push(cmdHelper.updateProperties(control, ruleUpdate, itemRegistry.getShapes(bo)));
      }

      return cmds;
    },

    validate: options.validate,
    disabled: options.disabled

  });

};
