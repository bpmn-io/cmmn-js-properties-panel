'use strict';

var TestHelper = require('../../../TestHelper');

var TestContainer = require('mocha-test-container-support');

/* global bootstrapModeler, inject */

var propertiesPanelModule = require('../../../../lib'),
    domQuery = require('min-dom').query,
    coreModule = require('cmmn-js/lib/core'),
    selectionModule = require('diagram-js/lib/features/selection').default,
    modelingModule = require('cmmn-js/lib/features/modeling'),
    propertiesProviderModule = require('../../../../lib/provider/camunda'),
    camundaModdlePackage = require('camunda-cmmn-moddle/resources/camunda');

function getInput(container) {
  return domQuery('input[name=historyTimeToLive]', container);
}


describe('case-history-time-to-live-property', function() {

  var diagramXML = require('./CaseHistoryTimeToLive.cmmn');

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
    modules: testModules,
    moddleExtensions: { camunda: camundaModdlePackage }
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

    it('should get the history time to live for case', inject(function(elementRegistry, selection, propertiesPanel) {

      // given
      field = getInput(propertiesPanel._container, 'historyTimeToLive');

      // then
      expect(field.value).to.equal(bo.get('historyTimeToLive'));

    }));

  });


  describe('set', function() {

    var bo, field;

    beforeEach(inject(function(elementRegistry, selection, propertiesPanel) {

      // given
      var item = elementRegistry.get('CasePlanModel_1');
      selection.select(item);

      bo = item.businessObject.$parent;
      field = getInput(propertiesPanel._container);

      // when
      TestHelper.triggerValue(field, 'bar', 'change');

    }));


    describe('in the DOM', function() {

      it('should execute', function() {
        expect(field.value).to.equal('bar');
      });

      it('should undo', inject(function(commandStack) {
        // when
        commandStack.undo();

        // then
        expect(field.value).to.equal('foo');
      }));


      it('should redo', inject(function(commandStack) {
        // when
        commandStack.undo();
        commandStack.redo();

        // then
        expect(field.value).to.equal('bar');
      }));

    });

    describe('on the business object', function() {

      it('should execute', function() {
        expect(bo.get('historyTimeToLive')).to.equal('bar');
      });

      it('should undo', inject(function(commandStack) {
        // when
        commandStack.undo();

        // then
        expect(bo.get('historyTimeToLive')).to.equal('foo');
      }));


      it('should redo', inject(function(commandStack) {
        // when
        commandStack.undo();
        commandStack.redo();

        // then
        expect(bo.get('historyTimeToLive')).to.equal('bar');
      }));

    });

  });

});
