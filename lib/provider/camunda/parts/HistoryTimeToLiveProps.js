'use strict';

var ModelUtil = require('cmmn-js/lib/util/ModelUtil'),
    getBusinessObject = ModelUtil.getBusinessObject,
    isCasePlanModel = ModelUtil.isCasePlanModel;

var HistoryTimeToLiveProp = require('./implementation/HistoryTimeToLiveProp');

module.exports = function(group, element, cmmnFactory, elementRegistry, itemRegistry, translate, options) {

  if (isCasePlanModel(element)) {
    group.entries = group.entries.concat(HistoryTimeToLiveProp(element, translate, {
      getBusinessObject: function(element) {
        return getBusinessObject(element).$parent;
      }
    }));
  }

};
