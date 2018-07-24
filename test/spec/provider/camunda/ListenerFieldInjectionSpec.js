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
    propertiesProviderModule = require('lib/provider/camunda'),
    camundaModdlePackage = require('camunda-cmmn-moddle/resources/camunda'),
    getBusinessObject = require('cmmn-js/lib/util/ModelUtil').getBusinessObject;

var extensionElementsHelper = require('lib/helper/ExtensionElementsHelper');

describe('listener-fieldInjection - properties', function() {

  var diagramXML = require('./ListenerFieldInjection.cmmn');

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

  function getExtensionElements(bo, type) {
    return extensionElementsHelper.getExtensionElements(bo, type) || [];
  }

  function getCamundaFields(bo, type, idx) {
    var extensionElements = getExtensionElements(bo, type);
    return extensionElements[idx].fields || [];
  }

  function getInput(container, inputNode) {
    return domQuery('div[data-entry=' + inputNode.dataEntry + '] input[name=' + inputNode.name + ']', container);
  }

  function getTextbox(container, inputNode) {
    return domQuery('div[data-entry=' + inputNode.dataEntry + '] div[name=' + inputNode.name + ']', container);
  }

  function getSelect(container, inputNode) {
    return domQuery('div[data-entry=' + inputNode.dataEntry + '] select[name=' + inputNode.name + ']', container);
  }

  function getAddButton(container, selector) {
    return domQuery('div[data-entry=' + selector + '] button[data-action=createElement]', container);
  }

  function getRemoveButton(container, selector) {
    return domQuery('div[data-entry=' + selector + '] button[data-action=removeElement]', container);
  }

  function selectOption(container, inputNode) {
    var select = getSelect(container, inputNode);

    select.options[0].selected = 'selected';
    TestHelper.triggerEvent(select, 'change');
  }

  var CASE_EXECUTION_LISTENER_TYPE = 'camunda:CaseExecutionListener',
      TASK_LISTENER_TYPE = 'camunda:TaskListener',
      VARIABLE_LISTENER_TYPE = 'camunda:VariableListener';

  var FIELD_NAME_ELEMENT = { dataEntry: 'listener-field-name', name: 'fieldName' },
      FIELD_TYPE_ELEMENT = { dataEntry: 'listener-field-type', name: 'fieldType' },
      FIELD_VALUE_ELEMENT = { dataEntry: 'listener-field-value', name: 'fieldValue' },
      FIELDS_SELECT_ELEMENT = { dataEntry: 'listener-fields', name: 'selectedExtensionElement' },
      CASE_EXECUTION_LISTENER_SELECT_ELEMENT = { dataEntry: 'caseExecutionListeners', name: 'selectedExtensionElement' },
      TASK_LISTENER_SELECT_ELEMENT = { dataEntry: 'taskListeners', name: 'selectedExtensionElement' },
      VARIABLE_LISTENER_SELECT_ELEMENT = { dataEntry: 'variableListeners', name: 'selectedExtensionElement' };


  describe('get', function() {

    describe('#variableListener', function() {

      var camundaField;

      beforeEach(inject(function(propertiesPanel, elementRegistry, selection) {
        var shape = elementRegistry.get('CasePlanModel_1');
        selection.select(shape);

        var bo = getBusinessObject(shape);
        camundaField = getCamundaFields(bo, VARIABLE_LISTENER_TYPE, 0)[0];

        // select listener
        selectOption(propertiesPanel._container, VARIABLE_LISTENER_SELECT_ELEMENT);
        // select field
        selectOption(propertiesPanel._container, FIELDS_SELECT_ELEMENT);

      }));


      it('name', inject(function(propertiesPanel) {

        var field = getInput(propertiesPanel._container, FIELD_NAME_ELEMENT);

        expect(field.value).to.equal(camundaField.get('name'));

      }));

      it('fieldType', inject(function(propertiesPanel) {

        var field = getSelect(propertiesPanel._container, FIELD_TYPE_ELEMENT);

        expect(field.value).to.equal('string');

      }));

      it('fieldValue', inject(function(propertiesPanel) {

        var field = getTextbox(propertiesPanel._container, FIELD_VALUE_ELEMENT);

        expect(field.textContent).to.equal(camundaField.get('string'));

      }));

    });


    describe('#caseExecutionListener', function() {

      var camundaField;

      beforeEach(inject(function(propertiesPanel, elementRegistry, selection) {
        var shape = elementRegistry.get('PlanItem_Task');
        selection.select(shape);

        var bo = getBusinessObject(shape).definitionRef;
        camundaField = getCamundaFields(bo, CASE_EXECUTION_LISTENER_TYPE, 0)[0];

        // select listener
        selectOption(propertiesPanel._container, CASE_EXECUTION_LISTENER_SELECT_ELEMENT);
        // select field
        selectOption(propertiesPanel._container, FIELDS_SELECT_ELEMENT);

      }));


      it('name', inject(function(propertiesPanel) {

        var field = getInput(propertiesPanel._container, FIELD_NAME_ELEMENT);

        expect(field.value).to.equal(camundaField.get('name'));

      }));

      it('fieldType', inject(function(propertiesPanel) {

        var field = getSelect(propertiesPanel._container, FIELD_TYPE_ELEMENT);

        expect(field.value).to.equal('expression');

      }));

      it('fieldValue', inject(function(propertiesPanel) {

        var field = getTextbox(propertiesPanel._container, FIELD_VALUE_ELEMENT);

        expect(field.textContent).to.equal(camundaField.get('expression'));

      }));

    });

    describe('#caseExecutionListener with stringValue attr', function() {

      var camundaField;

      beforeEach(inject(function(propertiesPanel, elementRegistry, selection) {
        var shape = elementRegistry.get('PlanItem_Task_StringValue');
        selection.select(shape);

        var bo = getBusinessObject(shape).definitionRef;
        camundaField = getCamundaFields(bo, CASE_EXECUTION_LISTENER_TYPE, 0)[0];

        // select listener
        selectOption(propertiesPanel._container, CASE_EXECUTION_LISTENER_SELECT_ELEMENT);
        // select field
        selectOption(propertiesPanel._container, FIELDS_SELECT_ELEMENT);

      }));


      it('name', inject(function(propertiesPanel) {

        var field = getInput(propertiesPanel._container, FIELD_NAME_ELEMENT);

        expect(field.value).to.equal(camundaField.get('name'));

      }));

      it('fieldType', inject(function(propertiesPanel) {

        var field = getSelect(propertiesPanel._container, FIELD_TYPE_ELEMENT);

        expect(field.value).to.equal('string');

      }));

      it('fieldValue', inject(function(propertiesPanel) {

        var field = getTextbox(propertiesPanel._container, FIELD_VALUE_ELEMENT);

        expect(field.textContent).to.equal(camundaField.get('stringValue'));

      }));

    });

    describe('#taskListener', function() {

      var camundaField;

      beforeEach(inject(function(propertiesPanel, elementRegistry, selection) {
        var shape = elementRegistry.get('PlanItem_HumanTask');
        selection.select(shape);

        var bo = getBusinessObject(shape).definitionRef;
        camundaField = getCamundaFields(bo, TASK_LISTENER_TYPE, 0)[0];

        // select listener
        selectOption(propertiesPanel._container, TASK_LISTENER_SELECT_ELEMENT);
        // select field
        selectOption(propertiesPanel._container, FIELDS_SELECT_ELEMENT);

      }));


      it('name', inject(function(propertiesPanel) {

        var field = getInput(propertiesPanel._container, FIELD_NAME_ELEMENT);

        expect(field.value).to.equal(camundaField.get('name'));

      }));

      it('fieldType', inject(function(propertiesPanel) {

        var field = getSelect(propertiesPanel._container, FIELD_TYPE_ELEMENT);

        expect(field.value).to.equal('expression');

      }));

      it('fieldValue', inject(function(propertiesPanel) {

        var field = getTextbox(propertiesPanel._container, FIELD_VALUE_ELEMENT);

        expect(field.textContent).to.equal(camundaField.get('expression'));

      }));

    });

    describe('#taskListener with expression element', function() {

      var camundaField;

      beforeEach(inject(function(propertiesPanel, elementRegistry, selection) {
        var shape = elementRegistry.get('PlanItem_HumanTask_Expression');
        selection.select(shape);

        var bo = getBusinessObject(shape).definitionRef;
        camundaField = getCamundaFields(bo, TASK_LISTENER_TYPE, 0)[0];

        // select listener
        selectOption(propertiesPanel._container, TASK_LISTENER_SELECT_ELEMENT);
        // select field
        selectOption(propertiesPanel._container, FIELDS_SELECT_ELEMENT);

      }));


      it('name', inject(function(propertiesPanel) {

        var field = getInput(propertiesPanel._container, FIELD_NAME_ELEMENT);

        expect(field.value).to.equal(camundaField.get('name'));

      }));

      it('fieldType', inject(function(propertiesPanel) {

        var field = getSelect(propertiesPanel._container, FIELD_TYPE_ELEMENT);

        expect(field.value).to.equal('expression');

      }));

      it('fieldValue', inject(function(propertiesPanel) {

        var field = getTextbox(propertiesPanel._container, FIELD_VALUE_ELEMENT);

        expect(field.textContent).to.equal(camundaField.get('expression'));

      }));

    });


  });


  describe('set', function() {

    describe('#variableListener', function() {

      var camundaField;

      beforeEach(inject(function(propertiesPanel, elementRegistry, selection) {
        var shape = elementRegistry.get('CasePlanModel_1');
        selection.select(shape);

        var bo = getBusinessObject(shape);
        camundaField = getCamundaFields(bo, VARIABLE_LISTENER_TYPE, 0)[0];

        // select listener
        selectOption(propertiesPanel._container, VARIABLE_LISTENER_SELECT_ELEMENT);
        // select field
        selectOption(propertiesPanel._container, FIELDS_SELECT_ELEMENT);

      }));

      describe('#name', function() {

        var field;

        beforeEach(inject(function(propertiesPanel) {

          field = getInput(propertiesPanel._container, FIELD_NAME_ELEMENT);

          TestHelper.triggerValue(field, 'FOO', 'change');

        }));

        describe('in the DOM', function() {

          it('should execute', function() {
            expect(field.value).to.equal('FOO');
          });

          it('should undo', inject(function(commandStack) {

            commandStack.undo();

            expect(field.value).to.equal('myListenerOne');
          }));

          it('should redo', inject(function(commandStack) {

            commandStack.undo();
            commandStack.redo();

            expect(field.value).to.equal('FOO');

          }));

        });

        describe('on the business object', function() {

          it('should execute', function() {
            expect(camundaField.get('name')).to.equal('FOO');
          });

          it('should undo', inject(function(commandStack) {

            commandStack.undo();

            expect(camundaField.get('name')).to.equal('myListenerOne');
          }));

          it('should redo', inject(function(commandStack) {

            commandStack.undo();
            commandStack.redo();

            expect(camundaField.get('name')).to.equal('FOO');

          }));

        });

      });

      describe('#fieldType', function() {

        var field;

        beforeEach(inject(function(propertiesPanel) {

          field = getSelect(propertiesPanel._container, FIELD_TYPE_ELEMENT);

          // select 'expression'
          field.options[1].selected = 'selected';
          TestHelper.triggerEvent(field, 'change');

        }));

        describe('in the DOM', function() {

          it('should execute', function() {
            expect(field.value).to.equal('expression');
          });

          it('should undo', inject(function(commandStack) {

            commandStack.undo();

            expect(field.value).to.equal('string');
          }));

          it('should redo', inject(function(commandStack) {

            commandStack.undo();
            commandStack.redo();

            expect(field.value).to.equal('expression');

          }));

        });

        describe('on the business object', function() {

          it('should execute', function() {
            expect(camundaField.get('string')).to.be.undefined;
            expect(camundaField.get('expression')).to.be.defined;
          });

          it('should undo', inject(function(commandStack) {

            commandStack.undo();

            expect(camundaField.get('string')).to.be.defined;
            expect(camundaField.get('expression')).to.be.undefined;
          }));

          it('should redo', inject(function(commandStack) {

            commandStack.undo();
            commandStack.redo();

            expect(camundaField.get('string')).to.be.undefined;
            expect(camundaField.get('expression')).to.be.defined;
          }));

        });

      });

      describe('#fieldValue', function() {

        var field;

        beforeEach(inject(function(propertiesPanel) {
          field = getTextbox(propertiesPanel._container, FIELD_VALUE_ELEMENT);

          TestHelper.triggerValue(field, 'FOO', 'change');

        }));

        describe('in the DOM', function() {

          it('should execute', function() {
            expect(field.textContent).to.equal('FOO');
          });

          it('should undo', inject(function(commandStack) {

            commandStack.undo();

            expect(field.textContent).to.equal('myListenerValueOne');
          }));

          it('should redo', inject(function(commandStack) {

            commandStack.undo();
            commandStack.redo();

            expect(field.textContent).to.equal('FOO');

          }));

        });

        describe('on the business object', function() {

          it('should execute', function() {
            expect(camundaField.get('string')).to.equal('FOO');
          });

          it('should undo', inject(function(commandStack) {

            commandStack.undo();

            expect(camundaField.get('string')).to.equal('myListenerValueOne');
          }));

          it('should redo', inject(function(commandStack) {

            commandStack.undo();
            commandStack.redo();

            expect(camundaField.get('string')).to.equal('FOO');
          }));

        });

      });


    });


    describe('#caseExecutionListener', function() {

      var camundaField;

      beforeEach(inject(function(propertiesPanel, elementRegistry, selection) {
        var shape = elementRegistry.get('PlanItem_Task');
        selection.select(shape);

        var bo = getBusinessObject(shape).definitionRef;
        camundaField = getCamundaFields(bo, CASE_EXECUTION_LISTENER_TYPE, 0)[0];

        // select listener
        selectOption(propertiesPanel._container, CASE_EXECUTION_LISTENER_SELECT_ELEMENT);
        // select field
        selectOption(propertiesPanel._container, FIELDS_SELECT_ELEMENT);

      }));

      describe('#name', function() {

        var field;

        beforeEach(inject(function(propertiesPanel) {
          field = getInput(propertiesPanel._container, FIELD_NAME_ELEMENT);

          TestHelper.triggerValue(field, 'FOO', 'change');

        }));

        describe('in the DOM', function() {

          it('should execute', function() {
            expect(field.value).to.equal('FOO');
          });

          it('should undo', inject(function(commandStack) {

            commandStack.undo();

            expect(field.value).to.equal('myListener');
          }));

          it('should redo', inject(function(commandStack) {

            commandStack.undo();
            commandStack.redo();

            expect(field.value).to.equal('FOO');

          }));

        });

        describe('on the business object', function() {

          it('should execute', function() {
            expect(camundaField.get('name')).to.equal('FOO');
          });

          it('should undo', inject(function(commandStack) {

            commandStack.undo();

            expect(camundaField.get('name')).to.equal('myListener');
          }));

          it('should redo', inject(function(commandStack) {

            commandStack.undo();
            commandStack.redo();

            expect(camundaField.get('name')).to.equal('FOO');

          }));

        });

      });

      describe('#fieldType', function() {

        var field;

        beforeEach(inject(function(propertiesPanel) {
          field = getSelect(propertiesPanel._container, FIELD_TYPE_ELEMENT);

          // select 'string'
          field.options[0].selected = 'selected';
          TestHelper.triggerEvent(field, 'change');

        }));

        describe('in the DOM', function() {

          it('should execute', function() {
            expect(field.value).to.equal('string');
          });

          it('should undo', inject(function(commandStack) {

            commandStack.undo();

            expect(field.value).to.equal('expression');
          }));

          it('should redo', inject(function(commandStack) {

            commandStack.undo();
            commandStack.redo();

            expect(field.value).to.equal('string');

          }));

        });

        describe('on the business object', function() {

          it('should execute', function() {
            expect(camundaField.get('expression')).to.be.undefined;
            expect(camundaField.get('string')).to.be.defined;
          });

          it('should undo', inject(function(commandStack) {

            commandStack.undo();

            expect(camundaField.get('expression')).to.be.defined;
            expect(camundaField.get('string')).to.be.undefined;
          }));

          it('should redo', inject(function(commandStack) {

            commandStack.undo();
            commandStack.redo();

            expect(camundaField.get('expression')).to.be.undefined;
            expect(camundaField.get('string')).to.be.defined;
          }));

        });

      });

      describe('#fieldValue', function() {

        var field;

        beforeEach(inject(function(propertiesPanel) {
          field = getTextbox(propertiesPanel._container, FIELD_VALUE_ELEMENT);

          TestHelper.triggerValue(field, 'FOO', 'change');

        }));

        describe('in the DOM', function() {

          it('should execute', function() {
            expect(field.textContent).to.equal('FOO');
          });

          it('should undo', inject(function(commandStack) {

            commandStack.undo();

            expect(field.textContent).to.equal('myListenerValue');
          }));

          it('should redo', inject(function(commandStack) {

            commandStack.undo();
            commandStack.redo();

            expect(field.textContent).to.equal('FOO');

          }));

        });

        describe('on the business object', function() {

          it('should execute', function() {
            expect(camundaField.get('expression')).to.equal('FOO');
          });

          it('should undo', inject(function(commandStack) {

            commandStack.undo();

            expect(camundaField.get('expression')).to.equal('myListenerValue');
          }));

          it('should redo', inject(function(commandStack) {

            commandStack.undo();
            commandStack.redo();

            expect(camundaField.get('expression')).to.equal('FOO');
          }));

        });

      });


    });


    describe('#caseExecutionListener with stringValue attr', function() {

      var camundaField;

      beforeEach(inject(function(propertiesPanel, elementRegistry, selection) {
        var shape = elementRegistry.get('PlanItem_Task_StringValue');
        selection.select(shape);

        var bo = getBusinessObject(shape).definitionRef;
        camundaField = getCamundaFields(bo, CASE_EXECUTION_LISTENER_TYPE, 0)[0];

        // select listener
        selectOption(propertiesPanel._container, CASE_EXECUTION_LISTENER_SELECT_ELEMENT);
        // select field
        selectOption(propertiesPanel._container, FIELDS_SELECT_ELEMENT);

      }));

      describe('#fieldValue', function() {

        var field;

        beforeEach(inject(function(propertiesPanel) {
          field = getTextbox(propertiesPanel._container, FIELD_VALUE_ELEMENT);

          TestHelper.triggerValue(field, 'FOO', 'change');

        }));

        describe('in the DOM', function() {

          it('should execute', function() {
            expect(field.textContent).to.equal('FOO');
          });

          it('should undo', inject(function(commandStack) {

            commandStack.undo();

            expect(field.textContent).to.equal('myListenerValue');
          }));

          it('should redo', inject(function(commandStack) {

            commandStack.undo();
            commandStack.redo();

            expect(field.textContent).to.equal('FOO');

          }));

        });

        describe('on the business object', function() {

          it('should execute', function() {
            expect(camundaField.get('string')).to.equal('FOO');
            expect(camundaField.get('stringValue')).to.be.undefined;
          });

          it('should undo', inject(function(commandStack) {

            commandStack.undo();

            expect(camundaField.get('stringValue')).to.equal('myListenerValue');
          }));

          it('should redo', inject(function(commandStack) {

            commandStack.undo();
            commandStack.redo();

            expect(camundaField.get('string')).to.equal('FOO');
            expect(camundaField.get('stringValue')).to.be.undefined;
          }));

        });

      });


    });


    describe('#taskListener', function() {

      var camundaField;

      beforeEach(inject(function(propertiesPanel, elementRegistry, selection) {
        var shape = elementRegistry.get('PlanItem_HumanTask');
        selection.select(shape);

        var bo = getBusinessObject(shape).definitionRef;
        camundaField = getCamundaFields(bo, TASK_LISTENER_TYPE, 0)[0];

        // select listener
        selectOption(propertiesPanel._container, TASK_LISTENER_SELECT_ELEMENT);
        // select field
        selectOption(propertiesPanel._container, FIELDS_SELECT_ELEMENT);

      }));

      describe('#name', function() {

        var field;

        beforeEach(inject(function(propertiesPanel) {
          field = getInput(propertiesPanel._container, FIELD_NAME_ELEMENT);

          TestHelper.triggerValue(field, 'FOO', 'change');

        }));

        describe('in the DOM', function() {

          it('should execute', function() {
            expect(field.value).to.equal('FOO');
          });

          it('should undo', inject(function(commandStack) {

            commandStack.undo();

            expect(field.value).to.equal('myListener');
          }));

          it('should redo', inject(function(commandStack) {

            commandStack.undo();
            commandStack.redo();

            expect(field.value).to.equal('FOO');

          }));

        });

        describe('on the business object', function() {

          it('should execute', function() {
            expect(camundaField.get('name')).to.equal('FOO');
          });

          it('should undo', inject(function(commandStack) {

            commandStack.undo();

            expect(camundaField.get('name')).to.equal('myListener');
          }));

          it('should redo', inject(function(commandStack) {

            commandStack.undo();
            commandStack.redo();

            expect(camundaField.get('name')).to.equal('FOO');

          }));

        });

      });

      describe('#fieldType', function() {

        var field;

        beforeEach(inject(function(propertiesPanel) {
          field = getSelect(propertiesPanel._container, FIELD_TYPE_ELEMENT);

          // select 'string'
          field.options[0].selected = 'selected';
          TestHelper.triggerEvent(field, 'change');

        }));

        describe('in the DOM', function() {

          it('should execute', function() {
            expect(field.value).to.equal('string');
          });

          it('should undo', inject(function(commandStack) {

            commandStack.undo();

            expect(field.value).to.equal('expression');
          }));

          it('should redo', inject(function(commandStack) {

            commandStack.undo();
            commandStack.redo();

            expect(field.value).to.equal('string');

          }));

        });

        describe('on the business object', function() {

          it('should execute', function() {
            expect(camundaField.get('expression')).to.be.undefined;
            expect(camundaField.get('string')).to.be.defined;
          });

          it('should undo', inject(function(commandStack) {

            commandStack.undo();

            expect(camundaField.get('expression')).to.be.defined;
            expect(camundaField.get('string')).to.be.undefined;
          }));

          it('should redo', inject(function(commandStack) {

            commandStack.undo();
            commandStack.redo();

            expect(camundaField.get('expression')).to.be.undefined;
            expect(camundaField.get('string')).to.be.defined;
          }));

        });

      });

      describe('#fieldValue', function() {

        var field;

        beforeEach(inject(function(propertiesPanel) {
          field = getTextbox(propertiesPanel._container, FIELD_VALUE_ELEMENT);

          TestHelper.triggerValue(field, 'FOO', 'change');

        }));

        describe('in the DOM', function() {

          it('should execute', function() {
            expect(field.textContent).to.equal('FOO');
          });

          it('should undo', inject(function(commandStack) {

            commandStack.undo();

            expect(field.textContent).to.equal('myListenerValue');
          }));

          it('should redo', inject(function(commandStack) {

            commandStack.undo();
            commandStack.redo();

            expect(field.textContent).to.equal('FOO');

          }));

        });

        describe('on the business object', function() {

          it('should execute', function() {
            expect(camundaField.get('expression')).to.equal('FOO');
          });

          it('should undo', inject(function(commandStack) {

            commandStack.undo();

            expect(camundaField.get('expression')).to.equal('myListenerValue');
          }));

          it('should redo', inject(function(commandStack) {

            commandStack.undo();
            commandStack.redo();

            expect(camundaField.get('expression')).to.equal('FOO');
          }));

        });

      });


    });


  });


  describe('add camunda:field', function() {

    describe('#taskListener', function() {

      var bo;

      beforeEach(inject(function(propertiesPanel, elementRegistry, selection) {
        var shape = elementRegistry.get('PlanItem_HumanTask');
        selection.select(shape);

        bo = getBusinessObject(shape).definitionRef;

        // select listener
        selectOption(propertiesPanel._container, TASK_LISTENER_SELECT_ELEMENT);

        var button = getAddButton(propertiesPanel._container, 'listener-fields');

        TestHelper.triggerEvent(button, 'click');

      }));

      describe('in the DOM', function() {

        it('should execute', inject(function(propertiesPanel) {
          var field = getSelect(propertiesPanel._container, FIELDS_SELECT_ELEMENT);
          expect(field.options).to.have.length(2);
        }));

        it('should undo', inject(function(commandStack, propertiesPanel) {

          commandStack.undo();

          var field = getSelect(propertiesPanel._container, FIELDS_SELECT_ELEMENT);
          expect(field.options).to.have.length(1);
        }));

        it('should redo', inject(function(commandStack, propertiesPanel) {

          commandStack.undo();
          commandStack.redo();

          var field = getSelect(propertiesPanel._container, FIELDS_SELECT_ELEMENT);
          expect(field.options).to.have.length(2);

        }));

      });

      describe('on the business object', function() {

        it('should execute', function() {
          var camundaField = getCamundaFields(bo, TASK_LISTENER_TYPE, 0);
          expect(camundaField).to.have.length(2);
        });

        it('should undo', inject(function(commandStack) {

          commandStack.undo();

          var camundaField = getCamundaFields(bo, TASK_LISTENER_TYPE, 0);
          expect(camundaField).to.have.length(1);
        }));

        it('should redo', inject(function(commandStack) {

          commandStack.undo();
          commandStack.redo();

          var camundaField = getCamundaFields(bo, TASK_LISTENER_TYPE, 0);
          expect(camundaField).to.have.length(2);
        }));

      });

    });


    describe('#variableListener', function() {

      var bo;

      beforeEach(inject(function(propertiesPanel, elementRegistry, selection) {
        var shape = elementRegistry.get('CasePlanModel_1');
        selection.select(shape);

        bo = getBusinessObject(shape);

        // select listener
        selectOption(propertiesPanel._container, VARIABLE_LISTENER_SELECT_ELEMENT);

        var button = getAddButton(propertiesPanel._container, 'listener-fields');

        TestHelper.triggerEvent(button, 'click');

      }));

      describe('in the DOM', function() {

        it('should execute', inject(function(propertiesPanel) {
          var field = getSelect(propertiesPanel._container, FIELDS_SELECT_ELEMENT);
          expect(field.options).to.have.length(3);
        }));

        it('should undo', inject(function(commandStack, propertiesPanel) {

          commandStack.undo();

          var field = getSelect(propertiesPanel._container, FIELDS_SELECT_ELEMENT);
          expect(field.options).to.have.length(2);
        }));

        it('should redo', inject(function(commandStack, propertiesPanel) {

          commandStack.undo();
          commandStack.redo();

          var field = getSelect(propertiesPanel._container, FIELDS_SELECT_ELEMENT);
          expect(field.options).to.have.length(3);

        }));

      });

      describe('on the business object', function() {

        it('should execute', function() {
          var camundaField = getCamundaFields(bo, VARIABLE_LISTENER_TYPE, 0);
          expect(camundaField).to.have.length(3);
        });

        it('should undo', inject(function(commandStack) {

          commandStack.undo();

          var camundaField = getCamundaFields(bo, VARIABLE_LISTENER_TYPE, 0);
          expect(camundaField).to.have.length(2);
        }));

        it('should redo', inject(function(commandStack) {

          commandStack.undo();
          commandStack.redo();

          var camundaField = getCamundaFields(bo, VARIABLE_LISTENER_TYPE, 0);
          expect(camundaField).to.have.length(3);
        }));

      });

    });


    describe('#executionListener', function() {

      var bo;

      beforeEach(inject(function(propertiesPanel, elementRegistry, selection) {
        var shape = elementRegistry.get('PlanItem_Task');
        selection.select(shape);

        bo = getBusinessObject(shape).definitionRef;

        // select listener
        selectOption(propertiesPanel._container, CASE_EXECUTION_LISTENER_SELECT_ELEMENT);

        // add camunda:field
        var button = getAddButton(propertiesPanel._container, 'listener-fields');

        TestHelper.triggerEvent(button, 'click');

      }));

      describe('in the DOM', function() {

        it('should execute', inject(function(propertiesPanel) {
          var field = getSelect(propertiesPanel._container, FIELDS_SELECT_ELEMENT);
          expect(field.options).to.have.length(2);
        }));

        it('should undo', inject(function(commandStack, propertiesPanel) {

          commandStack.undo();

          var field = getSelect(propertiesPanel._container, FIELDS_SELECT_ELEMENT);
          expect(field.options).to.have.length(1);
        }));

        it('should redo', inject(function(commandStack, propertiesPanel) {

          commandStack.undo();
          commandStack.redo();

          var field = getSelect(propertiesPanel._container, FIELDS_SELECT_ELEMENT);
          expect(field.options).to.have.length(2);

        }));

      });

      describe('on the business object', function() {

        it('should execute', function() {
          var camundaField = getCamundaFields(bo, CASE_EXECUTION_LISTENER_TYPE, 0);
          expect(camundaField).to.have.length(2);
        });

        it('should undo', inject(function(commandStack) {

          commandStack.undo();

          var camundaField = getCamundaFields(bo, CASE_EXECUTION_LISTENER_TYPE, 0);
          expect(camundaField).to.have.length(1);
        }));

        it('should redo', inject(function(commandStack) {

          commandStack.undo();
          commandStack.redo();

          var camundaField = getCamundaFields(bo, CASE_EXECUTION_LISTENER_TYPE, 0);
          expect(camundaField).to.have.length(2);
        }));

      });

    });


  });


  describe('remove camunda:field', function() {

    describe('#variableListener', function() {

      var bo;

      beforeEach(inject(function(propertiesPanel, elementRegistry, selection) {
        var shape = elementRegistry.get('CasePlanModel_1');
        selection.select(shape);

        bo = getBusinessObject(shape);

        var button = getRemoveButton(propertiesPanel._container, 'listener-fields');

        // select listener
        selectOption(propertiesPanel._container, VARIABLE_LISTENER_SELECT_ELEMENT);

        // select field
        selectOption(propertiesPanel._container, FIELDS_SELECT_ELEMENT);

        TestHelper.triggerEvent(button, 'click');

      }));

      describe('in the DOM', function() {

        it('should execute', inject(function(propertiesPanel) {
          var field = getSelect(propertiesPanel._container, FIELDS_SELECT_ELEMENT);
          expect(field.options).to.have.length(1);
        }));

        it('should undo', inject(function(commandStack, propertiesPanel) {

          commandStack.undo();

          var field = getSelect(propertiesPanel._container, FIELDS_SELECT_ELEMENT);
          expect(field.options).to.have.length(2);
        }));

        it('should redo', inject(function(commandStack, propertiesPanel) {

          commandStack.undo();
          commandStack.redo();

          var field = getSelect(propertiesPanel._container, FIELDS_SELECT_ELEMENT);
          expect(field.options).to.have.length(1);

        }));

      });

      describe('on the business object', function() {

        it('should execute', function() {
          var camundaField = getCamundaFields(bo, VARIABLE_LISTENER_TYPE, 0);
          expect(camundaField).to.have.length(1);
        });

        it('should undo', inject(function(commandStack) {

          commandStack.undo();

          var camundaField = getCamundaFields(bo, VARIABLE_LISTENER_TYPE, 0);
          expect(camundaField).to.have.length(2);
        }));

        it('should redo', inject(function(commandStack) {

          commandStack.undo();
          commandStack.redo();

          var camundaField = getCamundaFields(bo, VARIABLE_LISTENER_TYPE, 0);
          expect(camundaField).to.have.length(1);
        }));

      });

    });


    describe('#caseExecutionListener', function() {

      var bo;

      beforeEach(inject(function(propertiesPanel, elementRegistry, selection) {
        var shape = elementRegistry.get('PlanItem_Task');
        selection.select(shape);

        bo = getBusinessObject(shape).definitionRef;

        var button = getRemoveButton(propertiesPanel._container, 'listener-fields');

        // select listener
        selectOption(propertiesPanel._container, CASE_EXECUTION_LISTENER_SELECT_ELEMENT);

        // select field
        selectOption(propertiesPanel._container, FIELDS_SELECT_ELEMENT);

        TestHelper.triggerEvent(button, 'click');

      }));

      describe('in the DOM', function() {

        it('should execute', inject(function(propertiesPanel) {
          var field = getSelect(propertiesPanel._container, FIELDS_SELECT_ELEMENT);
          expect(field.options).to.have.length(0);
        }));

        it('should undo', inject(function(commandStack, propertiesPanel) {

          commandStack.undo();

          var field = getSelect(propertiesPanel._container, FIELDS_SELECT_ELEMENT);
          expect(field.options).to.have.length(1);
        }));

        it('should redo', inject(function(commandStack, propertiesPanel) {

          commandStack.undo();
          commandStack.redo();

          var field = getSelect(propertiesPanel._container, FIELDS_SELECT_ELEMENT);
          expect(field.options).to.have.length(0);

        }));

      });

      describe('on the business object', function() {

        it('should execute', function() {
          var camundaField = getCamundaFields(bo, CASE_EXECUTION_LISTENER_TYPE, 0);
          expect(camundaField).to.have.length(0);
        });

        it('should undo', inject(function(commandStack) {

          commandStack.undo();

          var camundaField = getCamundaFields(bo, CASE_EXECUTION_LISTENER_TYPE, 0);
          expect(camundaField).to.have.length(1);
        }));

        it('should redo', inject(function(commandStack) {

          commandStack.undo();
          commandStack.redo();

          var camundaField = getCamundaFields(bo, CASE_EXECUTION_LISTENER_TYPE, 0);
          expect(camundaField).to.have.length(0);
        }));

      });

    });

    describe('#taskListener', function() {

      var bo;

      beforeEach(inject(function(propertiesPanel, elementRegistry, selection) {
        var shape = elementRegistry.get('PlanItem_HumanTask');
        selection.select(shape);

        bo = getBusinessObject(shape).definitionRef;

        var button = getRemoveButton(propertiesPanel._container, 'listener-fields');

        // select listener
        selectOption(propertiesPanel._container, TASK_LISTENER_SELECT_ELEMENT);

        // select field
        selectOption(propertiesPanel._container, FIELDS_SELECT_ELEMENT);

        TestHelper.triggerEvent(button, 'click');

      }));

      describe('in the DOM', function() {

        it('should execute', inject(function(propertiesPanel) {
          var field = getSelect(propertiesPanel._container, FIELDS_SELECT_ELEMENT);
          expect(field.options).to.have.length(0);
        }));

        it('should undo', inject(function(commandStack, propertiesPanel) {

          commandStack.undo();

          var field = getSelect(propertiesPanel._container, FIELDS_SELECT_ELEMENT);
          expect(field.options).to.have.length(1);
        }));

        it('should redo', inject(function(commandStack, propertiesPanel) {

          commandStack.undo();
          commandStack.redo();

          var field = getSelect(propertiesPanel._container, FIELDS_SELECT_ELEMENT);
          expect(field.options).to.have.length(0);

        }));

      });

      describe('on the business object', function() {

        it('should execute', function() {
          var camundaField = getCamundaFields(bo, TASK_LISTENER_TYPE, 0);
          expect(camundaField).to.have.length(0);
        });

        it('should undo', inject(function(commandStack) {

          commandStack.undo();

          var camundaField = getCamundaFields(bo, TASK_LISTENER_TYPE, 0);
          expect(camundaField).to.have.length(1);
        }));

        it('should redo', inject(function(commandStack) {

          commandStack.undo();
          commandStack.redo();

          var camundaField = getCamundaFields(bo, TASK_LISTENER_TYPE, 0);
          expect(camundaField).to.have.length(0);
        }));

      });

    });


  });


  describe('remove camunda:listener', function() {

    describe('#variableListener', function() {

      var bo;

      beforeEach(inject(function(propertiesPanel, elementRegistry, selection) {
        var shape = elementRegistry.get('CasePlanModel_1');
        selection.select(shape);

        bo = getBusinessObject(shape);

        var button = getRemoveButton(propertiesPanel._container, 'variableListeners');

        // select listener
        selectOption(propertiesPanel._container, VARIABLE_LISTENER_SELECT_ELEMENT);

        TestHelper.triggerEvent(button, 'click');

      }));

      describe('in the DOM', function() {

        it('should execute', inject(function(propertiesPanel) {

          var field = getSelect(propertiesPanel._container, VARIABLE_LISTENER_SELECT_ELEMENT);
          expect(field.options).to.have.length(0);

        }));

        it('should undo', inject(function(commandStack, propertiesPanel) {

          commandStack.undo();

          var field = getSelect(propertiesPanel._container, VARIABLE_LISTENER_SELECT_ELEMENT);
          expect(field.options).to.have.length(1);

        }));

        it('should redo', inject(function(commandStack, propertiesPanel) {

          commandStack.undo();
          commandStack.redo();

          var field = getSelect(propertiesPanel._container, VARIABLE_LISTENER_SELECT_ELEMENT);
          expect(field.options).to.have.length(0);

        }));

      });

      describe('on the business object', function() {

        it('should execute', function() {

          expect(getExtensionElements(bo, VARIABLE_LISTENER_TYPE)).to.have.length(0);

        });

        it('should undo', inject(function(commandStack) {

          commandStack.undo();

          expect(getExtensionElements(bo, VARIABLE_LISTENER_TYPE)).to.have.length(1);
          var camundaField = getCamundaFields(bo, VARIABLE_LISTENER_TYPE, 0);
          expect(camundaField).to.have.length(2);

        }));

        it('should redo', inject(function(commandStack) {

          commandStack.undo();
          commandStack.redo();

          expect(getExtensionElements(bo, VARIABLE_LISTENER_TYPE)).to.have.length(0);

        }));

      });

    });


    describe('#caseExecutionListener', function() {

      var bo;

      beforeEach(inject(function(propertiesPanel, elementRegistry, selection) {
        var shape = elementRegistry.get('PlanItem_Task');
        selection.select(shape);

        bo = getBusinessObject(shape).definitionRef;

        var button = getRemoveButton(propertiesPanel._container, 'caseExecutionListeners');

        // select listener
        selectOption(propertiesPanel._container, CASE_EXECUTION_LISTENER_SELECT_ELEMENT);

        TestHelper.triggerEvent(button, 'click');

      }));

      describe('in the DOM', function() {

        it('should execute', inject(function(propertiesPanel) {

          var field = getSelect(propertiesPanel._container, CASE_EXECUTION_LISTENER_SELECT_ELEMENT);
          expect(field.options).to.have.length(0);

        }));

        it('should undo', inject(function(commandStack, propertiesPanel) {

          commandStack.undo();

          var field = getSelect(propertiesPanel._container, CASE_EXECUTION_LISTENER_SELECT_ELEMENT);
          expect(field.options).to.have.length(1);

        }));

        it('should redo', inject(function(commandStack, propertiesPanel) {

          commandStack.undo();
          commandStack.redo();

          var field = getSelect(propertiesPanel._container, CASE_EXECUTION_LISTENER_SELECT_ELEMENT);
          expect(field.options).to.have.length(0);

        }));

      });

      describe('on the business object', function() {

        it('should execute', function() {

          expect(getExtensionElements(bo, CASE_EXECUTION_LISTENER_TYPE)).to.have.length(0);

        });

        it('should undo', inject(function(commandStack) {

          commandStack.undo();

          expect(getExtensionElements(bo, CASE_EXECUTION_LISTENER_TYPE)).to.have.length(1);
          var camundaField = getCamundaFields(bo, CASE_EXECUTION_LISTENER_TYPE, 0);
          expect(camundaField).to.have.length(1);

        }));

        it('should redo', inject(function(commandStack) {

          commandStack.undo();
          commandStack.redo();

          expect(getExtensionElements(bo, CASE_EXECUTION_LISTENER_TYPE)).to.have.length(0);

        }));

      });

    });


    describe('#taskListener', function() {

      var bo;

      beforeEach(inject(function(propertiesPanel, elementRegistry, selection) {
        var shape = elementRegistry.get('PlanItem_HumanTask');
        selection.select(shape);

        bo = getBusinessObject(shape).definitionRef;

        var button = getRemoveButton(propertiesPanel._container, 'taskListeners');

        // select listener
        selectOption(propertiesPanel._container, TASK_LISTENER_SELECT_ELEMENT);

        TestHelper.triggerEvent(button, 'click');

      }));

      describe('in the DOM', function() {

        it('should execute', inject(function(propertiesPanel) {

          var field = getSelect(propertiesPanel._container, TASK_LISTENER_SELECT_ELEMENT);
          expect(field.options).to.have.length(0);

        }));

        it('should undo', inject(function(commandStack, propertiesPanel) {

          commandStack.undo();

          var field = getSelect(propertiesPanel._container, TASK_LISTENER_SELECT_ELEMENT);
          expect(field.options).to.have.length(1);
        }));

        it('should redo', inject(function(commandStack, propertiesPanel) {

          commandStack.undo();
          commandStack.redo();

          var field = getSelect(propertiesPanel._container, TASK_LISTENER_SELECT_ELEMENT);
          expect(field.options).to.have.length(0);

        }));

      });

      describe('on the business object', function() {

        it('should execute', function() {

          expect(getExtensionElements(bo, TASK_LISTENER_TYPE)).to.have.length(0);

        });

        it('should undo', inject(function(commandStack) {

          commandStack.undo();

          expect(getExtensionElements(bo, TASK_LISTENER_TYPE)).to.have.length(1);

          var camundaField = getCamundaFields(bo, TASK_LISTENER_TYPE, 0);
          expect(camundaField).to.have.length(1);

        }));

        it('should redo', inject(function(commandStack) {

          commandStack.undo();
          commandStack.redo();

          expect(getExtensionElements(bo, TASK_LISTENER_TYPE)).to.have.length(0);

        }));

      });

    });


  });


  describe('validation errors', function() {

    beforeEach(inject(function(elementRegistry, selection, propertiesPanel) {

      var item = elementRegistry.get('PlanItem_Task_Invalid');
      selection.select(item);

      // select listener
      selectOption(propertiesPanel._container, CASE_EXECUTION_LISTENER_SELECT_ELEMENT);

      // select field
      selectOption(propertiesPanel._container, FIELDS_SELECT_ELEMENT);

    }));

    it('should be shown if the name field is empty', inject(function(propertiesPanel) {

      var field = getInput(propertiesPanel._container, FIELD_NAME_ELEMENT);

      expect(domClasses(field).has('invalid')).to.be.true;

    }));

    it('should be shown if fieldType selected and no fieldValue is empty', inject(function(propertiesPanel) {

      var fieldType = getSelect(propertiesPanel._container, FIELD_TYPE_ELEMENT);
      var fieldValue = getTextbox(propertiesPanel._container, FIELD_VALUE_ELEMENT);

      expect(fieldType.value).to.equal('string');
      expect(domClasses(fieldValue).has('invalid')).to.be.true;

    }));


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

      beforeEach(inject(function(elementRegistry, selection, propertiesPanel) {

        var item = elementRegistry.get('PlanItem_Task');
        selection.select(item);

        // select listener
        selectOption(propertiesPanel._container, CASE_EXECUTION_LISTENER_SELECT_ELEMENT);

        // select field
        selectOption(propertiesPanel._container, FIELDS_SELECT_ELEMENT);

      }));

      it('fieldName', expectVisible(true, getInput, FIELD_NAME_ELEMENT));
      it('fieldType', expectVisible(true, getSelect, FIELD_TYPE_ELEMENT));
      it('fieldValue', expectVisible(true, getTextbox, FIELD_VALUE_ELEMENT));

    });

    describe('should hide', function() {

      beforeEach(inject(function(elementRegistry, selection, propertiesPanel) {

        var item = elementRegistry.get('PlanItem_Task');
        selection.select(item);

        // select listener
        selectOption(propertiesPanel._container, CASE_EXECUTION_LISTENER_SELECT_ELEMENT);

      }));

      it('fieldName', expectVisible(false, getInput, FIELD_NAME_ELEMENT, true));
      it('fieldType', expectVisible(false, getSelect, FIELD_TYPE_ELEMENT));
      it('fieldValue', expectVisible(false, getTextbox, FIELD_VALUE_ELEMENT, true));

    });

  });


});
