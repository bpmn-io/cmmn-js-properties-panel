'use strict';

require('../TestHelper');

var TestContainer = require('mocha-test-container-support');

/* global bootstrapModeler, inject */



var propertiesPanelModule = require('../../lib'),
    coreModule = require('cmmn-js/lib/core'),
    selectionModule = require('diagram-js/lib/features/selection'),
    modelingModule = require('cmmn-js/lib/features/modeling'),
    propertiesProviderModule = require('./properties');


var domQuery = require('min-dom/lib/query'),
    domAttr = require('min-dom/lib/attr');


describe('properties-panel', function() {

  var diagramXML = require('./test.cmmn');

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


  beforeEach(inject(function(commandStack) {

    var button = document.createElement('button');
    button.textContent = 'UNDO';

    button.addEventListener('click', function() {
      commandStack.undo();
    });

    container.appendChild(button);
  }));


  it('should attach to element', inject(function(propertiesPanel, selection, elementRegistry) {

    // given
    var taskShape = elementRegistry.get('PlanItem_1');

    propertiesPanel.attachTo(container);

    // when
    selection.select(taskShape);

  }));


  describe('helpers', function() {

    describe('inject element id into [data-label-id] element', function() {

      function headerText(propertiesPanel) {
        return domQuery('[data-label-id]', propertiesPanel._container).textContent;
      }

      var shape;

      beforeEach(inject(function(propertiesPanel, elementRegistry) {
        propertiesPanel.attachTo(container);

        shape = elementRegistry.get('PlanItem_1');
      }));


      it('should display initially', inject(function(propertiesPanel, selection) {

        // when
        selection.select(shape);

        // then
        expect(headerText(propertiesPanel)).to.eql(shape.id);
      }));


      it('should update on id edit',
        inject(function(propertiesPanel, selection, modeling) {

          // given
          var newId = 'BAR';

          selection.select(shape);

          // when
          modeling.updateProperties(shape, { id: newId });

          // then
          expect(headerText(propertiesPanel)).to.eql(newId);
        })
      );


      it('should update on id undo', inject(function(propertiesPanel, selection, commandStack, modeling) {

        // given
        var oldId = shape.id;

        selection.select(shape);
        modeling.updateProperties(shape, { id: 'BAR' });

        // when
        commandStack.undo();

        // then
        expect(headerText(propertiesPanel)).to.eql(oldId);
      }));

    });

  });


  describe('tab selection', function() {

    function getActiveTabId(container) {
      var activeTabNode = domQuery('.cpp-properties-tab.cpp-active', container);
      return domAttr(activeTabNode, 'data-tab');
    }

    it('should keep the selected tab when changing the selected element',
      inject(function(propertiesPanel, selection, elementRegistry) {

        propertiesPanel.attachTo(container);

        // select event
        var shape = elementRegistry.get('PlanItem_1');
        selection.select(shape);

        // first: check selected tab
        expect(getActiveTabId(propertiesPanel._container)).to.equal('tab1');

        // select tab2
        propertiesPanel.activateTab('tab2');

        // check selected tab
        expect(getActiveTabId(propertiesPanel._container)).to.equal('tab2');

        // select task
        shape = elementRegistry.get('CasePlanModel_1');
        selection.select(shape);

        // check selected tab again
        expect(getActiveTabId(propertiesPanel._container)).to.equal('tab2');

      }));


    it('should select the first tab because the selected tab does not exist',
      inject(function(propertiesPanel, selection, elementRegistry) {

        propertiesPanel.attachTo(container);

        // select task
        var shape = elementRegistry.get('CasePlanModel_1');
        selection.select(shape);

        // select tab3
        propertiesPanel.activateTab('tab3');

        // check selected tab
        expect(getActiveTabId(propertiesPanel._container)).to.equal('tab3');

        // select event
        shape = elementRegistry.get('PlanItem_1');
        selection.select(shape);

        // check selected tab again
        expect(getActiveTabId(propertiesPanel._container)).to.equal('tab1');

      }));

  });


});
