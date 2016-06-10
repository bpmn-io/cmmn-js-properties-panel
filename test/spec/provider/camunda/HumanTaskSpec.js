'use strict';

var TestHelper = require('../../../TestHelper');

var TestContainer = require('mocha-test-container-support');

/* global bootstrapModeler, inject */

var propertiesPanelModule = require('../../../../lib'),
    domQuery = require('min-dom/lib/query'),
    coreModule = require('cmmn-js/lib/core'),
    selectionModule = require('diagram-js/lib/features/selection'),
    modelingModule = require('cmmn-js/lib/features/modeling'),
    propertiesProviderModule = require('../../../../lib/provider/camunda'),
    camundaModdlePackage = require('camunda-cmmn-moddle/resources/camunda');


function getInput(container, selector) {
  return domQuery('input[name=' + selector + ']', container);
}

function getClearButton(container, selector) {
  return domQuery('div[data-entry=' + selector + '] button[data-action=clear]', container);
}


describe('human-task-properties', function() {

  var diagramXML = require('./HumanTask.cmmn');

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

    var bo;

    beforeEach(inject(function(elementRegistry, selection) {

      // given
      var item = elementRegistry.get('PlanItem_WITH_PROPERTIES');
      selection.select(item);

      bo = item.businessObject.definitionRef;

    }));


    it('should fetch the formKey of a human task definition', inject(function(propertiesPanel) {

      var field = getInput(propertiesPanel._container, 'formKey');

      // when selecting element

      // then
      expect(field.value).to.equal(bo.get('formKey'));

    }));


    it('should fetch the assignee of a human task definition', inject(function(propertiesPanel) {

      var field = getInput(propertiesPanel._container, 'assignee');

      // when selecting element

      // then
      expect(field.value).to.equal(bo.get('assignee'));

    }));


    it('should fetch the candidateUsers of a human task definition', inject(function(propertiesPanel) {

      var field = getInput(propertiesPanel._container, 'candidateUsers');

      // when selecting element

      // then
      expect(field.value).to.equal(bo.get('candidateUsers'));

    }));


    it('should fetch the candidateGroups of a human task definition', inject(function(propertiesPanel) {

      var field = getInput(propertiesPanel._container, 'candidateGroups');

      // when selecting element

      // then
      expect(field.value).to.equal(bo.get('candidateGroups'));

    }));


    it('should fetch the dueDate of a human task definition', inject(function(propertiesPanel) {

      var field = getInput(propertiesPanel._container, 'dueDate');

      // when selecting element

      // then
      expect(field.value).to.equal(bo.get('dueDate'));

    }));


    it('should fetch the followUpDate of a human task definition', inject(function(propertiesPanel) {

      var field = getInput(propertiesPanel._container, 'followUpDate');

      // when selecting element

      // then
      expect(field.value).to.equal(bo.get('followUpDate'));

    }));


    it('should fetch the priority of a human task definition', inject(function(propertiesPanel) {

      var field = getInput(propertiesPanel._container, 'priority');

      // when selecting element

      // then
      expect(field.value).to.equal(bo.get('priority'));

    }));

  });


  describe('set', function() {

    describe('# formKey', function() {

      var bo, field;

      beforeEach(inject(function(elementRegistry, selection, propertiesPanel) {

        // given
        var item = elementRegistry.get('PlanItem_WITH_PROPERTIES');
        selection.select(item);

        bo = item.businessObject.definitionRef;

        field = getInput(propertiesPanel._container, 'formKey');

        // when
        TestHelper.triggerValue(field, 'foo.html', 'change');

      }));


      describe('in the DOM', function() {

        it('should execute', function() {
          expect(field.value).to.equal('foo.html');
        });

        it('should undo', inject(function(commandStack) {
          // when
          commandStack.undo();

          // then
          expect(field.value).to.equal('someForm.html');
        }));


        it('should redo', inject(function(commandStack) {
          // when
          commandStack.undo();
          commandStack.redo();

          // then
          expect(field.value).to.equal('foo.html');
        }));

      });

      describe('on the business object', function() {

        it('should execute', function() {
          expect(bo.get('formKey')).to.equal('foo.html');
        });

        it('should undo', inject(function(commandStack) {
          // when
          commandStack.undo();

          // then
          expect(bo.get('formKey')).to.equal('someForm.html');
        }));


        it('should redo', inject(function(commandStack) {
          // when
          commandStack.undo();
          commandStack.redo();

          // then
          expect(bo.get('formKey')).to.equal('foo.html');
        }));

      });

    });


    describe('# assignee', function() {

      var bo, field;

      beforeEach(inject(function(elementRegistry, selection, propertiesPanel) {

        // given
        var item = elementRegistry.get('PlanItem_WITHOUT_PROPERTIES');
        selection.select(item);

        bo = item.businessObject.definitionRef;

        field = getInput(propertiesPanel._container, 'assignee');

        expect(field.value).is.empty;
        expect(bo.get('assignee')).to.be.undefined;

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
          expect(field.value).is.empty;
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
          expect(bo.get('assignee')).to.equal('foo');
        });

        it('should undo', inject(function(commandStack) {
          // when
          commandStack.undo();

          // then
          expect(bo.get('assignee')).to.be.undefined;
        }));


        it('should redo', inject(function(commandStack) {
          // when
          commandStack.undo();
          commandStack.redo();

          // then
          expect(bo.get('assignee')).to.equal('foo');
        }));

      });

    });


    describe('# candidateUsers', function() {

      var bo, field;

      beforeEach(inject(function(elementRegistry, selection, propertiesPanel) {

        // given
        var item = elementRegistry.get('PlanItem_WITH_PROPERTIES');
        selection.select(item);

        bo = item.businessObject.definitionRef;

        field = getInput(propertiesPanel._container, 'candidateUsers');

        // when
        TestHelper.triggerValue(field, 'FOO', 'change');

      }));


      describe('in the DOM', function() {

        it('should execute', function() {
          // then
          expect(field.value).to.equal('FOO');
        });

        it('should undo', inject(function(commandStack) {
          // when
          commandStack.undo();

          // then
          expect(field.value).to.equal('users');
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
          // then
          expect(bo.get('candidateUsers')).to.equal('FOO');
        });

        it('should undo', inject(function(commandStack) {
          // when
          commandStack.undo();

          // then
          expect(bo.get('candidateUsers')).to.equal('users');
        }));


        it('should redo', inject(function(commandStack) {
          // when
          commandStack.undo();
          commandStack.redo();

          // then
          expect(bo.get('candidateUsers')).to.equal('FOO');
        }));

      });

    });


    describe('# candidateGroups', function() {

      var bo, field;

      beforeEach(inject(function(elementRegistry, selection, propertiesPanel) {

        // given
        var item = elementRegistry.get('PlanItem_WITH_PROPERTIES');
        selection.select(item);

        bo = item.businessObject.definitionRef;

        field = getInput(propertiesPanel._container, 'candidateGroups');

        // when
        TestHelper.triggerValue(field, 'FOO', 'change');

      }));


      describe('in the DOM', function() {

        it('should execute', function() {
          // then
          expect(field.value).to.equal('FOO');
        });

        it('should undo', inject(function(commandStack) {
          // when
          commandStack.undo();

          // then
          expect(field.value).to.equal('groups');
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
          // then
          expect(bo.get('candidateGroups')).to.equal('FOO');
        });

        it('should undo', inject(function(commandStack) {
          // when
          commandStack.undo();

          // then
          expect(bo.get('candidateGroups')).to.equal('groups');
        }));


        it('should redo', inject(function(commandStack) {
          // when
          commandStack.undo();
          commandStack.redo();

          // then
          expect(bo.get('candidateGroups')).to.equal('FOO');
        }));

      });

    });


    describe('# dueDate', function() {

      var bo, field;

      beforeEach(inject(function(elementRegistry, selection, propertiesPanel) {

        // given
        var item = elementRegistry.get('PlanItem_WITH_PROPERTIES');
        selection.select(item);

        bo = item.businessObject.definitionRef;

        field = getInput(propertiesPanel._container, 'dueDate');

        // when
        TestHelper.triggerValue(field, 'FOO', 'change');

      }));


      describe('in the DOM', function() {

        it('should execute', function() {
          // then
          expect(field.value).to.equal('FOO');
        });

        it('should undo', inject(function(commandStack) {
          // when
          commandStack.undo();

          // then
          expect(field.value).to.equal('${dueDateVar}');
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
          // then
          expect(bo.get('dueDate')).to.equal('FOO');
        });

        it('should undo', inject(function(commandStack) {
          // when
          commandStack.undo();

          // then
          expect(bo.get('dueDate')).to.equal('${dueDateVar}');
        }));


        it('should redo', inject(function(commandStack) {
          // when
          commandStack.undo();
          commandStack.redo();

          // then
          expect(bo.get('dueDate')).to.equal('FOO');
        }));

      });

    });


    describe('# followUpDate', function() {

      var bo, field;

      beforeEach(inject(function(elementRegistry, selection, propertiesPanel) {

        // given
        var item = elementRegistry.get('PlanItem_WITH_PROPERTIES');
        selection.select(item);

        bo = item.businessObject.definitionRef;

        field = getInput(propertiesPanel._container, 'followUpDate');

        // when
        TestHelper.triggerValue(field, 'FOO', 'change');

      }));


      describe('in the DOM', function() {

        it('should execute', function() {
          // then
          expect(field.value).to.equal('FOO');
        });

        it('should undo', inject(function(commandStack) {
          // when
          commandStack.undo();

          // then
          expect(field.value).to.equal('${followUpDateVar}');
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
          // then
          expect(bo.get('followUpDate')).to.equal('FOO');
        });

        it('should undo', inject(function(commandStack) {
          // when
          commandStack.undo();

          // then
          expect(bo.get('followUpDate')).to.equal('${followUpDateVar}');
        }));


        it('should redo', inject(function(commandStack) {
          // when
          commandStack.undo();
          commandStack.redo();

          // then
          expect(bo.get('followUpDate')).to.equal('FOO');
        }));

      });

    });


    describe('# priority', function() {

      var bo, field;

      beforeEach(inject(function(elementRegistry, selection, propertiesPanel) {

        // given
        var item = elementRegistry.get('PlanItem_WITH_PROPERTIES');
        selection.select(item);

        bo = item.businessObject.definitionRef;

        field = getInput(propertiesPanel._container, 'priority');

        // when
        TestHelper.triggerValue(field, 'FOO', 'change');

      }));


      describe('in the DOM', function() {

        it('should execute', function() {
          // then
          expect(field.value).to.equal('FOO');
        });

        it('should undo', inject(function(commandStack) {
          // when
          commandStack.undo();

          // then
          expect(field.value).to.equal('${priority}');
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
          // then
          expect(bo.get('priority')).to.equal('FOO');
        });

        it('should undo', inject(function(commandStack) {
          // when
          commandStack.undo();

          // then
          expect(bo.get('priority')).to.equal('${priority}');
        }));


        it('should redo', inject(function(commandStack) {
          // when
          commandStack.undo();
          commandStack.redo();

          // then
          expect(bo.get('priority')).to.equal('FOO');
        }));

      });

    });

  });


  describe('remove', function() {

    describe('should remove the formKey for a human task definition', function() {

      var bo, field;

      beforeEach(inject(function(elementRegistry, selection, propertiesPanel) {

        // given
        var item = elementRegistry.get('PlanItem_WITH_PROPERTIES');
        selection.select(item);

        bo = item.businessObject.definitionRef;

        field = getInput(propertiesPanel._container, 'formKey');

        // when
        TestHelper.triggerValue(field, '', 'change');

      }));


      describe('in the DOM', function() {

        it('should execute', function() {
          expect(field.value).is.empty;
        });

        it('should undo', inject(function(commandStack) {
          // when
          commandStack.undo();

          // then
          expect(field.value).to.equal('someForm.html');
        }));


        it('should redo', inject(function(commandStack) {
          // when
          commandStack.undo();
          commandStack.redo();

          // then
          expect(field.value).is.empty;
        }));

      });

      describe('on the business object', function() {

        it('should execute', function() {
          expect(bo.get('formKey')).to.be.undefined;
        });

        it('should undo', inject(function(commandStack) {
          // when
          commandStack.undo();

          // then
          expect(bo.get('formKey')).to.equal('someForm.html');
        }));


        it('should redo', inject(function(commandStack) {
          // when
          commandStack.undo();
          commandStack.redo();

          // then
          expect(bo.get('formKey')).to.be.undefined;
        }));

      });

    });


    describe('should clear the assignee for a human task definition', function() {

      var bo, field;

      beforeEach(inject(function(elementRegistry, selection, propertiesPanel) {

        // given
        var item = elementRegistry.get('PlanItem_WITH_PROPERTIES');
        selection.select(item);

        bo = item.businessObject.definitionRef;

        field = getInput(propertiesPanel._container, 'assignee');
        var button = getClearButton(propertiesPanel._container, 'assignee');

        // when
        TestHelper.triggerEvent(button, 'click');

      }));


      describe('in the DOM', function() {

        it('should execute', function() {
          expect(field.value).is.empty;
        });

        it('should undo', inject(function(commandStack) {
          // when
          commandStack.undo();

          // then
          expect(field.value).to.equal('demo');
        }));


        it('should redo', inject(function(commandStack) {
          // when
          commandStack.undo();
          commandStack.redo();

          // then
          expect(field.value).is.empty;
        }));

      });

      describe('on the business object', function() {

        it('should execute', function() {
          expect(bo.get('assignee')).to.be.undefined;
        });

        it('should undo', inject(function(commandStack) {
          // when
          commandStack.undo();

          // then
          expect(bo.get('assignee')).to.equal('demo');
        }));


        it('should redo', inject(function(commandStack) {
          // when
          commandStack.undo();
          commandStack.redo();

          // then
          expect(bo.get('demo')).to.be.undefined;
        }));

      });

    });

  });


});
