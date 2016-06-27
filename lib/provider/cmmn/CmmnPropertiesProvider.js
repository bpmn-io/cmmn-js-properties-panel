'use strict';

var inherits = require('inherits');

var CmmnElementHelper = require('../../helper/CmmnElementHelper'),
    isCMMNEdge = CmmnElementHelper.isCMMNEdge,
    getCMMNElementRef = CmmnElementHelper.getCMMNElementRef;

var PropertiesActivator = require('../../PropertiesActivator');

// item properties
var caseProps = require('./parts/CaseProps'),
    idProps = require('./parts/IdProps'),
    nameProps = require('./parts/NameProps'),
    documentationProps = require('./parts/DocumentationProps');

// detail properties
var ifPartProps = require('./parts/IfPartProps'),
    onPartProps = require('./parts/OnPartProps');

// plan item control properties
var planItemControlProps = require('./parts/PlanItemControlProps');

// definition props
var definitionIdProps = require('./parts/DefinitionIdProps'),
    definitionNameProps = require('./parts/DefinitionNameProps'),
    definitionDocumentationProps = require('./parts/DefinitionDocumentationProps'),
    callableProps = require('./parts/CallableProps');


function createGeneralTabGroups(element, cmmnFactory, elementRegistry, itemRegistry, cmmnRules) {

  var generalGroup = {
    id: 'general',
    label: 'General',
    entries: []
  };

  caseProps(generalGroup, element, cmmnFactory, elementRegistry, itemRegistry, cmmnRules);
  idProps(generalGroup, element, cmmnFactory, elementRegistry, itemRegistry, cmmnRules);
  nameProps(generalGroup, element, cmmnFactory, elementRegistry, itemRegistry, cmmnRules);


  var detailsGroup = {
    id: 'details',
    label: 'Details',
    entries: []
  };

  onPartProps(detailsGroup, element, cmmnFactory, elementRegistry, itemRegistry);
  ifPartProps(detailsGroup, element, cmmnFactory, elementRegistry, itemRegistry);
  callableProps(detailsGroup, element, cmmnFactory, elementRegistry, itemRegistry);


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


  var defaultControlGroup = {
    id: 'defaultControl',
    label: 'Default Control',
    entries: []
  };

  planItemControlProps(defaultControlGroup, element, cmmnFactory, elementRegistry, itemRegistry, cmmnRules, {
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


function CmmnPropertiesProvider(eventBus, cmmnFactory, elementRegistry, itemRegistry, cmmnRules) {

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

CmmnPropertiesProvider.$inject = [ 'eventBus', 'cmmnFactory', 'elementRegistry', 'itemRegistry', 'cmmnRules' ];

inherits(CmmnPropertiesProvider, PropertiesActivator);

module.exports = CmmnPropertiesProvider;
