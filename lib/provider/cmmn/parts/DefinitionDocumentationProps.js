'use strict';

var DocumentationProp = require('./implementation/DocumentationProp');

var ModelUtil = require('cmmn-js/lib/util/ModelUtil'),
    getDefinition = ModelUtil.getDefinition,
    isCasePlanModel = ModelUtil.isCasePlanModel;

module.exports = function(group, element, cmmnFactory) {

  if (!getDefinition(element) || isCasePlanModel(element)) {
    return;
  }


  // documentation
  group.entries = group.entries.concat(DocumentationProp(element, cmmnFactory, {

    id: 'definitionDocumentation',
    reference: 'definitionRef'

  }));

};
