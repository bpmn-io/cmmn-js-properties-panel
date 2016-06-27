'use strict';

var IdProp = require('./implementation/IdProp'),
    NameProp = require('./implementation/NameProp');

var cmdHelper = require('../../../helper/CmdHelper');

var ModelUtil = require('cmmn-js/lib/util/ModelUtil'),
    getBusinessObject = ModelUtil.getBusinessObject,
    isCasePlanModel = ModelUtil.isCasePlanModel;


module.exports = function(group, element) {

  if (!isCasePlanModel(element)) {
    return;
  }

  var getValue = function(modelProperty) {
    return function(element, node) {
      var bo = getBusinessObject(element).$parent;
      var value = {};

      value[modelProperty] = bo.get(modelProperty);

      return value;
    };
  };

  var setValue = function(modelProperty) {
    return function(element, values, node) {
      var bo = getBusinessObject(element).$parent;
      var props = {};

      props[modelProperty] = values[modelProperty] || undefined;

      return cmdHelper.updateBusinessObject(element, bo, props);
    };
  };

  // Case Id
  group.entries = group.entries.concat(IdProp(element, {
    id: 'caseId',
    label: 'Case Id',
    reference: '$parent',

    get: getValue('id'),

    set: setValue('id')

  }));


  // name
  group.entries = group.entries.concat(NameProp(element, {

    id: 'caseName',
    label: 'Case Name',

    get: getValue('name'),

    set: setValue('name')

  }));

};
