'use strict';

var TestHelper = require('../../../TestHelper');

var TestContainer = require('mocha-test-container-support');

/* global bootstrapModeler, inject */

var propertiesPanelModule = require('lib'),
    domClasses = require('min-dom').classes,
    domQuery = require('min-dom').query,
    coreModule = require('cmmn-js/lib/core'),
    selectionModule = require('diagram-js/lib/features/selection').default,
    modelingModule = require('cmmn-js/lib/features/modeling'),
    propertiesProviderModule = require('lib/provider/cmmn');

var find = require('lodash/find');

function getCheckbox(container, selector) {
  return domQuery('input[' + selector + ']', container);
}

function getSelect(container, selector) {
  return domQuery('select[' + selector + ']', container);
}

function getStandardEventSelect(container) {
  return getSelect(domQuery('div[data-entry=onPartStandardEvent]', container), 'name=standardEvent');
}

function getIsStandardEventVisibleCheckbox(container) {
  return getCheckbox(
    domQuery('div[data-entry=onPartIsStandardEventVisible]', container),
    'name=isStandardEventVisible'
  );
}

var isContainedIn = function(values, value) {
  return find(values, function(elem) {
    return elem.value === value;
  });
};

describe('onPart-properties', function() {

  var diagramXML = require('./OnPart.cmmn');

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

    var onPart, field, bo;

    describe('# standardEvent', function() {

      it('should fetch the standard event of plan item on part',
        inject(function(elementRegistry, selection, propertiesPanel) {

          // given
          onPart = elementRegistry.get('PlanItemOnPart_1_Task_di');
          selection.select(onPart);

          field = getStandardEventSelect(propertiesPanel._container);
          bo = onPart.businessObject.cmmnElementRef;

          // when selecting element

          // then
          expect(field.value).to.equal(bo.get('standardEvent'));

        })
      );


      it('should fetch the standard event of case file item on part',
        inject(function(elementRegistry, selection, propertiesPanel) {

          // given
          onPart = elementRegistry.get('CaseFileItemOnPart_1_di');
          selection.select(onPart);

          field = getStandardEventSelect(propertiesPanel._container);
          bo = onPart.businessObject.cmmnElementRef;

          // when selecting element

          // then
          expect(field.value).to.equal(bo.get('standardEvent'));

        })
      );

      it('should fetch standard events for task',
        inject(function(elementRegistry, selection, propertiesPanel) {

          // given
          onPart = elementRegistry.get('PlanItemOnPart_1_Task_di');
          selection.select(onPart);

          field = getStandardEventSelect(propertiesPanel._container);

          // when selecting element

          // then
          expect(field.options).to.have.length(16);
          expect(isContainedIn(field.options, 'complete')).to.be.ok;
          expect(isContainedIn(field.options, 'create')).to.be.ok;
          expect(isContainedIn(field.options, 'disable')).to.be.ok;
          expect(isContainedIn(field.options, 'enable')).to.be.ok;
          expect(isContainedIn(field.options, 'exit')).to.be.ok;
          expect(isContainedIn(field.options, 'fault')).to.be.ok;
          expect(isContainedIn(field.options, 'manualStart')).to.be.ok;
          expect(isContainedIn(field.options, 'parentResume')).to.be.ok;
          expect(isContainedIn(field.options, 'parentSuspend')).to.be.ok;
          expect(isContainedIn(field.options, 'reactivate')).to.be.ok;
          expect(isContainedIn(field.options, 'reenable')).to.be.ok;
          expect(isContainedIn(field.options, 'resume')).to.be.ok;
          expect(isContainedIn(field.options, 'start')).to.be.ok;
          expect(isContainedIn(field.options, 'suspend')).to.be.ok;
          expect(isContainedIn(field.options, 'terminate')).to.be.ok;

        })
      );


      it('should fetch standard events for milestone',
        inject(function(elementRegistry, selection, propertiesPanel) {

          // given
          onPart = elementRegistry.get('PlanItemOnPart_2_Milestone_di');
          selection.select(onPart);

          field = getStandardEventSelect(propertiesPanel._container);

          // when selecting element

          // then
          expect(field.options).to.have.length(6);
          expect(isContainedIn(field.options, 'create')).to.be.ok;
          expect(isContainedIn(field.options, 'occur')).to.be.ok;
          expect(isContainedIn(field.options, 'resume')).to.be.ok;
          expect(isContainedIn(field.options, 'suspend')).to.be.ok;
          expect(isContainedIn(field.options, 'terminate')).to.be.ok;

        })
      );


      it('should fetch standard events for event listener',
        inject(function(elementRegistry, selection, propertiesPanel) {

          // given
          onPart = elementRegistry.get('PlanItemOnPart_3_EventListener_di');
          selection.select(onPart);

          field = getStandardEventSelect(propertiesPanel._container);

          // when selecting element

          // then
          expect(field.options).to.have.length(6);
          expect(isContainedIn(field.options, 'create')).to.be.ok;
          expect(isContainedIn(field.options, 'occur')).to.be.ok;
          expect(isContainedIn(field.options, 'resume')).to.be.ok;
          expect(isContainedIn(field.options, 'suspend')).to.be.ok;
          expect(isContainedIn(field.options, 'terminate')).to.be.ok;

        })
      );


      it('should fetch standard events for case file item',
        inject(function(elementRegistry, selection, propertiesPanel) {

          // given
          onPart = elementRegistry.get('CaseFileItemOnPart_1_di');
          selection.select(onPart);

          field = getStandardEventSelect(propertiesPanel._container);

          // when selecting element

          // then
          expect(field.options).to.have.length(9);
          expect(isContainedIn(field.options, 'addChild')).to.be.ok;
          expect(isContainedIn(field.options, 'addReference')).to.be.ok;
          expect(isContainedIn(field.options, 'create')).to.be.ok;
          expect(isContainedIn(field.options, 'delete')).to.be.ok;
          expect(isContainedIn(field.options, 'removeChild')).to.be.ok;
          expect(isContainedIn(field.options, 'removeReference')).to.be.ok;
          expect(isContainedIn(field.options, 'replace')).to.be.ok;
          expect(isContainedIn(field.options, 'update')).to.be.ok;

        })
      );

    });


    describe('# isStandardEventVisible', function() {

      it('should fetch is standard event visible (=true)',
        inject(function(elementRegistry, selection, propertiesPanel) {

          // given
          onPart = elementRegistry.get('STANDARD_EVENT_VISIBLE_TRUE_di');
          selection.select(onPart);

          field = getIsStandardEventVisibleCheckbox(propertiesPanel._container);
          bo = onPart.businessObject;

          // when selecting element

          // then
          expect(field.checked).to.equal(bo.get('isStandardEventVisible'));

        })
      );


      it('should fetch is standard event visible (=false)',
        inject(function(elementRegistry, selection, propertiesPanel) {

          // given
          onPart = elementRegistry.get('STANDARD_EVENT_VISIBLE_FALSE_di');
          selection.select(onPart);

          field = getIsStandardEventVisibleCheckbox(propertiesPanel._container);
          bo = onPart.businessObject;

          // when selecting element

          // then
          expect(field.checked).to.equal(bo.get('isStandardEventVisible'));

        })
      );


      it('should fetch is standard event visible (=undefined)',
        inject(function(elementRegistry, selection, propertiesPanel) {

          // given
          onPart = elementRegistry.get('STANDARD_EVENT_VISIBLE_FALSE_di');
          selection.select(onPart);

          field = getIsStandardEventVisibleCheckbox(propertiesPanel._container);
          bo = onPart.businessObject;

          // when selecting element

          // then
          expect(field.checked).to.be.false;

        })
      );

    });

  });


  describe('set', function() {

    var onPart, field, bo;

    describe('# standardEvent', function() {

      describe('should set standard event', function() {

        beforeEach(inject(function(elementRegistry, selection, propertiesPanel) {

          // given
          onPart = elementRegistry.get('PlanItemOnPart_1_Task_di');
          selection.select(onPart);

          bo = onPart.businessObject.cmmnElementRef;
          field = getStandardEventSelect(propertiesPanel._container);

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
            expect(bo.get('standardEvent')).to.equal('exit');
          });

          it('should undo', inject(function(commandStack) {
            // when
            commandStack.undo();

            // then
            expect(bo.get('standardEvent')).to.equal('complete');
          }));


          it('should redo', inject(function(commandStack) {
            // when
            commandStack.undo();
            commandStack.redo();

            // then
            expect(bo.get('standardEvent')).to.equal('exit');
          }));

        });

      });

    });

    describe('# isStandardEventVisible', function() {

      describe('should set is standard event visible to false', function() {

        beforeEach(inject(function(elementRegistry, selection, propertiesPanel) {

          // given
          onPart = elementRegistry.get('STANDARD_EVENT_VISIBLE_TRUE_di');
          selection.select(onPart);

          field = getIsStandardEventVisibleCheckbox(propertiesPanel._container);
          bo = onPart.businessObject;

          // when
          TestHelper.triggerEvent(field, 'click');

        }));

        describe('in the DOM', function() {

          it('should execute', function() {
            // then
            expect(field.checked).to.be.false;
          });

          it('should undo', inject(function(commandStack) {
            // when
            commandStack.undo();

            // then
            expect(field.checked).to.be.true;
          }));


          it('should redo', inject(function(commandStack) {
            // when
            commandStack.undo();
            commandStack.redo();

            // then
            expect(field.checked).to.be.false;
          }));

        });

        describe('on the business object', function() {

          it('should execute', function() {
            // then
            expect(bo.get('isStandardEventVisible')).to.be.false;
          });

          it('should undo', inject(function(commandStack) {
            // when
            commandStack.undo();

            // then
            expect(bo.get('isStandardEventVisible')).to.be.true;
          }));


          it('should redo', inject(function(commandStack) {
            // when
            commandStack.undo();
            commandStack.redo();

            // then
            expect(bo.get('isStandardEventVisible')).to.be.false;
          }));

        });

      });


      describe('should set is standard event visible to true', function() {

        beforeEach(inject(function(elementRegistry, selection, propertiesPanel) {

          // given
          onPart = elementRegistry.get('STANDARD_EVENT_VISIBLE_FALSE_di');
          selection.select(onPart);

          field = getIsStandardEventVisibleCheckbox(propertiesPanel._container);
          bo = onPart.businessObject;

          // when
          TestHelper.triggerEvent(field, 'click');

        }));

        describe('in the DOM', function() {

          it('should execute', function() {
            // then
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
            // then
            expect(bo.get('isStandardEventVisible')).to.be.true;
          });

          it('should undo', inject(function(commandStack) {
            // when
            commandStack.undo();

            // then
            expect(bo.get('isStandardEventVisible')).to.be.false;
          }));


          it('should redo', inject(function(commandStack) {
            // when
            commandStack.undo();
            commandStack.redo();

            // then
            expect(bo.get('isStandardEventVisible')).to.be.true;
          }));

        });

      });

    });

  });

  describe('validation', function() {

    var onPart, field;

    describe('# standardEvent', function() {

      describe('errors', function() {

        it('should not be shown if standard event is set',
          inject(function(elementRegistry, selection, propertiesPanel) {

            // given
            onPart = elementRegistry.get('PlanItemOnPart_1_Task_di');
            selection.select(onPart);

            field = getStandardEventSelect(propertiesPanel._container);

            // when selecting it

            // then
            expect(domClasses(field).has('invalid')).to.be.false;
          })
        );


        it('should be shown if standard event is not set',
          inject(function(elementRegistry, selection, propertiesPanel) {

            // given
            onPart = elementRegistry.get('Without_StandardEvent_di');
            selection.select(onPart);

            field = getStandardEventSelect(propertiesPanel._container);

            // when selecting it

            // then
            expect(domClasses(field).has('invalid')).to.be.true;
          })
        );


        it('should be shown if standard event gets removed',
          inject(function(elementRegistry, selection, propertiesPanel) {

            // given
            onPart = elementRegistry.get('PlanItemOnPart_1_Task_di');
            selection.select(onPart);

            field = getStandardEventSelect(propertiesPanel._container);

            // when
            TestHelper.selectedByOption(field, '');
            TestHelper.triggerEvent(field, 'change');

            // then
            expect(domClasses(field).has('invalid')).to.be.true;
          })
        );

      });

    });

  });

});
