'use strict';

var elementHelper = require('../helper/ElementHelper');

/**
 * A handler capable of creating a new element under a provided parent
 * and updating / creating a reference to it in one atomic action.
 *
 * @class
 * @constructor
 */
function CreateAndReferenceElementHandler(cmmnFactory) {
  this._cmmnFactory = cmmnFactory;
}

CreateAndReferenceElementHandler.$inject = [ 'cmmnFactory' ];

module.exports = CreateAndReferenceElementHandler;

function ensureNotNull(prop, name) {
  if (!prop) {
    throw new Error(name + ' required');
  }
  return prop;
}

////// api /////////////////////////////////////////////

/**
 * Creates a new element under a provided parent and updates / creates a reference to it in
 * one atomic action.
 *
 * @method  CreateAndReferenceElementHandler#execute
 *
 * @param {Object} context
 * @param {djs.model.Base} context.element which is the context for the reference
 * @param {moddle.referencingObject} context.referencingObject the object which creates the reference
 * @param {String} context.referenceProperty the property of the referencingObject which makes the reference
 * @param {moddle.newObject} context.newObject the new object to add
 * @param {moddle.newObjectContainer} context.newObjectContainer the container for the new object
 *
 * @returns {Array<djs.mode.Base>} the updated element
 */
CreateAndReferenceElementHandler.prototype.execute = function(context) {

  var referencingObject = ensureNotNull(context.referencingObject, 'referencingObject'),
      referenceProperty = ensureNotNull(context.referenceProperty, 'referenceProperty'),
      newObject = ensureNotNull(context.newObject, 'newObject'),
      newObjectContainer = ensureNotNull(context.newObjectContainer, 'newObjectContainer'),
      newObjectParent = ensureNotNull(context.newObjectParent, 'newObjectParent'),
      changed = [ context.element ]; // this will not change any diagram-js elements

  // create new object
  var referencedObject = elementHelper
                          .createElement(newObject.type, newObject.properties, newObjectParent, this._cmmnFactory);
  context.referencedObject = referencedObject;

  // add to containing list
  newObjectContainer.push(referencedObject);

  // adjust reference attribute
  context.previousReference = referencingObject[referenceProperty];
  referencingObject[referenceProperty] = referencedObject;

  context.changed = changed;

  // indicate changed on objects affected by the update
  return changed;
};

/**
 * Reverts the update
 *
 * @method  CreateAndReferenceElementHandler#revert
 *
 * @param {Object} context
 *
 * @returns {djs.mode.Base} the updated element
 */
CreateAndReferenceElementHandler.prototype.revert = function(context) {

  var referencingObject = context.referencingObject,
      referenceProperty = context.referenceProperty,
      previousReference = context.previousReference,
      referencedObject = context.referencedObject,
      newObjectContainer = context.newObjectContainer;

  // reset reference
  referencingObject.set(referenceProperty, previousReference);

  // remove new element
  newObjectContainer.splice(newObjectContainer.indexOf(referencedObject), 1);

  return context.changed;
};
