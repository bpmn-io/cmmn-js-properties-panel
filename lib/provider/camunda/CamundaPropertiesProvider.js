'use strict';

var inherits = require('inherits');

var is = require('cmmn-js/lib/util/ModelUtil').is;

var CmmnElementHelper = require('../../helper/CmmnElementHelper'),
    isCMMNEdge = CmmnElementHelper.isCMMNEdge,
    getCMMNElementRef = CmmnElementHelper.getCMMNElementRef;

var PropertiesActivator = require('../../PropertiesActivator');

// cmmn properties

// item properties
var caseProps = require('../cmmn/parts/CaseProps'),
    idProps = require('../cmmn/parts/IdProps'),
    nameProps = require('../cmmn/parts/NameProps'),
    documentationProps = require('../cmmn/parts/DocumentationProps');

// detail properties
var ifPartProps = require('../cmmn/parts/IfPartProps'),
    humanTaskProps = require('./parts/HumanTaskProps'),
    onPartProps = require('../cmmn/parts/OnPartProps'),
    variableMapping = require('./parts/VariableMappingProps');

// plan item control properties
var planItemControlProps = require('../cmmn/parts/PlanItemControlProps'),
    repeatOnStandardEventProps = require('./parts/RepeatOnStandardEventProps');

// definition props
var definitionIdProps = require('../cmmn/parts/DefinitionIdProps'),
    definitionNameProps = require('../cmmn/parts/DefinitionNameProps'),
    definitionDocumentationProps = require('../cmmn/parts/DefinitionDocumentationProps'),
    callableProps = require('../cmmn/parts/CallableProps'),
    callableExtensionProps = require('./parts/CallableExtensionProps');

// listener
var caseExecutionListenerProps = require('./parts/CaseExecutionListenerProps'),
    variableListenerProps = require('./parts/VariableListenerProps'),
    taskListenerProps = require('./parts/TaskListenerProps'),
    listenerDetailProps = require('./parts/ListenerDetailProps'),
    listenerFields = require('./parts/ListenerFieldInjectionProps');

// history time to live
var historyTimeToLive = require('./parts/HistoryTimeToLiveProps');


var getListenerLabel = function(listener, translate) {

  if (is(listener, 'camunda:CaseExecutionListener')) {
    return translate('Case Execution Listener');
  }

  if (is(listener, 'camunda:TaskListener')) {
    return translate('Task Listener');
  }

  if (is(listener, 'camunda:VariableListener')) {
    return translate('Variable Listener');
  }

  return '';
};


function createGeneralTabGroups(element, cmmnFactory, elementRegistry, itemRegistry, cmmnRules, translate) {

  var generalGroup = {
    id: 'general',
    label: translate('General'),
    entries: []
  };

  caseProps(generalGroup, element, cmmnFactory, elementRegistry, itemRegistry, cmmnRules, translate);
  idProps(generalGroup, element, cmmnFactory, elementRegistry, itemRegistry, cmmnRules, translate);
  nameProps(generalGroup, element, cmmnFactory, elementRegistry, itemRegistry, cmmnRules, translate);


  var detailsGroup = {
    id: 'details',
    label: translate('Details'),
    entries: []
  };

  onPartProps(detailsGroup, element, cmmnFactory, elementRegistry, itemRegistry, translate);
  ifPartProps(detailsGroup, element, cmmnFactory, elementRegistry, itemRegistry, translate);
  humanTaskProps(detailsGroup, element, cmmnFactory, elementRegistry, itemRegistry, translate);
  callableProps(detailsGroup, element, cmmnFactory, elementRegistry, itemRegistry, translate);
  callableExtensionProps(detailsGroup, element, cmmnFactory, elementRegistry, itemRegistry, translate);


  var documentationGroup = {
    id: 'documentation',
    label: translate('Documentation'),
    entries: []
  };

  documentationProps(documentationGroup, element, cmmnFactory, elementRegistry, itemRegistry, cmmnRules, translate);


  var historyTimeToLiveGroup = {
    id: 'historyConfiguration',
    label: translate('History Configuration'),
    entries: []
  };

  historyTimeToLive(historyTimeToLiveGroup, element, cmmnFactory, elementRegistry, itemRegistry, translate);

  return [
    generalGroup,
    detailsGroup,
    documentationGroup,
    historyTimeToLiveGroup
  ];
}


function createRulesTabGroups(element, cmmnFactory, elementRegistry, itemRegistry, cmmnRules, translate) {

  var itemControlGroup = {
    id: 'itemControl',
    label: translate('Item Control'),
    entries: []
  };

  planItemControlProps(itemControlGroup, element, cmmnFactory, elementRegistry, itemRegistry, cmmnRules, translate);
  repeatOnStandardEventProps(itemControlGroup, element, cmmnFactory, elementRegistry, itemRegistry, cmmnRules, translate);


  var defaultControlGroup = {
    id: 'defaultControl',
    label: translate('Default Control'),
    entries: []
  };

  planItemControlProps(defaultControlGroup, element, cmmnFactory, elementRegistry, itemRegistry, cmmnRules, translate, {
    isDefaultControl: true
  });
  repeatOnStandardEventProps(defaultControlGroup, element, cmmnFactory, elementRegistry, itemRegistry, cmmnRules, translate, {
    isDefaultControl: true
  });

  return [
    itemControlGroup,
    defaultControlGroup
  ];
}


function createVariablesTabGroups(element, cmmnFactory, elementRegistry, itemRegistry, cmmnRules, translate) {

  var variablesGroup = {
    id : 'variables',
    label : translate('Variables'),
    entries: []
  };

  variableMapping(variablesGroup, element, cmmnFactory, elementRegistry, itemRegistry, cmmnRules, translate);

  return [
    variablesGroup
  ];
}


function createListenerTabGroups(element, cmmnFactory, elementRegistry, itemRegistry, cmmnRules, translate) {

  var caseExecutionListenerGroup = {
    id: 'caseExecutionListeners',
    label: translate('Case Execution Listeners'),
    entries: []
  };

  var caseExecutionListenerProvider = caseExecutionListenerProps(
    caseExecutionListenerGroup,
    element,
    cmmnFactory,
    elementRegistry,
    itemRegistry,
    cmmnRules,
    translate
  );


  var taskListenerGroup = {
    id: 'taskListeners',
    label: translate('Task Listeners'),
    entries: []
  };

  var taskListenerProvider = taskListenerProps(
    taskListenerGroup,
    element,
    cmmnFactory,
    elementRegistry,
    itemRegistry,
    cmmnRules,
    translate
  );


  var variableListenerGroup = {
    id: 'variableListeners',
    label: translate('Variable Listeners'),
    entries: []
  };

  var variableListenerProvider = variableListenerProps(
    variableListenerGroup,
    element,
    cmmnFactory,
    elementRegistry,
    itemRegistry,
    cmmnRules,
    translate
  );


  caseExecutionListenerProvider.register([ taskListenerGroup, variableListenerGroup ]);
  taskListenerProvider.register([ caseExecutionListenerGroup, variableListenerGroup ]);
  variableListenerProvider.register([ caseExecutionListenerGroup, taskListenerGroup ]);


  function getSelectedListener(element, node) {

    return caseExecutionListenerProvider.getSelectedListener(element, node) ||
           taskListenerProvider.getSelectedListener(element, node) ||
           variableListenerProvider.getSelectedListener(element, node);
  }


  var listenerDetailsGroup = {
    id: 'listenerDetails',
    entries: [],
    enabled: function(element, node) {
      return getSelectedListener(element, node);
    },
    label: function(element, node) {
      var param = getSelectedListener(element, node);
      return getListenerLabel(param, translate);
    }
  };

  listenerDetailProps(
    listenerDetailsGroup,
    element,
    cmmnFactory,
    elementRegistry,
    itemRegistry,
    cmmnRules,
    translate,
    { getListener : getSelectedListener }
  );


  var listenerFieldsGroup = {
    id: 'listener-fields',
    label: translate('Field Injection'),
    entries: [],
    enabled: function(element, node) {
      return getSelectedListener(element, node);
    }
  };

  listenerFields(
    listenerFieldsGroup,
    element,
    cmmnFactory,
    elementRegistry,
    itemRegistry,
    cmmnRules,
    translate,
    { getListener : getSelectedListener }
  );


  return [
    caseExecutionListenerGroup,
    taskListenerGroup,
    variableListenerGroup,
    listenerDetailsGroup,
    listenerFieldsGroup
  ];
}


function createDefinitionTabGroups(element, cmmnFactory, elementRegistry, itemRegistry, cmmnRules, translate) {

  var detailsGroup = {
    id: 'definitionDetails',
    label: translate('Details'),
    entries: []
  };

  definitionIdProps(detailsGroup, element, cmmnFactory, elementRegistry, itemRegistry, cmmnRules, translate);
  definitionNameProps(detailsGroup, element, cmmnFactory, elementRegistry, itemRegistry, cmmnRules, translate);


  var documentationGroup = {
    id: 'definitionDocumentation',
    label: translate('Documentation'),
    entries: []
  };

  definitionDocumentationProps(documentationGroup, element, cmmnFactory, elementRegistry, itemRegistry, cmmnRules, translate);

  return [
    detailsGroup,
    documentationGroup
  ];
}


// Camunda Properties Provider /////////////////////////////////////


/**
 * A properties provider for Camunda related properties.
 *
 * @param {EventBus} eventBus
 * @param {CmmnFactory} cmmnFactory
 * @param {ElementRegistry} elementRegistry
 */
function CamundaPropertiesProvider(eventBus, cmmnFactory, elementRegistry, itemRegistry, cmmnRules, translate) {

  PropertiesActivator.call(this, eventBus);

  this.getTabs = function(element) {

    var generalTab = {
      id: 'general',
      label: translate('General'),
      groups: createGeneralTabGroups(element, cmmnFactory, elementRegistry, itemRegistry, cmmnRules, translate)
    };

    var rulesTab = {
      id: 'rules',
      label: translate('Rules'),
      groups: createRulesTabGroups(element, cmmnFactory, elementRegistry, itemRegistry, cmmnRules, translate)
    };

    var variablesTab = {
      id: 'variables',
      label: translate('Variables'),
      groups: createVariablesTabGroups(element, cmmnFactory, elementRegistry, itemRegistry, cmmnRules, translate)
    };

    var listenerTab = {
      id: 'listener',
      label: translate('Listener'),
      groups: createListenerTabGroups(element, cmmnFactory, elementRegistry, itemRegistry, cmmnRules, translate)
    };

    var definitionTab = {
      id: 'definition',
      label: translate('Definition'),
      groups: createDefinitionTabGroups(element, cmmnFactory, elementRegistry, itemRegistry, cmmnRules, translate)
    };

    return [
      generalTab,
      rulesTab,
      variablesTab,
      listenerTab,
      definitionTab
    ];

  };

  this.getHeaderLabel = function(element) {

    if (isCMMNEdge(element)) {
      element = getCMMNElementRef(element) || element;
    }

    return element.id;

  };
}

CamundaPropertiesProvider.$inject = [
  'eventBus',
  'cmmnFactory',
  'elementRegistry',
  'itemRegistry',
  'cmmnRules',
  'translate'
];

inherits(CamundaPropertiesProvider, PropertiesActivator);

module.exports = CamundaPropertiesProvider;
