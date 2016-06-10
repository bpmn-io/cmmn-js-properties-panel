'use strict';

var cmdHelper = require('../../../helper/CmdHelper'),
    entryFactory = require('../../../factory/EntryFactory');

var TransitionProp = require('./implementation/TransitionProp');

var CmmnElementHelper = require('../../../helper/CmmnElementHelper'),
    isOnPartConnection = CmmnElementHelper.isOnPartConnection,
    getOutgoingOnParts = CmmnElementHelper.getOutgoingOnParts;

var isLabel = require('cmmn-js/lib/features/modeling/util/ModelingUtil').isLabel;

module.exports = function(group, element, cmmnFactory, elementRegistry, itemRegistry) {


  if (!isOnPartConnection(element)) {
    return;
  }


  // standard event
  group.entries = group.entries.concat(TransitionProp(element, {

    id: 'onPartStandardEvent',
    label: 'Standard Event',
    reference: 'cmmnElementRef',
    modelProperty: 'standardEvent',

    set: function(element, values, node, bo) {

      var connection = !isLabel(element) ? element : element.labelTarget,
          source = connection.source,
          changed = getOutgoingOnParts(source, bo) || [],
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


  // is standard event visible
  group.entries.push(entryFactory.checkbox({

    id: 'onPartIsStandardEventVisible',
    label: 'Show Standard Event',
    modelProperty: 'isStandardEventVisible'

  }));

};
