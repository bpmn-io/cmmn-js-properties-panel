'use strict';

var IdProp = require('./implementation/IdProp');

var getDefinition = require('cmmn-js/lib/util/ModelUtil').getDefinition;
var isItemCapable = require('../../../helper/CmmnElementHelper').isItemCapable;

module.exports = function(group, element, elementRegistry, itemRegistry, options) {

  if (!isItemCapable(element) || !getDefinition(element)) {
    return;
  }

  // Id
  group.entries = group.entries.concat(IdProp(element, {
    id: 'definitionId',
    label: 'Definition Id',
    reference: 'definitionRef'
  }));

};
