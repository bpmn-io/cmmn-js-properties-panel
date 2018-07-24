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
    getBusinessObject = require('cmmn-js/lib/util/ModelUtil').getBusinessObject,
    getDefinition = require('cmmn-js/lib/util/ModelUtil').getDefinition;

var find = require('lodash/find');

function getRepeatOnStandardEventSelect(container, entryProp) {
  var entry = domQuery('div[data-entry=' + entryProp + ']', container);
  return domQuery('select[name=repeatOnStandardEvent]', entry);
}

function getItemControlRepeatOnStandardEvent(container) {
  return getRepeatOnStandardEventSelect(container, 'itemControlRepeatOnStandardEvent');
}

function getDefaultControlRepeatOnStandardEvent(container) {
  return getRepeatOnStandardEventSelect(container, 'defaultControlRepeatOnStandardEvent');
}

function getItemControl(element) {
  var bo = getBusinessObject(element);
  return bo.get('itemControl');
}

function getDefaultControl(element) {
  var definition = getDefinition(element);
  return definition.get('defaultControl');
}

function getItemControlRepetitionRule(element) {
  var itemControl = getItemControl(element);
  return itemControl.get('repetitionRule');
}

function getDefaultControlRepetitionRule(element) {
  var defaultControl = getDefaultControl(element);
  return defaultControl.get('repetitionRule');
}

var isContainedIn = function(values, value) {
  return find(values, function(elem) {
    return elem.value === value;
  });
};

describe('repeat-on-standard-event-properties', function() {

  var diagramXML = require('./RepeatOnStandardEvent.cmmn');

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

    var shape, rule, field;

    beforeEach(inject(function(elementRegistry, selection) {

      // given
      shape = elementRegistry.get('PI_Task_1');
      selection.select(shape);

    }));

    describe('# itemControl', function() {

      it('should fetch repeatOnStandardEvent', inject(function(propertiesPanel) {

        // when selecting element

        // then
        rule = getItemControlRepetitionRule(shape);
        field = getItemControlRepeatOnStandardEvent(propertiesPanel._container);
        expect(field.value).to.equal(rule.get('camunda:repeatOnStandardEvent'));

      }));


      it('should fetch repeat on standard events', inject(function(propertiesPanel) {

        // when selecting element

        // then
        field = getItemControlRepeatOnStandardEvent(propertiesPanel._container);

        expect(field.options).to.have.length(9);
        expect(isContainedIn(field.options, 'create')).to.be.ok;
        expect(isContainedIn(field.options, 'enable')).to.be.ok;
        expect(isContainedIn(field.options, 'disable')).to.be.ok;
        expect(isContainedIn(field.options, 'reenable')).to.be.ok;
        expect(isContainedIn(field.options, 'manualStart')).to.be.ok;
        expect(isContainedIn(field.options, 'start')).to.be.ok;
        expect(isContainedIn(field.options, 'complete')).to.be.ok;
        expect(isContainedIn(field.options, 'exit')).to.be.ok;

      }));

    });


    describe('# defaultControl', function() {

      it('should fetch repeatOnStandardEvent', inject(function(propertiesPanel) {

        // when selecting element

        // then
        rule = getDefaultControlRepetitionRule(shape);
        field = getDefaultControlRepeatOnStandardEvent(propertiesPanel._container);
        expect(field.value).to.equal(rule.get('camunda:repeatOnStandardEvent'));

      }));


      it('should fetch repeat on standard events', inject(function(propertiesPanel) {

        // when selecting element

        // then
        field = getDefaultControlRepeatOnStandardEvent(propertiesPanel._container);
        expect(field.options).to.have.length(9);
        expect(isContainedIn(field.options, 'create')).to.be.ok;
        expect(isContainedIn(field.options, 'enable')).to.be.ok;
        expect(isContainedIn(field.options, 'disable')).to.be.ok;
        expect(isContainedIn(field.options, 'reenable')).to.be.ok;
        expect(isContainedIn(field.options, 'manualStart')).to.be.ok;
        expect(isContainedIn(field.options, 'start')).to.be.ok;
        expect(isContainedIn(field.options, 'complete')).to.be.ok;
        expect(isContainedIn(field.options, 'exit')).to.be.ok;

      }));

    });

  });


  describe('set', function() {

    var shape, rule, field;

    describe('should change', function() {

      beforeEach(inject(function(elementRegistry, selection) {

        // given
        shape = elementRegistry.get('PI_Task_1');
        selection.select(shape);

      }));

      describe('# itemControl', function() {

        beforeEach(inject(function(propertiesPanel) {

          // given
          field = getItemControlRepeatOnStandardEvent(propertiesPanel._container);
          rule = getItemControlRepetitionRule(shape);

          // when
          TestHelper.selectedByOption(field, 'exit');
          TestHelper.triggerEvent(field, 'change');

        }));

        describe('in the DOM', function() {

          it('should execute', function() {
            // then
            expect(field.value).to.equal('exit');
          });


          it('should undo', inject(function(commandStack) {
            // when
            commandStack.undo();

            // then
            expect(field.value).to.equal('complete');
          }));


          it('should redo', inject(function(commandStack) {
            // when
            commandStack.undo();
            commandStack.redo();

            // then
            expect(field.value).to.equal('exit');
          }));

        });

        describe('on the business object', function() {

          it('should execute', function() {
            // then
            expect(rule.get('camunda:repeatOnStandardEvent')).to.equal('exit');
          });


          it('should undo', inject(function(commandStack) {
            // when
            commandStack.undo();

            // then
            expect(rule.get('camunda:repeatOnStandardEvent')).to.equal('complete');
          }));


          it('should redo', inject(function(commandStack) {
            // when
            commandStack.undo();
            commandStack.redo();

            // then
            expect(rule.get('camunda:repeatOnStandardEvent')).to.equal('exit');
          }));

        });

      });


      describe('# defaultControl', function() {

        beforeEach(inject(function(propertiesPanel) {

          // given
          field = getDefaultControlRepeatOnStandardEvent(propertiesPanel._container);
          rule = getDefaultControlRepetitionRule(shape);

          // when
          TestHelper.selectedByOption(field, 'exit');
          TestHelper.triggerEvent(field, 'change');

        }));

        describe('in the DOM', function() {

          it('should execute', function() {
            // then
            expect(field.value).to.equal('exit');
          });


          it('should undo', inject(function(commandStack) {
            // when
            commandStack.undo();

            // then
            expect(field.value).to.equal('complete');
          }));


          it('should redo', inject(function(commandStack) {
            // when
            commandStack.undo();
            commandStack.redo();

            // then
            expect(field.value).to.equal('exit');
          }));

        });

        describe('on the business object', function() {

          it('should execute', function() {
            // then
            expect(rule.get('camunda:repeatOnStandardEvent')).to.equal('exit');
          });


          it('should undo', inject(function(commandStack) {
            // when
            commandStack.undo();

            // then
            expect(rule.get('camunda:repeatOnStandardEvent')).to.equal('complete');
          }));


          it('should redo', inject(function(commandStack) {
            // when
            commandStack.undo();
            commandStack.redo();

            // then
            expect(rule.get('camunda:repeatOnStandardEvent')).to.equal('exit');
          }));

        });

      });
    });


    describe('should remove', function() {

      beforeEach(inject(function(elementRegistry, selection) {

        // given
        shape = elementRegistry.get('PI_Task_1');
        selection.select(shape);

      }));

      describe('# itemControl', function() {

        beforeEach(inject(function(propertiesPanel) {

          // given
          field = getItemControlRepeatOnStandardEvent(propertiesPanel._container);
          rule = getItemControlRepetitionRule(shape);

          // when
          TestHelper.selectedByOption(field, '');
          TestHelper.triggerEvent(field, 'change');

        }));

        describe('in the DOM', function() {

          it('should execute', function() {
            // then
            expect(field.value).to.equal('');
          });


          it('should undo', inject(function(commandStack) {
            // when
            commandStack.undo();

            // then
            expect(field.value).to.equal('complete');
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
            // then
            expect(rule.get('camunda:repeatOnStandardEvent')).not.to.exist;
          });


          it('should undo', inject(function(commandStack) {
            // when
            commandStack.undo();

            // then
            expect(rule.get('camunda:repeatOnStandardEvent')).to.equal('complete');
          }));


          it('should redo', inject(function(commandStack) {
            // when
            commandStack.undo();
            commandStack.redo();

            // then
            expect(rule.get('camunda:repeatOnStandardEvent')).not.to.exist;
          }));

        });

      });


      describe('# defaultControl', function() {

        beforeEach(inject(function(propertiesPanel) {

          // given
          field = getDefaultControlRepeatOnStandardEvent(propertiesPanel._container);
          rule = getDefaultControlRepetitionRule(shape);

          // when
          TestHelper.selectedByOption(field, '');
          TestHelper.triggerEvent(field, 'change');

        }));

        describe('in the DOM', function() {

          it('should execute', function() {
            // then
            expect(field.value).to.equal('');
          });


          it('should undo', inject(function(commandStack) {
            // when
            commandStack.undo();

            // then
            expect(field.value).to.equal('complete');
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
            // then
            expect(rule.get('camunda:repeatOnStandardEvent')).not.to.exist;
          });


          it('should undo', inject(function(commandStack) {
            // when
            commandStack.undo();

            // then
            expect(rule.get('camunda:repeatOnStandardEvent')).to.equal('complete');
          }));


          it('should redo', inject(function(commandStack) {
            // when
            commandStack.undo();
            commandStack.redo();

            // then
            expect(rule.get('camunda:repeatOnStandardEvent')).not.to.exist;
          }));

        });

      });

    });


    describe('should init', function() {

      beforeEach(inject(function(elementRegistry, selection) {

        // given
        shape = elementRegistry.get('PI_Task_2');
        selection.select(shape);

      }));

      describe('# itemControl', function() {

        beforeEach(inject(function(propertiesPanel) {

          // given
          field = getItemControlRepeatOnStandardEvent(propertiesPanel._container);
          rule = getItemControlRepetitionRule(shape);

          // when
          TestHelper.selectedByOption(field, 'exit');
          TestHelper.triggerEvent(field, 'change');

        }));

        describe('in the DOM', function() {

          it('should execute', function() {
            // then
            expect(field.value).to.equal('exit');
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
            expect(field.value).to.equal('exit');
          }));

        });

        describe('on the business object', function() {

          it('should execute', function() {
            // then
            expect(rule.get('camunda:repeatOnStandardEvent')).to.equal('exit');
          });


          it('should undo', inject(function(commandStack) {
            // when
            commandStack.undo();

            // then
            expect(rule.get('camunda:repeatOnStandardEvent')).not.to.exist;
          }));


          it('should redo', inject(function(commandStack) {
            // when
            commandStack.undo();
            commandStack.redo();

            // then
            expect(rule.get('camunda:repeatOnStandardEvent')).to.equal('exit');
          }));

        });

      });


      describe('# defaultControl', function() {

        beforeEach(inject(function(propertiesPanel) {

          // given
          field = getDefaultControlRepeatOnStandardEvent(propertiesPanel._container);
          rule = getDefaultControlRepetitionRule(shape);

          // when
          TestHelper.selectedByOption(field, 'exit');
          TestHelper.triggerEvent(field, 'change');

        }));

        describe('in the DOM', function() {

          it('should execute', function() {
            // then
            expect(field.value).to.equal('exit');
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
            expect(field.value).to.equal('exit');
          }));

        });

        describe('on the business object', function() {

          it('should execute', function() {
            // then
            expect(rule.get('camunda:repeatOnStandardEvent')).to.equal('exit');
          });


          it('should undo', inject(function(commandStack) {
            // when
            commandStack.undo();

            // then
            expect(rule.get('camunda:repeatOnStandardEvent')).not.to.exist;
          }));


          it('should redo', inject(function(commandStack) {
            // when
            commandStack.undo();
            commandStack.redo();

            // then
            expect(rule.get('camunda:repeatOnStandardEvent')).to.equal('exit');
          }));

        });

      });

    });

  });

  describe('validation', function() {

    describe('warnings', function() {


      it('should NOT show that event is ignored on item control repetition rule',
        inject(function(elementRegistry, selection, propertiesPanel) {

          // given
          var shape = elementRegistry.get('PI_Task_1');
          selection.select(shape);

          var field = getItemControlRepeatOnStandardEvent(propertiesPanel._container);

          // when selecting element

          // then
          expect(domClasses(field).has('warning')).to.be.false;

        })
      );

      it('should show that event is ignored on item control repetition rule',
        inject(function(elementRegistry, selection, propertiesPanel) {

          // given
          var shape = elementRegistry.get('PI_Task_3');
          selection.select(shape);

          var field = getItemControlRepeatOnStandardEvent(propertiesPanel._container);

          // when selecting element

          // then
          expect(domClasses(field).has('warning')).to.be.true;

        })
      );


      it('should NOT show that event is ignored on default control repetition rule',
        inject(function(elementRegistry, selection, propertiesPanel) {

          // given
          var shape = elementRegistry.get('PI_Task_5');
          selection.select(shape);

          var field = getDefaultControlRepeatOnStandardEvent(propertiesPanel._container);

          // when selecting element

          // then
          expect(domClasses(field).has('warning')).to.be.false;

        })
      );

      it('should show that event is ignored on default control repetition rule',
        inject(function(elementRegistry, selection, propertiesPanel) {

          // given
          var shape = elementRegistry.get('PI_Task_4');
          selection.select(shape);

          var field = getDefaultControlRepeatOnStandardEvent(propertiesPanel._container);

          // when selecting element

          // then
          expect(domClasses(field).has('warning')).to.be.true;

        })
      );


      it('should NOT show that event is overwritten',
        inject(function(elementRegistry, selection, propertiesPanel) {

          // given
          var shape = elementRegistry.get('PI_Task_5');
          selection.select(shape);

          var field = getDefaultControlRepeatOnStandardEvent(propertiesPanel._container);

          // when selecting element

          // then
          expect(domClasses(field).has('warning')).to.be.false;

        })
      );

      it('should show that event is overwritten',
        inject(function(elementRegistry, selection, propertiesPanel) {

          // given
          var shape = elementRegistry.get('PI_Task_1');
          selection.select(shape);

          var field = getDefaultControlRepeatOnStandardEvent(propertiesPanel._container);

          // when selecting element

          // then
          expect(domClasses(field).has('warning')).to.be.true;

        })
      );

    });

  });

});