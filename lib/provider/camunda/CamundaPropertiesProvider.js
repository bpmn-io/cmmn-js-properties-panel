'use strict';

var inherits = require('inherits');

var PropertiesActivator = require('../../PropertiesActivator');


function createGeneralTabGroups(element, cmmnFactory, elementRegistry) {

  return [];

}


// Camunda Properties Provider /////////////////////////////////////


/**
 * A properties provider for Camunda related properties.
 *
 * @param {EventBus} eventBus
 * @param {CmmnFactory} cmmnFactory
 * @param {ElementRegistry} elementRegistry
 */
function CamundaPropertiesProvider(eventBus, cmmnFactory, elementRegistry) {

  PropertiesActivator.call(this, eventBus);

  this.getTabs = function(element) {

    var generalTab = {
      id: 'general',
      label: 'General',
      groups: createGeneralTabGroups(
                  element, cmmnFactory,
                  elementRegistry)
    };

    return [
      generalTab
    ];
  };

}

CamundaPropertiesProvider.$inject = [
  'eventBus',
  'cmmnFactory',
  'elementRegistry'
];

inherits(CamundaPropertiesProvider, PropertiesActivator);

module.exports = CamundaPropertiesProvider;
