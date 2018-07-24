'use strict';

var getBusinessObject = require('cmmn-js/lib/util/ModelUtil').getBusinessObject;

// input entities
var textInputField = require('./TextInputEntryFactory'),
    checkboxField = require('./CheckboxEntryFactory'),
    selectBoxField = require('./SelectEntryFactory'),
    textBoxField = require('./TextBoxEntryFactory'),
    validationAwareTextInputField = require('./ValidationAwareTextInput'),
    labelEntry = require('./LabelFactory');

var cmdHelper = require('../helper/CmdHelper');

// helpers ////////////////////////////////////////

function ensureNotNull(prop) {
  if (!prop) {
    throw new Error(prop + ' must be set.');
  }

  return prop;
}

/**
 * sets the default parameters which are needed to create an entry
 *
 * @param options
 * @returns {{id: *, description: (*|string), get: (*|Function), set: (*|Function),
 *            validate: (*|Function), html: string}}
 */
var setDefaultParameters = function(options) {

  function getReferencedObject(element, reference) {
    var bo = getBusinessObject(element);

    if (reference) {
      return bo && bo.get(reference);
    }

    return bo;
  }


  // default /////////////////////////////////////////////////////////

  // default method to fetch the current value of the input field
  var defaultGet = function(element, node, bo) {
    var res = {},
        prop = ensureNotNull(options.modelProperty);

    bo = bo || getBusinessObject(element);
    res[prop] = bo && bo.get(prop);

    return res;
  };

  // default method to set a new value to the input field
  var defaultSet = function(element, values, node, bo) {
    var res = {},
        prop = ensureNotNull(options.modelProperty);

    if (values[prop] !== '') {
      res[prop] = values[prop];
    } else {
      res[prop] = undefined;
    }

    bo = bo || getBusinessObject(element);

    return cmdHelper.updateProperties(bo, res, element);
  };

  // default validation method
  var defaultValidate = function() {
    return {};
  };


  // wrapper ////////////////////////////////////////

  var wrapperGet = function(element, node) {

    var reference = options.reference,
        getter = options.get || defaultGet;

    return getter(element, node, getReferencedObject(element, reference));

  };

  var wrapperSet = function(element, values, node) {

    var reference = options.reference,
        setter = options.set || defaultSet;

    return setter(element, values, node, getReferencedObject(element, reference));

  };

  var wrapperValidate = function(element, values, node) {

    var reference = options.reference,
        validator = options.validate || defaultValidate;

    return validator(element, values, node, getReferencedObject(element, reference));

  };



  return {
    id : options.id,
    description : (options.description || ''),
    get : wrapperGet,
    set : wrapperSet,
    validate : wrapperValidate,
    html: '',
    reference: options.reference,
    hideEntry: options.hideEntry
  };
};

function EntryFactory() {

}

/**
 * Generates an text input entry object for a property panel.
 * options are:
 * - id: id of the entry - String
 *
 * - description: description of the property - String
 *
 * - label: label for the input field - String
 *
 * - set: setter method - Function
 *
 * - get: getter method - Function
 *
 * - validate: validation mehtod - Function
 *
 * - modelProperty: name of the model property - String
 *
 * - buttonAction: Object which contains the following properties: - Object
 * ---- name: name of the [data-action] callback - String
 * ---- method: callback function for [data-action] - Function
 *
 * - buttonShow: Object which contains the following properties: - Object
 * ---- name: name of the [data-show] callback - String
 * ---- method: callback function for [data-show] - Function
 *
 * @param options
 * @returns the propertyPanel entry resource object
 */
EntryFactory.textField = function(options) {
  return textInputField(options, setDefaultParameters(options));
};

EntryFactory.validationAwareTextField = function(options) {
  return validationAwareTextInputField(options, setDefaultParameters(options));
};

/**
 * Generates a checkbox input entry object for a property panel.
 * options are:
 * - id: id of the entry - String
 *
 * - description: description of the property - String
 *
 * - label: label for the input field - String
 *
 * - set: setter method - Function
 *
 * - get: getter method - Function
 *
 * - validate: validation mehtod - Function
 *
 * - modelProperty: name of the model property - String
 *
 * @param options
 * @returns the propertyPanel entry resource object
 */
EntryFactory.checkbox = function(options) {
  return checkboxField(options, setDefaultParameters(options));
};

EntryFactory.textBox = function(options) {
  return textBoxField(options, setDefaultParameters(options));
};

EntryFactory.selectBox = function(options) {
  return selectBoxField(options, setDefaultParameters(options));
};

EntryFactory.label = function(options) {
  return labelEntry(options);
};

module.exports = EntryFactory;
