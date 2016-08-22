'use strict';

var fieldInjection = require('./implementation/FieldInjection');

module.exports = function(group, element, cmmnFactory, elementRegistry, itemRegistry, cmmnRules, options) {

  var fieldInjectionEntry = fieldInjection(element, cmmnFactory, options);

  if (fieldInjectionEntry && fieldInjectionEntry.length > 0) {
    group.entries = group.entries.concat(fieldInjectionEntry);
  }

};
