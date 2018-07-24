'use strict';

var TestHelper = require('../../../TestHelper');

var TestContainer = require('mocha-test-container-support');

/* global bootstrapModeler, inject */

var propertiesPanelModule = require('lib'),
    domQuery = require('min-dom').query,
    domClasses = require('min-dom').classes,
    is = require('cmmn-js/lib/util/ModelUtil').is,
    forEach = require('lodash/forEach'),
    coreModule = require('cmmn-js/lib/core'),
    selectionModule = require('diagram-js/lib/features/selection').default,
    modelingModule = require('cmmn-js/lib/features/modeling'),
    propertiesProviderModule = require('lib/provider/camunda'),
    camundaModdlePackage = require('camunda-cmmn-moddle/resources/camunda');


function getInput(container, selector) {
  return domQuery('input[name="' + selector + '"]', container);
}

function getSelect(container, selector) {
  return domQuery('select[id="' + selector + '"]', container);
}

function getAddButton(container, selector) {
  return domQuery('div[data-entry=' + selector + '] button[data-action=createElement]', container);
}

function getRemoveButton(container, selector) {
  return domQuery('div[data-entry=' + selector + '] button[data-action=removeElement]', container);
}

function getVariableMappings(extensionElements, type) {
  var mappings = [];

  if (extensionElements && extensionElements.values) {
    forEach(extensionElements.values, function(value) {
      if (is(value, type) &&
          (typeof value.source !== 'undefined' ||
           typeof value.sourceExpression !== 'undefined' ||
           value.variables === 'all')) {
        mappings.push(value);
      }
    });
  }
  return mappings;
}

function getCamundaInWithBusinessKey(extensionElements) {
  var camundaIn = [];
  if (extensionElements && extensionElements.values) {
    forEach(extensionElements.values, function(value) {
      if (is(value, 'camunda:In') && value.businessKey) {
        camundaIn.push(value);
      }
    });
  }
  return camundaIn;
}

function selectVariableMapping(propertiesPanel, selectorId) {
  var inMappings = getSelect(propertiesPanel._container, selectorId);

  inMappings.options[0].selected = 'selected';
  TestHelper.triggerEvent(inMappings, 'change');
}

var CAMUNDA_IN_EXTENSION_ELEMENT = 'camunda:In',
    CAMUNDA_OUT_EXTENSION_ELEMENT = 'camunda:Out';

var BUSINESS_KEY_VALUE = '#{caseExecution.caseBusinessKey}';


describe('variable-mapping-properties', function() {

  var diagramXML = require('./VariableMapping.cmmn');

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

    describe('# Case Task', function() {

      describe('# camunda:in', function() {

        var variableMappings;

        beforeEach(inject(function(elementRegistry, selection, propertiesPanel) {

          // given
          var item = elementRegistry.get('PlanItem_CaseTask_Source');
          selection.select(item);

          var bo = item.businessObject.definitionRef;
          variableMappings = getVariableMappings(bo.get('extensionElements'), CAMUNDA_IN_EXTENSION_ELEMENT);

          // select existing in-mapping
          selectVariableMapping(propertiesPanel, 'cam-extensionElements-variableMapping-in');

        }));


        it('should fetch the source of a case task definition', inject(function(propertiesPanel) {

          var field = getInput(propertiesPanel._container, 'source');

          // when selecting element

          // then
          expect(field.value).to.equal(variableMappings[0].get('source'));

        }));


        it('should fetch the target of a case task definition', inject(function(propertiesPanel) {

          var field = getInput(propertiesPanel._container, 'target');

          // when selecting element

          // then
          expect(field.value).to.equal(variableMappings[0].get('target'));

        }));


        it('should fetch the local of a case task definition', inject(function(propertiesPanel) {

          var field = getInput(propertiesPanel._container, 'local');

          // when selecting element

          // then
          expect(field.checked).to.equal(variableMappings[0].get('local'));

        }));

      });

      describe('# camunda:out variables', function() {

        var variableMappings;

        beforeEach(inject(function(elementRegistry, selection, propertiesPanel) {

          // given
          var item = elementRegistry.get('PlanItem_CaseTask_Out_All');
          selection.select(item);

          var bo = item.businessObject.definitionRef;
          variableMappings = getVariableMappings(bo.get('extensionElements'), CAMUNDA_OUT_EXTENSION_ELEMENT);

          // select existing in-mapping
          selectVariableMapping(propertiesPanel, 'cam-extensionElements-variableMapping-out');

        }));


        it('should fetch the variables of a case task definition', inject(function(propertiesPanel) {

          var field = getSelect(propertiesPanel._container, 'camunda-variableMapping-inOutType-select');

          // when selecting element

          // then
          expect(field.value).to.equal('variables');
          expect(variableMappings[0].get('variables')).to.equal('all');

        }));

      });

    });

    describe('# Process Task', function() {

      var variableMappings;

      describe('# camunda:in', function() {

        beforeEach(inject(function(elementRegistry, selection, propertiesPanel) {

          // given
          var item = elementRegistry.get('PlanItem_ProcessTask_SourceExpression');
          selection.select(item);

          var bo = item.businessObject.definitionRef;
          variableMappings = getVariableMappings(bo.get('extensionElements'), CAMUNDA_IN_EXTENSION_ELEMENT);

          // select existing in-mapping
          selectVariableMapping(propertiesPanel, 'cam-extensionElements-variableMapping-in');

        }));


        it('should fetch the sourceExpression of a process task definition', inject(function(propertiesPanel) {

          var field = getInput(propertiesPanel._container, 'source');

          // when selecting element

          // then
          expect(field.value).to.equal(variableMappings[0].get('sourceExpression'));

        }));


        it('should fetch the target of a process task definition', inject(function(propertiesPanel) {

          var field = getInput(propertiesPanel._container, 'target');

          // when selecting element

          // then
          expect(field.value).to.equal(variableMappings[0].get('target'));

        }));


        it('should fetch the local of a process task definition', inject(function(propertiesPanel) {

          var field = getInput(propertiesPanel._container, 'local');

          // when selecting element

          // then
          expect(field.checked).to.equal(variableMappings[0].get('local'));

        }));

      });

      describe('# camunda:in businessKey', function() {

        var variableMappings;

        beforeEach(inject(function(elementRegistry, selection, propertiesPanel) {

          // given
          var item = elementRegistry.get('PlanItem_ProcessTask_BusinessKey');
          selection.select(item);

          var bo = item.businessObject.definitionRef;
          variableMappings = getCamundaInWithBusinessKey(bo.get('extensionElements'));

        }));


        it('should fetch the business key of a process task definition', inject(function(propertiesPanel) {

          var field = getInput(propertiesPanel._container, 'callableBusinessKey');

          // when selecting element

          // then
          expect(field.checked).to.be.true;
          expect(variableMappings[0].get('businessKey')).to.equal(BUSINESS_KEY_VALUE);

        }));

      });

    });


  });


  describe('validation errors', function() {

    describe('# Case Task', function() {

      beforeEach(inject(function(elementRegistry, selection, propertiesPanel) {

        // given
        var item = elementRegistry.get('PlanItem_CaseTask_Invalid');
        selection.select(item);

        // select existing in-mapping
        selectVariableMapping(propertiesPanel, 'cam-extensionElements-variableMapping-in');

      }));

      it('should be shown if source is selected and source is empty', inject(function(propertiesPanel) {

        var inOutType = getSelect(propertiesPanel._container, 'camunda-variableMapping-inOutType-select');
        var field = getInput(propertiesPanel._container, 'source');

        // when selecting element

        // then
        expect(inOutType.value).to.equal('source');
        expect(domClasses(field).has('invalid')).to.be.true;

      }));

      it('should be shown if source is selected and target is empty', inject(function(propertiesPanel) {

        var inOutType = getSelect(propertiesPanel._container, 'camunda-variableMapping-inOutType-select');
        var field = getInput(propertiesPanel._container, 'target');

        // when selecting element

        // then
        expect(inOutType.value).to.equal('source');
        expect(domClasses(field).has('invalid')).to.be.true;

      }));

    });

    describe('# Process Task', function() {

      beforeEach(inject(function(elementRegistry, selection, propertiesPanel) {

        // given
        var item = elementRegistry.get('PlanItem_ProcessTask_Invalid');
        selection.select(item);

        // select existing in-mapping
        selectVariableMapping(propertiesPanel, 'cam-extensionElements-variableMapping-in');

      }));

      it('should be shown if sourceExpression is selected and sourceExpression is empty', inject(function(propertiesPanel) {

        var inOutType = getSelect(propertiesPanel._container, 'camunda-variableMapping-inOutType-select');
        var field = getInput(propertiesPanel._container, 'source');

        // when selecting element

        // then
        expect(inOutType.value).to.equal('sourceExpression');
        expect(domClasses(field).has('invalid')).to.be.true;

      }));

      it('should be shown if sourceExpression is selected and target is empty', inject(function(propertiesPanel) {

        var inOutType = getSelect(propertiesPanel._container, 'camunda-variableMapping-inOutType-select');
        var field = getInput(propertiesPanel._container, 'target');

        // when selecting element

        // then
        expect(inOutType.value).to.equal('sourceExpression');
        expect(domClasses(field).has('invalid')).to.be.true;

      }));

    });

  });


  describe('set', function() {

    describe('# business key', function() {

      var bo, field;

      beforeEach(inject(function(elementRegistry, selection, propertiesPanel) {

        // given
        var item = elementRegistry.get('PlanItem_CaseTask_Empty');
        selection.select(item);

        bo = item.businessObject.definitionRef;

        field = getInput(propertiesPanel._container, 'callableBusinessKey');

        // when

        TestHelper.triggerEvent(field, 'click');

      }));


      describe('in the DOM', function() {

        it('should execute', function() {
          expect(field.checked).to.be.true;
        });

        it('should undo', inject(function(commandStack) {
          // when
          commandStack.undo();

          // then
          expect(field.checked).to.be.false;
        }));

        it('should redo', inject(function(commandStack) {
          // when
          commandStack.undo();
          commandStack.redo();

          // then
          expect(field.checked).to.be.true;
        }));

      });

      describe('on the business object', function() {

        it('should execute', function() {
          var variableMappings = getCamundaInWithBusinessKey(bo.get('extensionElements'));
          expect(variableMappings[0].get('businessKey')).to.equal(BUSINESS_KEY_VALUE);
        });

        it('should undo', inject(function(commandStack) {
          // when
          commandStack.undo();

          // then
          var variableMappings = getCamundaInWithBusinessKey(bo.get('extensionElements'));
          expect(variableMappings).is.empty;
        }));

        it('should redo', inject(function(commandStack) {
          // when
          commandStack.undo();
          commandStack.redo();

          // then
          var variableMappings = getCamundaInWithBusinessKey(bo.get('extensionElements'));
          expect(variableMappings[0].get('businessKey')).to.equal(BUSINESS_KEY_VALUE);
        }));

      });

    });

    describe('# source', function() {

      var field, variableMappings;

      beforeEach(inject(function(elementRegistry, selection, propertiesPanel) {

        // given
        var item = elementRegistry.get('PlanItem_CaseTask_Invalid');
        selection.select(item);

        var bo = item.businessObject.definitionRef;
        variableMappings = getVariableMappings(bo.get('extensionElements'), CAMUNDA_IN_EXTENSION_ELEMENT);

        // select existing in-mapping
        selectVariableMapping(propertiesPanel, 'cam-extensionElements-variableMapping-in');

        field = getInput(propertiesPanel._container, 'source');

        // when

        TestHelper.triggerValue(field, 'FOO', 'change');

      }));


      describe('in the DOM', function() {

        it('should execute', function() {
          expect(field.value).to.equal('FOO');
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
          expect(field.value).to.equal('FOO');
        }));

      });

      describe('on the business object', function() {

        it('should execute', function() {
          expect(variableMappings[0].get('source')).to.equal('FOO');
        });

        it('should undo', inject(function(commandStack) {
          // when
          commandStack.undo();

          // then
          expect(variableMappings[0].get('source')).to.equal('');
        }));

        it('should redo', inject(function(commandStack) {
          // when
          commandStack.undo();
          commandStack.redo();

          // then
          expect(variableMappings[0].get('source')).to.equal('FOO');
        }));

      });

    });

    describe('# sourceExpression', function() {

      var field, variableMappings;

      beforeEach(inject(function(elementRegistry, selection, propertiesPanel) {

        // given
        var item = elementRegistry.get('PlanItem_ProcessTask_Invalid');
        selection.select(item);

        var bo = item.businessObject.definitionRef;
        variableMappings = getVariableMappings(bo.get('extensionElements'), CAMUNDA_IN_EXTENSION_ELEMENT);

        // select existing in-mapping
        selectVariableMapping(propertiesPanel, 'cam-extensionElements-variableMapping-in');

        field = getInput(propertiesPanel._container, 'source');

        // when

        TestHelper.triggerValue(field, 'FOO', 'change');

      }));


      describe('in the DOM', function() {

        it('should execute', function() {
          expect(field.value).to.equal('FOO');
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
          expect(field.value).to.equal('FOO');
        }));

      });

      describe('on the business object', function() {

        it('should execute', function() {
          expect(variableMappings[0].get('sourceExpression')).to.equal('FOO');
        });

        it('should undo', inject(function(commandStack) {
          // when
          commandStack.undo();

          // then
          expect(variableMappings[0].get('sourceExpression')).to.equal('');
        }));

        it('should redo', inject(function(commandStack) {
          // when
          commandStack.undo();
          commandStack.redo();

          // then
          expect(variableMappings[0].get('sourceExpression')).to.equal('FOO');
        }));

      });

    });

    describe('# target', function() {

      var field, variableMappings;

      beforeEach(inject(function(elementRegistry, selection, propertiesPanel) {

        // given
        var item = elementRegistry.get('PlanItem_ProcessTask_Invalid');
        selection.select(item);

        var bo = item.businessObject.definitionRef;
        variableMappings = getVariableMappings(bo.get('extensionElements'), CAMUNDA_IN_EXTENSION_ELEMENT);

        // select existing in-mapping
        selectVariableMapping(propertiesPanel, 'cam-extensionElements-variableMapping-in');

        field = getInput(propertiesPanel._container, 'target');

        // when

        TestHelper.triggerValue(field, 'FOO', 'change');

      }));


      describe('in the DOM', function() {

        it('should execute', function() {
          expect(field.value).to.equal('FOO');
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
          expect(field.value).to.equal('FOO');
        }));

      });

      describe('on the business object', function() {

        it('should execute', function() {
          expect(variableMappings[0].get('target')).to.equal('FOO');
        });

        it('should undo', inject(function(commandStack) {
          // when
          commandStack.undo();

          // then
          expect(variableMappings[0].get('target')).to.be.undefined;
        }));

        it('should redo', inject(function(commandStack) {
          // when
          commandStack.undo();
          commandStack.redo();

          // then
          expect(variableMappings[0].get('target')).to.equal('FOO');
        }));

      });

    });

    describe('# local', function() {

      var field, variableMappings;

      beforeEach(inject(function(elementRegistry, selection, propertiesPanel) {

        // given
        var item = elementRegistry.get('PlanItem_ProcessTask_Invalid');
        selection.select(item);

        var bo = item.businessObject.definitionRef;
        variableMappings = getVariableMappings(bo.get('extensionElements'), CAMUNDA_IN_EXTENSION_ELEMENT);

        // select existing in-mapping
        selectVariableMapping(propertiesPanel, 'cam-extensionElements-variableMapping-in');

        field = getInput(propertiesPanel._container, 'local');

        // when

        TestHelper.triggerEvent(field, 'click');

      }));


      describe('in the DOM', function() {

        it('should execute', function() {
          expect(field.checked).to.be.true;
        });

        it('should undo', inject(function(commandStack) {
          // when
          commandStack.undo();

          // then
          expect(field.checked).to.be.false;
        }));

        it('should redo', inject(function(commandStack) {
          // when
          commandStack.undo();
          commandStack.redo();

          // then
          expect(field.checked).to.be.true;
        }));

      });

      describe('on the business object', function() {

        it('should execute', function() {
          expect(variableMappings[0].get('local')).to.be.true;
        });

        it('should undo', inject(function(commandStack) {
          // when
          commandStack.undo();

          // then
          expect(variableMappings[0].get('local')).to.be.false;
        }));

        it('should redo', inject(function(commandStack) {
          // when
          commandStack.undo();
          commandStack.redo();

          // then
          expect(variableMappings[0].get('local')).to.be.true;
        }));

      });

    });

    describe('# inOutType', function() {

      describe('source -> sourceExpression', function() {

        var field, variableMappings;

        beforeEach(inject(function(elementRegistry, selection, propertiesPanel) {

          // given
          var item = elementRegistry.get('PlanItem_CaseTask_Invalid');
          selection.select(item);

          var bo = item.businessObject.definitionRef;
          variableMappings = getVariableMappings(bo.get('extensionElements'), CAMUNDA_IN_EXTENSION_ELEMENT);

          // select existing in-mapping
          selectVariableMapping(propertiesPanel, 'cam-extensionElements-variableMapping-in');

          field = getSelect(propertiesPanel._container, 'camunda-variableMapping-inOutType-select');

          // when
          // select 'sourceExpression'
          field.options[1].selected = 'selected';
          TestHelper.triggerEvent(field, 'change');

        }));


        describe('in the DOM', function() {

          it('should execute', function() {
            expect(field.value).to.equal('sourceExpression');
          });

          it('should undo', inject(function(commandStack) {
            // when
            commandStack.undo();

            // then
            expect(field.value).to.equal('source');
          }));

          it('should redo', inject(function(commandStack) {
            // when
            commandStack.undo();
            commandStack.redo();

            // then
            expect(field.value).to.equal('sourceExpression');
          }));

        });

        describe('on the business object', function() {

          it('should execute', function() {
            expect(variableMappings[0].get('source')).to.be.undefined;
            expect(variableMappings[0].get('sourceExpression')).to.be.defined;
          });

          it('should undo', inject(function(commandStack) {
            // when
            commandStack.undo();

            // then
            expect(variableMappings[0].get('source')).to.be.defined;
            expect(variableMappings[0].get('sourceExpression')).to.be.undefined;
          }));

          it('should redo', inject(function(commandStack) {
            // when
            commandStack.undo();
            commandStack.redo();

            // then
            expect(variableMappings[0].get('source')).to.be.undefined;
            expect(variableMappings[0].get('sourceExpression')).to.be.defined;
          }));

        });

      });

      describe('sourceExpression -> all', function() {

        var field, variableMappings;

        beforeEach(inject(function(elementRegistry, selection, propertiesPanel) {

          // given
          var item = elementRegistry.get('PlanItem_ProcessTask_Invalid');
          selection.select(item);

          var bo = item.businessObject.definitionRef;
          variableMappings = getVariableMappings(bo.get('extensionElements'), CAMUNDA_IN_EXTENSION_ELEMENT);

          // select existing in-mapping
          selectVariableMapping(propertiesPanel, 'cam-extensionElements-variableMapping-in');

          field = getSelect(propertiesPanel._container, 'camunda-variableMapping-inOutType-select');

          // when
          // select 'all'
          field.options[2].selected = 'selected';
          TestHelper.triggerEvent(field, 'change');

        }));


        describe('in the DOM', function() {

          it('should execute', function() {
            expect(field.value).to.equal('variables');
          });

          it('should undo', inject(function(commandStack) {
            // when
            commandStack.undo();

            // then
            expect(field.value).to.equal('sourceExpression');
          }));

          it('should redo', inject(function(commandStack) {
            // when
            commandStack.undo();
            commandStack.redo();

            // then
            expect(field.value).to.equal('variables');
          }));

        });

        describe('on the business object', function() {

          it('should execute', function() {
            expect(variableMappings[0].get('sourceExpression')).to.be.undefined;
            expect(variableMappings[0].get('variables')).to.be.defined;
          });

          it('should undo', inject(function(commandStack) {
            // when
            commandStack.undo();

            // then
            expect(variableMappings[0].get('sourceExpression')).to.be.defined;
            expect(variableMappings[0].get('variables')).to.be.undefined;
          }));

          it('should redo', inject(function(commandStack) {
            // when
            commandStack.undo();
            commandStack.redo();

            // then
            expect(variableMappings[0].get('sourceExpression')).to.be.undefined;
            expect(variableMappings[0].get('variables')).to.be.defined;
          }));

        });

      });

    });

  });


  describe('add', function() {

    describe('# camunda:in', function() {

      var bo, field;

      beforeEach(inject(function(elementRegistry, selection, propertiesPanel) {

        // given
        var item = elementRegistry.get('PlanItem_CaseTask_Empty');
        selection.select(item);

        bo = item.businessObject.definitionRef;

        var button = getAddButton(propertiesPanel._container, 'variableMapping-in');
        field = getSelect(propertiesPanel._container, 'cam-extensionElements-variableMapping-in');

        // when

        TestHelper.triggerEvent(button, 'click');

      }));


      describe('in the DOM', function() {

        it('should execute', function() {
          expect(field).to.have.length(1);
        });

        it('should undo', inject(function(commandStack) {
          // when
          commandStack.undo();

          // then
          expect(field).to.have.length(0);
        }));

        it('should redo', inject(function(commandStack) {
          // when
          commandStack.undo();
          commandStack.redo();

          // then
          expect(field).to.have.length(1);
        }));

      });

      describe('on the business object', function() {

        it('should execute', function() {
          var variableMappings = getVariableMappings(bo.get('extensionElements'), CAMUNDA_IN_EXTENSION_ELEMENT);
          expect(variableMappings).to.have.length(1);
        });

        it('should undo', inject(function(commandStack) {
          // when
          commandStack.undo();

          // then
          var variableMappings = getVariableMappings(bo.get('extensionElements'), CAMUNDA_IN_EXTENSION_ELEMENT);
          expect(variableMappings).to.have.length(0);
        }));

        it('should redo', inject(function(commandStack) {
          // when
          commandStack.undo();
          commandStack.redo();

          // then
          var variableMappings = getVariableMappings(bo.get('extensionElements'), CAMUNDA_IN_EXTENSION_ELEMENT);
          expect(variableMappings).to.have.length(1);
        }));

      });

    });

    describe('# camunda:out', function() {

      var bo, field;

      beforeEach(inject(function(elementRegistry, selection, propertiesPanel) {

        // given
        var item = elementRegistry.get('PlanItem_CaseTask_Empty');
        selection.select(item);

        bo = item.businessObject.definitionRef;

        var button = getAddButton(propertiesPanel._container, 'variableMapping-out');
        field = getSelect(propertiesPanel._container, 'cam-extensionElements-variableMapping-out');

        // when

        TestHelper.triggerEvent(button, 'click');

      }));


      describe('in the DOM', function() {

        it('should execute', function() {
          expect(field).to.have.length(1);
        });

        it('should undo', inject(function(commandStack) {
          // when
          commandStack.undo();

          // then
          expect(field).to.have.length(0);
        }));

        it('should redo', inject(function(commandStack) {
          // when
          commandStack.undo();
          commandStack.redo();

          // then
          expect(field).to.have.length(1);
        }));

      });

      describe('on the business object', function() {

        it('should execute', function() {
          var variableMappings = getVariableMappings(bo.get('extensionElements'), CAMUNDA_OUT_EXTENSION_ELEMENT);
          expect(variableMappings).to.have.length(1);
        });

        it('should undo', inject(function(commandStack) {
          // when
          commandStack.undo();

          // then
          var variableMappings = getVariableMappings(bo.get('extensionElements'), CAMUNDA_OUT_EXTENSION_ELEMENT);
          expect(variableMappings).to.have.length(0);
        }));

        it('should redo', inject(function(commandStack) {
          // when
          commandStack.undo();
          commandStack.redo();

          // then
          var variableMappings = getVariableMappings(bo.get('extensionElements'), CAMUNDA_OUT_EXTENSION_ELEMENT);
          expect(variableMappings).to.have.length(1);
        }));

      });

    });

  });


  describe('remove', function() {

    describe('# camunda:in', function() {

      var bo, field;

      beforeEach(inject(function(elementRegistry, selection, propertiesPanel) {

        // given
        var item = elementRegistry.get('PlanItem_CaseTask_Source');
        selection.select(item);

        bo = item.businessObject.definitionRef;

        var button = getRemoveButton(propertiesPanel._container, 'variableMapping-in');
        field = getSelect(propertiesPanel._container, 'cam-extensionElements-variableMapping-in');

        selectVariableMapping(propertiesPanel, 'cam-extensionElements-variableMapping-in');

        // when

        TestHelper.triggerEvent(button, 'click');

      }));


      describe('in the DOM', function() {

        it('should execute', function() {
          expect(field).to.have.length(0);
        });

        it('should undo', inject(function(commandStack) {
          // when
          commandStack.undo();

          // then
          expect(field).to.have.length(1);
        }));

        it('should redo', inject(function(commandStack) {
          // when
          commandStack.undo();
          commandStack.redo();

          // then
          expect(field).to.have.length(0);
        }));

      });

      describe('on the business object', function() {

        it('should execute', function() {
          var variableMappings = getVariableMappings(bo.get('extensionElements'), CAMUNDA_IN_EXTENSION_ELEMENT);
          expect(variableMappings).to.have.length(0);
        });

        it('should undo', inject(function(commandStack) {
          // when
          commandStack.undo();

          // then
          var variableMappings = getVariableMappings(bo.get('extensionElements'), CAMUNDA_IN_EXTENSION_ELEMENT);
          expect(variableMappings).to.have.length(1);
        }));

        it('should redo', inject(function(commandStack) {
          // when
          commandStack.undo();
          commandStack.redo();

          // then
          var variableMappings = getVariableMappings(bo.get('extensionElements'), CAMUNDA_IN_EXTENSION_ELEMENT);
          expect(variableMappings).to.have.length(0);
        }));

      });

    });

    describe('# camunda:out', function() {

      var bo, field;

      beforeEach(inject(function(elementRegistry, selection, propertiesPanel) {

        // given
        var item = elementRegistry.get('PlanItem_CaseTask_Out_All');
        selection.select(item);

        bo = item.businessObject.definitionRef;

        var button = getRemoveButton(propertiesPanel._container, 'variableMapping-out');
        field = getSelect(propertiesPanel._container, 'cam-extensionElements-variableMapping-out');

        selectVariableMapping(propertiesPanel, 'cam-extensionElements-variableMapping-out');

        // when

        TestHelper.triggerEvent(button, 'click');

      }));


      describe('in the DOM', function() {

        it('should execute', function() {
          expect(field).to.have.length(0);
        });

        it('should undo', inject(function(commandStack) {
          // when
          commandStack.undo();

          // then
          expect(field).to.have.length(1);
        }));

        it('should redo', inject(function(commandStack) {
          // when
          commandStack.undo();
          commandStack.redo();

          // then
          expect(field).to.have.length(0);
        }));

      });

      describe('on the business object', function() {

        it('should execute', function() {
          var variableMappings = getVariableMappings(bo.get('extensionElements'), CAMUNDA_OUT_EXTENSION_ELEMENT);
          expect(variableMappings).to.have.length(0);
        });

        it('should undo', inject(function(commandStack) {
          // when
          commandStack.undo();

          // then
          var variableMappings = getVariableMappings(bo.get('extensionElements'), CAMUNDA_OUT_EXTENSION_ELEMENT);
          expect(variableMappings).to.have.length(1);
        }));

        it('should redo', inject(function(commandStack) {
          // when
          commandStack.undo();
          commandStack.redo();

          // then
          var variableMappings = getVariableMappings(bo.get('extensionElements'), CAMUNDA_OUT_EXTENSION_ELEMENT);
          expect(variableMappings).to.have.length(0);
        }));

      });

    });

  });


  describe('control visibility', function() {

    function expectVisible(visible, getter, inputNode, parentElement) {

      return inject(function(propertiesPanel, selection, elementRegistry) {

        var field = getter(propertiesPanel._container, inputNode);

        if (parentElement) {
          field = field.parentElement;
        }

        // then
        if (visible) {
          expect(field).to.exist;
        } else {
          expect(domClasses(field).has('cpp-hidden')).to.be.true;
        }
      });
    }

    describe('should show', function() {

      describe('all fields when in variable mapping is selected', function() {

        beforeEach(inject(function(elementRegistry, selection, propertiesPanel) {

          var item = elementRegistry.get('PlanItem_CaseTask_Source');
          selection.select(item);

          selectVariableMapping(propertiesPanel, 'cam-extensionElements-variableMapping-in');

        }));

        it('type', expectVisible(true, getSelect, 'camunda-variableMapping-inOutType-select'));
        it('source', expectVisible(true, getInput, 'source'));
        it('target', expectVisible(true, getInput, 'target'));
        it('local', expectVisible(true, getInput, 'local'));

      });

    });

    describe('should hide', function() {

      describe('all fields when no variable mapping is selected', function() {

        beforeEach(inject(function(elementRegistry, selection) {

          var item = elementRegistry.get('PlanItem_CaseTask_Source');
          selection.select(item);

        }));

        it('type', expectVisible(false, getSelect, 'camunda-variableMapping-inOutType-select'));
        it('source', expectVisible(false, getInput, 'source', true));
        it('target', expectVisible(false, getInput, 'target', true));
        it('local', expectVisible(false, getInput, 'local'));

      });

      describe('"local" checkbox when out variable mapping is selected', function() {

        beforeEach(inject(function(elementRegistry, selection, propertiesPanel) {

          var item = elementRegistry.get('PlanItem_CaseTask_Out_All');
          selection.select(item);

          selectVariableMapping(propertiesPanel, 'cam-extensionElements-variableMapping-out');

        }));

        it('local', expectVisible(false, getInput, 'local'));

      });

    });

  });


});
