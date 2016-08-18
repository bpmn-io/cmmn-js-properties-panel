'use strict';

var cmdHelper = require('../../../../helper/CmdHelper'),
    entryFactory = require('../../../../factory/EntryFactory');

module.exports = function(element, options) {


  var EXTERNAL_TYPE = 'external',
      INLINE_TYPE = 'inline';

  var scriptFormatProp = 'scriptFormat',
      valueProp = 'value',
      resourceProp = 'resource';


  function getScriptType(script) {

    var external = script && script.get(resourceProp);

    if (external !== undefined) {
      return EXTERNAL_TYPE;
    }

    return INLINE_TYPE;
  }


  options = options || {};

  var getScript = options.getScript,
      reference = 'definitionRef';

  var getValue = function(prop) {
    return function(element, node) {
      var script = getScript(element, node),
          value = {};

      value[prop] = (script && script.get(prop)) || undefined;

      return value;
    };
  };

  var setValue = function(prop, defaultValue) {
    return function(element, values, node) {
      var script = getScript(element, node),
          update = {};

      update[prop] = values[prop] || defaultValue;

      return cmdHelper.updateProperties(script, update, element);
    };
  };

  var hideEntry = function(expectedType) {
    return function(element, node) {
      var script = getScript(element, node);
      return !script || (expectedType && getScriptType(script) !== expectedType);
    };
  };

  var validate = function(prop) {
    return function(element, values) {
      var value = values[prop],
          validate = {};

      if (!value) {
        validate[prop] = 'Must provide a value';
      }

      return validate;
    };
  };


  var scriptFormatEntry = entryFactory.textField({

    id: 'scriptFormant',
    label: 'Script Format',
    modelProperty: scriptFormatProp,
    reference: reference,

    get: getValue(scriptFormatProp),
    set: setValue(scriptFormatProp),
    hideEntry: hideEntry(),
    validate: validate(scriptFormatProp)

  });


  var scriptTypeEntry = entryFactory.selectBox({

    id: 'scriptType',
    label: 'Script Type',
    modelProperty: 'type',
    reference: reference,
    selectOptions: [
      { value: INLINE_TYPE, name: 'Inline Script' },
      { value: EXTERNAL_TYPE, name: 'External Resource' }
    ],

    get: function(element, node) {

      var script = getScript(element, node);
      return {
        type: getScriptType(script)
      };

    },

    set: function(element, values, node) {

      var script = getScript(element, node),
          type = values.type || undefined,
          update = {};

      update[resourceProp] = type === EXTERNAL_TYPE ? '' : undefined;
      update[valueProp] = undefined;

      return cmdHelper.updateProperties(script, update, element);

    },

    hideEntry: hideEntry()

  });


  var scriptValueEntry = entryFactory.textBox({

    id: 'scriptValue',
    label: 'Script',
    modelProperty: valueProp,
    reference: reference,

    get: getValue(valueProp),
    set: setValue(valueProp),
    hideEntry: hideEntry(INLINE_TYPE),
    validate: validate(valueProp)

  });


  var scriptResouceEntry = entryFactory.textField({

    id: 'scriptResource',
    label: 'Resource',
    modelProperty: resourceProp,
    reference: reference,

    get: getValue(resourceProp),
    set: setValue(resourceProp, ''),
    hideEntry: hideEntry(EXTERNAL_TYPE),
    validate: validate(resourceProp)

  });

  return [ scriptFormatEntry, scriptTypeEntry, scriptValueEntry, scriptResouceEntry ];

};
