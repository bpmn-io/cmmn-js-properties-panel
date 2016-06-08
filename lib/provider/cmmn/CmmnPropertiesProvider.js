'use strict';

var inherits = require('inherits');

var CmmnElementHelper = require('../../helper/CmmnElementHelper'),
    isCMMNEdge = CmmnElementHelper.isCMMNEdge,
    getCMMNElementRef = CmmnElementHelper.getCMMNElementRef;

var PropertiesActivator = require('../../PropertiesActivator');

// item properties
var idProps = require('./parts/IdProps'),
    nameProps = require('./parts/NameProps');

// definition props
var definitionIdProps = require('./parts/DefinitionIdProps'),
    definitionNameProps = require('./parts/DefinitionNameProps');


function createGeneralTabGroups(element, cmmnFactory, elementRegistry, itemRegistry) {

  var generalGroup = {
    id: 'general',
    label: 'General',
    entries: []
  };

  idProps(generalGroup, element, cmmnFactory, elementRegistry, itemRegistry);
  nameProps(generalGroup, element, cmmnFactory, elementRegistry, itemRegistry);

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

  definitionIdProps(detailsGroup, element, cmmnFactory, elementRegistry, itemRegistry);
  definitionNameProps(detailsGroup, element, cmmnFactory, elementRegistry, itemRegistry);

  return [
    detailsGroup
  ];

}


function CmmnPropertiesProvider(eventBus, cmmnFactory, elementRegistry, itemRegistry) {

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

CmmnPropertiesProvider.$inject = [ 'eventBus', 'cmmnFactory', 'elementRegistry', 'itemRegistry' ];

inherits(CmmnPropertiesProvider, PropertiesActivator);

module.exports = CmmnPropertiesProvider;
