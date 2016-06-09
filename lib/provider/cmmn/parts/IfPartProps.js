'use strict';

var cmdHelper = require('../../../helper/CmdHelper');
var ConditionProp = require('./implementation/ConditionProp');

var CmmnElementHelper = require('../../../helper/CmmnElementHelper'),
    isCriterion = CmmnElementHelper.isCriterion,
    isItemCapable = CmmnElementHelper.isItemCapable;

var ModelUtil = require('cmmn-js/lib/util/ModelUtil'),
    isCasePlanModel = ModelUtil.isCasePlanModel,
    getBusinessObject = ModelUtil.getBusinessObject;

var getParent = require('cmmn-js/lib/features/modeling/util/ModelingUtil').getParent;

module.exports = function(group, element, cmmnFactory) {

  function getIfPart(bo) {
    return bo && bo.get('ifPart');
  }

  function getIfPartCondition(bo) {
    var ifPart = getIfPart(bo);
    return ifPart && ifPart.get('condition');
  }


  if (!isCriterion(element)) {
    return;
  }


  group.entries = group.entries.concat(ConditionProp(element, cmmnFactory, {

    id: 'ifPartCondition',
    label: 'If Part Condition',
    reference: 'sentryRef',

    getCondition: function(element, node, bo) {
      return getIfPartCondition(bo);
    },

    createdCondition: function(condition, element, node, bo) {
      var cmds = [],
          ifPart = getIfPart(bo);

      if (!bo) {

        // criterion without referencing a sentry
        bo = cmmnFactory.create('cmmn:Sentry');

        var container = getSentryParent(element.host),
            criterion = getBusinessObject(element);
        if (container) {
          cmds.push(
            cmdHelper.updateProperties(criterion, { sentryRef: bo }, element),
            cmdHelper.updateSemanticParent(bo, container, 'sentries', element)
          );
        }

      }

      if (!ifPart) {
        ifPart = cmmnFactory.create('cmmn:IfPart');
        cmds.push(
          cmdHelper.updateProperties(bo, { ifPart: ifPart }, element),
          cmdHelper.updateSemanticParent(ifPart, bo, null, element)
        );
      }

      cmds.push(
        cmdHelper.updateProperties(ifPart, { condition: condition }, element),
        cmdHelper.updateSemanticParent(condition, ifPart, null, element)
      );

      return cmds;
    },

    removedCondition: function(condition, element, node, bo) {
      var cmds = [],
          ifPart = getIfPart(bo);

      if (ifPart) {
        cmds.push(
          cmdHelper.updateProperties(ifPart, { condition: undefined }, element),
          cmdHelper.updateProperties(bo, { ifPart: undefined }, element),
          cmdHelper.updateSemanticParent(ifPart, null, null, element)
        );
      }

      return cmds;
    }

  }));

};


function getSentryParent(host) {

  if (isCasePlanModel(host)) {
    return getBusinessObject(host);
  }

  if (isItemCapable(host)) {
    var bo = getBusinessObject(host);
    return getParent(bo, 'cmmn:PlanFragment');
  }

}