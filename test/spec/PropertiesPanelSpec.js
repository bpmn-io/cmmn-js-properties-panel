'use strict';

require('../TestHelper');

var TestContainer = require('mocha-test-container-support');

/* global bootstrapModeler, inject */



var propertiesPanelModule = require('lib'),
    coreModule = require('cmmn-js/lib/core'),
    selectionModule = require('diagram-js/lib/features/selection').default,
    modelingModule = require('cmmn-js/lib/features/modeling'),
    propertiesProviderModule = require('./properties');


var domQuery = require('min-dom').query,
    domAttr = require('min-dom').attr;


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


  describe('description for field entry', function() {

    function getDescriptionField(container, dataEntrySelector) {
      return domQuery(dataEntrySelector + ' .cpp-field-description', container);
    }

    var eventShape;

    beforeEach(inject(function(propertiesPanel, selection, elementRegistry) {
      propertiesPanel.attachTo(container);

      eventShape = elementRegistry.get('PlanItem_1');
      selection.select(eventShape);

    }));


    it('only text', inject(function(propertiesPanel) {
      var descriptionField = getDescriptionField(propertiesPanel._container, '[data-entry=myText]');

      expect(descriptionField.textContent).to.be.equal('This field is for documentation');
    }));


    it('with a markdown link', inject(function(propertiesPanel) {
      var descriptionField = getDescriptionField(propertiesPanel._container, '[data-entry=myLinkText]');

      expect(descriptionField.textContent).to.be.equal('For details see camunda.org');

      var link = domQuery('a', descriptionField);

      expect(link.href).to.be.equal('http://www.camunda.org/');
      expect(link.textContent).to.be.equal('camunda.org');
    }));


    it('with an html link', inject(function(propertiesPanel) {
      var descriptionField = getDescriptionField(propertiesPanel._container, '[data-entry=myHtmlLinkText]');

      expect(descriptionField.textContent).to.be.equal('For details see camunda.org');

      var link = domQuery('a', descriptionField);

      expect(link.href).to.be.equal('http://www.camunda.org/');
      expect(link.textContent).to.be.equal('camunda.org');
    }));


    it('with a malicious link', inject(function(propertiesPanel) {
      var descriptionField = getDescriptionField(propertiesPanel._container, '[data-entry=maliciousLinkText]');

      expect(descriptionField.textContent).to.be.equal('For malicious code see [javascript](javascript:alert(1))');

      var link = domQuery('a', descriptionField);

      expect(link).to.not.exist;
    }));

  });



});
