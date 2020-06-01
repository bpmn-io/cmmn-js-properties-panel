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
  callableProps(detailsGroup, element, cmmnFactory, elementRegistry, itemRegistry, translate);


  var documentationGroup = {
    id: 'documentation',
    label: translate('Documentation'),
    entries: []
  };

  documentationProps(documentationGroup, element, cmmnFactory, elementRegistry, itemRegistry, cmmnRules, translate);

  return [
    generalGroup,
    detailsGroup,
    documentationGroup
  ];

}


function createRulesTabGroups(element, cmmnFactory, elementRegistry, itemRegistry, cmmnRules, translate) {

  var itemControlGroup = {
    id: 'itemControl',
    label: translate('Item Control'),
    entries: []
  };

  planItemControlProps(itemControlGroup, element, cmmnFactory, elementRegistry, itemRegistry, cmmnRules, translate);


  var defaultControlGroup = {
    id: 'defaultControl',
    label: translate('Default Control'),
    entries: []
  };

  planItemControlProps(defaultControlGroup, element, cmmnFactory, elementRegistry, itemRegistry, cmmnRules, translate, {
    isDefaultControl: true
  });

  return [
    itemControlGroup,
    defaultControlGroup
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


function CmmnPropertiesProvider(eventBus, cmmnFactory, elementRegistry, itemRegistry, cmmnRules, translate) {

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

    var definitionTab = {
      id: 'definition',
      label: translate('Definition'),
      groups: createDefinitionTabGroups(element, cmmnFactory, elementRegistry, itemRegistry, cmmnRules, translate)
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

CmmnPropertiesProvider.$inject = [
  'eventBus',
  'cmmnFactory',
  'elementRegistry',
  'itemRegistry',
  'cmmnRules',
  'translate'
];

inherits(CmmnPropertiesProvider, PropertiesActivator);

module.exports = CmmnPropertiesProvider;
