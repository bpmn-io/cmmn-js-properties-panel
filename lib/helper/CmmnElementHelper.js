'use strict';

var ModelUtil = require('cmmn-js/lib/util/ModelUtil'),
    is = ModelUtil.is,
    getBusinessObject = ModelUtil.getBusinessObject,
    getDefinition = ModelUtil.getDefinition,
    isCasePlanModel = ModelUtil.isCasePlanModel;

var isAny = require('cmmn-js/lib/features/modeling/util/ModelingUtil').isAny;

var filter = require('lodash/filter');

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


function isDiscretionaryConnection(element) {
  return !getCMMNElementRef(element);
}

module.exports.isDiscretionaryConnection = isDiscretionaryConnection;


function isAssociationConnection(element) {
  return is(getCMMNElementRef(element), 'cmmn:Association');
}

module.exports.isAssociationConnection = isAssociationConnection;


function isOnPartConnection(element) {
  return is(getCMMNElementRef(element), 'cmmn:OnPart');
}

module.exports.isOnPartConnection = isOnPartConnection;


function getCMMNElementRef(element) {
  var bo = getBusinessObject(element);
  return bo && bo.cmmnElementRef;
}

module.exports.getCMMNElementRef = getCMMNElementRef;


function isTextAnnotation(element) {
  return is(element, 'cmmn:TextAnnotation');
}

module.exports.isTextAnnotation = isTextAnnotation;


function isCMMNDiagram(element) {
  return is(element, 'cmmndi:CMMNDiagram');
}

module.exports.isCMMNDiagram = isCMMNDiagram;


function isAssignable(element) {
  return is(getDefinition(element), 'camunda:Assignable');
}

module.exports.isAssignable = isAssignable;


function isFormSupported(element) {
  return is(getDefinition(element), 'camunda:FormSupported');
}

module.exports.isFormSupported = isFormSupported;


function isTask(element) {
  return is(getDefinition(element), 'cmmn:Task');
}

module.exports.isTask = isTask;


function isHumanTask(element) {
  return is(getDefinition(element), 'cmmn:HumanTask');
}

module.exports.isHumanTask = isHumanTask;


function isMilestone(element) {
  return is(getDefinition(element), 'cmmn:Milestone');
}

module.exports.isMilestone = isMilestone;


function isEventListener(element) {
  return is(getDefinition(element), 'cmmn:EventListener');
}

module.exports.isEventListener = isEventListener;


function isStage(element) {
  return is(getDefinition(element), 'cmmn:Stage');
}

module.exports.isStage = isStage;


function isInOutBindingCapable(element) {
  return isAny(getDefinition(element), [
    'cmmn:ProcessTask',
    'cmmn:CaseTask'
  ]);
}

module.exports.isInOutBindingCapable = isInOutBindingCapable;


function getOutgoingOnParts(element, onPartFilter) {

  return filter(element.outgoing, function(con) {

    if (isOnPartConnection(con)) {

      if (onPartFilter && getCMMNElementRef(con) !== onPartFilter) {
        return false;
      }

      return true;

    }

    return false;

  });

}

module.exports.getOutgoingOnParts = getOutgoingOnParts;


function isCallable(element) {
  return isAny(getDefinition(element), [
    'cmmn:ProcessTask',
    'cmmn:CaseTask',
    'cmmn:DecisionTask'
  ]);
}

module.exports.isCallable = isCallable;


function isPlanItem(element) {
  return is(element, 'cmmn:PlanItem');
}

module.exports.isPlanItem = isPlanItem;


function isCaseExecutionListenerCapable(element) {

  if (isCasePlanModel(element)) {
    return true;
  }

  if (isPlanItem(element)) {

    var definition = getDefinition(element);
    return isAny(definition, [
      'cmmn:Task',
      'cmmn:Stage',
      'cmmn:Milestone'
    ]);

  }

  return false;

}

module.exports.isCaseExecutionListenerCapable = isCaseExecutionListenerCapable;


function isTaskListenerCapable(element) {
  return isPlanItem(element) && isHumanTask(element);
}

module.exports.isTaskListenerCapable = isTaskListenerCapable;


function isVariableListenerCapable(element) {

  if (isCasePlanModel(element)) {
    return true;
  }

  if (isPlanItem(element)) {

    var definition = getDefinition(element);
    return isAny(definition, [
      'cmmn:Task',
      'cmmn:Stage'
    ]);

  }

  return false;

}

module.exports.isVariableListenerCapable = isVariableListenerCapable;
