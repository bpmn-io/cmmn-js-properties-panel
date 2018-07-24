'use strict';

var TestHelper = require('../../../TestHelper');

var TestContainer = require('mocha-test-container-support');

/* global bootstrapModeler, inject */

var propertiesPanelModule = require('lib'),
    domQuery = require('min-dom').query,
    domClasses = require('min-dom').classes,
    is = require('cmmn-js/lib/util/ModelUtil').is,
    forEach = require('lodash/collection/forEach'),
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

function getTaskListeners(extensionElements) {
  var mappings = [];

  if (extensionElements && extensionElements.values) {
    forEach(extensionElements.values, function(value) {
      if (is(value, 'camunda:TaskListener')) {
        mappings.push(value);
      }
    });
  }
  return mappings;
}

function selectFirstListener(propertiesPanel) {
  var listeners = getSelect(propertiesPanel._container, 'cam-extensionElements-taskListeners');

  listeners.options[0].selected = 'selected';
  TestHelper.triggerEvent(listeners, 'change');
}


describe('task-listener-properties', function() {

  var diagramXML = require('./TaskListener.cmmn');

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

    describe('# Class', function() {

      var listeners;

      beforeEach(inject(function(elementRegistry, selection, propertiesPanel) {

        // given
        var item = elementRegistry.get('PlanItem_HumanTask_Class');
        selection.select(item);

        var bo = item.businessObject.definitionRef;
        listeners = getTaskListeners(bo.get('extensionElements'));

        // select existing task listener
        selectFirstListener(propertiesPanel);

      }));


      it('should fetch the eventType of a task listener', inject(function(propertiesPanel) {

        var field = getSelect(propertiesPanel._container, 'camunda-taskListenerEventType-select');

        // when selecting element

        // then
        expect(field.value).to.equal(listeners[0].get('event'));

      }));


      it('should fetch the listenerType of a task listener', inject(function(propertiesPanel) {

        var field = getSelect(propertiesPanel._container, 'camunda-listenerType-select');

        // when selecting element

        // then
        expect(field.value).to.equal('class');

      }));


      it('should fetch the class of a task listener', inject(function(propertiesPanel) {

        var field = getInput(propertiesPanel._container, 'class');

        // when selecting element

        // then
        expect(field.value).to.equal(listeners[0].get('class'));

      }));

    });

    describe('# Expression', function() {

      var listeners;

      beforeEach(inject(function(elementRegistry, selection, propertiesPanel) {

        // given
        var item = elementRegistry.get('PlanItem_HumanTask_Expression');
        selection.select(item);

        var bo = item.businessObject.definitionRef;
        listeners = getTaskListeners(bo.get('extensionElements'));

        // select existing task listener
        selectFirstListener(propertiesPanel);

      }));


      it('should fetch the eventType of a task listener', inject(function(propertiesPanel) {

        var field = getSelect(propertiesPanel._container, 'camunda-taskListenerEventType-select');

        // when selecting element

        // then
        expect(field.value).to.equal(listeners[0].get('event'));

      }));


      it('should fetch the listenerType of a task listener', inject(function(propertiesPanel) {

        var field = getSelect(propertiesPanel._container, 'camunda-listenerType-select');

        // when selecting element

        // then
        expect(field.value).to.equal('expression');

      }));


      it('should fetch the class of a task listener', inject(function(propertiesPanel) {

        var field = getInput(propertiesPanel._container, 'expression');

        // when selecting element

        // then
        expect(field.value).to.equal(listeners[0].get('expression'));

      }));

    });

    describe('# Delegate Expression', function() {

      var listeners;

      beforeEach(inject(function(elementRegistry, selection, propertiesPanel) {

        // given
        var item = elementRegistry.get('PlanItem_HumanTask_DelegateExpression');
        selection.select(item);

        var bo = item.businessObject.definitionRef;
        listeners = getTaskListeners(bo.get('extensionElements'));

        // select existing task listener
        selectFirstListener(propertiesPanel);

      }));


      it('should fetch the eventType of a task listener', inject(function(propertiesPanel) {

        var field = getSelect(propertiesPanel._container, 'camunda-taskListenerEventType-select');

        // when selecting element

        // then
        expect(field.value).to.equal(listeners[0].get('event'));

      }));


      it('should fetch the listenerType of a task listener', inject(function(propertiesPanel) {

        var field = getSelect(propertiesPanel._container, 'camunda-listenerType-select');

        // when selecting element

        // then
        expect(field.value).to.equal('delegateExpression');

      }));


      it('should fetch the class of a task listener', inject(function(propertiesPanel) {

        var field = getInput(propertiesPanel._container, 'delegateExpression');

        // when selecting element

        // then
        expect(field.value).to.equal(listeners[0].get('delegateExpression'));

      }));

    });


  });


  describe('validation', function() {

    describe('errors', function() {

      describe('# Class', function() {

        beforeEach(inject(function(elementRegistry, selection, propertiesPanel) {

          // given
          var item = elementRegistry.get('PlanItem_HumanTask_Class_Invalid');
          selection.select(item);

          // select existing task listener
          selectFirstListener(propertiesPanel);

        }));

        it('should be shown if listenerType is selected and class is empty', inject(function(propertiesPanel) {

          var listenerType = getSelect(propertiesPanel._container, 'camunda-listenerType-select');
          var field = getInput(propertiesPanel._container, 'class');

          // when selecting element

          // then
          expect(listenerType.value).to.equal('class');
          expect(domClasses(field).has('invalid')).to.be.true;

        }));

      });

      describe('# Expression', function() {

        beforeEach(inject(function(elementRegistry, selection, propertiesPanel) {

          // given
          var item = elementRegistry.get('PlanItem_HumanTask_Expression_Invalid');
          selection.select(item);

          // select existing task listener
          selectFirstListener(propertiesPanel);

        }));

        it('should be shown if listenerType is selected and expression is empty', inject(function(propertiesPanel) {

          var listenerType = getSelect(propertiesPanel._container, 'camunda-listenerType-select');
          var field = getInput(propertiesPanel._container, 'expression');

          // when selecting element

          // then
          expect(listenerType.value).to.equal('expression');
          expect(domClasses(field).has('invalid')).to.be.true;

        }));

      });

      describe('# Delegate Expression', function() {

        beforeEach(inject(function(elementRegistry, selection, propertiesPanel) {

          // given
          var item = elementRegistry.get('PlanItem_HumanTask_DelegateExpression_Invalid');
          selection.select(item);

          // select existing task listener
          selectFirstListener(propertiesPanel);

        }));

        it('should be shown if listenerType is selected and delegateExpression is empty', inject(function(propertiesPanel) {

          var listenerType = getSelect(propertiesPanel._container, 'camunda-listenerType-select');
          var field = getInput(propertiesPanel._container, 'delegateExpression');

          // when selecting element

          // then
          expect(listenerType.value).to.equal('delegateExpression');
          expect(domClasses(field).has('invalid')).to.be.true;

        }));

      });

    });

    describe('warnings', function() {

      describe('# Class', function() {

        beforeEach(inject(function(elementRegistry, selection, propertiesPanel) {

          // given
          var item = elementRegistry.get('PlanItem_HumanTask_Class_Invalid');
          selection.select(item);

          // select existing task listener
          selectFirstListener(propertiesPanel);

        }));

        it('should be shown if eventType is empty', inject(function(propertiesPanel) {

          var eventType = getSelect(propertiesPanel._container, 'camunda-taskListenerEventType-select');

          // when selecting element

          // then
          expect(domClasses(eventType).has('warning')).to.be.true;

        }));

      });

    });


  });


  describe('set', function() {

    describe('# eventType', function() {

      var field, listeners;

      beforeEach(inject(function(elementRegistry, selection, propertiesPanel) {

        // given
        var item = elementRegistry.get('PlanItem_HumanTask_Class');
        selection.select(item);

        var bo = item.businessObject.definitionRef;
        listeners = getTaskListeners(bo.get('extensionElements'));

        field = getSelect(propertiesPanel._container, 'camunda-taskListenerEventType-select');

        // select existing task listener
        selectFirstListener(propertiesPanel);

        // when
        // select ''
        field.options[0].selected = 'selected';
        TestHelper.triggerEvent(field, 'change');

      }));


      describe('in the DOM', function() {

        it('should execute', function() {
          expect(field.value).to.equal('');
        });

        it('should undo', inject(function(commandStack) {
          // when
          commandStack.undo();

          // then
          expect(field.value).to.equal('create');
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
          expect(listeners[0].get('event')).to.be.undefined;
        });

        it('should undo', inject(function(commandStack) {
          // when
          commandStack.undo();

          // then
          expect(listeners[0].get('event')).to.equal('create');
        }));

        it('should redo', inject(function(commandStack) {
          // when
          commandStack.undo();
          commandStack.redo();

          // then
          expect(listeners[0].get('event')).to.be.undefined;
        }));

      });

    });

    describe('# listenerType', function() {

      var field, listeners;

      beforeEach(inject(function(elementRegistry, selection, propertiesPanel) {

        // given
        var item = elementRegistry.get('PlanItem_HumanTask_Class');
        selection.select(item);

        var bo = item.businessObject.definitionRef;
        listeners = getTaskListeners(bo.get('extensionElements'));

        field = getSelect(propertiesPanel._container, 'camunda-listenerType-select');

        // select existing task listener
        selectFirstListener(propertiesPanel);

        // when
        // select 'expression'
        field.options[1].selected = 'selected';
        TestHelper.triggerEvent(field, 'change');

      }));


      describe('in the DOM', function() {

        it('should execute', function() {
          expect(field.value).to.equal('expression');
        });

        it('should undo', inject(function(commandStack) {
          // when
          commandStack.undo();

          // then
          expect(field.value).to.equal('class');
        }));

        it('should redo', inject(function(commandStack) {
          // when
          commandStack.undo();
          commandStack.redo();

          // then
          expect(field.value).to.equal('expression');
        }));

      });

      describe('on the business object', function() {

        it('should execute', function() {
          expect(listeners[0].get('expression')).to.be.defined;
          expect(listeners[0].get('class')).to.be.undefined;
        });

        it('should undo', inject(function(commandStack) {
          // when
          commandStack.undo();

          // then
          expect(listeners[0].get('expression')).to.be.undefined;
          expect(listeners[0].get('class')).to.be.defined;
        }));

        it('should redo', inject(function(commandStack) {
          // when
          commandStack.undo();
          commandStack.redo();

          // then
          expect(listeners[0].get('expression')).to.be.defined;
          expect(listeners[0].get('class')).to.be.undefined;
        }));

      });

    });

    describe('# class', function() {

      var field, listeners;

      beforeEach(inject(function(elementRegistry, selection, propertiesPanel) {

        // given
        var item = elementRegistry.get('PlanItem_HumanTask_Class');
        selection.select(item);

        var bo = item.businessObject.definitionRef;
        listeners = getTaskListeners(bo.get('extensionElements'));

        field = getInput(propertiesPanel._container, 'class');

        // select existing task listener
        selectFirstListener(propertiesPanel);

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
          expect(field.value).to.equal('myClass');
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
          expect(listeners[0].get('class')).to.equal('FOO');
        });

        it('should undo', inject(function(commandStack) {
          // when
          commandStack.undo();

          // then
          expect(listeners[0].get('class')).to.equal('myClass');
        }));

        it('should redo', inject(function(commandStack) {
          // when
          commandStack.undo();
          commandStack.redo();

          // then
          expect(listeners[0].get('class')).to.equal('FOO');
        }));

      });

    });

    describe('# expression', function() {

      var field, listeners;

      beforeEach(inject(function(elementRegistry, selection, propertiesPanel) {

        // given
        var item = elementRegistry.get('PlanItem_HumanTask_Expression');
        selection.select(item);

        var bo = item.businessObject.definitionRef;
        listeners = getTaskListeners(bo.get('extensionElements'));

        field = getInput(propertiesPanel._container, 'expression');

        // select existing task listener
        selectFirstListener(propertiesPanel);

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
          expect(field.value).to.equal('${myExpression}');
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
          expect(listeners[0].get('expression')).to.equal('FOO');
        });

        it('should undo', inject(function(commandStack) {
          // when
          commandStack.undo();

          // then
          expect(listeners[0].get('expression')).to.equal('${myExpression}');
        }));

        it('should redo', inject(function(commandStack) {
          // when
          commandStack.undo();
          commandStack.redo();

          // then
          expect(listeners[0].get('expression')).to.equal('FOO');
        }));

      });

    });

    describe('# delegateExpression', function() {

      var field, listeners;

      beforeEach(inject(function(elementRegistry, selection, propertiesPanel) {

        // given
        var item = elementRegistry.get('PlanItem_HumanTask_DelegateExpression');
        selection.select(item);

        var bo = item.businessObject.definitionRef;
        listeners = getTaskListeners(bo.get('extensionElements'));

        field = getInput(propertiesPanel._container, 'delegateExpression');

        // select existing task listener
        selectFirstListener(propertiesPanel);

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
          expect(field.value).to.equal('${myDelegateExpression}');
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
          expect(listeners[0].get('delegateExpression')).to.equal('FOO');
        });

        it('should undo', inject(function(commandStack) {
          // when
          commandStack.undo();

          // then
          expect(listeners[0].get('delegateExpression')).to.equal('${myDelegateExpression}');
        }));

        it('should redo', inject(function(commandStack) {
          // when
          commandStack.undo();
          commandStack.redo();

          // then
          expect(listeners[0].get('delegateExpression')).to.equal('FOO');
        }));

      });

    });


  });


  describe('add', function() {

    var bo, field;

    beforeEach(inject(function(elementRegistry, selection, propertiesPanel) {

      // given
      var item = elementRegistry.get('PlanItem_HumanTask_Empty');
      selection.select(item);

      bo = item.businessObject.definitionRef;

      var button = getAddButton(propertiesPanel._container, 'taskListeners');
      field = getSelect(propertiesPanel._container, 'cam-extensionElements-taskListeners');

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
        var listeners = getTaskListeners(bo.get('extensionElements'));
        expect(listeners).to.have.length(1);
      });

      it('should undo', inject(function(commandStack) {
        // when
        commandStack.undo();

        // then
        var listeners = getTaskListeners(bo.get('extensionElements'));
        expect(listeners).to.have.length(0);
      }));

      it('should redo', inject(function(commandStack) {
        // when
        commandStack.undo();
        commandStack.redo();

        // then
        var listeners = getTaskListeners(bo.get('extensionElements'));
        expect(listeners).to.have.length(1);
      }));

    });


  });


  describe('remove', function() {

    var bo, field;

    beforeEach(inject(function(elementRegistry, selection, propertiesPanel) {

      // given
      var item = elementRegistry.get('PlanItem_HumanTask_Class');
      selection.select(item);

      bo = item.businessObject.definitionRef;

      var button = getRemoveButton(propertiesPanel._container, 'taskListeners');
      field = getSelect(propertiesPanel._container, 'cam-extensionElements-taskListeners');

      // select existing task listener
      selectFirstListener(propertiesPanel);

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
        var listeners = getTaskListeners(bo.get('extensionElements'));
        expect(listeners).to.have.length(0);
      });

      it('should undo', inject(function(commandStack) {
        // when
        commandStack.undo();

        // then
        var listeners = getTaskListeners(bo.get('extensionElements'));
        expect(listeners).to.have.length(1);
      }));

      it('should redo', inject(function(commandStack) {
        // when
        commandStack.undo();
        commandStack.redo();

        // then
        var listeners = getTaskListeners(bo.get('extensionElements'));
        expect(listeners).to.have.length(0);
      }));

    });

  });


});
