'use strict';

var IdProp = require('./implementation/IdProp');

var ModelUtil = require('cmmn-js/lib/util/ModelUtil'),
    getDefinition = ModelUtil.getDefinition,
    isCasePlanModel = ModelUtil.isCasePlanModel;

module.exports = function(group, element) {

  if (!getDefinition(element) || isCasePlanModel(element)) {
    return;
  }

  // Id
  group.entries = group.entries.concat(IdProp(element, {
    id: 'definitionId',
    label: 'Definition Id',
    reference: 'definitionRef'
  }));

};
