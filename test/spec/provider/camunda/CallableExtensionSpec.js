'use strict';

var TestHelper = require('../../../TestHelper');

var TestContainer = require('mocha-test-container-support');

/* global bootstrapModeler, inject */

var propertiesPanelModule = require('../../../../lib'),
    domQuery = require('min-dom').query,
    domClasses = require('min-dom').classes,
    coreModule = require('cmmn-js/lib/core'),
    selectionModule = require('diagram-js/lib/features/selection').default,
    modelingModule = require('cmmn-js/lib/features/modeling'),
    propertiesProviderModule = require('../../../../lib/provider/camunda'),
    camundaModdlePackage = require('camunda-cmmn-moddle/resources/camunda');


function getInput(container, selector) {
  return domQuery('input[name="' + selector + '"]', container);
}

function getSelect(container, selector) {
  return domQuery('select[name="' + selector + '"]', container);
}


describe('callable-extension-properties', function() {

  var diagramXML = require('./CallableExtension.cmmn');

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

    describe('# Decision Task', function() {

      var bo;

      beforeEach(inject(function(elementRegistry, selection) {

        // given
        var item = elementRegistry.get('PlanItem_DecisionTask_Version');
        selection.select(item);

        bo = item.businessObject.definitionRef;

      }));


      it('should fetch the binding of a decision task definition', inject(function(propertiesPanel) {

        var field = getSelect(propertiesPanel._container, 'callableBinding');

        // when selecting element

        // then
        expect(field.value).to.equal(bo.get('camunda:decisionBinding'));

      }));


      it('should fetch the version of a decision task definition', inject(function(propertiesPanel) {

        var field = getInput(propertiesPanel._container, 'callableVersion');

        // when selecting element

        // then
        expect(field.value).to.equal(bo.get('camunda:decisionVersion'));

      }));


      it('should fetch the tenantId of a decision task definition', inject(function(propertiesPanel) {

        var field = getInput(propertiesPanel._container, 'callableTenantId');

        // when selecting element

        // then
        expect(field.value).to.equal(bo.get('camunda:decisionTenantId'));

      }));


      it('should fetch the resultVariable of a decision task definition', inject(function(propertiesPanel) {

        var field = getInput(propertiesPanel._container, 'resultVariable');

        // when selecting element

        // then
        expect(field.value).to.equal(bo.get('camunda:resultVariable'));

      }));


      it('should fetch the mapDecisionResult of a decision task definition', inject(function(propertiesPanel) {

        var field = getSelect(propertiesPanel._container, 'mapDecisionResult');

        // when selecting element

        // then
        expect(field.value).to.equal(bo.get('camunda:mapDecisionResult'));

      }));

    });

    describe('# Case Task', function() {

      var bo;

      beforeEach(inject(function(elementRegistry, selection) {

        // given
        var item = elementRegistry.get('PlanItem_CaseTask_Valid');
        selection.select(item);

        bo = item.businessObject.definitionRef;

      }));


      it('should fetch the binding of a case task definition', inject(function(propertiesPanel) {

        var field = getSelect(propertiesPanel._container, 'callableBinding');

        // when selecting element

        // then
        expect(field.value).to.equal(bo.get('camunda:caseBinding'));

      }));


      it('should fetch the tenantId of a case task definition', inject(function(propertiesPanel) {

        var field = getInput(propertiesPanel._container, 'callableTenantId');

        // when selecting element

        // then
        expect(field.value).to.equal(bo.get('camunda:caseTenantId'));

      }));

    });

    describe('# Process Task', function() {

      var bo;

      beforeEach(inject(function(elementRegistry, selection) {

        // given
        var item = elementRegistry.get('PlanItem_ProcessTask_Valid');
        selection.select(item);

        bo = item.businessObject.definitionRef;

      }));


      it('should fetch the binding of a process task definition', inject(function(propertiesPanel) {

        var field = getSelect(propertiesPanel._container, 'callableBinding');

        // when selecting element

        // then
        expect(field.value).to.equal(bo.get('camunda:processBinding'));

      }));


      it('should fetch the tenantId of a process task definition', inject(function(propertiesPanel) {

        var field = getInput(propertiesPanel._container, 'callableTenantId');

        // when selecting element

        // then
        expect(field.value).to.equal(bo.get('camunda:processTenantId'));

      }));

    });

  });


  describe('validation errors', function() {

    var bo;

    beforeEach(inject(function(elementRegistry, selection) {

      // given
      var item = elementRegistry.get('PlanItem_CaseTask_Invalid');
      selection.select(item);

      bo = item.businessObject.definitionRef;

    }));


    it('should be shown if version binding set and version field is empty', inject(function(propertiesPanel) {

      var binding = getSelect(propertiesPanel._container, 'callableBinding');
      var version = getInput(propertiesPanel._container, 'callableVersion');

      // when selecting element

      // then
      expect(binding.value).to.equal(bo.get('camunda:caseBinding'));
      expect(domClasses(version).has('invalid')).to.be.true;

    }));

  });


  describe('set', function() {

    describe('# binding', function() {

      var bo, field, versionField;

      beforeEach(inject(function(elementRegistry, selection, propertiesPanel) {

        // given
        var item = elementRegistry.get('PlanItem_DecisionTask_Version');
        selection.select(item);

        bo = item.businessObject.definitionRef;

        field = getSelect(propertiesPanel._container, 'callableBinding');
        versionField = getInput(propertiesPanel._container, 'callableVersion');

        // when

        // select 'latest'
        field[0].selected = 'selected';
        TestHelper.triggerEvent(field, 'change');

      }));


      describe('in the DOM', function() {

        it('should execute', function() {
          expect(field.value).to.equal('latest');
          expect(domClasses(versionField.parentElement).has('cpp-hidden')).to.be.true;
        });

        it('should undo', inject(function(commandStack) {
          // when
          commandStack.undo();

          // then
          expect(field.value).to.equal('version');
          expect(domClasses(versionField.parentElement).has('cpp-hidden')).to.be.false;
        }));


        it('should redo', inject(function(commandStack) {
          // when
          commandStack.undo();
          commandStack.redo();

          // then
          expect(field.value).to.equal('latest');
          expect(domClasses(versionField.parentElement).has('cpp-hidden')).to.be.true;
        }));

      });

      describe('on the business object', function() {

        it('should execute', function() {
          expect(bo.get('camunda:decisionBinding')).to.equal('latest');
          expect(bo.get('camunda:decisionVersion')).to.be.undefined;
        });

        it('should undo', inject(function(commandStack) {
          // when
          commandStack.undo();

          // then
          expect(bo.get('camunda:decisionBinding')).to.equal('version');
          expect(bo.get('camunda:decisionVersion')).to.be.defined;
        }));


        it('should redo', inject(function(commandStack) {
          // when
          commandStack.undo();
          commandStack.redo();

          // then
          expect(bo.get('camunda:decisionBinding')).to.equal('latest');
          expect(bo.get('camunda:decisionVersion')).to.be.undefined;
        }));

      });

    });


    describe('# version', function() {

      var bo, field;

      beforeEach(inject(function(elementRegistry, selection, propertiesPanel) {

        // given
        var item = elementRegistry.get('PlanItem_DecisionTask_Version');
        selection.select(item);

        bo = item.businessObject.definitionRef;

        field = getInput(propertiesPanel._container, 'callableVersion');

        // when
        TestHelper.triggerValue(field, '1', 'change');

      }));


      describe('in the DOM', function() {

        it('should execute', function() {
          expect(field.value).to.equal('1');
        });

        it('should undo', inject(function(commandStack) {
          // when
          commandStack.undo();

          // then
          expect(field.value).to.equal('2');
        }));


        it('should redo', inject(function(commandStack) {
          // when
          commandStack.undo();
          commandStack.redo();

          // then
          expect(field.value).to.equal('1');
        }));

      });

      describe('on the business object', function() {

        it('should execute', function() {
          expect(bo.get('camunda:decisionVersion')).to.equal('1');
        });

        it('should undo', inject(function(commandStack) {
          // when
          commandStack.undo();

          // then
          expect(bo.get('camunda:decisionVersion')).to.equal('2');
        }));


        it('should redo', inject(function(commandStack) {
          // when
          commandStack.undo();
          commandStack.redo();

          // then
          expect(bo.get('camunda:decisionVersion')).to.equal('1');
        }));

      });

    });


    describe('# tenantId', function() {

      var bo, field;

      beforeEach(inject(function(elementRegistry, selection, propertiesPanel) {

        // given
        var item = elementRegistry.get('PlanItem_DecisionTask_Version');
        selection.select(item);

        bo = item.businessObject.definitionRef;

        field = getInput(propertiesPanel._container, 'callableTenantId');

        // when
        TestHelper.triggerValue(field, 'TENANT_TWO', 'change');

      }));


      describe('in the DOM', function() {

        it('should execute', function() {
          // then
          expect(field.value).to.equal('TENANT_TWO');
        });

        it('should undo', inject(function(commandStack) {
          // when
          commandStack.undo();

          // then
          expect(field.value).to.equal('tenantOne');
        }));


        it('should redo', inject(function(commandStack) {
          // when
          commandStack.undo();
          commandStack.redo();

          // then
          expect(field.value).to.equal('TENANT_TWO');
        }));

      });

      describe('on the business object', function() {

        it('should execute', function() {
          // then
          expect(bo.get('camunda:decisionTenantId')).to.equal('TENANT_TWO');
        });

        it('should undo', inject(function(commandStack) {
          // when
          commandStack.undo();

          // then
          expect(bo.get('camunda:decisionTenantId')).to.equal('tenantOne');
        }));


        it('should redo', inject(function(commandStack) {
          // when
          commandStack.undo();
          commandStack.redo();

          // then
          expect(bo.get('camunda:decisionTenantId')).to.equal('TENANT_TWO');
        }));

      });

    });


    describe('# resultVariable', function() {

      var bo, field, mapDecisionResultField;

      beforeEach(inject(function(elementRegistry, selection, propertiesPanel) {

        // given
        var item = elementRegistry.get('PlanItem_DecisionTask_Version');
        selection.select(item);

        bo = item.businessObject.definitionRef;

        field = getInput(propertiesPanel._container, 'resultVariable');
        mapDecisionResultField = getSelect(propertiesPanel._container, 'mapDecisionResult');

        // when
        TestHelper.triggerValue(field, '', 'change');

      }));


      describe('in the DOM', function() {

        it('should execute', function() {
          // then
          expect(field.value).to.equal('');
          expect(domClasses(mapDecisionResultField).has('cpp-hidden')).to.be.true;
        });

        it('should undo', inject(function(commandStack) {
          // when
          commandStack.undo();

          // then
          expect(field.value).to.equal('myResVar');
          expect(domClasses(mapDecisionResultField).has('cpp-hidden')).to.be.false;
        }));


        it('should redo', inject(function(commandStack) {
          // when
          commandStack.undo();
          commandStack.redo();

          // then
          expect(field.value).to.equal('');
          expect(domClasses(mapDecisionResultField).has('cpp-hidden')).to.be.true;
        }));

      });

      describe('on the business object', function() {

        it('should execute', function() {
          // then
          expect(bo.get('camunda:resultVariable')).to.be.undefined;
          // default value 'resultList'
          expect(bo.get('camunda:mapDecisionResult')).to.be.defined;
        });

        it('should undo', inject(function(commandStack) {
          // when
          commandStack.undo();

          // then
          expect(bo.get('camunda:resultVariable')).to.equal('myResVar');
          expect(bo.get('camunda:mapDecisionResult')).to.be.defined;
        }));


        it('should redo', inject(function(commandStack) {
          // when
          commandStack.undo();
          commandStack.redo();

          // then
          expect(bo.get('camunda:resultVariable')).to.be.undefined;
          // default value 'resultList'
          expect(bo.get('camunda:mapDecisionResult')).to.be.defined;
        }));

      });

    });


    describe('# mapDecisionResult', function() {

      var bo, field;

      beforeEach(inject(function(elementRegistry, selection, propertiesPanel) {

        // given
        var item = elementRegistry.get('PlanItem_DecisionTask_Version');
        selection.select(item);

        bo = item.businessObject.definitionRef;

        field = getSelect(propertiesPanel._container, 'mapDecisionResult');

        // when
        // select 'resultList'
        field[3].selected = 'selected';
        TestHelper.triggerEvent(field, 'change');

      }));


      describe('in the DOM', function() {

        it('should execute', function() {
          // then
          expect(field.value).to.equal('resultList');
        });

        it('should undo', inject(function(commandStack) {
          // when
          commandStack.undo();

          // then
          expect(field.value).to.equal('singleResult');
        }));


        it('should redo', inject(function(commandStack) {
          // when
          commandStack.undo();
          commandStack.redo();

          // then
          expect(field.value).to.equal('resultList');
        }));

      });

      describe('on the business object', function() {

        it('should execute', function() {
          // then
          expect(bo.get('camunda:mapDecisionResult')).to.equal('resultList');
        });

        it('should undo', inject(function(commandStack) {
          // when
          commandStack.undo();

          // then
          expect(bo.get('camunda:mapDecisionResult')).to.equal('singleResult');
        }));


        it('should redo', inject(function(commandStack) {
          // when
          commandStack.undo();
          commandStack.redo();

          // then
          expect(bo.get('camunda:mapDecisionResult')).to.equal('resultList');
        }));

      });

    });

  });

});
