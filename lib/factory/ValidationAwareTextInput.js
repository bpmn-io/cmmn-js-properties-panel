'use strict';

var textField = require('./TextInputEntryFactory');

/**
 * This function is a wrapper around TextInputEntryFactory.
 * It adds functionality to cache an invalid value entered in the
 * text input, instead of setting it on the business object.
 */
var validationAwareTextField = function(options, defaultParameters) {

  var modelProperty = options.modelProperty,
      defaultGet = defaultParameters.get,
      defaultSet = defaultParameters.set;


  defaultParameters.get = function(element, node) {
    var value = this.__lastInvalidValue;

    delete this.__lastInvalidValue;

    var properties = {};

    if (value !== undefined) {
      properties[modelProperty] = value;
    }
    else {
      properties = defaultGet(element, node);
    }

    return properties;
  };

  defaultParameters.set = function(element, values, node) {
    var validationErrors = validate.apply(this, [ element, values, node ]),
        propertyValue = values[modelProperty],
        properties = {};

    // make sure we do not update the id
    if (validationErrors && validationErrors[modelProperty]) {

      this.__lastInvalidValue = propertyValue;
      properties = defaultGet(element, node);

    } else {

      properties[modelProperty] = propertyValue;

    }

    return defaultSet(element, properties, node);
  };

  var validate = defaultParameters.validate = function(element, values, node) {
    var value = values[modelProperty] || this.__lastInvalidValue;

    var property = {};
    property[modelProperty] = value;

    return options.validate(element, property, node);
  };

  return textField(options, defaultParameters);
};

module.exports = validationAwareTextField;
