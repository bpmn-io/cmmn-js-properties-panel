'use strict';

var inherits = require('inherits');

var CmmnElementHelper = require('../../helper/CmmnElementHelper'),
    isCMMNEdge = CmmnElementHelper.isCMMNEdge,
    getCMMNElementRef = CmmnElementHelper.getCMMNElementRef;

var PropertiesActivator = require('../../PropertiesActivator');

// cmmn properties

// item properties
var itemIdProps = require('../cmmn/parts/ItemIdProps');

// definition props
var definitionIdProps = require('../cmmn/parts/DefinitionIdProps');


function createGeneralTabGroups(element, cmmnFactory, elementRegistry, itemRegistry) {

  var generalGroup = {
    id: 'general',
    label: 'General',
    entries: []
  };

  itemIdProps(generalGroup, element, elementRegistry, itemRegistry);

  return [
    generalGroup
  ];

}

function createDefinitionTabGroups(element, cmmnFactory, elementRegistry, itemRegistry) {

  var detailsGroup = {
    id: 'details',
    label: 'Details',
    entries: []
  };

  definitionIdProps(detailsGroup, element, elementRegistry, itemRegistry);

  return [
    detailsGroup
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
function CamundaPropertiesProvider(eventBus, cmmnFactory, elementRegistry, itemRegistry) {

  PropertiesActivator.call(this, eventBus);

  this.getTabs = function(element) {

    var generalTab = {
      id: 'general',
      label: 'General',
      groups: createGeneralTabGroups(element, cmmnFactory, elementRegistry, itemRegistry)
    };

    var definitionTab = {
      id: 'definition',
      label: 'Definition',
      groups: createDefinitionTabGroups(element, cmmnFactory, elementRegistry, itemRegistry)
    };

    return [
      generalTab,
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
  'itemRegistry'
];

inherits(CamundaPropertiesProvider, PropertiesActivator);

module.exports = CamundaPropertiesProvider;
