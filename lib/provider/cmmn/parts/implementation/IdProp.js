'use strict';

var entryFactory = require('../../../../factory/EntryFactory'),
    isIdValid = require('../../../../Utils').isIdValid,
    getBusinessObject = require('cmmn-js/lib/util/ModelUtil').getBusinessObject;

module.exports = function(element, options) {

  options = options || {};

  var id = options.id,
      reference = options.reference,
      label = options.label;

  // Id
  var idEntry = entryFactory.validationAwareTextField({

    id: id || 'id',
    label: label || 'Id',
    modelProperty: 'id',
    reference: reference,

    get: options.get,

    set: options.set,

    validate: function(element, values) {
      var idValue = values.id,
          bo = getBusinessObject(element);

      bo = (reference && reference === '$parent') ? bo.$parent : bo.get(reference) || bo;

      var idError = isIdValid(bo, idValue);

      return idError ? { id: idError } : {};
    }

  });

  return [ idEntry ];

};
