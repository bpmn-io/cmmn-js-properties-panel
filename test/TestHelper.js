'use strict';

var TestHelper = module.exports = require('cmmn-js/test/helper');

var domQuery = require('min-dom/lib/query');

TestHelper.insertCSS('diagram-js.css', require('diagram-js/assets/diagram-js.css'));
TestHelper.insertCSS('cmmn-embedded.css', require('cmmn-js/assets/cmmn-font/css/cmmn-embedded.css'));
TestHelper.insertCSS('properties.css', require('./assets/properties.css'));

TestHelper.insertCSS('diagram-js-testing.css',
  '.test-container .result { height: auto; }' +
  '.bjs-container { height: 400px !important; }' +
  ' div.test-container {height: auto}'
);


var bootstrapModeler = TestHelper.bootstrapModeler;

/**
 * Bootstrap a modeler instance.
 *
 * Before a modeler instance is bootstrapped any previous
 * existing modeler instance is destroyed, if it exists.
 *
 * Due to the fact that (almost) each test case bootstrap a new
 * modeler instance, destroying of an previous modeler instance
 * is necessary to speed the test execution up.
 */
TestHelper.bootstrapModeler = function(diagram, options, locals) {
  return function(done) {
    var previousInstance = TestHelper.getCmmnJs();

    if (previousInstance) {
      var container = previousInstance.container.parentNode;

      container.parentNode.removeChild(container);

      previousInstance.destroy();
    }
    return bootstrapModeler(diagram, options, locals).apply(this, [ done ]);
  };
};

/**
 * Overwrites the existing global bootstrapModeler().
 */
global.bootstrapModeler = TestHelper.bootstrapModeler;

/**
 * Triggers a change event
 *
 * @param element on which the change should be triggered
 * @param eventType type of the event (e.g. click, change, ...)
 */
var triggerEvent = function(element, eventType) {

  var evt;

  eventType = eventType || 'change';

  if (document.createEvent) {
    try {
      // Chrome, Safari, Firefox
      evt = new MouseEvent((eventType), { view: window, bubbles: true, cancelable: true });
    } catch (e) {
      // IE 11, PhantomJS (wat!)
      evt = document.createEvent('MouseEvent');

      evt.initEvent((eventType), true, true);
    }
    return element.dispatchEvent(evt);
  } else {
    // Welcome IE
    evt = document.createEventObject();

    return element.fireEvent('on' + eventType, evt);
  }
};

var triggerValue = function(element, value, eventType) {
  element.value = value;

  this.triggerEvent(element, eventType);
};

var triggerInput = function(element, value) {
  element.value = value;

  this.triggerEvent(element, 'input');

  element.focus();
};

/**
 * Select a form field with the specified index in the DOM
 *
 * @param  {number} index
 * @param  {DOMElement} container
 */
var triggerFormFieldSelection = function(index, container) {
  var formFieldSelectBox = domQuery('select[name=selectedExtensionElement]', container);

  formFieldSelectBox.options[index].selected = 'selected';
  TestHelper.triggerEvent(formFieldSelectBox, 'change');
};

/**
 *  Select the option with the given value
 *
 *  @param element contains the options
 *  @param optionValue value which should be selected
 */
var selectedByOption = function(element, optionValue) {

  var options = domQuery.all('option', element);

  for (var i = 0; i< options.length; i++) {

    var option = options[i];

    if (option.value === optionValue) {
      element.selectedIndex = i;
      break;
    }
  }
};

/**
 * PhantomJS Speciality
 * @param element
 * @returns {*}
 */
var selectedByIndex = function(element) {
  if (!element) {
    return null;
  }

  return element.options[element.selectedIndex];
};


module.exports.triggerEvent = triggerEvent;
module.exports.triggerValue = triggerValue;
module.exports.triggerInput = triggerInput;
module.exports.triggerFormFieldSelection = triggerFormFieldSelection;
module.exports.selectedByOption = selectedByOption;
module.exports.selectedByIndex = selectedByIndex;


global.chai.use(require('./matchers'));