'use strict';

var fieldInjection = require('./implementation/FieldInjection');

module.exports = function(group, element, cmmnFactory, elementRegistry, itemRegistry, cmmnRules, translate, options) {

  var fieldInjectionEntry = fieldInjection(element, cmmnFactory, translate, options);

  if (fieldInjectionEntry && fieldInjectionEntry.length > 0) {
    group.entries = group.entries.concat(fieldInjectionEntry);
  }

};
