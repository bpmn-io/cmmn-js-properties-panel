'use strict';

var IdProp = require('./implementation/IdProp');

var ModelUtil = require('cmmn-js/lib/util/ModelUtil'),
    getDefinition = ModelUtil.getDefinition,
    isCasePlanModel = ModelUtil.isCasePlanModel;

module.exports = function(group, element, cmmnFactory, elementRegistry, itemRegistry, cmmnRules, translate) {

  if (!getDefinition(element) || isCasePlanModel(element)) {
    return;
  }

  // Id
  group.entries = group.entries.concat(IdProp(element, translate, {
    id: 'definitionId',
    label: translate('Definition Id'),
    reference: 'definitionRef'
  }));

};
