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
    propertiesProviderModule = require('lib/provider/cmmn'),
    getBusinessObject = require('cmmn-js/lib/util/ModelUtil').getBusinessObject;


function getInput(container, selector) {
  return domQuery('input[' + selector + ']', container);
}

function getIdInput(container) {
  return getInput(domQuery('div[data-entry=id]', container), 'name=id');
}

function getDefinitionIdInput(container) {
  return getInput(domQuery('div[data-entry=definitionId]', container), 'name=id');
}


describe('id-properties', function() {

  var diagramXML = require('./Id.cmmn');

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

    it('should fetch the id for root', inject(function(elementRegistry, selection, propertiesPanel) {

      // given
      item = elementRegistry.get('CMMNDiagram_1');
      selection.select(item);

      field = getIdInput(propertiesPanel._container);
      bo = item.businessObject;

      // when selecting element

      // then
      expect(field.value).to.equal(bo.get('id'));

    }));


    it('should fetch the id for case plan model', inject(function(elementRegistry, selection, propertiesPanel) {

      // given
      item = elementRegistry.get('CasePlanModel_1');
      selection.select(item);

      field = getIdInput(propertiesPanel._container);
      bo = item.businessObject;

      // when selecting element

      // then
      expect(field.value).to.equal(bo.get('id'));

    }));


    it('should fetch the id for an item', inject(function(elementRegistry, selection, propertiesPanel) {

      // given
      item = elementRegistry.get('PlanItem_1');
      selection.select(item);

      field = getIdInput(propertiesPanel._container);
      bo = item.businessObject;

      // when selecting element

      // then
      expect(field.value).to.equal(bo.get('id'));

    }));


    it('should fetch the id for a definition', inject(function(elementRegistry, selection, propertiesPanel) {

      // given
      item = elementRegistry.get('PlanItem_1');
      selection.select(item);

      field = getDefinitionIdInput(propertiesPanel._container);
      bo = item.businessObject.definitionRef;

      // when selecting element

      // then
      expect(field.value).to.equal(bo.get('id'));

    }));


    it('should fetch the id for a criterion', inject(function(elementRegistry, selection, propertiesPanel) {

      // given
      item = elementRegistry.get('EntryCriterion_1');
      selection.select(item);

      field = getIdInput(propertiesPanel._container);
      bo = item.businessObject;

      // when selecting element

      // then
      expect(field.value).to.equal(bo.get('id'));

    }));


    it('should fetch the id for a plan item on part connection',
      inject(function(elementRegistry, selection, propertiesPanel) {

        // given
        item = elementRegistry.get('PlanItemOnPart_1_di');
        selection.select(item);

        field = getIdInput(propertiesPanel._container);
        bo = item.businessObject.cmmnElementRef;

        // when selecting element

        // then
        expect(field.value).to.equal(bo.get('id'));

      })
    );


    it('should fetch the id for a case file item on part connection',
      inject(function(elementRegistry, selection, propertiesPanel) {

        // given
        item = elementRegistry.get('CaseFileItemOnPart_1_di');
        selection.select(item);

        field = getIdInput(propertiesPanel._container);
        bo = item.businessObject.cmmnElementRef;

        // when selecting element

        // then
        expect(field.value).to.equal(bo.get('id'));

      })
    );


    it('should fetch the id for a discretionary connection',
      inject(function(elementRegistry, selection, propertiesPanel) {

        // given
        item = elementRegistry.get('DiscretionaryConnection_1');
        selection.select(item);

        field = getIdInput(propertiesPanel._container);
        bo = item.businessObject;

        // when selecting element

        // then
        expect(field.value).to.equal(bo.get('id'));

      })
    );


    it('should fetch the id for an assocation connection',
      inject(function(elementRegistry, selection, propertiesPanel) {

        // given
        item = elementRegistry.get('Association_1_di');
        selection.select(item);

        field = getIdInput(propertiesPanel._container);
        bo = item.businessObject.cmmnElementRef;

        // when selecting element

        // then
        expect(field.value).to.equal(bo.get('id'));

      })
    );

  });


  describe('set', function() {

    describe('should set the id for an element', function() {

      var item, bo, field;

      describe('# root', function() {

        beforeEach(inject(function(elementRegistry, selection, propertiesPanel) {

          // given
          item = elementRegistry.get('CMMNDiagram_1');
          selection.select(item);

          bo = item.businessObject;
          field = getIdInput(propertiesPanel._container);

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
            expect(field.value).to.equal('CMMNDiagram_1');
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
            expect(bo.get('id')).to.equal('foo');
          });

          it('should undo', inject(function(commandStack) {
            // when
            commandStack.undo();

            // then
            expect(bo.get('id')).to.equal('CMMNDiagram_1');
          }));


          it('should redo', inject(function(commandStack) {
            // when
            commandStack.undo();
            commandStack.redo();

            // then
            expect(bo.get('id')).to.equal('foo');
          }));

        });

      });


      describe('# casePlanModel', function() {

        beforeEach(inject(function(elementRegistry, selection, propertiesPanel) {

          // given
          item = elementRegistry.get('CasePlanModel_1');
          selection.select(item);

          bo = item.businessObject;
          field = getIdInput(propertiesPanel._container);

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
            expect(field.value).to.equal('CasePlanModel_1');
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
            expect(bo.get('id')).to.equal('foo');
          });

          it('should undo', inject(function(commandStack) {
            // when
            commandStack.undo();

            // then
            expect(bo.get('id')).to.equal('CasePlanModel_1');
          }));


          it('should redo', inject(function(commandStack) {
            // when
            commandStack.undo();
            commandStack.redo();

            // then
            expect(bo.get('id')).to.equal('foo');
          }));

        });

      });


      describe('# itemCapable', function() {

        describe('# planItem', function() {

          beforeEach(inject(function(elementRegistry, selection, propertiesPanel) {

            // given
            item = elementRegistry.get('PlanItem_1');
            selection.select(item);

            bo = item.businessObject;
            field = getIdInput(propertiesPanel._container);

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
              expect(field.value).to.equal('PlanItem_1');
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
              expect(bo.get('id')).to.equal('foo');
            });

            it('should undo', inject(function(commandStack) {
              // when
              commandStack.undo();

              // then
              expect(bo.get('id')).to.equal('PlanItem_1');
            }));


            it('should redo', inject(function(commandStack) {
              // when
              commandStack.undo();
              commandStack.redo();

              // then
              expect(bo.get('id')).to.equal('foo');
            }));

          });

        });


        describe('# discretionaryItem', function() {

          beforeEach(inject(function(elementRegistry, selection, propertiesPanel) {

            // given
            item = elementRegistry.get('DIS_Task_2');
            selection.select(item);

            bo = item.businessObject;
            field = getIdInput(propertiesPanel._container);

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
              expect(field.value).to.equal('DIS_Task_2');
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
              expect(bo.get('id')).to.equal('foo');
            });

            it('should undo', inject(function(commandStack) {
              // when
              commandStack.undo();

              // then
              expect(bo.get('id')).to.equal('DIS_Task_2');
            }));


            it('should redo', inject(function(commandStack) {
              // when
              commandStack.undo();
              commandStack.redo();

              // then
              expect(bo.get('id')).to.equal('foo');
            }));

          });

        });


        describe('# caseFileItem', function() {

          beforeEach(inject(function(elementRegistry, selection, propertiesPanel) {

            // given
            item = elementRegistry.get('CaseFileItem_1');
            selection.select(item);

            bo = item.businessObject;
            field = getIdInput(propertiesPanel._container);

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
              expect(field.value).to.equal('CaseFileItem_1');
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
              expect(bo.get('id')).to.equal('foo');
            });

            it('should undo', inject(function(commandStack) {
              // when
              commandStack.undo();

              // then
              expect(bo.get('id')).to.equal('CaseFileItem_1');
            }));


            it('should redo', inject(function(commandStack) {
              // when
              commandStack.undo();
              commandStack.redo();

              // then
              expect(bo.get('id')).to.equal('foo');
            }));

          });

        });


        describe('# criterion', function() {

          beforeEach(inject(function(elementRegistry, selection, propertiesPanel) {

            // given
            item = elementRegistry.get('EntryCriterion_1');
            selection.select(item);

            bo = item.businessObject;
            field = getIdInput(propertiesPanel._container);

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
              expect(field.value).to.equal('EntryCriterion_1');
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
              expect(bo.get('id')).to.equal('foo');
            });

            it('should undo', inject(function(commandStack) {
              // when
              commandStack.undo();

              // then
              expect(bo.get('id')).to.equal('EntryCriterion_1');
            }));


            it('should redo', inject(function(commandStack) {
              // when
              commandStack.undo();
              commandStack.redo();

              // then
              expect(bo.get('id')).to.equal('foo');
            }));

          });

        });

      });

      describe('# definition', function() {

        var definition;

        describe('# plan item definition', function() {

          beforeEach(inject(function(elementRegistry, selection, propertiesPanel) {

            // given
            item = elementRegistry.get('PlanItem_1');
            selection.select(item);

            bo = item.businessObject;
            definition = bo.definitionRef;

            field = getDefinitionIdInput(propertiesPanel._container);

            // when
            TestHelper.triggerValue(field, 'foo', 'change');

          }));

          describe('in the DOM', function() {

            it('should execute', function() {
              // then
              expect(field.value).to.equal('foo');
            });

            it('should undo', inject(function(commandStack) {
              // when
              commandStack.undo();

              // then
              expect(field.value).to.equal('Task_1');
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
              expect(definition.get('id')).to.equal('foo');
            });

            it('should undo', inject(function(commandStack) {
              // when
              commandStack.undo();

              // then
              expect(definition.get('id')).to.equal('Task_1');
            }));


            it('should redo', inject(function(commandStack) {
              // when
              commandStack.undo();
              commandStack.redo();

              // then
              expect(definition.get('id')).to.equal('foo');
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

            field = getDefinitionIdInput(propertiesPanel._container);

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
              expect(field.value).to.equal('CaseFileItemDefinition_1');
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
              expect(definition.get('id')).to.equal('foo');
            });

            it('should undo', inject(function(commandStack) {
              // when
              commandStack.undo();

              // then
              expect(definition.get('id')).to.equal('CaseFileItemDefinition_1');
            }));


            it('should redo', inject(function(commandStack) {
              // when
              commandStack.undo();
              commandStack.redo();

              // then
              expect(definition.get('id')).to.equal('foo');
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
            field = getIdInput(propertiesPanel._container);

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
              expect(field.value).to.equal('PlanItemOnPart_1');
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
              expect(bo.get('id')).to.equal('foo');
            });

            it('should undo', inject(function(commandStack) {
              // when
              commandStack.undo();

              // then
              expect(bo.get('id')).to.equal('PlanItemOnPart_1');
            }));


            it('should redo', inject(function(commandStack) {
              // when
              commandStack.undo();
              commandStack.redo();

              // then
              expect(bo.get('id')).to.equal('foo');
            }));

          });

        });


        describe('# case file item on part', function() {

          beforeEach(inject(function(elementRegistry, selection, propertiesPanel) {

            // given
            item = elementRegistry.get('CaseFileItemOnPart_1_di');
            selection.select(item);

            bo = item.businessObject.cmmnElementRef;
            field = getIdInput(propertiesPanel._container);

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
              expect(field.value).to.equal('CaseFileItemOnPart_1');
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
              expect(bo.get('id')).to.equal('foo');
            });

            it('should undo', inject(function(commandStack) {
              // when
              commandStack.undo();

              // then
              expect(bo.get('id')).to.equal('CaseFileItemOnPart_1');
            }));


            it('should redo', inject(function(commandStack) {
              // when
              commandStack.undo();
              commandStack.redo();

              // then
              expect(bo.get('id')).to.equal('foo');
            }));

          });

        });


        describe('# discretionary', function() {

          beforeEach(inject(function(elementRegistry, selection, propertiesPanel) {

            // given
            item = elementRegistry.get('DiscretionaryConnection_1');
            selection.select(item);

            bo = item.businessObject;
            field = getIdInput(propertiesPanel._container);

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
              expect(field.value).to.equal('DiscretionaryConnection_1');
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
              expect(bo.get('id')).to.equal('foo');
            });

            it('should undo', inject(function(commandStack) {
              // when
              commandStack.undo();

              // then
              expect(bo.get('id')).to.equal('DiscretionaryConnection_1');
            }));


            it('should redo', inject(function(commandStack) {
              // when
              commandStack.undo();
              commandStack.redo();

              // then
              expect(bo.get('id')).to.equal('foo');
            }));

          });

        });


        describe('# association', function() {

          beforeEach(inject(function(elementRegistry, selection, propertiesPanel) {

            // given
            item = elementRegistry.get('Association_1_di');
            selection.select(item);

            bo = item.businessObject.cmmnElementRef;
            field = getIdInput(propertiesPanel._container);

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
              expect(field.value).to.equal('Association_1');
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
              expect(bo.get('id')).to.equal('foo');
            });

            it('should undo', inject(function(commandStack) {
              // when
              commandStack.undo();

              // then
              expect(bo.get('id')).to.equal('Association_1');
            }));


            it('should redo', inject(function(commandStack) {
              // when
              commandStack.undo();
              commandStack.redo();

              // then
              expect(bo.get('id')).to.equal('foo');
            }));

          });

        });

      });

    });

  });

  describe('validation', function() {

    var shape,
        textField,
        businessObject;

    beforeEach(inject(function(elementRegistry, selection, propertiesPanel) {
      shape = elementRegistry.get('PlanItem_1');
      selection.select(shape);

      textField = getIdInput(propertiesPanel._container);
      businessObject = getBusinessObject(shape);
    }));

    it('should not remove the id for an element', inject(function(propertiesPanel) {

      // assume
      expect(textField.value).to.equal('PlanItem_1');

      // when
      TestHelper.triggerValue(textField, '', 'change');

      // then
      expect(businessObject.get('id')).to.equal('PlanItem_1');
    }));


    it('should not set the id with a space for an element', inject(function(propertiesPanel) {

      // assume
      expect(textField.value).to.equal('PlanItem_1');

      // when
      TestHelper.triggerValue(textField, 'foo bar', 'change');

      // then
      expect(businessObject.get('id')).to.equal('PlanItem_1');
    }));


    it('should not set invalid QName id for an element', inject(function(propertiesPanel) {

      // assume
      expect(textField.value).to.equal('PlanItem_1');

      // when
      TestHelper.triggerValue(textField, '::FOO', 'change');

      // then
      expect(businessObject.get('id')).to.equal('PlanItem_1');
    }));


    it('should not set invalid HTML characters id for an element', inject(function(propertiesPanel) {

      // assume
      expect(textField.value).to.equal('PlanItem_1');

      // when
      TestHelper.triggerValue(textField, '<hello>', 'change');

      // then
      expect(businessObject.get('id')).to.equal('PlanItem_1');
    }));

    describe('errors', function() {

      it('should not be shown if id is valid', function() {

        // when
        TestHelper.triggerValue(textField, 'foo', 'change');

        // then
        expect(domClasses(textField).has('invalid')).to.be.false;
      });


      it('should be shown if id gets removed', function() {

        // when
        TestHelper.triggerValue(textField, '', 'change');

        // then
        expect(domClasses(textField).has('invalid')).to.be.true;
      });


      it('should be shown if id contains space', function() {

        // when
        TestHelper.triggerValue(textField, 'foo bar', 'change');

        // then
        expect(domClasses(textField).has('invalid')).to.be.true;
      });


      it('should be shown if id is invalid QName', function() {

        // when
        TestHelper.triggerValue(textField, '::FOO', 'change');

        // then
        expect(domClasses(textField).has('invalid')).to.be.true;
      });


      it('should be shown if id contains HTML characters', function() {

        // when
        TestHelper.triggerValue(textField, '<hello>', 'change');

        // then
        expect(domClasses(textField).has('invalid')).to.be.true;
      });

    });

  });

});
