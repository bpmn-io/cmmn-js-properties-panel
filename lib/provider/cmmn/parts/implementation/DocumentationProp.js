'use strict';

var forEach = require('lodash/forEach');

var entryFactory = require('../../../../factory/EntryFactory'),
    cmdHelper = require('../../../../helper/CmdHelper');

var CmmnElementHelper = require('../../../../helper/CmmnElementHelper'),
    isCMMNDiagram = CmmnElementHelper.isCMMNDiagram;


module.exports = function(element, cmmnFactory, options) {

  options = options || {};

  var containment = 'documentation';

  function getDocumentations(bo) {
    return bo.get(containment);
  }

  function getDocumentation(bo) {
    var documentations = getDocumentations(bo);
    return documentations.length > 0 ? documentations[0] : undefined;
  }

  // Documentation
  var entry = entryFactory.textBox({

    id: options.id || 'documentation',
    label: options.label || 'Documentation',
    modelProperty: 'documentation',
    reference: options.reference,

    get: function(element, node, bo) {

      var documentation,
          text;

      if (isCMMNDiagram(bo)) {
        text = bo.documentation;
      }
      else {
        documentation = getDocumentation(bo);
        text = documentation && documentation.text;
      }

      return {
        documentation: text
      };

    },

    set: function(element, values, node, bo) {

      var isRoot = isCMMNDiagram(bo),
          documentation = !isRoot && getDocumentation(bo),
          text = values.documentation || undefined,
          value = {};

      value[isRoot ? 'documentation' : 'text'] = text;

      if (isRoot) {
        return cmdHelper.updateProperties(bo, value, element);
      }

      if (documentation && !text) {

        var cmds = [];

        forEach(getDocumentations(bo), function(doc) {
          cmds.push(cmdHelper.updateSemanticParent(doc, null, containment, element));
        });

        return cmds;
      }

      if (!documentation && text) {
        documentation = cmmnFactory.create('cmmn:Documentation', value);
        return cmdHelper.updateSemanticParent(documentation, bo, containment, element);
      }

      return cmdHelper.updateProperties(documentation, value, element);
    }

  });

  return [ entry ];

};

