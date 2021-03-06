'use strict';

var DocumentationProp = require('./implementation/DocumentationProp');

var CmmnElementHelper = require('../../../helper/CmmnElementHelper'),
    isCMMNEdge = CmmnElementHelper.isCMMNEdge,
    isDiscretionaryConnection = CmmnElementHelper.isDiscretionaryConnection;


module.exports = function(group, element, cmmnFactory, elementRegistry, itemRegistry, cmmnRules, translate) {

  if (isCMMNEdge(element) && isDiscretionaryConnection(element)) {
    return;
  }

  // name
  group.entries = group.entries.concat(DocumentationProp(element, cmmnFactory, translate, {
    reference: isCMMNEdge(element) ? 'cmmnElementRef' : undefined
  }));

};
