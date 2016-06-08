'use strict';

var NameProp = require('./implementation/NameProp');
var cmdHelper = require('../../../helper/CmdHelper');

var ModelUtil = require('cmmn-js/lib/util/ModelUtil'),
    getDefinition = ModelUtil.getDefinition,
    isCasePlanModel = ModelUtil.isCasePlanModel;


module.exports = function(group, element, cmmnFactory, elementRegistry, itemRegistry) {

  if (!getDefinition(element) || isCasePlanModel(element)) {
    return;
  }


  // name
  group.entries = group.entries.concat(NameProp(element, {

    id: 'definitionName',
    label: 'Definition Name',
    reference: 'definitionRef',

    set: function(element, values, node, bo) {

      var changed = itemRegistry.getShapes(bo);

      if (changed.indexOf(element) === -1) {
        changed.push(element);
      }

      var props = {
        name: values.name || undefined
      };

      return cmdHelper.updateProperties(bo, props, changed);

    }

  }));

};
