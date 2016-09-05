'use strict';

var getBusinessObject = require('cmmn-js/lib/util/ModelUtil').getBusinessObject,
    cmdHelper = require('../helper/CmdHelper');

var entryFieldDescription = require('./EntryFieldDescription');


var checkbox = function(options, defaultParameters) {
  var resource = defaultParameters,
      label = options.label || resource.id,
      canBeDisabled = !!options.disabled && typeof options.disabled === 'function',
      description = options.description;


  resource.html =
    '<input id="camunda-' + resource.id + '" ' +
         'type="checkbox" ' +
         'name="' + options.modelProperty + '" ' +
         (canBeDisabled ? 'data-show="isDisabled"' : '') +
         ' />' +
    '<label for="camunda-' + resource.id + '" ' +
         (canBeDisabled ? 'data-show="isDisabled"' : '') +
         '>' + label + '</label>';

  // add description below checkbox entry field
  if (description) {
    resource.html += entryFieldDescription(description);
  }

  resource.get = function(element) {
    var bo = getBusinessObject(element),
        res = {};

    res[options.modelProperty] = bo.get(options.modelProperty);

    return res;
  };
  resource.set = function(element, values) {
    var res = {};

    res[options.modelProperty] = !!values[options.modelProperty];

    return cmdHelper.updateProperties(element, res);
  };

  if (typeof options.set === 'function') {
    resource.set = options.set;
  }

  if (typeof options.get === 'function') {
    resource.get = options.get;
  }

  if (canBeDisabled) {
    resource.isDisabled = function() {
      return !options.disabled.apply(resource, arguments);
    };
  }

  resource.cssClasses = ['cpp-checkbox'];

  return resource;
};

module.exports = checkbox;
