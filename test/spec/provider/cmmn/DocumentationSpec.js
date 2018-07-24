'use strict';

var TestHelper = require('../../../TestHelper');

var TestContainer = require('mocha-test-container-support');

/* global bootstrapModeler, inject */

var propertiesPanelModule = require('lib'),
    domQuery = require('min-dom').query,
    coreModule = require('cmmn-js/lib/core'),
    selectionModule = require('diagram-js/lib/features/selection').default,
    modelingModule = require('cmmn-js/lib/features/modeling'),
    propertiesProviderModule = require('lib/provider/cmmn');


function getInput(container, selector) {
  return domQuery('[' + selector + ']', container);
}

function getDocumentationInput(container) {
  return getInput(domQuery('div[data-entry=documentation]', container), 'name=documentation');
}

function getDefinitionDocumentationInput(container) {
  return getInput(domQuery('div[data-entry=definitionDocumentation]', container), 'name=documentation');
}

function getDocumentation(bo) {
  var documentations = bo.get('documentation') || [];
  return documentations[0];
}

function getTextBoxRows(field) {
  var innerText = field.innerText || '';
  var lines = innerText.split(/\r?\n/g);
  var rows = lines.length;

  return rows;
}

describe('documentation-properties', function() {

  var diagramXML = require('./Documentation.cmmn');

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

    it('should fetch the documentation for root', inject(function(elementRegistry, selection, propertiesPanel) {

      // given
      item = elementRegistry.get('CMMNDiagram_1');
      selection.select(item);

      field = getDocumentationInput(propertiesPanel._container);
      bo = item.businessObject;

      // when selecting element

      // then
      expect(field.textContent).to.equal(bo.get('documentation'));

    }));


    it('should fetch the documentation for case plan model', inject(function(elementRegistry, selection, propertiesPanel) {

      // given
      item = elementRegistry.get('CasePlanModel_1');
      selection.select(item);

      field = getDocumentationInput(propertiesPanel._container);
      bo = item.businessObject;

      // when selecting element

      // then
      expect(field.textContent).to.equal(getDocumentation(bo).get('text'));

    }));


    it('should fetch the documentation for a plan item', inject(function(elementRegistry, selection, propertiesPanel) {

      // given
      item = elementRegistry.get('PlanItem_1');
      selection.select(item);

      field = getDocumentationInput(propertiesPanel._container);
      bo = item.businessObject;

      // when selecting element

      // then
      expect(field.textContent).to.equal(getDocumentation(bo).get('text'));

    }));


    it('should fetch the documentation for a discretionary item', inject(function(elementRegistry, selection, propertiesPanel) {

      // given
      item = elementRegistry.get('DIS_Task_2');
      selection.select(item);

      field = getDocumentationInput(propertiesPanel._container);
      bo = item.businessObject;

      // when selecting element

      // then
      expect(field.textContent).to.equal(getDocumentation(bo).get('text'));

    }));


    it('should fetch the documentation for a definition', inject(function(elementRegistry, selection, propertiesPanel) {

      // given
      item = elementRegistry.get('PlanItem_1');
      selection.select(item);

      field = getDefinitionDocumentationInput(propertiesPanel._container);
      bo = item.businessObject.definitionRef;

      // when selecting element

      // then
      expect(field.textContent).to.equal(getDocumentation(bo).get('text'));

    }));


    it('should fetch the documentation for a case file item', inject(function(elementRegistry, selection, propertiesPanel) {

      // given
      item = elementRegistry.get('CaseFileItem_1');
      selection.select(item);

      field = getDocumentationInput(propertiesPanel._container);
      bo = item.businessObject;

      // when selecting element

      // then
      expect(field.textContent).to.equal(getDocumentation(bo).get('text'));

    }));


    it('should fetch the documentation for a case file item definition', inject(function(elementRegistry, selection, propertiesPanel) {

      // given
      item = elementRegistry.get('CaseFileItem_1');
      selection.select(item);

      field = getDefinitionDocumentationInput(propertiesPanel._container);
      bo = item.businessObject.definitionRef;

      // when selecting element

      // then
      expect(field.textContent).to.equal(getDocumentation(bo).get('text'));

    }));


    it('should fetch the documentation for a criterion', inject(function(elementRegistry, selection, propertiesPanel) {

      // given
      item = elementRegistry.get('EntryCriterion_1');
      selection.select(item);

      field = getDocumentationInput(propertiesPanel._container);
      bo = item.businessObject;

      // when selecting element

      // then
      expect(field.textContent).to.equal(getDocumentation(bo).get('text'));

    }));


    it('should fetch the documentation for a plan item on part connection',
      inject(function(elementRegistry, selection, propertiesPanel) {

        // given
        item = elementRegistry.get('PlanItemOnPart_1_di');
        selection.select(item);

        field = getDocumentationInput(propertiesPanel._container);
        bo = item.businessObject.cmmnElementRef;

        // when selecting element

        // then
        expect(field.textContent).to.equal(getDocumentation(bo).get('text'));

      })
    );


    it('should fetch the documentation for a case file item on part connection',
      inject(function(elementRegistry, selection, propertiesPanel) {

        // given
        item = elementRegistry.get('CaseFileItemOnPart_1_di');
        selection.select(item);

        field = getDocumentationInput(propertiesPanel._container);
        bo = item.businessObject.cmmnElementRef;

        // when selecting element

        // then
        expect(field.textContent).to.equal(getDocumentation(bo).get('text'));

      })
    );


    it('should fetch the documentation for an assocation connection',
      inject(function(elementRegistry, selection, propertiesPanel) {

        // given
        item = elementRegistry.get('Association_1_di');
        selection.select(item);

        field = getDocumentationInput(propertiesPanel._container);
        bo = item.businessObject.cmmnElementRef;

        // when selecting element

        // then
        expect(field.textContent).to.equal(getDocumentation(bo).get('text'));

      })
    );


    it('should fetch the documentation for a text annotation',
      inject(function(elementRegistry, selection, propertiesPanel) {

        // given
        item = elementRegistry.get('TextAnnotation_1');
        selection.select(item);

        field = getDocumentationInput(propertiesPanel._container);
        bo = item.businessObject;

        // when selecting element

        // then
        expect(field.textContent).to.equal(getDocumentation(bo).get('text'));

      })
    );

  });


  describe('set', function() {

    describe('should set the documentation for an element', function() {

      var item, bo, field;

      describe('# root', function() {

        beforeEach(inject(function(elementRegistry, selection, propertiesPanel) {

          // given
          item = elementRegistry.get('CMMNDiagram_1');
          selection.select(item);

          bo = item.businessObject;
          field = getDocumentationInput(propertiesPanel._container);

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
            expect(field.textContent).to.equal('DOCS');
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
            expect(bo.get('documentation')).to.equal('foo');
          });

          it('should undo', inject(function(commandStack) {
            // when
            commandStack.undo();

            // then
            expect(bo.get('documentation')).to.equal('DOCS');
          }));


          it('should redo', inject(function(commandStack) {
            // when
            commandStack.undo();
            commandStack.redo();

            // then
            expect(bo.get('documentation')).to.equal('foo');
          }));

        });

      });


      describe('# casePlanModel', function() {

        beforeEach(inject(function(elementRegistry, selection, propertiesPanel) {

          // given
          item = elementRegistry.get('CasePlanModel_1');
          selection.select(item);

          bo = item.businessObject;
          field = getDocumentationInput(propertiesPanel._container);

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
            expect(field.textContent).to.equal('DOCS');
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
            expect(getDocumentation(bo).get('text')).to.equal('foo');
          });

          it('should undo', inject(function(commandStack) {
            // when
            commandStack.undo();

            // then
            expect(getDocumentation(bo).get('text')).to.equal('DOCS');
          }));


          it('should redo', inject(function(commandStack) {
            // when
            commandStack.undo();
            commandStack.redo();

            // then
            expect(getDocumentation(bo).get('text')).to.equal('foo');
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
            field = getDocumentationInput(propertiesPanel._container);

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
              expect(field.textContent).to.equal('DOCS');
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
              expect(getDocumentation(bo).get('text')).to.equal('foo');
            });

            it('should undo', inject(function(commandStack) {
              // when
              commandStack.undo();

              // then
              expect(getDocumentation(bo).get('text')).to.equal('DOCS');
            }));


            it('should redo', inject(function(commandStack) {
              // when
              commandStack.undo();
              commandStack.redo();

              // then
              expect(getDocumentation(bo).get('text')).to.equal('foo');
            }));

          });

        });


        describe('# discretionaryItem', function() {

          beforeEach(inject(function(elementRegistry, selection, propertiesPanel) {

            // given
            item = elementRegistry.get('DIS_Task_2');
            selection.select(item);

            bo = item.businessObject;
            field = getDocumentationInput(propertiesPanel._container);

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
              expect(field.textContent).to.equal('DOCS');
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
              expect(getDocumentation(bo).get('text')).to.equal('foo');
            });

            it('should undo', inject(function(commandStack) {
              // when
              commandStack.undo();

              // then
              expect(getDocumentation(bo).get('text')).to.equal('DOCS');
            }));


            it('should redo', inject(function(commandStack) {
              // when
              commandStack.undo();
              commandStack.redo();

              // then
              expect(getDocumentation(bo).get('text')).to.equal('foo');
            }));

          });

        });


        describe('# caseFileItem', function() {

          beforeEach(inject(function(elementRegistry, selection, propertiesPanel) {

            // given
            item = elementRegistry.get('CaseFileItem_1');
            selection.select(item);

            bo = item.businessObject;
            field = getDocumentationInput(propertiesPanel._container);

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
              expect(field.textContent).to.equal('DOCS');
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
              expect(getDocumentation(bo).get('text')).to.equal('foo');
            });

            it('should undo', inject(function(commandStack) {
              // when
              commandStack.undo();

              // then
              expect(getDocumentation(bo).get('text')).to.equal('DOCS');
            }));


            it('should redo', inject(function(commandStack) {
              // when
              commandStack.undo();
              commandStack.redo();

              // then
              expect(getDocumentation(bo).get('text')).to.equal('foo');
            }));

          });

        });


        describe('# criterion', function() {

          beforeEach(inject(function(elementRegistry, selection, propertiesPanel) {

            // given
            item = elementRegistry.get('EntryCriterion_1');
            selection.select(item);

            bo = item.businessObject;
            field = getDocumentationInput(propertiesPanel._container);

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
              expect(field.textContent).to.equal('DOCS');
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
              expect(getDocumentation(bo).get('text')).to.equal('foo');
            });

            it('should undo', inject(function(commandStack) {
              // when
              commandStack.undo();

              // then
              expect(getDocumentation(bo).get('text')).to.equal('DOCS');
            }));


            it('should redo', inject(function(commandStack) {
              // when
              commandStack.undo();
              commandStack.redo();

              // then
              expect(getDocumentation(bo).get('text')).to.equal('foo');
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

            field = getDefinitionDocumentationInput(propertiesPanel._container);

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
              expect(field.textContent).to.equal('DOCS');
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
              expect(getDocumentation(definition).get('text')).to.equal('foo');
            });

            it('should undo', inject(function(commandStack) {
              // when
              commandStack.undo();

              // then
              expect(getDocumentation(definition).get('text')).to.equal('DOCS');
            }));


            it('should redo', inject(function(commandStack) {
              // when
              commandStack.undo();
              commandStack.redo();

              // then
              expect(getDocumentation(definition).get('text')).to.equal('foo');
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

            field = getDefinitionDocumentationInput(propertiesPanel._container);

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
              expect(field.textContent).to.equal('DOCS');
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
              expect(getDocumentation(definition).get('text')).to.equal('foo');
            });

            it('should undo', inject(function(commandStack) {
              // when
              commandStack.undo();

              // then
              expect(getDocumentation(definition).get('text')).to.equal('DOCS');
            }));


            it('should redo', inject(function(commandStack) {
              // when
              commandStack.undo();
              commandStack.redo();

              // then
              expect(getDocumentation(definition).get('text')).to.equal('foo');
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
            field = getDocumentationInput(propertiesPanel._container);

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
              expect(field.textContent).to.equal('DOCS');
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
              expect(getDocumentation(bo).get('text')).to.equal('foo');
            });

            it('should undo', inject(function(commandStack) {
              // when
              commandStack.undo();

              // then
              expect(getDocumentation(bo).get('text')).to.equal('DOCS');
            }));


            it('should redo', inject(function(commandStack) {
              // when
              commandStack.undo();
              commandStack.redo();

              // then
              expect(getDocumentation(bo).get('text')).to.equal('foo');
            }));

          });

        });


        describe('# case file item on part', function() {

          beforeEach(inject(function(elementRegistry, selection, propertiesPanel) {

            // given
            item = elementRegistry.get('CaseFileItemOnPart_1_di');
            selection.select(item);

            bo = item.businessObject.cmmnElementRef;
            field = getDocumentationInput(propertiesPanel._container);

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
              expect(field.textContent).to.equal('DOCS');
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
              expect(getDocumentation(bo).get('text')).to.equal('foo');
            });

            it('should undo', inject(function(commandStack) {
              // when
              commandStack.undo();

              // then
              expect(getDocumentation(bo).get('text')).to.equal('DOCS');
            }));


            it('should redo', inject(function(commandStack) {
              // when
              commandStack.undo();
              commandStack.redo();

              // then
              expect(getDocumentation(bo).get('text')).to.equal('foo');
            }));

          });

        });


        describe('# association', function() {

          beforeEach(inject(function(elementRegistry, selection, propertiesPanel) {

            // given
            item = elementRegistry.get('Association_1_di');
            selection.select(item);

            bo = item.businessObject.cmmnElementRef;
            field = getDocumentationInput(propertiesPanel._container);

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
              expect(field.textContent).to.equal('DOCS');
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
              expect(getDocumentation(bo).get('text')).to.equal('foo');
            });

            it('should undo', inject(function(commandStack) {
              // when
              commandStack.undo();

              // then
              expect(getDocumentation(bo).get('text')).to.equal('DOCS');
            }));


            it('should redo', inject(function(commandStack) {
              // when
              commandStack.undo();
              commandStack.redo();

              // then
              expect(getDocumentation(bo).get('text')).to.equal('foo');
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
          field = getDocumentationInput(propertiesPanel._container);

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
            expect(field.textContent).to.equal('DOCS');
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
            expect(getDocumentation(bo).get('text')).to.equal('foo');
          });

          it('should undo', inject(function(commandStack) {
            // when
            commandStack.undo();

            // then
            expect(getDocumentation(bo).get('text')).to.equal('DOCS');
          }));


          it('should redo', inject(function(commandStack) {
            // when
            commandStack.undo();
            commandStack.redo();

            // then
            expect(getDocumentation(bo).get('text')).to.equal('foo');
          }));

        });

      });


      describe('# should create documentation element', function() {

        beforeEach(inject(function(elementRegistry, selection, propertiesPanel) {

          // given
          item = elementRegistry.get('PI_Task_3');
          selection.select(item);

          bo = item.businessObject;
          field = getDocumentationInput(propertiesPanel._container);

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
            // then
            expect(bo.get('documentation')).to.have.length(1);
            expect(bo.get('documentation')).to.include(getDocumentation(bo));
            expect(getDocumentation(bo).$parent).to.equal(bo);

            expect(getDocumentation(bo).get('text')).to.equal('foo');
          });

          it('should undo', inject(function(commandStack) {
            // given
            var documentation = getDocumentation(bo);

            // when
            commandStack.undo();

            // then
            expect(bo.get('documentation')).to.have.length(0);
            expect(getDocumentation(bo)).not.to.exist;
            expect(documentation.$parent).not.to.exist;

            expect(documentation.get('text')).to.equal('foo');
          }));


          it('should redo', inject(function(commandStack) {
            // when
            commandStack.undo();
            commandStack.redo();

            // then
            expect(bo.get('documentation')).to.have.length(1);
            expect(bo.get('documentation')).to.include(getDocumentation(bo));
            expect(getDocumentation(bo).$parent).to.equal(bo);

            expect(getDocumentation(bo).get('text')).to.equal('foo');
          }));

        });

      });


      describe('# should remove documentation element', function() {

        var documentation;

        beforeEach(inject(function(elementRegistry, selection, propertiesPanel) {

          // given
          item = elementRegistry.get('PlanItem_1');
          selection.select(item);

          bo = item.businessObject;
          field = getDocumentationInput(propertiesPanel._container);
          documentation = getDocumentation(bo);

          // when
          TestHelper.triggerValue(field, '', 'change');

        }));

        describe('in the DOM', function() {

          it('should execute', function() {
            // then
            expect(field.textContent).to.equal('');
          });

          it('should undo', inject(function(commandStack) {
            // when
            commandStack.undo();

            // then
            expect(field.textContent).to.equal('DOCS');
          }));


          it('should redo', inject(function(commandStack) {
            // when
            commandStack.undo();
            commandStack.redo();

            // then
            expect(field.textContent).to.equal('');
          }));

        });

        describe('on the business object', function() {

          it('should execute', function() {
            // then
            expect(bo.get('documentation')).to.have.length(0);
            expect(getDocumentation(bo)).not.to.exist;
            expect(documentation.$parent).not.to.exist;
          });

          it('should undo', inject(function(commandStack) {
            // when
            commandStack.undo();

            // then
            expect(bo.get('documentation')).to.have.length(1);
            expect(bo.get('documentation')).to.include(getDocumentation(bo));
            expect(getDocumentation(bo).$parent).to.equal(bo);

            expect(getDocumentation(bo).get('text')).to.equal('DOCS');
          }));


          it('should redo', inject(function(commandStack) {
            // when
            commandStack.undo();
            commandStack.redo();

            // then
            expect(bo.get('documentation')).to.have.length(0);
            expect(getDocumentation(bo)).not.to.exist;
            expect(documentation.$parent).not.to.exist;
          }));

        });

      });

    });

  });


  describe('control visibility', function() {

    function expectVisible(elementId, visible, getter) {

      if (!getter) {
        getter = getDocumentationInput;
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

      it('PlanItem', expectVisible('PlanItem_1', true));
      it('DiscretionaryItem', expectVisible('DIS_Task_2', true));
      it('CaseFileItem', expectVisible('CaseFileItem_1', true));

      it('PlanItemDefinition', expectVisible('PlanItem_1', true, getDefinitionDocumentationInput));
      it('CaseFileItemDefinition', expectVisible('CaseFileItem_1', true, getDefinitionDocumentationInput));

      it('Criterion', expectVisible('EntryCriterion_1', true));

      it('CaseFileItemOnPart', expectVisible('CaseFileItemOnPart_1_di', true));
      it('PlanItemOnPart', expectVisible('PlanItemOnPart_1_di', true));
      it('Association', expectVisible('Association_1_di', true));

      it('TextAnnotation', expectVisible('TextAnnotation_1', true));

    });


    describe('should hide', function() {

      it('DiscretionaryConnection', expectVisible('DiscretionaryConnection_1', false));

    });

  });


  describe('textbox rows', function() {

    var field, bo, documentation;

    beforeEach(inject(function(elementRegistry, selection, propertiesPanel) {

      var item = elementRegistry.get('PlanItem_1');
      selection.select(item);

      bo = item.businessObject;
      field = getDocumentationInput(propertiesPanel._container);
      documentation = getDocumentation(bo);

    }));

    it('should initialize textbox with one rows', inject(function(elementRegistry, selection, propertiesPanel) {

      expect(getTextBoxRows(field)).to.equal(1);
    }));


    describe('should grow', function() {

      beforeEach(inject(function(elementRegistry, selection, propertiesPanel) {

        TestHelper.triggerValue(field, 'a\nb', 'change');

      }));

      it('should execute', function() {
        expect(field.innerText).to.equal(documentation.text);
        expect(getTextBoxRows(field)).to.equal(2);
      });

      it('should undo', inject(function(commandStack) {

        commandStack.undo();

        expect(field.innerText).to.equal(documentation.text);
        expect(getTextBoxRows(field)).to.equal(1);
      }));

      it('should redo', inject(function(commandStack) {

        commandStack.undo();
        commandStack.redo();

        expect(field.innerText).to.equal(documentation.text);
        expect(getTextBoxRows(field)).to.equal(2);
      }));

    });


    describe('should reduce', function() {

      beforeEach(inject(function(elementRegistry, selection, propertiesPanel) {

        TestHelper.triggerValue(field, '', 'change');

      }));

      it('should execute', function() {
        expect(getDocumentation(bo)).to.be.undefined;
        expect(getTextBoxRows(field)).to.equal(1);
      });

      it('should undo', inject(function(commandStack) {

        commandStack.undo();

        expect(field.innerText).to.equal(documentation.text);
        expect(getTextBoxRows(field)).to.equal(1);
      }));

      it('should redo', inject(function(commandStack) {

        commandStack.undo();
        commandStack.redo();

        expect(getDocumentation(bo)).to.be.undefined;
        expect(getTextBoxRows(field)).to.equal(1);
      }));

    });


    describe('should set textbox rows to more than three', function() {

      beforeEach(inject(function(elementRegistry, selection, propertiesPanel) {

        TestHelper.triggerValue(field, 'a\nb\nc\nd\ne', 'change');

      }));

      it('should execute', function() {
        expect(field.innerText).to.equal(documentation.text);
        expect(getTextBoxRows(field)).to.equal(5);
      });

      it('should undo', inject(function(commandStack) {

        commandStack.undo();

        expect(field.innerText).to.equal(documentation.text);
        expect(getTextBoxRows(field)).to.equal(1);
      }));

      it('should redo', inject(function(commandStack) {

        commandStack.undo();
        commandStack.redo();

        expect(field.innerText).to.equal(documentation.text);
        expect(getTextBoxRows(field)).to.equal(5);
      }));

    });

  });


});
