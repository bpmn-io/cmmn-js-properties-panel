'use strict';

var ModelUtil = require('cmmn-js/lib/util/ModelUtil'),
    is = ModelUtil.is,
    getBusinessObject = ModelUtil.getBusinessObject;

var isAny = require('cmmn-js/lib/features/modeling/util/ModelingUtil').isAny;


function isItemCapable(element) {
  return isAny(element, [
    'cmmn:PlanItem',
    'cmmn:DiscretionaryItem',
    'cmmn:CaseFileItem'
  ]);
}

module.exports.isItemCapable = isItemCapable;


function isCriterion(element) {
  return is(element, 'cmmn:Criterion');
}

module.exports.isCriterion = isCriterion;


function isCMMNEdge(element) {
  return is(element, 'cmmndi:CMMNEdge');
}

module.exports.isCMMNEdge = isCMMNEdge;


function getCMMNElementRef(element) {
  var bo = getBusinessObject(element);
  return bo && bo.cmmnElementRef;
}

module.exports.getCMMNElementRef = getCMMNElementRef;
