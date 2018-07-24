'use strict';

var TestHelper = require('../../../TestHelper');

var TestContainer = require('mocha-test-container-support');

/* global bootstrapModeler, inject */

var propertiesPanelModule = require('lib'),
    domQuery = require('min-dom').query,
    domClasses = require('min-dom').classes,
    coreModule = require('cmmn-js/lib/core'),
    selectionModule = require('diagram-js/lib/features/selection').default,
    modelingModule = require('cmmn-js/lib/features/modeling'),
    propertiesProviderModule = require('lib/provider/cmmn'),
    getBusinessObject = require('cmmn-js/lib/util/ModelUtil').getBusinessObject;


function getTextBox(container, selector) {
  return domQuery('[data-entry=caseName] [name=' + selector + ']', container);
}

function getInput(container, selector) {
  return domQuery('[data-entry=caseId] input[' + selector + ']', container);
}


describe('case-properties', function() {

  var diagramXML = require('./Case.cmmn');

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

    beforeEach(inject(function(elementRegistry, selection, propertiesPanel) {

      // given
      item = elementRegistry.get('CasePlanModel_1');
      selection.select(item);

      bo = item.businessObject.$parent;

    }));

    it('should fetch the name for case', inject(function(elementRegistry, selection, propertiesPanel) {

      // given
      field = getTextBox(propertiesPanel._container, 'name');

      // when
      TestHelper.triggerValue(field, 'foo', 'change');

      // then
      expect(field.textContent).to.equal(bo.get('name'));

    }));

    it('should fetch the id for case', inject(function(elementRegistry, selection, propertiesPanel) {

      // given
      field = getInput(propertiesPanel._container, 'id');

      // when
      TestHelper.triggerValue(field, 'foo', 'change');

      // then
      expect(field.value).to.equal(bo.get('id'));

    }));

  });


  describe('set', function() {

    describe('should set the name for case', function() {

      var bo, field;

      beforeEach(inject(function(elementRegistry, selection, propertiesPanel) {

        // given
        var item = elementRegistry.get('CasePlanModel_1');
        selection.select(item);

        bo = item.businessObject.$parent;
        field = getTextBox(propertiesPanel._container, 'name');

        // when
        TestHelper.triggerValue(field, 'foo', 'change');

      }));


      describe('in the DOM', function() {

        it('should execute', function() {
          expect(field.textContent).to.equal('foo');
        });

        it('should undo', inject(function(commandStack) {
          // when
          commandStack.undo();

          // then
          expect(field.textContent).to.equal('myCase');
        }));


        it('should redo', inject(function(commandStack) {
          // when
          commandStack.undo();
          commandStack.redo();

          // then
          expect(field.textContent).to.equal('foo');
        }));

      });

      describe('on the business object', function() {

        it('should execute', function() {
          expect(bo.get('name')).to.equal('foo');
        });

        it('should undo', inject(function(commandStack) {
          // when
          commandStack.undo();

          // then
          expect(bo.get('name')).to.equal('myCase');
        }));


        it('should redo', inject(function(commandStack) {
          // when
          commandStack.undo();
          commandStack.redo();

          // then
          expect(bo.get('name')).to.equal('foo');
        }));

      });

    });


    describe('should set the id for case', function() {

      var bo, field;

      beforeEach(inject(function(elementRegistry, selection, propertiesPanel) {

        // given
        var item = elementRegistry.get('CasePlanModel_1');
        selection.select(item);

        bo = item.businessObject.$parent;
        field = getInput(propertiesPanel._container, 'id');

        // when
        TestHelper.triggerValue(field, 'foo', 'change');

      }));


      describe('in the DOM', function() {

        it('should execute', function() {
          expect(field.value).to.equal('foo');
        });

        it('should undo', inject(function(commandStack) {
          // when
          commandStack.undo();

          // then
          expect(field.value).to.equal('Case_1');
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
          expect(bo.get('id')).to.equal('foo');
        });

        it('should undo', inject(function(commandStack) {
          // when
          commandStack.undo();

          // then
          expect(bo.get('id')).to.equal('Case_1');
        }));


        it('should redo', inject(function(commandStack) {
          // when
          commandStack.undo();
          commandStack.redo();

          // then
          expect(bo.get('id')).to.equal('foo');
        }));

      });

    });


  });


  describe('validation', function() {

    var field, bo;

    beforeEach(inject(function(elementRegistry, selection, propertiesPanel) {
      var shape = elementRegistry.get('CasePlanModel_1');
      selection.select(shape);

      field = getInput(propertiesPanel._container, 'id');
      bo = getBusinessObject(shape).$parent;

    }));

    it('should not remove the id for case', inject(function(propertiesPanel) {

      // assume
      expect(field.value).to.equal('Case_1');

      // when
      TestHelper.triggerValue(field, '', 'change');

      // then
      expect(bo.get('id')).to.equal('Case_1');
    }));


    it('should not set the id with a space for case', inject(function(propertiesPanel) {

      // assume
      expect(field.value).to.equal('Case_1');

      // when
      TestHelper.triggerValue(field, 'foo bar', 'change');

      // then
      expect(bo.get('id')).to.equal('Case_1');
    }));


    it('should not set invalid QName id for case', inject(function(propertiesPanel) {

      // assume
      expect(field.value).to.equal('Case_1');

      // when
      TestHelper.triggerValue(field, '::FOO', 'change');

      // then
      expect(bo.get('id')).to.equal('Case_1');
    }));


    it('should not set invalid HTML characters id for case', inject(function(propertiesPanel) {

      // assume
      expect(field.value).to.equal('Case_1');

      // when
      TestHelper.triggerValue(field, '<hello>', 'change');

      // then
      expect(bo.get('id')).to.equal('Case_1');
    }));

    describe('errors', function() {

      it('should not be shown if id is valid', function() {

        // when
        TestHelper.triggerValue(field, 'foo', 'change');

        // then
        expect(domClasses(field).has('invalid')).to.be.false;
      });


      it('should be shown if id gets removed', function() {

        // when
        TestHelper.triggerValue(field, '', 'change');

        // then
        expect(domClasses(field).has('invalid')).to.be.true;
      });


      it('should be shown if id contains space', function() {

        // when
        TestHelper.triggerValue(field, 'foo bar', 'change');

        // then
        expect(domClasses(field).has('invalid')).to.be.true;
      });


      it('should be shown if id is invalid QName', function() {

        // when
        TestHelper.triggerValue(field, '::FOO', 'change');

        // then
        expect(domClasses(field).has('invalid')).to.be.true;
      });


      it('should be shown if id contains HTML characters', function() {

        // when
        TestHelper.triggerValue(field, '<hello>', 'change');

        // then
        expect(domClasses(field).has('invalid')).to.be.true;
      });

    });

  });


  describe('control visibility', function() {

    function expectVisible(elementId, visible, getter) {

      if (!getter) {
        getter = getInput;
      }

      return inject(function(propertiesPanel, selection, elementRegistry) {

        // given
        var element = elementRegistry.get(elementId);

        // assume
        expect(element).to.exist;

        // when
        selection.select(element);
        var field = getter(propertiesPanel._container, 'id');

        // then
        if (visible) {
          expect(field).to.exist;
        } else {
          expect(field).not.to.exist;
        }
      });
    }

    describe('should show case id', function() {
      it('CasePlanModel', expectVisible('CasePlanModel_1', true));
    });


    describe('should hide case id', function() {
      it('Root', expectVisible('CMMNDiagram_1', false));
      it('PlanItem', expectVisible('PlanItem_1', false));
    });

  });


});
