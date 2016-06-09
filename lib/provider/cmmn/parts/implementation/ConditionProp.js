'use strict';

var cmdHelper = require('../../../../helper/CmdHelper'),
    entryFactory = require('../../../../factory/EntryFactory');

var noop = function() {};
var noopEmptyList = function() { return []; };

module.exports = function(element, cmmnFactory, options) {

  options = options || {};

  var id = options.id,
      label = options.label,
      reference = options.reference,
      getCondition = options.getCondition || noop,
      createdCondition = options.createdCondition || noopEmptyList,
      removedCondition = options.removedCondition || noopEmptyList;


  var conditionEntry = entryFactory.textField({

    id: id || 'condition',
    label: label || 'Condition',
    modelProperty: 'body',
    reference: reference,

    get: function(element, node, bo) {

      var condition = getCondition(element, node, bo);
      return {
        body: (condition && condition.get('body')) || undefined
      };

    },

    set: function(element, values, node, bo) {

      var condition = getCondition(element, node, bo),
          body = values.body || undefined,
          value = { body : body },
          cmds = [];

      if (body) {

        if (!condition) {
          condition = cmmnFactory.create('cmmn:Expression', value);
          cmds.push(createdCondition(condition, element, node, bo));
        }
        else {
          cmds.push(cmdHelper.updateProperties(condition, value, element));
        }

      }
      else {

        if (condition) {
          cmds.push(
            cmdHelper.updateProperties(condition, value, element),
            cmdHelper.updateSemanticParent(condition, null, null, element),
            removedCondition(condition, element, node, bo)
          );
        }

      }

      return cmds;

    }

  });

  return [ conditionEntry ];

};
