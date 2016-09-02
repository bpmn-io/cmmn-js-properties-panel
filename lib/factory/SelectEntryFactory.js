'use strict';

var forEach = require('lodash/collection/forEach');

var entryFieldDescription = require('./EntryFieldDescription');


var isList = function(list) {
  return !(!list || Object.prototype.toString.call(list) !== '[object Array]');
};

var addEmptyParameter = function(list) {
  list.unshift({ name: '', value: '' });
};

/**
 * @param  {Object} options
 * @param  {string} options.id
 * @param  {string} [options.label]
 * @param  {Array<Object>} options.selectOptions
 * @param  {string} options.modelProperty
 * @param  {boolean} options.emptyParameter
 * @param  {function} options.disabled
 * @param  {Object} defaultParameters
 *
 * @return {Object}
 */
var selectbox = function(options, defaultParameters) {
  var resource = defaultParameters,
      label = options.label || resource.id,
      selectOptions = options.selectOptions,
      modelProperty = options.modelProperty,
      emptyParameter = options.emptyParameter,
      canBeDisabled = !!options.disabled && typeof options.disabled === 'function',
      description = options.description;

  if (isList(selectOptions)) {
    if (emptyParameter) {
      addEmptyParameter(selectOptions);
    }
  } else {
    selectOptions = [ { name: '', value: '' } ];
  }

  resource.html =
    '<label for="camunda-' + resource.id + '"' +
    (canBeDisabled ? 'data-show="isDisabled" ' : '') + '>' + label + '</label>' +
    '<select id="camunda-' + resource.id + '-select" name="' + modelProperty + '"' +
    (canBeDisabled ? 'data-show="isDisabled" ' : '') + ' data-value>';

  forEach(selectOptions, function(option) {
    resource.html += '<option value="' + option.value + '">' + (option.name || '') + '</option>';
  });

  resource.html += '</select>';

  // add description below select box entry field
  if (description) {
    resource.html += entryFieldDescription(description);
  }

  if (canBeDisabled) {
    resource.isDisabled = function() {
      return !options.disabled.apply(resource, arguments);
    };
  }

  resource.cssClasses = ['dropdown'];

  return resource;
};

module.exports = selectbox;
