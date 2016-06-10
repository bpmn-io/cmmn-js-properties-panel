'use strict';

var entryFactory = require('../../../factory/EntryFactory'),
    cmdHelper = require('../../../helper/CmdHelper');

var NameProp = require('./implementation/NameProp');

var ModelUtil = require('cmmn-js/lib/util/ModelUtil'),
    getName = ModelUtil.getName,
    getBusinessObject = ModelUtil.getBusinessObject;

var isLabel = require('cmmn-js/lib/features/modeling/util/ModelingUtil').isLabel;

var CmmnElementHelper = require('../../../helper/CmmnElementHelper'),
    isOnPartConnection = CmmnElementHelper.isOnPartConnection,
    isCMMNEdge = CmmnElementHelper.isCMMNEdge,
    isDiscretionaryConnection = CmmnElementHelper.isDiscretionaryConnection,
    isAssociationConnection = CmmnElementHelper.isAssociationConnection,
    isCriterion = CmmnElementHelper.isCriterion,
    isTextAnnotation = CmmnElementHelper.isTextAnnotation,
    isItemCapable = CmmnElementHelper.isItemCapable,
    getOutgoingOnParts = CmmnElementHelper.getOutgoingOnParts;

var domQuery   = require('min-dom/lib/query'),
    domClosest = require('min-dom/lib/closest');

module.exports = function(group, element) {

  if (isCriterion(element)) {
    return;
  }

  if (isCMMNEdge(element) &&
      (isDiscretionaryConnection(element) ||
       isAssociationConnection(element))) {
    return;
  }


  var setter;
  if (isOnPartConnection(element)) {
    setter = function(element, values, node, bo) {

      var connection = !isLabel(element) ? element : element.labelTarget,
          source = connection.source,
          changed = getOutgoingOnParts(source, bo) || [],
          name = values.name || undefined;

      if (changed.indexOf(element) === -1) {
        changed.push(element);
      }

      return cmdHelper.updateProperties(bo, { name: name }, changed);

    };
  }


  // name
  group.entries = group.entries.concat(NameProp(element, {

    modelProperty: isTextAnnotation(element) ? 'text' : undefined,
    reference: isCMMNEdge(element) ? 'cmmnElementRef' : undefined,

    get: function(element, node, bo) {

      if (isTextAnnotation(bo)) {
        return {
          text: bo.text
        };
      }

      return {
        name: getName(bo)
      };
    },

    set: setter

  }));


  group.entries.push(entryFactory.link({

    id: 'definitionNameLink',
    label: 'Definition name is used',

    getClickableElement: function(element, node) {
      var panel = domClosest(node, 'div.djs-properties-panel');
      return domQuery('a[data-tab-target="definition"]', panel);
    },

    hideLink: function(element, node) {
      var bo = getBusinessObject(element);
      return !(isItemCapable(element) && getName(bo) && !bo.name);
    }

  }));

};
