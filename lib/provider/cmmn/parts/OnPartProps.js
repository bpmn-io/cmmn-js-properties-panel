'use strict';

var cmdHelper = require('../../../helper/CmdHelper');

var TransitionProp = require('./implementation/TransitionProp');

var CmmnElementHelper = require('../../../helper/CmmnElementHelper'),
    isOnPartConnection = CmmnElementHelper.isOnPartConnection,
    getOutgoingOnParts = CmmnElementHelper.getOutgoingOnParts;


module.exports = function(group, element, cmmnFactory, elementRegistry, itemRegistry) {


  if (!isOnPartConnection(element)) {
    return;
  }


  group.entries = group.entries.concat(TransitionProp(element, {
    id: 'onPartStandardEvent',
    label: 'Standard Event',
    reference: 'cmmnElementRef',
    modelProperty: 'standardEvent',

    set: function(element, values, node, bo) {

      var changed = getOutgoingOnParts(element.source, bo) || [],
          standardEvent = values.standardEvent || undefined;

      if (changed.indexOf(element) === -1) {
        changed.push(element);
      }

      return cmdHelper.updateProperties(bo, { standardEvent: standardEvent }, changed);

    },

    validate: function(element, values, node, bo) {
      return bo && !bo.get('standardEvent') ? { standardEvent: 'Must provide a standard event' } : {};
    }

  }));

};
