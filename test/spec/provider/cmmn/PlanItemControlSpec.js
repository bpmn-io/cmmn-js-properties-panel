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
    getBusinessObject = require('cmmn-js/lib/util/ModelUtil').getBusinessObject,
    getDefinition = require('cmmn-js/lib/util/ModelUtil').getDefinition;


function getInput(container, groupProp, rule) {
  var group = domQuery('div[data-group=' + groupProp + ']', container);
  return domQuery('input[name=' + rule + ']', group);
}

function getItemControlRuleInput(container, rule) {
  return getInput(container, 'itemControl', rule);
}

function getDefaultControlRuleInput(container, rule) {
  return getInput(container, 'defaultControl', rule);
}

function getButton(container, entryProp, action) {
  var entry = domQuery('div[data-entry=' + entryProp + ']', container);
  return domQuery('button[data-action=' + action + ']', entry);
}

function getAddItemControlButton(container) {
  return getButton(container, 'itemControlControlAction', 'add');
}

function getAddDefaultControlButton(container) {
  return getButton(container, 'defaultControlControlAction', 'add');
}

function getRemoveItemControlButton(container) {
  return getButton(container, 'itemControlControlAction', 'remove');
}

function getRemoveDefaultControlButton(container) {
  return getButton(container, 'defaultControlControlAction', 'remove');
}

function isHidden(node) {
  return domClasses(node).has('cpp-hidden');
}

function isAddItemControlButtonHidden(container) {
  return isHidden(getAddItemControlButton(container).parentNode);
}

function isRemoveItemControlButtonHidden(container) {
  return isHidden(getRemoveItemControlButton(container).parentNode);
}

function isItemControlRuleInputHidden(container, rule) {
  return isHidden(getItemControlRuleInput(container, rule).parentNode);
}

function isAddDefaultControlButtonHidden(container) {
  return isHidden(getAddDefaultControlButton(container).parentNode);
}

function isRemoveDefaultControlButtonHidden(container) {
  return isHidden(getRemoveDefaultControlButton(container).parentNode);
}

function isDefaultControlRuleInputHidden(container, rule) {
  return isHidden(getDefaultControlRuleInput(container, rule).parentNode);
}

function getItemControl(element) {
  var bo = getBusinessObject(element);
  return bo.get('itemControl');
}

function getDefaultControl(element) {
  var definition = getDefinition(element);
  return definition.get('defaultControl');
}


describe('plan-item-control-properties', function() {

  var diagramXML = require('./PlanItemControl.cmmn');

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

    var shape, field;

    beforeEach(inject(function(elementRegistry, selection) {

      // given
      shape = elementRegistry.get('PI_ALL_RULES');

      // when
      selection.select(shape);

    }));


    function expectFetchItemControlRuleValue(prop, getControl, getField) {

      return inject(function(propertiesPanel) {

        var control = getControl(shape),
            rule = control.get(prop),
            condition = rule.get('condition');

        field = getField(propertiesPanel._container, prop);

        // then
        expect(field.value).to.equal(condition.get('body'));

      });

    }

    describe('# itemControl', function() {

      it('should fetch the manual activation rule', expectFetchItemControlRuleValue(
        'manualActivationRule',
        getItemControl,
        getItemControlRuleInput
      ));


      it('should fetch the required rule', expectFetchItemControlRuleValue(
        'requiredRule',
        getItemControl,
        getItemControlRuleInput
      ));


      it('should fetch the repetition rule', expectFetchItemControlRuleValue(
        'repetitionRule',
        getItemControl,
        getItemControlRuleInput
      ));

    });


    describe('# defaultControl', function() {

      it('should fetch the manual activation rule', expectFetchItemControlRuleValue(
        'manualActivationRule',
        getDefaultControl,
        getDefaultControlRuleInput
      ));


      it('should fetch the required rule', expectFetchItemControlRuleValue(
        'requiredRule',
        getDefaultControl,
        getDefaultControlRuleInput
      ));


      it('should fetch the repetition rule', expectFetchItemControlRuleValue(
        'repetitionRule',
        getDefaultControl,
        getDefaultControlRuleInput
      ));

    });

  });


  describe('set', function() {

    var shape, control, rule, condition, field;


    describe('condition body', function() {

      beforeEach(inject(function(elementRegistry, selection) {

        // given
        shape = elementRegistry.get('PI_ALL_RULES');
        selection.select(shape);

      }));

      describe('# itemControl', function() {

        beforeEach(function() {
          control = getItemControl(shape);
        });

        describe('# manualActivationRule', function() {

          beforeEach(inject(function(propertiesPanel) {

            // given
            rule = control.get('manualActivationRule');
            condition = rule.get('condition');

            field = getItemControlRuleInput(propertiesPanel._container, 'manualActivationRule');

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
              expect(field.value).to.equal('ITEM_MANUAL');
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
              // then
              expect(condition.get('body')).to.equal('foo');
            });

            it('should undo', inject(function(commandStack) {
              // when
              commandStack.undo();

              // then
              expect(condition.get('body')).to.equal('ITEM_MANUAL');
            }));


            it('should redo', inject(function(commandStack) {
              // when
              commandStack.undo();
              commandStack.redo();

              // then
              expect(condition.get('body')).to.equal('foo');
            }));

          });

        });


        describe('# requiredRule', function() {

          beforeEach(inject(function(propertiesPanel) {

            // given
            rule = control.get('requiredRule');
            condition = rule.get('condition');

            field = getItemControlRuleInput(propertiesPanel._container, 'requiredRule');

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
              expect(field.value).to.equal('ITEM_REQUIRED');
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
              // then
              expect(condition.get('body')).to.equal('foo');
            });

            it('should undo', inject(function(commandStack) {
              // when
              commandStack.undo();

              // then
              expect(condition.get('body')).to.equal('ITEM_REQUIRED');
            }));


            it('should redo', inject(function(commandStack) {
              // when
              commandStack.undo();
              commandStack.redo();

              // then
              expect(condition.get('body')).to.equal('foo');
            }));

          });

        });


        describe('# repetitionRule', function() {

          beforeEach(inject(function(propertiesPanel) {

            // given
            rule = control.get('repetitionRule');
            condition = rule.get('condition');

            field = getItemControlRuleInput(propertiesPanel._container, 'repetitionRule');

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
              expect(field.value).to.equal('ITEM_REPETITION');
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
              // then
              expect(condition.get('body')).to.equal('foo');
            });

            it('should undo', inject(function(commandStack) {
              // when
              commandStack.undo();

              // then
              expect(condition.get('body')).to.equal('ITEM_REPETITION');
            }));


            it('should redo', inject(function(commandStack) {
              // when
              commandStack.undo();
              commandStack.redo();

              // then
              expect(condition.get('body')).to.equal('foo');
            }));

          });

        });

      });


      describe('# defaultControl', function() {

        beforeEach(function() {
          control = getDefaultControl(shape);
        });

        describe('# manualActivationRule', function() {

          beforeEach(inject(function(propertiesPanel) {

            // given
            rule = control.get('manualActivationRule');
            condition = rule.get('condition');

            field = getDefaultControlRuleInput(propertiesPanel._container, 'manualActivationRule');

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
              expect(field.value).to.equal('DEF_MANUAL');
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
              // then
              expect(condition.get('body')).to.equal('foo');
            });

            it('should undo', inject(function(commandStack) {
              // when
              commandStack.undo();

              // then
              expect(condition.get('body')).to.equal('DEF_MANUAL');
            }));


            it('should redo', inject(function(commandStack) {
              // when
              commandStack.undo();
              commandStack.redo();

              // then
              expect(condition.get('body')).to.equal('foo');
            }));

          });

        });


        describe('# requiredRule', function() {

          beforeEach(inject(function(propertiesPanel) {

            // given
            rule = control.get('requiredRule');
            condition = rule.get('condition');

            field = getDefaultControlRuleInput(propertiesPanel._container, 'requiredRule');

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
              expect(field.value).to.equal('DEF_REQUIRED');
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
              // then
              expect(condition.get('body')).to.equal('foo');
            });

            it('should undo', inject(function(commandStack) {
              // when
              commandStack.undo();

              // then
              expect(condition.get('body')).to.equal('DEF_REQUIRED');
            }));


            it('should redo', inject(function(commandStack) {
              // when
              commandStack.undo();
              commandStack.redo();

              // then
              expect(condition.get('body')).to.equal('foo');
            }));

          });

        });


        describe('# repetitionRule', function() {

          beforeEach(inject(function(propertiesPanel) {

            // given
            rule = control.get('repetitionRule');
            condition = rule.get('condition');

            field = getDefaultControlRuleInput(propertiesPanel._container, 'repetitionRule');

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
              expect(field.value).to.equal('DEF_REPETITION');
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
              // then
              expect(condition.get('body')).to.equal('foo');
            });

            it('should undo', inject(function(commandStack) {
              // when
              commandStack.undo();

              // then
              expect(condition.get('body')).to.equal('DEF_REPETITION');
            }));


            it('should redo', inject(function(commandStack) {
              // when
              commandStack.undo();
              commandStack.redo();

              // then
              expect(condition.get('body')).to.equal('foo');
            }));

          });

        });

      });

    });

    describe('should create condition', function() {

      beforeEach(inject(function(elementRegistry, selection) {

        // given
        shape = elementRegistry.get('PI_RULES_NO_CONDITION');
        selection.select(shape);

      }));

      describe('# itemControl', function() {

        beforeEach(function() {
          control = getItemControl(shape);
        });

        describe('# manualActivationRule', function() {

          beforeEach(inject(function(propertiesPanel) {
            // given
            rule = control.get('manualActivationRule');
            field = getItemControlRuleInput(propertiesPanel._container, 'manualActivationRule');

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
              expect(field.value).to.be.empty;
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
              // then
              var condition = rule.get('condition');

              expect(condition).to.exist;
              expect(condition.get('body')).to.equal('foo');

              expect(condition.$parent).to.exist;
              expect(condition.$parent).to.equal(rule);
            });

            it('should undo', inject(function(commandStack) {
              var condition = rule.get('condition');

              // when
              commandStack.undo();

              // then
              expect(rule.get('condition')).not.to.exist;

              expect(condition).to.exist;
              expect(condition.get('body')).to.equal('foo');

              expect(condition.$parent).to.not.exist;
            }));


            it('should redo', inject(function(commandStack) {
              // when
              commandStack.undo();
              commandStack.redo();

              // then
              var condition = rule.get('condition');

              expect(condition).to.exist;
              expect(condition.get('body')).to.equal('foo');

              expect(condition.$parent).to.exist;
              expect(condition.$parent).to.equal(rule);
            }));

          });

        });


        describe('# requiredRule', function() {

          beforeEach(inject(function(propertiesPanel) {
            // given
            rule = control.get('requiredRule');
            field = getItemControlRuleInput(propertiesPanel._container, 'requiredRule');

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
              expect(field.value).to.be.empty;
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
              // then
              var condition = rule.get('condition');

              expect(condition).to.exist;
              expect(condition.get('body')).to.equal('foo');

              expect(condition.$parent).to.exist;
              expect(condition.$parent).to.equal(rule);
            });

            it('should undo', inject(function(commandStack) {
              var condition = rule.get('condition');

              // when
              commandStack.undo();

              // then
              expect(rule.get('condition')).not.to.exist;

              expect(condition).to.exist;
              expect(condition.get('body')).to.equal('foo');

              expect(condition.$parent).to.not.exist;
            }));


            it('should redo', inject(function(commandStack) {
              // when
              commandStack.undo();
              commandStack.redo();

              // then
              var condition = rule.get('condition');

              expect(condition).to.exist;
              expect(condition.get('body')).to.equal('foo');

              expect(condition.$parent).to.exist;
              expect(condition.$parent).to.equal(rule);
            }));

          });

        });


        describe('# repetitionRule', function() {

          beforeEach(inject(function(propertiesPanel) {
            // given
            rule = control.get('repetitionRule');
            field = getItemControlRuleInput(propertiesPanel._container, 'repetitionRule');

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
              expect(field.value).to.be.empty;
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
              // then
              var condition = rule.get('condition');

              expect(condition).to.exist;
              expect(condition.get('body')).to.equal('foo');

              expect(condition.$parent).to.exist;
              expect(condition.$parent).to.equal(rule);
            });

            it('should undo', inject(function(commandStack) {
              var condition = rule.get('condition');

              // when
              commandStack.undo();

              // then
              expect(rule.get('condition')).not.to.exist;

              expect(condition).to.exist;
              expect(condition.get('body')).to.equal('foo');

              expect(condition.$parent).to.not.exist;
            }));


            it('should redo', inject(function(commandStack) {
              // when
              commandStack.undo();
              commandStack.redo();

              // then
              var condition = rule.get('condition');

              expect(condition).to.exist;
              expect(condition.get('body')).to.equal('foo');

              expect(condition.$parent).to.exist;
              expect(condition.$parent).to.equal(rule);
            }));

          });

        });

      });


      describe('# defaultControl', function() {

        beforeEach(function() {
          control = getDefaultControl(shape);
        });

        describe('# manualActivationRule', function() {

          beforeEach(inject(function(propertiesPanel) {
            // given
            rule = control.get('manualActivationRule');
            field = getDefaultControlRuleInput(propertiesPanel._container, 'manualActivationRule');

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
              expect(field.value).to.be.empty;
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
              // then
              var condition = rule.get('condition');

              expect(condition).to.exist;
              expect(condition.get('body')).to.equal('foo');

              expect(condition.$parent).to.exist;
              expect(condition.$parent).to.equal(rule);
            });

            it('should undo', inject(function(commandStack) {
              var condition = rule.get('condition');

              // when
              commandStack.undo();

              // then
              expect(rule.get('condition')).not.to.exist;

              expect(condition).to.exist;
              expect(condition.get('body')).to.equal('foo');

              expect(condition.$parent).to.not.exist;
            }));


            it('should redo', inject(function(commandStack) {
              // when
              commandStack.undo();
              commandStack.redo();

              // then
              var condition = rule.get('condition');

              expect(condition).to.exist;
              expect(condition.get('body')).to.equal('foo');

              expect(condition.$parent).to.exist;
              expect(condition.$parent).to.equal(rule);
            }));

          });

        });


        describe('# requiredRule', function() {

          beforeEach(inject(function(propertiesPanel) {
            // given
            rule = control.get('requiredRule');
            field = getDefaultControlRuleInput(propertiesPanel._container, 'requiredRule');

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
              expect(field.value).to.be.empty;
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
              // then
              var condition = rule.get('condition');

              expect(condition).to.exist;
              expect(condition.get('body')).to.equal('foo');

              expect(condition.$parent).to.exist;
              expect(condition.$parent).to.equal(rule);
            });

            it('should undo', inject(function(commandStack) {
              var condition = rule.get('condition');

              // when
              commandStack.undo();

              // then
              expect(rule.get('condition')).not.to.exist;

              expect(condition).to.exist;
              expect(condition.get('body')).to.equal('foo');

              expect(condition.$parent).to.not.exist;
            }));


            it('should redo', inject(function(commandStack) {
              // when
              commandStack.undo();
              commandStack.redo();

              // then
              var condition = rule.get('condition');

              expect(condition).to.exist;
              expect(condition.get('body')).to.equal('foo');

              expect(condition.$parent).to.exist;
              expect(condition.$parent).to.equal(rule);
            }));

          });

        });


        describe('# repetitionRule', function() {

          beforeEach(inject(function(propertiesPanel) {
            // given
            rule = control.get('repetitionRule');
            field = getDefaultControlRuleInput(propertiesPanel._container, 'repetitionRule');

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
              expect(field.value).to.be.empty;
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
              // then
              var condition = rule.get('condition');

              expect(condition).to.exist;
              expect(condition.get('body')).to.equal('foo');

              expect(condition.$parent).to.exist;
              expect(condition.$parent).to.equal(rule);
            });

            it('should undo', inject(function(commandStack) {
              var condition = rule.get('condition');

              // when
              commandStack.undo();

              // then
              expect(rule.get('condition')).not.to.exist;

              expect(condition).to.exist;
              expect(condition.get('body')).to.equal('foo');

              expect(condition.$parent).to.not.exist;
            }));


            it('should redo', inject(function(commandStack) {
              // when
              commandStack.undo();
              commandStack.redo();

              // then
              var condition = rule.get('condition');

              expect(condition).to.exist;
              expect(condition.get('body')).to.equal('foo');

              expect(condition.$parent).to.exist;
              expect(condition.$parent).to.equal(rule);
            }));

          });

        });

      });

    });


    describe('should create rule', function() {

      beforeEach(inject(function(elementRegistry, selection) {

        // given
        shape = elementRegistry.get('PI_WITH_CONTROL');
        selection.select(shape);

      }));

      describe('# itemControl', function() {

        beforeEach(function() {
          control = getItemControl(shape);
        });

        describe('# manualActivationRule', function() {

          beforeEach(inject(function(propertiesPanel) {
            // given
            field = getItemControlRuleInput(propertiesPanel._container, 'manualActivationRule');

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
              expect(field.value).to.be.empty;
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
              // then
              var rule = control.get('manualActivationRule');

              expect(rule).to.exist;
              expect(rule.$parent).to.exist;
              expect(rule.$parent).to.equal(control);

              var condition = rule.get('condition');

              expect(condition).to.exist;
              expect(condition.get('body')).to.equal('foo');

              expect(condition.$parent).to.exist;
              expect(condition.$parent).to.equal(rule);
            });


            it('should undo', inject(function(commandStack) {
              var rule = control.get('manualActivationRule');
              var condition = rule.get('condition');

              // when
              commandStack.undo();

              // then
              expect(control.get('manualActivationRule')).not.to.exist;

              expect(rule.$parent).not.to.exist;
              expect(rule.get('condition')).not.to.exist;

              expect(condition).to.exist;
              expect(condition.get('body')).to.equal('foo');

              expect(condition.$parent).to.not.exist;
            }));


            it('should redo', inject(function(commandStack) {
              // when
              commandStack.undo();
              commandStack.redo();

              // then
              var rule = control.get('manualActivationRule');

              expect(rule).to.exist;
              expect(rule.$parent).to.exist;
              expect(rule.$parent).to.equal(control);

              var condition = rule.get('condition');

              expect(condition).to.exist;
              expect(condition.get('body')).to.equal('foo');

              expect(condition.$parent).to.exist;
              expect(condition.$parent).to.equal(rule);
            }));

          });

        });


        describe('# requiredRule', function() {

          beforeEach(inject(function(propertiesPanel) {
            // given
            field = getItemControlRuleInput(propertiesPanel._container, 'requiredRule');

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
              expect(field.value).to.be.empty;
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
              // then
              var rule = control.get('requiredRule');

              expect(rule).to.exist;
              expect(rule.$parent).to.exist;
              expect(rule.$parent).to.equal(control);

              var condition = rule.get('condition');

              expect(condition).to.exist;
              expect(condition.get('body')).to.equal('foo');

              expect(condition.$parent).to.exist;
              expect(condition.$parent).to.equal(rule);
            });


            it('should undo', inject(function(commandStack) {
              var rule = control.get('requiredRule');
              var condition = rule.get('condition');

              // when
              commandStack.undo();

              // then
              expect(control.get('requiredRule')).not.to.exist;

              expect(rule.$parent).not.to.exist;
              expect(rule.get('condition')).not.to.exist;

              expect(condition).to.exist;
              expect(condition.get('body')).to.equal('foo');

              expect(condition.$parent).to.not.exist;
            }));


            it('should redo', inject(function(commandStack) {
              // when
              commandStack.undo();
              commandStack.redo();

              // then
              var rule = control.get('requiredRule');

              expect(rule).to.exist;
              expect(rule.$parent).to.exist;
              expect(rule.$parent).to.equal(control);

              var condition = rule.get('condition');

              expect(condition).to.exist;
              expect(condition.get('body')).to.equal('foo');

              expect(condition.$parent).to.exist;
              expect(condition.$parent).to.equal(rule);
            }));

          });

        });


        describe('# repetitionRule', function() {

          beforeEach(inject(function(propertiesPanel) {
            // given
            field = getItemControlRuleInput(propertiesPanel._container, 'repetitionRule');

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
              expect(field.value).to.be.empty;
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
              // then
              var rule = control.get('repetitionRule');

              expect(rule).to.exist;
              expect(rule.$parent).to.exist;
              expect(rule.$parent).to.equal(control);

              var condition = rule.get('condition');

              expect(condition).to.exist;
              expect(condition.get('body')).to.equal('foo');

              expect(condition.$parent).to.exist;
              expect(condition.$parent).to.equal(rule);
            });


            it('should undo', inject(function(commandStack) {
              var rule = control.get('repetitionRule');
              var condition = rule.get('condition');

              // when
              commandStack.undo();

              // then
              expect(control.get('repetitionRule')).not.to.exist;

              expect(rule.$parent).not.to.exist;
              expect(rule.get('condition')).not.to.exist;

              expect(condition).to.exist;
              expect(condition.get('body')).to.equal('foo');

              expect(condition.$parent).to.not.exist;
            }));


            it('should redo', inject(function(commandStack) {
              // when
              commandStack.undo();
              commandStack.redo();

              // then
              var rule = control.get('repetitionRule');

              expect(rule).to.exist;
              expect(rule.$parent).to.exist;
              expect(rule.$parent).to.equal(control);

              var condition = rule.get('condition');

              expect(condition).to.exist;
              expect(condition.get('body')).to.equal('foo');

              expect(condition.$parent).to.exist;
              expect(condition.$parent).to.equal(rule);
            }));

          });

        });

      });


      describe('# defaultControl', function() {

        beforeEach(function() {
          control = getDefaultControl(shape);
        });

        describe('# manualActivationRule', function() {

          beforeEach(inject(function(propertiesPanel) {
            // given
            field = getDefaultControlRuleInput(propertiesPanel._container, 'manualActivationRule');

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
              expect(field.value).to.be.empty;
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
              // then
              var rule = control.get('manualActivationRule');

              expect(rule).to.exist;
              expect(rule.$parent).to.exist;
              expect(rule.$parent).to.equal(control);

              var condition = rule.get('condition');

              expect(condition).to.exist;
              expect(condition.get('body')).to.equal('foo');

              expect(condition.$parent).to.exist;
              expect(condition.$parent).to.equal(rule);
            });


            it('should undo', inject(function(commandStack) {
              var rule = control.get('manualActivationRule');
              var condition = rule.get('condition');

              // when
              commandStack.undo();

              // then
              expect(control.get('manualActivationRule')).not.to.exist;

              expect(rule.$parent).not.to.exist;
              expect(rule.get('condition')).not.to.exist;

              expect(condition).to.exist;
              expect(condition.get('body')).to.equal('foo');

              expect(condition.$parent).to.not.exist;
            }));


            it('should redo', inject(function(commandStack) {
              // when
              commandStack.undo();
              commandStack.redo();

              // then
              var rule = control.get('manualActivationRule');

              expect(rule).to.exist;
              expect(rule.$parent).to.exist;
              expect(rule.$parent).to.equal(control);

              var condition = rule.get('condition');

              expect(condition).to.exist;
              expect(condition.get('body')).to.equal('foo');

              expect(condition.$parent).to.exist;
              expect(condition.$parent).to.equal(rule);
            }));

          });

        });


        describe('# requiredRule', function() {

          beforeEach(inject(function(propertiesPanel) {
            // given
            field = getDefaultControlRuleInput(propertiesPanel._container, 'requiredRule');

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
              expect(field.value).to.be.empty;
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
              // then
              var rule = control.get('requiredRule');

              expect(rule).to.exist;
              expect(rule.$parent).to.exist;
              expect(rule.$parent).to.equal(control);

              var condition = rule.get('condition');

              expect(condition).to.exist;
              expect(condition.get('body')).to.equal('foo');

              expect(condition.$parent).to.exist;
              expect(condition.$parent).to.equal(rule);
            });


            it('should undo', inject(function(commandStack) {
              var rule = control.get('requiredRule');
              var condition = rule.get('condition');

              // when
              commandStack.undo();

              // then
              expect(control.get('requiredRule')).not.to.exist;

              expect(rule.$parent).not.to.exist;
              expect(rule.get('condition')).not.to.exist;

              expect(condition).to.exist;
              expect(condition.get('body')).to.equal('foo');

              expect(condition.$parent).to.not.exist;
            }));


            it('should redo', inject(function(commandStack) {
              // when
              commandStack.undo();
              commandStack.redo();

              // then
              var rule = control.get('requiredRule');

              expect(rule).to.exist;
              expect(rule.$parent).to.exist;
              expect(rule.$parent).to.equal(control);

              var condition = rule.get('condition');

              expect(condition).to.exist;
              expect(condition.get('body')).to.equal('foo');

              expect(condition.$parent).to.exist;
              expect(condition.$parent).to.equal(rule);
            }));

          });
        });


        describe('# repetitionRule', function() {

          beforeEach(inject(function(propertiesPanel) {
            // given
            field = getDefaultControlRuleInput(propertiesPanel._container, 'repetitionRule');

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
              expect(field.value).to.be.empty;
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
              // then
              var rule = control.get('repetitionRule');

              expect(rule).to.exist;
              expect(rule.$parent).to.exist;
              expect(rule.$parent).to.equal(control);

              var condition = rule.get('condition');

              expect(condition).to.exist;
              expect(condition.get('body')).to.equal('foo');

              expect(condition.$parent).to.exist;
              expect(condition.$parent).to.equal(rule);
            });


            it('should undo', inject(function(commandStack) {
              var rule = control.get('repetitionRule');
              var condition = rule.get('condition');

              // when
              commandStack.undo();

              // then
              expect(control.get('repetitionRule')).not.to.exist;

              expect(rule.$parent).not.to.exist;
              expect(rule.get('condition')).not.to.exist;

              expect(condition).to.exist;
              expect(condition.get('body')).to.equal('foo');

              expect(condition.$parent).to.not.exist;
            }));


            it('should redo', inject(function(commandStack) {
              // when
              commandStack.undo();
              commandStack.redo();

              // then
              var rule = control.get('repetitionRule');

              expect(rule).to.exist;
              expect(rule.$parent).to.exist;
              expect(rule.$parent).to.equal(control);

              var condition = rule.get('condition');

              expect(condition).to.exist;
              expect(condition.get('body')).to.equal('foo');

              expect(condition.$parent).to.exist;
              expect(condition.$parent).to.equal(rule);
            }));

          });

        });

      });

    });

  });


  describe('add', function() {

    var shape, bo, button, container;

    beforeEach(inject(function(elementRegistry, selection, propertiesPanel) {

      // given
      shape = elementRegistry.get('PI_WITHOUT_ANYTHING');
      selection.select(shape);
      container = propertiesPanel._container;

    }));

    describe('itemControl', function() {

      beforeEach(function() {

        // given
        bo = getBusinessObject(shape);
        button = getAddItemControlButton(container);

        // when
        TestHelper.triggerEvent(button, 'click');

      });


      describe('in the DOM', function() {

        it('should execute', function() {
          // then
          expect(isAddItemControlButtonHidden(container)).to.be.true;
          expect(isRemoveItemControlButtonHidden(container)).to.be.false;

          expect(isItemControlRuleInputHidden(container, 'manualActivationRule')).to.be.false;
          expect(isItemControlRuleInputHidden(container, 'requiredRule')).to.be.false;
          expect(isItemControlRuleInputHidden(container, 'repetitionRule')).to.be.false;
        });

        it('should undo', inject(function(commandStack) {
          // when
          commandStack.undo();

          // then
          expect(isAddItemControlButtonHidden(container)).to.be.false;
          expect(isRemoveItemControlButtonHidden(container)).to.be.true;

          expect(isItemControlRuleInputHidden(container, 'manualActivationRule')).to.be.true;
          expect(isItemControlRuleInputHidden(container, 'requiredRule')).to.be.true;
          expect(isItemControlRuleInputHidden(container, 'repetitionRule')).to.be.true;
        }));


        it('should redo', inject(function(commandStack) {
          // when
          commandStack.undo();
          commandStack.redo();

          // then
          expect(isAddItemControlButtonHidden(container)).to.be.true;
          expect(isRemoveItemControlButtonHidden(container)).to.be.false;

          expect(isItemControlRuleInputHidden(container, 'manualActivationRule')).to.be.false;
          expect(isItemControlRuleInputHidden(container, 'requiredRule')).to.be.false;
          expect(isItemControlRuleInputHidden(container, 'repetitionRule')).to.be.false;
        }));

      });

      describe('on the business object', function() {

        it('should execute', function() {
          // then
          var control = getItemControl(shape);

          expect(control).to.exist;

          expect(control.$parent).to.exist;
          expect(control.$parent).to.equal(bo);
        });


        it('should undo', inject(function(commandStack) {
          var control = getItemControl(shape);

          // when
          commandStack.undo();

          // then
          expect(getItemControl(shape)).not.to.exist;

          expect(control.$parent).not.to.exist;
        }));


        it('should redo', inject(function(commandStack) {
          // when
          commandStack.undo();
          commandStack.redo();

          // then
          var control = getItemControl(shape);

          expect(control).to.exist;

          expect(control.$parent).to.exist;
          expect(control.$parent).to.equal(bo);
        }));

      });

    });


    describe('defaultControl', function() {

      beforeEach(function() {

        // given
        bo = getDefinition(shape);
        button = getAddDefaultControlButton(container);

        // when
        TestHelper.triggerEvent(button, 'click');

      });


      describe('in the DOM', function() {

        it('should execute', function() {
          // then
          expect(isAddDefaultControlButtonHidden(container)).to.be.true;
          expect(isRemoveDefaultControlButtonHidden(container)).to.be.false;

          expect(isDefaultControlRuleInputHidden(container, 'manualActivationRule')).to.be.false;
          expect(isDefaultControlRuleInputHidden(container, 'requiredRule')).to.be.false;
          expect(isDefaultControlRuleInputHidden(container, 'repetitionRule')).to.be.false;
        });

        it('should undo', inject(function(commandStack) {
          // when
          commandStack.undo();

          // then
          expect(isAddDefaultControlButtonHidden(container)).to.be.false;
          expect(isRemoveDefaultControlButtonHidden(container)).to.be.true;

          expect(isDefaultControlRuleInputHidden(container, 'manualActivationRule')).to.be.true;
          expect(isDefaultControlRuleInputHidden(container, 'requiredRule')).to.be.true;
          expect(isDefaultControlRuleInputHidden(container, 'repetitionRule')).to.be.true;
        }));


        it('should redo', inject(function(commandStack) {
          // when
          commandStack.undo();
          commandStack.redo();

          // then
          expect(isAddDefaultControlButtonHidden(container)).to.be.true;
          expect(isRemoveDefaultControlButtonHidden(container)).to.be.false;

          expect(isDefaultControlRuleInputHidden(container, 'manualActivationRule')).to.be.false;
          expect(isDefaultControlRuleInputHidden(container, 'requiredRule')).to.be.false;
          expect(isDefaultControlRuleInputHidden(container, 'repetitionRule')).to.be.false;
        }));

      });

      describe('on the business object', function() {

        it('should execute', function() {
          // then
          var control = getDefaultControl(shape);

          expect(control).to.exist;

          expect(control.$parent).to.exist;
          expect(control.$parent).to.equal(bo);
        });


        it('should undo', inject(function(commandStack) {
          var control = getDefaultControl(shape);

          // when
          commandStack.undo();

          // then
          expect(getDefaultControl(shape)).not.to.exist;

          expect(control.$parent).not.to.exist;
        }));


        it('should redo', inject(function(commandStack) {
          // when
          commandStack.undo();
          commandStack.redo();

          // then
          var control = getDefaultControl(shape);

          expect(control).to.exist;

          expect(control.$parent).to.exist;
          expect(control.$parent).to.equal(bo);
        }));

      });

    });

  });


  describe('remove', function() {

    var shape, bo, control, button, container;

    beforeEach(inject(function(elementRegistry, selection, propertiesPanel) {

      // given
      shape = elementRegistry.get('PI_ALL_RULES');
      selection.select(shape);
      container = propertiesPanel._container;

    }));

    describe('itemControl', function() {

      beforeEach(function() {

        // given
        bo = getBusinessObject(shape);
        control = getItemControl(shape);
        button = getRemoveItemControlButton(container);

        // when
        TestHelper.triggerEvent(button, 'click');

      });


      describe('in the DOM', function() {

        it('should execute', function() {
          // then
          expect(isAddItemControlButtonHidden(container)).to.be.false;
          expect(isRemoveItemControlButtonHidden(container)).to.be.true;

          expect(isItemControlRuleInputHidden(container, 'manualActivationRule')).to.be.true;
          expect(isItemControlRuleInputHidden(container, 'requiredRule')).to.be.true;
          expect(isItemControlRuleInputHidden(container, 'repetitionRule')).to.be.true;
        });

        it('should undo', inject(function(commandStack) {
          // when
          commandStack.undo();

          // then
          expect(isAddItemControlButtonHidden(container)).to.be.true;
          expect(isRemoveItemControlButtonHidden(container)).to.be.false;

          expect(isItemControlRuleInputHidden(container, 'manualActivationRule')).to.be.false;
          expect(isItemControlRuleInputHidden(container, 'requiredRule')).to.be.false;
          expect(isItemControlRuleInputHidden(container, 'repetitionRule')).to.be.false;
        }));


        it('should redo', inject(function(commandStack) {
          // when
          commandStack.undo();
          commandStack.redo();

          // then
          expect(isAddItemControlButtonHidden(container)).to.be.false;
          expect(isRemoveItemControlButtonHidden(container)).to.be.true;

          expect(isItemControlRuleInputHidden(container, 'manualActivationRule')).to.be.true;
          expect(isItemControlRuleInputHidden(container, 'requiredRule')).to.be.true;
          expect(isItemControlRuleInputHidden(container, 'repetitionRule')).to.be.true;
        }));

      });

      describe('on the business object', function() {

        it('should execute', function() {
          // then
          expect(bo.get('itemControl')).not.to.exist;
          expect(control.$parent).not.to.exist;
        });


        it('should undo', inject(function(commandStack) {
          // when
          commandStack.undo();

          // then
          expect(bo.get('itemControl')).to.exist;
          expect(control.$parent).to.exist;
          expect(control.$parent).to.equal(bo);
        }));


        it('should redo', inject(function(commandStack) {
          // when
          commandStack.undo();
          commandStack.redo();

          // then
          expect(bo.get('itemControl')).not.to.exist;
          expect(control.$parent).not.to.exist;
        }));

      });

    });


    describe('defaultControl', function() {

      beforeEach(function() {

        // given
        bo = getDefinition(shape);
        control = getDefaultControl(shape);
        button = getRemoveDefaultControlButton(container);

        // when
        TestHelper.triggerEvent(button, 'click');

      });

      describe('in the DOM', function() {

        it('should execute', function() {
          // then
          expect(isAddDefaultControlButtonHidden(container)).to.be.false;
          expect(isRemoveDefaultControlButtonHidden(container)).to.be.true;

          expect(isDefaultControlRuleInputHidden(container, 'manualActivationRule')).to.be.true;
          expect(isDefaultControlRuleInputHidden(container, 'requiredRule')).to.be.true;
          expect(isDefaultControlRuleInputHidden(container, 'repetitionRule')).to.be.true;
        });

        it('should undo', inject(function(commandStack) {
          // when
          commandStack.undo();

          // then
          expect(isAddDefaultControlButtonHidden(container)).to.be.true;
          expect(isRemoveDefaultControlButtonHidden(container)).to.be.false;

          expect(isDefaultControlRuleInputHidden(container, 'manualActivationRule')).to.be.false;
          expect(isDefaultControlRuleInputHidden(container, 'requiredRule')).to.be.false;
          expect(isDefaultControlRuleInputHidden(container, 'repetitionRule')).to.be.false;
        }));


        it('should redo', inject(function(commandStack) {
          // when
          commandStack.undo();
          commandStack.redo();

          // then
          expect(isAddDefaultControlButtonHidden(container)).to.be.false;
          expect(isRemoveDefaultControlButtonHidden(container)).to.be.true;

          expect(isDefaultControlRuleInputHidden(container, 'manualActivationRule')).to.be.true;
          expect(isDefaultControlRuleInputHidden(container, 'requiredRule')).to.be.true;
          expect(isDefaultControlRuleInputHidden(container, 'repetitionRule')).to.be.true;
        }));

      });

      describe('on the business object', function() {

        it('should execute', function() {
          // then
          expect(bo.get('defaultControl')).not.to.exist;
          expect(control.$parent).not.to.exist;
        });


        it('should undo', inject(function(commandStack) {
          // when
          commandStack.undo();

          // then
          expect(bo.get('defaultControl')).to.exist;
          expect(control.$parent).to.exist;
          expect(control.$parent).to.equal(bo);
        }));


        it('should redo', inject(function(commandStack) {
          // when
          commandStack.undo();
          commandStack.redo();

          // then
          expect(bo.get('defaultControl')).not.to.exist;
          expect(control.$parent).not.to.exist;
        }));

      });

    });


    describe('# itemControl', function() {

      var rule, condition, field;

      beforeEach(function() {
        // given
        bo = getBusinessObject(shape);
        control = getItemControl(shape);
      });

      describe('should remove', function() {


        describe('manualActivationRule', function() {

          beforeEach(function() {

            // given
            rule = control.get('manualActivationRule');
            condition = rule.get('condition');
            field = getItemControlRuleInput(container, 'manualActivationRule');

            // when
            TestHelper.triggerValue(field, '', 'change');

          });

          describe('in the DOM', function() {

            it('should execute', function() {
              // then
              expect(field.value).to.equal('');
            });

            it('should undo', inject(function(commandStack) {
              // when
              commandStack.undo();

              // then
              expect(field.value).to.equal('ITEM_MANUAL');
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
              expect(control.get('manualActivationRule')).not.to.exist;

              expect(rule.$parent).not.to.exist;
              expect(rule.get('condition')).not.to.exist;

              expect(condition.$parent).not.to.exist;
              expect(condition.get('body')).not.to.exist;
            });

            it('should undo', inject(function(commandStack) {
              // when
              commandStack.undo();

              // then
              expect(field.value).to.equal('ITEM_MANUAL');
            }));


            it('should redo', inject(function(commandStack) {
              // when
              commandStack.undo();
              commandStack.redo();

              // then
              expect(control.get('manualActivationRule')).not.to.exist;

              expect(rule.$parent).not.to.exist;
              expect(rule.get('condition')).not.to.exist;

              expect(condition.$parent).not.to.exist;
              expect(condition.get('body')).not.to.exist;
            }));

          });

        });


        describe('requiredRule', function() {

          beforeEach(function() {

            // given
            rule = control.get('requiredRule');
            condition = rule.get('condition');
            field = getItemControlRuleInput(container, 'requiredRule');

            // when
            TestHelper.triggerValue(field, '', 'change');

          });

          describe('in the DOM', function() {

            it('should execute', function() {
              // then
              expect(field.value).to.equal('');
            });

            it('should undo', inject(function(commandStack) {
              // when
              commandStack.undo();

              // then
              expect(field.value).to.equal('ITEM_REQUIRED');
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
              expect(control.get('requiredRule')).not.to.exist;

              expect(rule.$parent).not.to.exist;
              expect(rule.get('condition')).not.to.exist;

              expect(condition.$parent).not.to.exist;
              expect(condition.get('body')).not.to.exist;
            });

            it('should undo', inject(function(commandStack) {
              // when
              commandStack.undo();

              // then
              expect(field.value).to.equal('ITEM_REQUIRED');
            }));


            it('should redo', inject(function(commandStack) {
              // when
              commandStack.undo();
              commandStack.redo();

              // then
              expect(control.get('requiredRule')).not.to.exist;

              expect(rule.$parent).not.to.exist;
              expect(rule.get('condition')).not.to.exist;

              expect(condition.$parent).not.to.exist;
              expect(condition.get('body')).not.to.exist;
            }));

          });

        });


        describe('repetitionRule', function() {

          beforeEach(function() {

            // given
            rule = control.get('repetitionRule');
            condition = rule.get('condition');
            field = getItemControlRuleInput(container, 'repetitionRule');

            // when
            TestHelper.triggerValue(field, '', 'change');

          });

          describe('in the DOM', function() {

            it('should execute', function() {
              // then
              expect(field.value).to.equal('');
            });

            it('should undo', inject(function(commandStack) {
              // when
              commandStack.undo();

              // then
              expect(field.value).to.equal('ITEM_REPETITION');
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
              expect(control.get('repetitionRule')).not.to.exist;

              expect(rule.$parent).not.to.exist;
              expect(rule.get('condition')).not.to.exist;

              expect(condition.$parent).not.to.exist;
              expect(condition.get('body')).not.to.exist;
            });

            it('should undo', inject(function(commandStack) {
              // when
              commandStack.undo();

              // then
              expect(field.value).to.equal('ITEM_REPETITION');
            }));


            it('should redo', inject(function(commandStack) {
              // when
              commandStack.undo();
              commandStack.redo();

              // then
              expect(control.get('repetitionRule')).not.to.exist;

              expect(rule.$parent).not.to.exist;
              expect(rule.get('condition')).not.to.exist;

              expect(condition.$parent).not.to.exist;
              expect(condition.get('body')).not.to.exist;
            }));

          });

        });

      });


      describe('# defaultControl', function() {

        var rule, condition, field;

        beforeEach(function() {
          // given
          bo = getDefinition(shape);
          control = getDefaultControl(shape);
        });

        describe('should remove', function() {


          describe('manualActivationRule', function() {

            beforeEach(function() {

              // given
              rule = control.get('manualActivationRule');
              condition = rule.get('condition');
              field = getDefaultControlRuleInput(container, 'manualActivationRule');

              // when
              TestHelper.triggerValue(field, '', 'change');

            });

            describe('in the DOM', function() {

              it('should execute', function() {
                // then
                expect(field.value).to.equal('');
              });

              it('should undo', inject(function(commandStack) {
                // when
                commandStack.undo();

                // then
                expect(field.value).to.equal('DEF_MANUAL');
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
                expect(control.get('manualActivationRule')).not.to.exist;

                expect(rule.$parent).not.to.exist;
                expect(rule.get('condition')).not.to.exist;

                expect(condition.$parent).not.to.exist;
                expect(condition.get('body')).not.to.exist;
              });

              it('should undo', inject(function(commandStack) {
                // when
                commandStack.undo();

                // then
                expect(field.value).to.equal('DEF_MANUAL');
              }));


              it('should redo', inject(function(commandStack) {
                // when
                commandStack.undo();
                commandStack.redo();

                // then
                expect(control.get('manualActivationRule')).not.to.exist;

                expect(rule.$parent).not.to.exist;
                expect(rule.get('condition')).not.to.exist;

                expect(condition.$parent).not.to.exist;
                expect(condition.get('body')).not.to.exist;
              }));

            });

          });


          describe('requiredRule', function() {

            beforeEach(function() {

              // given
              rule = control.get('requiredRule');
              condition = rule.get('condition');
              field = getDefaultControlRuleInput(container, 'requiredRule');

              // when
              TestHelper.triggerValue(field, '', 'change');

            });

            describe('in the DOM', function() {

              it('should execute', function() {
                // then
                expect(field.value).to.equal('');
              });

              it('should undo', inject(function(commandStack) {
                // when
                commandStack.undo();

                // then
                expect(field.value).to.equal('DEF_REQUIRED');
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
                expect(control.get('requiredRule')).not.to.exist;

                expect(rule.$parent).not.to.exist;
                expect(rule.get('condition')).not.to.exist;

                expect(condition.$parent).not.to.exist;
                expect(condition.get('body')).not.to.exist;
              });

              it('should undo', inject(function(commandStack) {
                // when
                commandStack.undo();

                // then
                expect(field.value).to.equal('DEF_REQUIRED');
              }));


              it('should redo', inject(function(commandStack) {
                // when
                commandStack.undo();
                commandStack.redo();

                // then
                expect(control.get('requiredRule')).not.to.exist;

                expect(rule.$parent).not.to.exist;
                expect(rule.get('condition')).not.to.exist;

                expect(condition.$parent).not.to.exist;
                expect(condition.get('body')).not.to.exist;
              }));

            });

          });


          describe('repetitionRule', function() {

            beforeEach(function() {

              // given
              rule = control.get('repetitionRule');
              condition = rule.get('condition');
              field = getDefaultControlRuleInput(container, 'repetitionRule');

              // when
              TestHelper.triggerValue(field, '', 'change');

            });

            describe('in the DOM', function() {

              it('should execute', function() {
                // then
                expect(field.value).to.equal('');
              });

              it('should undo', inject(function(commandStack) {
                // when
                commandStack.undo();

                // then
                expect(field.value).to.equal('DEF_REPETITION');
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
                expect(control.get('repetitionRule')).not.to.exist;

                expect(rule.$parent).not.to.exist;
                expect(rule.get('condition')).not.to.exist;

                expect(condition.$parent).not.to.exist;
                expect(condition.get('body')).not.to.exist;
              });

              it('should undo', inject(function(commandStack) {
                // when
                commandStack.undo();

                // then
                expect(field.value).to.equal('DEF_REPETITION');
              }));


              it('should redo', inject(function(commandStack) {
                // when
                commandStack.undo();
                commandStack.redo();

                // then
                expect(control.get('repetitionRule')).not.to.exist;

                expect(rule.$parent).not.to.exist;
                expect(rule.get('condition')).not.to.exist;

                expect(condition.$parent).not.to.exist;
                expect(condition.get('body')).not.to.exist;
              }));

            });

          });

        });

      });

    });

  });


  describe('validation', function() {

    describe('warnings', function() {

      it('should not be shown if default control rule is not overwritten',
        inject(function(elementRegistry, selection, propertiesPanel) {

          // given
          var shape = elementRegistry.get('PI_DEF_MANUAL');
          var container = propertiesPanel._container;

          // when
          selection.select(shape);

          // then
          expect(domClasses(getDefaultControlRuleInput(container, 'manualActivationRule')).has('warning')).to.be.false;
        })
      );


      it('should be shown if default control rule is overwritten',
        inject(function(elementRegistry, selection, propertiesPanel) {

          // given
          var shape = elementRegistry.get('PI_ALL_RULES');
          var container = propertiesPanel._container;

          // when
          selection.select(shape);

          // then
          expect(domClasses(getDefaultControlRuleInput(container, 'manualActivationRule')).has('warning')).to.be.true;
        })
      );

    });

  });

});
