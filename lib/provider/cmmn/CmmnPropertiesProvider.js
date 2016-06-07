'use strict';

var inherits = require('inherits');

var PropertiesActivator = require('../../PropertiesActivator');


function createGeneralTabGroups(element, cmmnFactory, elementRegistry) {

  return [];

}

function CmmnPropertiesProvider(eventBus, cmmnFactory, elementRegistry) {

  PropertiesActivator.call(this, eventBus);

  this.getTabs = function(element) {

    var generalTab = {
      id: 'general',
      label: 'General',
      groups: createGeneralTabGroups(element, cmmnFactory, elementRegistry)
    };

    return [
      generalTab
    ];
  };
}

CmmnPropertiesProvider.$inject = [ 'eventBus', 'cmmnFactory', 'elementRegistry' ];

inherits(CmmnPropertiesProvider, PropertiesActivator);

module.exports = CmmnPropertiesProvider;
