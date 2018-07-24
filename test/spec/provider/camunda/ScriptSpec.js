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

function getTextbox(container, selector) {
  return domQuery('[name="' + selector + '"]', container);
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


describe('script-properties', function() {

  var diagramXML = require('./Script.cmmn');

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

    describe('# Script Inline', function() {

      var listeners;

      beforeEach(inject(function(elementRegistry, selection, propertiesPanel) {

        // given
        var item = elementRegistry.get('PlanItem_HumanTask_Script');
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
        expect(field.value).to.equal('script');

      }));


      it('should fetch the scriptFormat of a task listener', inject(function(propertiesPanel) {

        var field = getInput(propertiesPanel._container, 'scriptFormat');

        // when selecting element

        // then
        expect(field.value).to.equal(listeners[0].get('script').get('scriptFormat'));

      }));

      it('should fetch the scriptType of a task listener', inject(function(propertiesPanel) {

        var field = getSelect(propertiesPanel._container, 'camunda-scriptType-select');

        // when selecting element

        // then
        expect(field.value).to.equal('inline');

      }));

      it('should fetch the script of a task listener', inject(function(propertiesPanel) {

        var field = getTextbox(propertiesPanel._container, 'value');

        // when selecting element

        // then
        expect(field.textContent).to.equal(listeners[0].get('script').get('value'));

      }));

    });

    describe('# Script External', function() {

      var listeners;

      beforeEach(inject(function(elementRegistry, selection, propertiesPanel) {

        // given
        var item = elementRegistry.get('PlanItem_HumanTask_Script_EXTERNAL');
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
        expect(field.value).to.equal('script');

      }));


      it('should fetch the scriptFormat of a task listener', inject(function(propertiesPanel) {

        var field = getInput(propertiesPanel._container, 'scriptFormat');

        // when selecting element

        // then
        expect(field.value).to.equal(listeners[0].get('script').get('scriptFormat'));

      }));

      it('should fetch the scriptType of a task listener', inject(function(propertiesPanel) {

        var field = getSelect(propertiesPanel._container, 'camunda-scriptType-select');

        // when selecting element

        // then
        expect(field.value).to.equal('external');

      }));

      it('should fetch the resource of a task listener', inject(function(propertiesPanel) {

        var field = getInput(propertiesPanel._container, 'resource');

        // when selecting element

        // then
        expect(field.value).to.equal(listeners[0].get('script').get('resource'));

      }));

    });


  });


  describe('validation', function() {

    describe('errors', function() {

      describe('# Script Inline', function() {

        beforeEach(inject(function(elementRegistry, selection, propertiesPanel) {

          // given
          var item = elementRegistry.get('PlanItem_HumanTask_Script_Invalid');
          selection.select(item);

          // select existing task listener
          selectFirstListener(propertiesPanel);

        }));

        it('should be shown if listenerType is selected and scriptFormat is empty', inject(function(propertiesPanel) {

          var listenerType = getSelect(propertiesPanel._container, 'camunda-listenerType-select');
          var field = getInput(propertiesPanel._container, 'scriptFormat');

          // when selecting element

          // then
          expect(listenerType.value).to.equal('script');
          expect(domClasses(field).has('invalid')).to.be.true;

        }));

        it('should be shown if scriptType is selected and script is empty', inject(function(propertiesPanel) {

          var scriptType = getSelect(propertiesPanel._container, 'camunda-scriptType-select');
          var field = getTextbox(propertiesPanel._container, 'value');

          // when selecting element

          // then
          expect(scriptType.value).to.equal('inline');
          expect(domClasses(field).has('invalid')).to.be.true;

        }));

      });


    });

    describe('warnings', function() {

      describe('# Script Inline', function() {

        beforeEach(inject(function(elementRegistry, selection, propertiesPanel) {

          // given
          var item = elementRegistry.get('PlanItem_HumanTask_Script_Invalid');
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
        var item = elementRegistry.get('PlanItem_HumanTask_Script');
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
        var item = elementRegistry.get('PlanItem_HumanTask_Script');
        selection.select(item);

        var bo = item.businessObject.definitionRef;
        listeners = getTaskListeners(bo.get('extensionElements'));

        field = getSelect(propertiesPanel._container, 'camunda-listenerType-select');

        // select existing task listener
        selectFirstListener(propertiesPanel);

        // when
        // select 'class'
        field.options[0].selected = 'selected';
        TestHelper.triggerEvent(field, 'change');

      }));


      describe('in the DOM', function() {

        it('should execute', function() {
          expect(field.value).to.equal('class');
        });

        it('should undo', inject(function(commandStack) {
          // when
          commandStack.undo();

          // then
          expect(field.value).to.equal('script');
        }));

        it('should redo', inject(function(commandStack) {
          // when
          commandStack.undo();
          commandStack.redo();

          // then
          expect(field.value).to.equal('class');
        }));

      });

      describe('on the business object', function() {

        it('should execute', function() {
          expect(listeners[0].get('class')).to.be.defined;
          expect(listeners[0].get('script')).to.be.undefined;
        });

        it('should undo', inject(function(commandStack) {
          // when
          commandStack.undo();

          // then
          expect(listeners[0].get('class')).to.be.undefined;
          expect(listeners[0].get('script')).to.be.defined;
        }));

        it('should redo', inject(function(commandStack) {
          // when
          commandStack.undo();
          commandStack.redo();

          // then
          expect(listeners[0].get('class')).to.be.defined;
          expect(listeners[0].get('script')).to.be.undefined;
        }));

      });

    });

    describe('# scriptFormat', function() {

      var field, listeners;

      beforeEach(inject(function(elementRegistry, selection, propertiesPanel) {

        // given
        var item = elementRegistry.get('PlanItem_HumanTask_Script');
        selection.select(item);

        var bo = item.businessObject.definitionRef;
        listeners = getTaskListeners(bo.get('extensionElements'));

        field = getInput(propertiesPanel._container, 'scriptFormat');

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
          expect(field.value).to.equal('groovy');
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
          expect(listeners[0].get('script').get('scriptFormat')).to.equal('FOO');
        });

        it('should undo', inject(function(commandStack) {
          // when
          commandStack.undo();

          // then
          expect(listeners[0].get('script').get('scriptFormat')).to.equal('groovy');
        }));

        it('should redo', inject(function(commandStack) {
          // when
          commandStack.undo();
          commandStack.redo();

          // then
          expect(listeners[0].get('script').get('scriptFormat')).to.equal('FOO');
        }));

      });

    });

    describe('# scriptType', function() {

      var field, listeners;

      beforeEach(inject(function(elementRegistry, selection, propertiesPanel) {

        // given
        var item = elementRegistry.get('PlanItem_HumanTask_Script');
        selection.select(item);

        var bo = item.businessObject.definitionRef;
        listeners = getTaskListeners(bo.get('extensionElements'));

        field = getSelect(propertiesPanel._container, 'camunda-scriptType-select');

        // select existing task listener
        selectFirstListener(propertiesPanel);

        // when
        // select 'external'
        field.options[1].selected = 'selected';
        TestHelper.triggerEvent(field, 'change');

      }));


      describe('in the DOM', function() {

        it('should execute', function() {
          expect(field.value).to.equal('external');
        });

        it('should undo', inject(function(commandStack) {
          // when
          commandStack.undo();

          // then
          expect(field.value).to.equal('inline');
        }));

        it('should redo', inject(function(commandStack) {
          // when
          commandStack.undo();
          commandStack.redo();

          // then
          expect(field.value).to.equal('external');
        }));

      });

      describe('on the business object', function() {

        it('should execute', function() {
          expect(listeners[0].get('script').get('value')).to.be.undefined;
          expect(listeners[0].get('script').get('resource')).to.be.defined;
        });

        it('should undo', inject(function(commandStack) {
          // when
          commandStack.undo();

          // then
          expect(listeners[0].get('script').get('value')).to.be.defined;
          expect(listeners[0].get('script').get('resource')).to.be.undefined;
        }));

        it('should redo', inject(function(commandStack) {
          // when
          commandStack.undo();
          commandStack.redo();

          // then
          expect(listeners[0].get('script').get('value')).to.be.undefined;
          expect(listeners[0].get('script').get('resource')).to.be.defined;
        }));

      });

    });


    describe('# script value', function() {

      var field, listeners;

      beforeEach(inject(function(elementRegistry, selection, propertiesPanel) {

        // given
        var item = elementRegistry.get('PlanItem_HumanTask_Script');
        selection.select(item);

        var bo = item.businessObject.definitionRef;
        listeners = getTaskListeners(bo.get('extensionElements'));

        field = getTextbox(propertiesPanel._container, 'value');

        // select existing task listener
        selectFirstListener(propertiesPanel);

        // when
        TestHelper.triggerValue(field, 'FOO', 'change');

      }));


      describe('in the DOM', function() {

        it('should execute', function() {
          expect(field.textContent).to.equal('FOO');
        });

        it('should undo', inject(function(commandStack) {
          // when
          commandStack.undo();

          // then
          expect(field.textContent).to.equal('myScript');
        }));

        it('should redo', inject(function(commandStack) {
          // when
          commandStack.undo();
          commandStack.redo();

          // then
          expect(field.textContent).to.equal('FOO');
        }));

      });

      describe('on the business object', function() {

        it('should execute', function() {
          expect(listeners[0].get('script').get('value')).to.equal('FOO');
        });

        it('should undo', inject(function(commandStack) {
          // when
          commandStack.undo();

          // then
          expect(listeners[0].get('script').get('value')).to.equal('myScript');
        }));

        it('should redo', inject(function(commandStack) {
          // when
          commandStack.undo();
          commandStack.redo();

          // then
          expect(listeners[0].get('script').get('value')).to.equal('FOO');
        }));

      });

    });

    describe('# script resource', function() {

      var field, listeners;

      beforeEach(inject(function(elementRegistry, selection, propertiesPanel) {

        // given
        var item = elementRegistry.get('PlanItem_HumanTask_Script_EXTERNAL');
        selection.select(item);

        var bo = item.businessObject.definitionRef;
        listeners = getTaskListeners(bo.get('extensionElements'));

        field = getInput(propertiesPanel._container, 'resource');

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
          expect(field.value).to.equal('myScript.js');
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
          expect(listeners[0].get('script').get('resource')).to.equal('FOO');
        });

        it('should undo', inject(function(commandStack) {
          // when
          commandStack.undo();

          // then
          expect(listeners[0].get('script').get('resource')).to.equal('myScript.js');
        }));

        it('should redo', inject(function(commandStack) {
          // when
          commandStack.undo();
          commandStack.redo();

          // then
          expect(listeners[0].get('script').get('resource')).to.equal('FOO');
        }));

      });

    });


  });


});
