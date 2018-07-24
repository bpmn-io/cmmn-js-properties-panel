'use strict';

var TestHelper = require('../../../TestHelper');

var TestContainer = require('mocha-test-container-support');

/* global bootstrapModeler, inject */

var propertiesPanelModule = require('lib'),
    domQuery = require('min-dom').query,
    coreModule = require('cmmn-js/lib/core'),
    selectionModule = require('diagram-js/lib/features/selection').default,
    modelingModule = require('cmmn-js/lib/features/modeling'),
    propertiesProviderModule = require('lib/provider/cmmn');


function getInput(container, selector) {
  return domQuery('input[' + selector + ']', container);
}

function getIfPartInput(container) {
  return getInput(domQuery('div[data-entry=ifPartCondition]', container), 'name=body');
}


describe('ifPart-properties', function() {

  var diagramXML = require('./IfPart.cmmn');

  var testModules = [
    coreModule, selectionModule, modelingModule,
    propertiesPanelModule,
    propertiesProviderModule
  ];

  var container;

  beforeEach(function() {
    container = TestContainer.get(this);
  });

  beforeEach(bootstrapModeler(diagramXML, {
    modules: testModules
  }));


  beforeEach(inject(function(commandStack, propertiesPanel) {

    var undoButton = document.createElement('button');
    undoButton.textContent = 'UNDO';

    undoButton.addEventListener('click', function() {
      commandStack.undo();
    });

    container.appendChild(undoButton);

    propertiesPanel.attachTo(container);
  }));


  describe('get', function() {

    var item, field, bo;

    it('should fetch the condition body', inject(function(elementRegistry, selection, propertiesPanel) {

      // given
      item = elementRegistry.get('EntryCriterion_1');
      selection.select(item);

      field = getIfPartInput(propertiesPanel._container);
      bo = item.businessObject.sentryRef.ifPart.condition;

      // when selecting element

      // then
      expect(field.value).to.equal(bo.get('body'));

    }));

  });


  describe('set', function() {

    var item, bo, field;

    describe('should set the condition body', function() {

      beforeEach(inject(function(elementRegistry, selection, propertiesPanel) {

        // given
        item = elementRegistry.get('EntryCriterion_1');
        selection.select(item);

        bo = item.businessObject.sentryRef.ifPart.condition;
        field = getIfPartInput(propertiesPanel._container);

        // when
        TestHelper.triggerValue(field, 'foo', 'change');

      }));

      describe('in the DOM', function() {

        it('should execute', function() {
          // then
          expect(field.value).to.equal('foo');
        });

        it('should undo', inject(function(commandStack) {
          // when
          commandStack.undo();

          // then
          expect(field.value).to.equal('CONDITION');
        }));


        it('should redo', inject(function(commandStack) {
          // when
          commandStack.undo();
          commandStack.redo();

          // then
          expect(field.value).to.equal('foo');
        }));

      });

      describe('on the business object', function() {

        it('should execute', function() {
          // then
          expect(bo.get('body')).to.equal('foo');
        });

        it('should undo', inject(function(commandStack) {
          // when
          commandStack.undo();

          // then
          expect(bo.get('body')).to.equal('CONDITION');
        }));


        it('should redo', inject(function(commandStack) {
          // when
          commandStack.undo();
          commandStack.redo();

          // then
          expect(bo.get('body')).to.equal('foo');
        }));

      });

    });


    describe('should create the condition', function() {

      var ifPart;

      beforeEach(inject(function(elementRegistry, selection, propertiesPanel) {

        // given
        item = elementRegistry.get('EntryCriterion_2');
        selection.select(item);

        bo = item.businessObject.sentryRef;
        ifPart = bo.ifPart;
        field = getIfPartInput(propertiesPanel._container);

        // when
        TestHelper.triggerValue(field, 'foo', 'change');

      }));

      describe('in the DOM', function() {

        it('should execute', function() {
          // then
          expect(field.value).to.equal('foo');
        });

        it('should undo', inject(function(commandStack) {
          // when
          commandStack.undo();

          // then
          expect(field.value).to.equal('');
        }));


        it('should redo', inject(function(commandStack) {
          // when
          commandStack.undo();
          commandStack.redo();

          // then
          expect(field.value).to.equal('foo');
        }));

      });

      describe('on the business object', function() {

        it('should execute', function() {
          // then
          expect(ifPart.get('condition')).to.exist;
          expect(ifPart.get('condition').$parent).to.equal(ifPart);

          expect(ifPart.get('condition').get('body')).to.equal('foo');
        });

        it('should undo', inject(function(commandStack) {
          // given
          var condition = ifPart.get('condition');

          // when
          commandStack.undo();

          // then
          expect(ifPart.get('condition')).not.to.exist;
          expect(condition.$parent).not.to.exist;

          expect(condition.get('body')).to.equal('foo');
        }));


        it('should redo', inject(function(commandStack) {
          // when
          commandStack.undo();
          commandStack.redo();

          // then
          expect(ifPart.get('condition')).to.exist;
          expect(ifPart.get('condition').$parent).to.equal(ifPart);

          expect(ifPart.get('condition').get('body')).to.equal('foo');
        }));

      });

    });


    describe('should create the ifPart and the condition', function() {

      beforeEach(inject(function(elementRegistry, selection, propertiesPanel) {

        // given
        item = elementRegistry.get('EntryCriterion_3');
        selection.select(item);

        bo = item.businessObject.sentryRef;
        field = getIfPartInput(propertiesPanel._container);

        // when
        TestHelper.triggerValue(field, 'foo', 'change');

      }));

      describe('in the DOM', function() {

        it('should execute', function() {
          // then
          expect(field.value).to.equal('foo');
        });

        it('should undo', inject(function(commandStack) {
          // when
          commandStack.undo();

          // then
          expect(field.value).to.equal('');
        }));


        it('should redo', inject(function(commandStack) {
          // when
          commandStack.undo();
          commandStack.redo();

          // then
          expect(field.value).to.equal('foo');
        }));

      });

      describe('on the business object', function() {

        it('should execute', function() {
          // then
          expect(bo.get('ifPart')).to.exist;
          expect(bo.get('ifPart').$parent).to.equal(bo);

          var ifPart = bo.get('ifPart');
          expect(ifPart.get('condition')).to.exist;
          expect(ifPart.get('condition').$parent).to.equal(ifPart);

          expect(ifPart.get('condition').get('body')).to.equal('foo');
        });

        it('should undo', inject(function(commandStack) {
          // given
          var ifPart = bo.get('ifPart'),
              condition = ifPart.get('condition');

          // when
          commandStack.undo();

          // then
          expect(bo.get('ifPart')).not.to.exist;
          expect(ifPart.$parent).not.to.exist;

          expect(ifPart.get('condition')).not.to.exist;
          expect(condition.$parent).not.to.exist;

          expect(condition.get('body')).to.equal('foo');
        }));


        it('should redo', inject(function(commandStack) {
          // when
          commandStack.undo();
          commandStack.redo();

          // then
          expect(bo.get('ifPart')).to.exist;
          expect(bo.get('ifPart').$parent).to.equal(bo);

          var ifPart = bo.get('ifPart');
          expect(ifPart.get('condition')).to.exist;
          expect(ifPart.get('condition').$parent).to.equal(ifPart);

          expect(ifPart.get('condition').get('body')).to.equal('foo');
        }));

      });

    });


    describe('should create the sentry', function() {

      var casePlanModel;

      beforeEach(inject(function(elementRegistry, selection, propertiesPanel) {

        // given
        item = elementRegistry.get('EntryCriterion_4');
        selection.select(item);

        casePlanModel = elementRegistry.get('CasePlanModel_1').businessObject;

        bo = item.businessObject;
        field = getIfPartInput(propertiesPanel._container);

        // assume
        expect(bo.get('sentryRef')).not.to.exist;

        // when
        TestHelper.triggerValue(field, 'foo', 'change');

      }));

      describe('in the DOM', function() {

        it('should execute', function() {
          // then
          expect(field.value).to.equal('foo');
        });

        it('should undo', inject(function(commandStack) {
          // when
          commandStack.undo();

          // then
          expect(field.value).to.equal('');
        }));


        it('should redo', inject(function(commandStack) {
          // when
          commandStack.undo();
          commandStack.redo();

          // then
          expect(field.value).to.equal('foo');
        }));

      });

      describe('on the business object', function() {

        it('should execute', function() {
          // then
          expect(bo.get('sentryRef')).to.exist;
          expect(bo.get('sentryRef').$parent).to.equal(casePlanModel);

          var sentry = bo.get('sentryRef');
          expect(sentry.get('ifPart')).to.exist;
          expect(sentry.get('ifPart').$parent).to.equal(sentry);

          var ifPart = sentry.get('ifPart');
          expect(ifPart.get('condition')).to.exist;
          expect(ifPart.get('condition').$parent).to.equal(ifPart);

          expect(ifPart.get('condition').get('body')).to.equal('foo');
        });

        it('should undo', inject(function(commandStack) {
          // given
          var sentry = bo.get('sentryRef'),
              ifPart = sentry.get('ifPart'),
              condition = ifPart.get('condition');

          // when
          commandStack.undo();

          // then
          expect(bo.get('sentryRef')).not.to.exist;
          expect(sentry.$parent).not.to.exist;

          expect(bo.get('ifPart')).not.to.exist;
          expect(ifPart.$parent).not.to.exist;

          expect(ifPart.get('condition')).not.to.exist;
          expect(condition.$parent).not.to.exist;

          expect(condition.get('body')).to.equal('foo');
        }));


        it('should redo', inject(function(commandStack) {
          // when
          commandStack.undo();
          commandStack.redo();

          // then
          expect(bo.get('sentryRef')).to.exist;
          expect(bo.get('sentryRef').$parent).to.equal(casePlanModel);

          var sentry = bo.get('sentryRef');
          expect(sentry.get('ifPart')).to.exist;
          expect(sentry.get('ifPart').$parent).to.equal(sentry);

          var ifPart = sentry.get('ifPart');
          expect(ifPart.get('condition')).to.exist;
          expect(ifPart.get('condition').$parent).to.equal(ifPart);

          expect(ifPart.get('condition').get('body')).to.equal('foo');
        }));

      });

    });


    describe('should remove the condition and ifPart', function() {

      var ifPart, condition;

      beforeEach(inject(function(elementRegistry, selection, propertiesPanel) {

        // given
        item = elementRegistry.get('EntryCriterion_1');
        selection.select(item);

        bo = item.businessObject.sentryRef;
        ifPart = bo.ifPart;
        condition = ifPart.condition;
        field = getIfPartInput(propertiesPanel._container);

        // when
        TestHelper.triggerValue(field, '', 'change');

      }));

      describe('in the DOM', function() {

        it('should execute', function() {
          // then
          expect(field.value).to.equal('');
        });

        it('should undo', inject(function(commandStack) {
          // when
          commandStack.undo();

          // then
          expect(field.value).to.equal('CONDITION');
        }));


        it('should redo', inject(function(commandStack) {
          // when
          commandStack.undo();
          commandStack.redo();

          // then
          expect(field.value).to.equal('');
        }));

      });

      describe('on the business object', function() {

        it('should execute', function() {
          // then
          expect(bo.get('ifPart')).not.to.exist;
          expect(ifPart.$parent).not.to.exist;

          expect(ifPart.get('condition')).not.to.exist;
          expect(condition.$parent).not.to.exist;

          expect(condition.get('body')).not.to.exist;
        });

        it('should undo', inject(function(commandStack) {
          // when
          commandStack.undo();

          // then
          expect(bo.get('ifPart')).to.equal(ifPart);
          expect(ifPart.$parent).to.equal(bo);

          expect(ifPart.get('condition')).to.equal(condition);
          expect(condition.$parent).to.equal(ifPart);

          expect(condition.get('body')).to.equal('CONDITION');
        }));


        it('should redo', inject(function(commandStack) {
          // when
          commandStack.undo();
          commandStack.redo();

          // then
          expect(bo.get('ifPart')).not.to.exist;
          expect(ifPart.$parent).not.to.exist;

          expect(ifPart.get('condition')).not.to.exist;
          expect(condition.$parent).not.to.exist;

          expect(condition.get('body')).not.to.exist;
        }));

      });

    });

  });

});
