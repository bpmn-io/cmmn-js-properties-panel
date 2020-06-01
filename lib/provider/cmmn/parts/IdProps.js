'use strict';

var IdProp = require('./implementation/IdProp');

var isCMMNEdge = require('../../../helper/CmmnElementHelper').isCMMNEdge;

module.exports = function(group, element, cmmnFactory, elementRegistry, itemRegistry, cmmnRules, translate) {

  // Id
  group.entries = group.entries.concat(IdProp(element, translate, {
    reference: isCMMNEdge(element) ? 'cmmnElementRef' : undefined
  }));

};
