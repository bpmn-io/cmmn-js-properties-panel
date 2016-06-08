'use strict';

var IdProp = require('./implementation/IdProp');

var isCMMNEdge = require('../../../helper/CmmnElementHelper').isCMMNEdge;

module.exports = function(group, element) {

  // Id
  group.entries = group.entries.concat(IdProp(element, {
    reference: isCMMNEdge(element) ? 'cmmnElementRef' : undefined
  }));

};
