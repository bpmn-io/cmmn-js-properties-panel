'use strict';

var inherits = require('inherits');

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
    onPartProps = require('../cmmn/parts/OnPartProps');

// plan item control properties
var planItemControlProps = require('../cmmn/parts/PlanItemControlProps'),
    repeatOnStandardEventProps = require('./parts/RepeatOnStandardEventProps');

// definition props
var definitionIdProps = require('../cmmn/parts/DefinitionIdProps'),
    definitionNameProps = require('../cmmn/parts/DefinitionNameProps'),
    definitionDocumentationProps = require('../cmmn/parts/DefinitionDocumentationProps'),
    callableProps = require('../cmmn/parts/CallableProps'),
    callableExtensionProps = require('./parts/CallableExtensionProps');


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

    var definitionTab = {
      id: 'definition',
      label: 'Definition',
      groups: createDefinitionTabGroups(element, cmmnFactory, elementRegistry, itemRegistry, cmmnRules)
    };

    return [
      generalTab,
      rulesTab,
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
