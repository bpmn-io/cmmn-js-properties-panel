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
    propertiesProviderModule = require('lib/provider/cmmn');


function getInput(container, selector) {
  return domQuery('[' + selector + ']', container);
}

function getNameInput(container) {
  return getInput(domQuery('div[data-entry=name]', container), 'name=name');
}

function getDefinitionNameInput(container) {
  return getInput(domQuery('div[data-entry=definitionName]', container), 'name=name');
}

function getTextAnnotationNameInput(container) {
  return getInput(domQuery('div[data-entry=name]', container), 'name=text');
}

describe('name-properties', function() {

  var diagramXML = require('./Name.cmmn');

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

    var item, field, bo;

    it('should fetch the name for root', inject(function(elementRegistry, selection, propertiesPanel) {

      // given
      item = elementRegistry.get('CMMNDiagram_1');
      selection.select(item);

      field = getNameInput(propertiesPanel._container);
      bo = item.businessObject;

      // when selecting element

      // then
      expect(field.textContent).to.equal(bo.get('name'));

    }));


    it('should fetch the name for case plan model', inject(function(elementRegistry, selection, propertiesPanel) {

      // given
      item = elementRegistry.get('CasePlanModel_1');
      selection.select(item);

      field = getNameInput(propertiesPanel._container);
      bo = item.businessObject;

      // when selecting element

      // then
      expect(field.textContent).to.equal(bo.get('name'));

    }));


    it('should fetch the name for a plan item on part connection',
      inject(function(elementRegistry, selection, propertiesPanel) {

        // given
        item = elementRegistry.get('PlanItemOnPart_1_di');
        selection.select(item);

        field = getNameInput(propertiesPanel._container);
        bo = item.businessObject.cmmnElementRef;

        // when selecting element

        // then
        expect(field.textContent).to.equal(bo.get('name'));

      })
    );


    it('should fetch the name for a case file item on part connection',
      inject(function(elementRegistry, selection, propertiesPanel) {

        // given
        item = elementRegistry.get('CaseFileItemOnPart_1_di');
        selection.select(item);

        field = getNameInput(propertiesPanel._container);
        bo = item.businessObject.cmmnElementRef;

        // when selecting element

        // then
        expect(field.textContent).to.equal(bo.get('name'));

      })
    );


    it('should fetch the name from item', inject(function(elementRegistry, selection, propertiesPanel) {

      // given
      item = elementRegistry.get('PI_HumanTask_1');
      selection.select(item);

      field = getNameInput(propertiesPanel._container);
      bo = item.businessObject;

      // when selecting element

      // then
      expect(field.textContent).to.equal(bo.get('name'));

    }));


    it('should fetch the name from definition', inject(function(elementRegistry, selection, propertiesPanel) {

      // given
      item = elementRegistry.get('PI_HumanTask_2');
      selection.select(item);

      field = getNameInput(propertiesPanel._container);
      bo = item.businessObject;
      var definition = bo.definitionRef;

      // when selecting element

      // then
      expect(field.textContent).not.to.equal(bo.get('name'));
      expect(field.textContent).to.equal(definition.get('name'));

    }));


    it('should fetch the name from item (not from definition)', inject(function(elementRegistry, selection, propertiesPanel) {

      // given
      item = elementRegistry.get('PI_HumanTask_3');
      selection.select(item);

      field = getNameInput(propertiesPanel._container);
      bo = item.businessObject;

      // when selecting element

      // then
      expect(field.textContent).to.equal(bo.get('name'));

    }));


    it('should fetch the name from definition (not from item)', inject(function(elementRegistry, selection, propertiesPanel) {

      // given
      item = elementRegistry.get('PI_HumanTask_3');
      selection.select(item);

      field = getDefinitionNameInput(propertiesPanel._container);
      var definition = item.businessObject.definitionRef;

      // when selecting element

      // then
      expect(field.textContent).to.equal(definition.get('name'));

    }));


    it('should fetch the name from text annotation', inject(function(elementRegistry, selection, propertiesPanel) {

      // given
      item = elementRegistry.get('TextAnnotation_1');
      selection.select(item);

      field = getTextAnnotationNameInput(propertiesPanel._container);
      bo = item.businessObject;

      // when selecting element

      // then
      expect(field.textContent).to.equal(bo.get('text'));

    }));

  });


  describe('set', function() {

    describe('should set the name for an element', function() {

      var item, bo, field;

      describe('# root', function() {

        beforeEach(inject(function(elementRegistry, selection, propertiesPanel) {

          // given
          item = elementRegistry.get('CMMNDiagram_1');
          selection.select(item);

          bo = item.businessObject;
          field = getNameInput(propertiesPanel._container);

          // when
          TestHelper.triggerValue(field, 'foo', 'change');

        }));


        describe('in the DOM', function() {

          it('should execute', function() {
            expect(field.textContent).to.equal('foo');
          });

          it('should undo', inject(function(commandStack) {
            // when
            commandStack.undo();

            // then
            expect(field.textContent).to.equal('DIAGRAM');
          }));


          it('should redo', inject(function(commandStack) {
            // when
            commandStack.undo();
            commandStack.redo();

            // then
            expect(field.textContent).to.equal('foo');
          }));

        });

        describe('on the business object', function() {

          it('should execute', function() {
            expect(bo.get('name')).to.equal('foo');
          });

          it('should undo', inject(function(commandStack) {
            // when
            commandStack.undo();

            // then
            expect(bo.get('name')).to.equal('DIAGRAM');
          }));


          it('should redo', inject(function(commandStack) {
            // when
            commandStack.undo();
            commandStack.redo();

            // then
            expect(bo.get('name')).to.equal('foo');
          }));

        });

      });


      describe('# casePlanModel', function() {

        beforeEach(inject(function(elementRegistry, selection, propertiesPanel) {

          // given
          item = elementRegistry.get('CasePlanModel_1');
          selection.select(item);

          bo = item.businessObject;
          field = getNameInput(propertiesPanel._container);

          // when
          TestHelper.triggerValue(field, 'foo', 'change');

        }));


        describe('in the DOM', function() {

          it('should execute', function() {
            expect(field.textContent).to.equal('foo');
          });

          it('should undo', inject(function(commandStack) {
            // when
            commandStack.undo();

            // then
            expect(field.textContent).to.equal('A CasePlanModel');
          }));


          it('should redo', inject(function(commandStack) {
            // when
            commandStack.undo();
            commandStack.redo();

            // then
            expect(field.textContent).to.equal('foo');
          }));

        });

        describe('on the business object', function() {

          it('should execute', function() {
            expect(bo.get('name')).to.equal('foo');
          });

          it('should undo', inject(function(commandStack) {
            // when
            commandStack.undo();

            // then
            expect(bo.get('name')).to.equal('A CasePlanModel');
          }));


          it('should redo', inject(function(commandStack) {
            // when
            commandStack.undo();
            commandStack.redo();

            // then
            expect(bo.get('name')).to.equal('foo');
          }));

        });

      });


      describe('# itemCapable', function() {

        describe('# planItem', function() {

          beforeEach(inject(function(elementRegistry, selection, propertiesPanel) {

            // given
            item = elementRegistry.get('PI_HumanTask_1');
            selection.select(item);

            bo = item.businessObject;
            field = getNameInput(propertiesPanel._container);

            // when
            TestHelper.triggerValue(field, 'foo', 'change');

          }));

          describe('in the DOM', function() {

            it('should execute', function() {
              expect(field.textContent).to.equal('foo');
            });

            it('should undo', inject(function(commandStack) {
              // when
              commandStack.undo();

              // then
              expect(field.textContent).to.equal('ITEM');
            }));


            it('should redo', inject(function(commandStack) {
              // when
              commandStack.undo();
              commandStack.redo();

              // then
              expect(field.textContent).to.equal('foo');
            }));

          });

          describe('on the business object', function() {

            it('should execute', function() {
              expect(bo.get('name')).to.equal('foo');
            });

            it('should undo', inject(function(commandStack) {
              // when
              commandStack.undo();

              // then
              expect(bo.get('name')).to.equal('ITEM');
            }));


            it('should redo', inject(function(commandStack) {
              // when
              commandStack.undo();
              commandStack.redo();

              // then
              expect(bo.get('name')).to.equal('foo');
            }));

          });

        });


        describe('# discretionaryItem', function() {

          beforeEach(inject(function(elementRegistry, selection, propertiesPanel) {

            // given
            item = elementRegistry.get('DIS_Task_2');
            selection.select(item);

            bo = item.businessObject;
            field = getNameInput(propertiesPanel._container);

            // when
            TestHelper.triggerValue(field, 'foo', 'change');

          }));

          describe('in the DOM', function() {

            it('should execute', function() {
              expect(field.textContent).to.equal('foo');
            });

            it('should undo', inject(function(commandStack) {
              // when
              commandStack.undo();

              // then
              expect(field.textContent).to.equal('');
            }));


            it('should redo', inject(function(commandStack) {
              // when
              commandStack.undo();
              commandStack.redo();

              // then
              expect(field.textContent).to.equal('foo');
            }));

          });

          describe('on the business object', function() {

            it('should execute', function() {
              expect(bo.get('name')).to.equal('foo');
            });

            it('should undo', inject(function(commandStack) {
              // when
              commandStack.undo();

              // then
              expect(bo.get('name')).not.to.exist;
            }));


            it('should redo', inject(function(commandStack) {
              // when
              commandStack.undo();
              commandStack.redo();

              // then
              expect(bo.get('name')).to.equal('foo');
            }));

          });

        });


        describe('# caseFileItem', function() {

          beforeEach(inject(function(elementRegistry, selection, propertiesPanel) {

            // given
            item = elementRegistry.get('CaseFileItem_1');
            selection.select(item);

            bo = item.businessObject;
            field = getNameInput(propertiesPanel._container);

            // when
            TestHelper.triggerValue(field, 'foo', 'change');

          }));

          describe('in the DOM', function() {

            it('should execute', function() {
              expect(field.textContent).to.equal('foo');
            });

            it('should undo', inject(function(commandStack) {
              // when
              commandStack.undo();

              // then
              expect(field.textContent).to.equal('');
            }));


            it('should redo', inject(function(commandStack) {
              // when
              commandStack.undo();
              commandStack.redo();

              // then
              expect(field.textContent).to.equal('foo');
            }));

          });

          describe('on the business object', function() {

            it('should execute', function() {
              expect(bo.get('name')).to.equal('foo');
            });

            it('should undo', inject(function(commandStack) {
              // when
              commandStack.undo();

              // then
              expect(bo.get('name')).not.to.exist;
            }));


            it('should redo', inject(function(commandStack) {
              // when
              commandStack.undo();
              commandStack.redo();

              // then
              expect(bo.get('name')).to.equal('foo');
            }));

          });

        });

        describe('should set definition name in the DOM', function() {

          beforeEach(inject(function(elementRegistry, selection, propertiesPanel) {

            // given
            item = elementRegistry.get('PI_HumanTask_3');
            selection.select(item);

            bo = item.businessObject;
            field = getNameInput(propertiesPanel._container);

            // when
            TestHelper.triggerValue(field, '', 'change');

          }));

          it('should execute', function() {
            // then
            expect(field.textContent).to.equal('DEF');
          });

          it('should undo', inject(function(commandStack) {
            // when
            commandStack.undo();

            // then
            expect(field.textContent).to.equal('ITEM');
          }));


          it('should redo', inject(function(commandStack) {
            // when
            commandStack.undo();
            commandStack.redo();

            // then
            expect(field.textContent).to.equal('DEF');
          }));

        });

      });

      describe('# definition', function() {

        var definition;

        describe('# plan item definition', function() {

          beforeEach(inject(function(elementRegistry, selection, propertiesPanel) {

            // given
            item = elementRegistry.get('PI_HumanTask_3');
            selection.select(item);

            bo = item.businessObject;
            definition = bo.definitionRef;

            field = getDefinitionNameInput(propertiesPanel._container);

            // when
            TestHelper.triggerValue(field, 'foo', 'change');

          }));

          describe('in the DOM', function() {

            it('should execute', function() {
              // then
              expect(field.textContent).to.equal('foo');
            });

            it('should undo', inject(function(commandStack) {
              // when
              commandStack.undo();

              // then
              expect(field.textContent).to.equal('DEF');
            }));


            it('should redo', inject(function(commandStack) {
              // when
              commandStack.undo();
              commandStack.redo();

              // then
              expect(field.textContent).to.equal('foo');
            }));

          });

          describe('on the business object', function() {

            it('should execute', function() {
              expect(definition.get('name')).to.equal('foo');
            });

            it('should undo', inject(function(commandStack) {
              // when
              commandStack.undo();

              // then
              expect(definition.get('name')).to.equal('DEF');
            }));


            it('should redo', inject(function(commandStack) {
              // when
              commandStack.undo();
              commandStack.redo();

              // then
              expect(definition.get('name')).to.equal('foo');
            }));

          });

        });


        describe('# case file item definition', function() {

          beforeEach(inject(function(elementRegistry, selection, propertiesPanel) {

            // given
            item = elementRegistry.get('CaseFileItem_1');
            selection.select(item);

            bo = item.businessObject;
            definition = bo.definitionRef;

            field = getDefinitionNameInput(propertiesPanel._container);

            // when
            TestHelper.triggerValue(field, 'foo', 'change');

          }));

          describe('in the DOM', function() {

            it('should execute', function() {
              expect(field.textContent).to.equal('foo');
            });

            it('should undo', inject(function(commandStack) {
              // when
              commandStack.undo();

              // then
              expect(field.textContent).to.equal('');
            }));


            it('should redo', inject(function(commandStack) {
              // when
              commandStack.undo();
              commandStack.redo();

              // then
              expect(field.textContent).to.equal('foo');
            }));

          });

          describe('on the business object', function() {

            it('should execute', function() {
              expect(definition.get('name')).to.equal('foo');
            });

            it('should undo', inject(function(commandStack) {
              // when
              commandStack.undo();

              // then
              expect(definition.get('name')).not.to.exist;
            }));


            it('should redo', inject(function(commandStack) {
              // when
              commandStack.undo();
              commandStack.redo();

              // then
              expect(definition.get('name')).to.equal('foo');
            }));

          });

        });

      });

      describe('# connection', function() {

        describe('# plan item on part', function() {

          beforeEach(inject(function(elementRegistry, selection, propertiesPanel) {

            // given
            item = elementRegistry.get('PlanItemOnPart_1_di');
            selection.select(item);

            bo = item.businessObject.cmmnElementRef;
            field = getNameInput(propertiesPanel._container);

            // when
            TestHelper.triggerValue(field, 'foo', 'change');

          }));

          describe('in the DOM', function() {

            it('should execute', function() {
              expect(field.textContent).to.equal('foo');
            });

            it('should undo', inject(function(commandStack) {
              // when
              commandStack.undo();

              // then
              expect(field.textContent).to.equal('PLAN_ON_PART');
            }));


            it('should redo', inject(function(commandStack) {
              // when
              commandStack.undo();
              commandStack.redo();

              // then
              expect(field.textContent).to.equal('foo');
            }));

          });

          describe('on the business object', function() {

            it('should execute', function() {
              expect(bo.get('name')).to.equal('foo');
            });

            it('should undo', inject(function(commandStack) {
              // when
              commandStack.undo();

              // then
              expect(bo.get('name')).to.equal('PLAN_ON_PART');
            }));


            it('should redo', inject(function(commandStack) {
              // when
              commandStack.undo();
              commandStack.redo();

              // then
              expect(bo.get('name')).to.equal('foo');
            }));

          });

        });


        describe('# case file item on part', function() {

          beforeEach(inject(function(elementRegistry, selection, propertiesPanel) {

            // given
            item = elementRegistry.get('CaseFileItemOnPart_1_di');
            selection.select(item);

            bo = item.businessObject.cmmnElementRef;
            field = getNameInput(propertiesPanel._container);

            // when
            TestHelper.triggerValue(field, 'foo', 'change');

          }));

          describe('in the DOM', function() {

            it('should execute', function() {
              expect(field.textContent).to.equal('foo');
            });

            it('should undo', inject(function(commandStack) {
              // when
              commandStack.undo();

              // then
              expect(field.textContent).to.equal('CASE_ON_PART');
            }));


            it('should redo', inject(function(commandStack) {
              // when
              commandStack.undo();
              commandStack.redo();

              // then
              expect(field.textContent).to.equal('foo');
            }));

          });

          describe('on the business object', function() {

            it('should execute', function() {
              expect(bo.get('name')).to.equal('foo');
            });

            it('should undo', inject(function(commandStack) {
              // when
              commandStack.undo();

              // then
              expect(bo.get('name')).to.equal('CASE_ON_PART');
            }));


            it('should redo', inject(function(commandStack) {
              // when
              commandStack.undo();
              commandStack.redo();

              // then
              expect(bo.get('name')).to.equal('foo');
            }));

          });

        });

      });

      describe('# text annotation', function() {

        beforeEach(inject(function(elementRegistry, selection, propertiesPanel) {

          // given
          item = elementRegistry.get('TextAnnotation_1');
          selection.select(item);

          bo = item.businessObject;
          field = getTextAnnotationNameInput(propertiesPanel._container);

          // when
          TestHelper.triggerValue(field, 'foo', 'change');

        }));

        describe('in the DOM', function() {

          it('should execute', function() {
            expect(field.textContent).to.equal('foo');
          });

          it('should undo', inject(function(commandStack) {
            // when
            commandStack.undo();

            // then
            expect(field.textContent).to.equal('TEXT_ANNOTATION');
          }));


          it('should redo', inject(function(commandStack) {
            // when
            commandStack.undo();
            commandStack.redo();

            // then
            expect(field.textContent).to.equal('foo');
          }));

        });

        describe('on the business object', function() {

          it('should execute', function() {
            expect(bo.get('text')).to.equal('foo');
          });

          it('should undo', inject(function(commandStack) {
            // when
            commandStack.undo();

            // then
            expect(bo.get('text')).to.equal('TEXT_ANNOTATION');
          }));


          it('should redo', inject(function(commandStack) {
            // when
            commandStack.undo();
            commandStack.redo();

            // then
            expect(bo.get('text')).to.equal('foo');
          }));

        });

      });

    });

  });

  describe('control visibility', function() {

    function expectVisible(elementId, visible, getter) {

      if (!getter) {
        getter = getNameInput;
      }

      return inject(function(propertiesPanel, selection, elementRegistry) {

        // given
        var element = elementRegistry.get(elementId);

        // assume
        expect(element).to.exist;

        // when
        selection.select(element);
        var field = getter(propertiesPanel._container);

        // then
        if (visible) {
          expect(field).to.exist;
        } else {
          expect(field).not.to.exist;
        }
      });
    }

    describe('should show', function() {

      it('Root', expectVisible('CMMNDiagram_1', true));
      it('CasePlanModel', expectVisible('CasePlanModel_1', true));

      it('PlanItem', expectVisible('PI_HumanTask_1', true));
      it('DiscretionaryItem', expectVisible('DIS_Task_2', true));
      it('CaseFileItem', expectVisible('CaseFileItem_1', true));

      it('PlanItemDefinition', expectVisible('PI_HumanTask_1', true, getDefinitionNameInput));
      it('CaseFileItemDefinition', expectVisible('CaseFileItem_1', true, getDefinitionNameInput));

      it('CaseFileItemOnPart', expectVisible('CaseFileItemOnPart_1_di', true));
      it('PlanItemOnPart', expectVisible('PlanItemOnPart_1_di', true));

      it('TextAnnotation', expectVisible('TextAnnotation_1', true, getTextAnnotationNameInput));

    });


    describe('should hide', function() {

      it('Criterion', expectVisible('EntryCriterion_1', false));

      it('DiscretionaryConnection', expectVisible('DiscretionaryConnection_1', false));
      it('Association', expectVisible('Association_1_di', false));

    });

  });


  describe('validation', function() {

    describe('warnings', function() {

      it('should not be shown if item name is used',
        inject(function(elementRegistry, selection, propertiesPanel) {

          // given
          var shape = elementRegistry.get('PI_HumanTask_3');
          var container = propertiesPanel._container;

          // when
          selection.select(shape);

          // then
          var field = getNameInput(container);
          expect(domClasses(field).has('warning')).to.be.false;
        })
      );


      it('should be shown if definition name is used',
        inject(function(elementRegistry, selection, propertiesPanel) {

          // given
          var shape = elementRegistry.get('PI_HumanTask_2');
          var container = propertiesPanel._container;

          // when
          selection.select(shape);

          // then
          var field = getNameInput(container);
          expect(domClasses(field).has('warning')).to.be.true;
        })
      );

    });

  });

});
