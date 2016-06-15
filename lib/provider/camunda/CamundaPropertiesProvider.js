'use strict';

var inherits = require('inherits');

var is = require('cmmn-js/lib/util/ModelUtil').is;

var CmmnElementHelper = require('../../helper/CmmnElementHelper'),
    isCMMNEdge = CmmnElementHelper.isCMMNEdge,
    getCMMNElementRef = CmmnElementHelper.getCMMNElementRef;

var PropertiesActivator = require('../../PropertiesActivator');

// cmmn properties

// item properties
var idProps = require('../cmmn/parts/IdProps'),
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
    listenerDetailProps = require('./parts/ListenerDetailProps');


var getListenerLabel = function(listener) {

  if (is(listener, 'camunda:CaseExecutionListener')) {
    return 'Case Execution Listener';
  }

  if (is(listener, 'camunda:TaskListener')) {
    return 'Task Listener';
  }

  if (is(listener, 'camunda:VariableListener')) {
    return 'Variable Listener';
  }

  return '';
};


function createGeneralTabGroups(element, cmmnFactory, elementRegistry, itemRegistry, cmmnRules) {

  var generalGroup = {
    id: 'general',
    label: 'General',
    entries: []
  };

  idProps(generalGroup, element, cmmnFactory, elementRegistry, itemRegistry, cmmnRules);
  nameProps(generalGroup, element, cmmnFactory, elementRegistry, itemRegistry, cmmnRules);


  var detailsGroup = {
    id: 'details',
    label: 'Details',
    entries: []
  };

  onPartProps(detailsGroup, element, cmmnFactory, elementRegistry, itemRegistry);
  ifPartProps(detailsGroup, element, cmmnFactory, elementRegistry, itemRegistry);
  humanTaskProps(detailsGroup, element, cmmnFactory, elementRegistry, itemRegistry);
  callableProps(detailsGroup, element, cmmnFactory, elementRegistry, itemRegistry);
  callableExtensionProps(detailsGroup, element, cmmnFactory, elementRegistry, itemRegistry);


  var documentationGroup = {
    id: 'documentation',
    label: 'Documentation',
    entries: []
  };

  documentationProps(documentationGroup, element, cmmnFactory, elementRegistry, itemRegistry, cmmnRules);


  return [
    generalGroup,
    detailsGroup,
    documentationGroup
  ];
}


function createRulesTabGroups(element, cmmnFactory, elementRegistry, itemRegistry, cmmnRules) {

  var itemControlGroup = {
    id: 'itemControl',
    label: 'Item Control',
    entries: []
  };

  planItemControlProps(itemControlGroup, element, cmmnFactory, elementRegistry, itemRegistry, cmmnRules);
  repeatOnStandardEventProps(itemControlGroup, element, cmmnFactory, elementRegistry, itemRegistry, cmmnRules);


  var defaultControlGroup = {
    id: 'defaultControl',
    label: 'Default Control',
    entries: []
  };

  planItemControlProps(defaultControlGroup, element, cmmnFactory, elementRegistry, itemRegistry, cmmnRules, {
    isDefaultControl: true
  });
  repeatOnStandardEventProps(defaultControlGroup, element, cmmnFactory, elementRegistry, itemRegistry, cmmnRules, {
    isDefaultControl: true
  });

  return [
    itemControlGroup,
    defaultControlGroup
  ];
}


function createVariablesTabGroups(element, cmmnFactory, elementRegistry, itemRegistry, cmmnRules) {

  var variablesGroup = {
    id : 'variables',
    label : 'Variables',
    entries: []
  };

  variableMapping(variablesGroup, element, cmmnFactory, elementRegistry, itemRegistry, cmmnRules);

  return [
    variablesGroup
  ];
}


function createListenerTabGroups(element, cmmnFactory, elementRegistry, itemRegistry, cmmnRules) {

  var caseExecutionListenerGroup = {
    id: 'caseExecutionListeners',
    label: 'Case Execution Listeners',
    entries: []
  };

  var caseExecutionListenerProvider = caseExecutionListenerProps(
    caseExecutionListenerGroup,
    element,
    cmmnFactory,
    elementRegistry,
    itemRegistry,
    cmmnRules
  );


  var taskListenerGroup = {
    id: 'taskListeners',
    label: 'Task Listeners',
    entries: []
  };

  var taskListenerProvider = taskListenerProps(
    taskListenerGroup,
    element,
    cmmnFactory,
    elementRegistry,
    itemRegistry,
    cmmnRules
  );


  var variableListenerGroup = {
    id: 'variableListeners',
    label: 'Variable Listeners',
    entries: []
  };

  var variableListenerProvider = variableListenerProps(
    variableListenerGroup,
    element,
    cmmnFactory,
    elementRegistry,
    itemRegistry,
    cmmnRules
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
      return getListenerLabel(param);
    }
  };

  listenerDetailProps(
    listenerDetailsGroup,
    element,
    cmmnFactory,
    elementRegistry,
    itemRegistry,
    cmmnRules,
    { getListener : getSelectedListener }
  );


  return [
    caseExecutionListenerGroup,
    taskListenerGroup,
    variableListenerGroup,
    listenerDetailsGroup
  ];
}


function createDefinitionTabGroups(element, cmmnFactory, elementRegistry, itemRegistry, cmmnRules) {

  var detailsGroup = {
    id: 'definitionDetails',
    label: 'Details',
    entries: []
  };

  definitionIdProps(detailsGroup, element, cmmnFactory, elementRegistry, itemRegistry, cmmnRules);
  definitionNameProps(detailsGroup, element, cmmnFactory, elementRegistry, itemRegistry, cmmnRules);


  var documentationGroup = {
    id: 'definitionDocumentation',
    label: 'Documentation',
    entries: []
  };

  definitionDocumentationProps(documentationGroup, element, cmmnFactory, elementRegistry, itemRegistry, cmmnRules);

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
function CamundaPropertiesProvider(eventBus, cmmnFactory, elementRegistry, itemRegistry, cmmnRules) {

  PropertiesActivator.call(this, eventBus);

  this.getTabs = function(element) {

    var generalTab = {
      id: 'general',
      label: 'General',
      groups: createGeneralTabGroups(element, cmmnFactory, elementRegistry, itemRegistry, cmmnRules)
    };

    var rulesTab = {
      id: 'rules',
      label: 'Rules',
      groups: createRulesTabGroups(element, cmmnFactory, elementRegistry, itemRegistry, cmmnRules)
    };

    var variablesTab = {
      id: 'variables',
      label: 'Variables',
      groups: createVariablesTabGroups(element, cmmnFactory, elementRegistry, itemRegistry, cmmnRules)
    };

    var listenerTab = {
      id: 'listener',
      label: 'Listener',
      groups: createListenerTabGroups(element, cmmnFactory, elementRegistry, itemRegistry, cmmnRules)
    };

    var definitionTab = {
      id: 'definition',
      label: 'Definition',
      groups: createDefinitionTabGroups(element, cmmnFactory, elementRegistry, itemRegistry, cmmnRules)
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
  'cmmnRules'
];

inherits(CamundaPropertiesProvider, PropertiesActivator);

module.exports = CamundaPropertiesProvider;
