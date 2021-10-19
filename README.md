# cmmn-js-properties-panel

[![CI](https://github.com/bpmn-io/cmmn-js-properties-panel/workflows/CI/badge.svg)](https://github.com/bpmn-io/cmmn-js-properties-panel/actions?query=workflow%3ACI)

This is properties panel extension for [cmmn-js](https://github.com/bpmn-io/cmmn-js).


## Features

The properties panel allows users to edit invisible CMMN properties in a convenient way.


## Usage

Provide two HTML elements, one for the properties panel and one for the CMMN diagram:

```html
<div class="modeler">
  <div id="canvas"></div>
  <div id="properties"></div>
</div>
```

Bootstrap [cmmn-js](https://github.com/bpmn-io/cmmn-js) with the properties panel and a [properties provider](https://github.com/bpmn-io/cmmn-js-properties-panel/tree/master/lib/provider):

```javascript
var CmmnJS = require('cmmn-js/lib/Modeler'),
    propertiesPanelModule = require('cmmn-js-properties-panel'),
    propertiesProviderModule = require('cmmn-js-properties-panel/lib/provider/cmmn');

var cmmnJS = new CmmnJS({
  additionalModules: [
    propertiesPanelModule,
    propertiesProviderModule
  ],
  container: '#canvas',
  propertiesPanel: {
    parent: '#properties'
  }
});
```


### Dynamic Attach/Detach

You may attach or detach the properties panel dynamically to any element on the page, too:

```javascript
var propertiesPanel = cmmnJS.get('propertiesPanel');

// detach the panel
propertiesPanel.detach();

// attach it to some other element
propertiesPanel.attachTo('#other-properties');
```


### Use with Camunda properties

In order to be able to edit [Camunda](https://camunda.org) related properties, use the [camunda properties provider](https://github.com/bpmn-io/cmmn-js-properties-panel/tree/master/lib/provider/camunda).
In addition, you need to define the `camunda` namespace via [camunda-cmmn-moddle](https://github.com/camunda/camunda-cmmn-moddle).

```javascript
var CmmnJS = require('cmmn-js/lib/Modeler'),
    propertiesPanelModule = require('cmmn-js-properties-panel'),
    // use Camunda properties provider
    propertiesProviderModule = require('cmmn-js-properties-panel/lib/provider/camunda');

// a descriptor that defines Camunda related CMMN 1.1 XML extensions
var camundaModdleDescriptor = require('camunda-cmmn-moddle/resources/camunda');

var cmmnJS = new CmmnJS({
  additionalModules: [
    propertiesPanelModule,
    propertiesProviderModule
  ],
  container: '#canvas',
  propertiesPanel: {
    parent: '#properties'
  },
  // make camunda prefix known for import, editing and export
  moddleExtensions: {
    camunda: camundaModdleDescriptor
  }
});

...
```


## Additional Resources

* [Issue tracker](https://github.com/bpmn-io/cmmn-js-properties-panel/issues)
* [Forum](https://forum.bpmn.io)


## Development

### Running the tests

```bash
npm install

export TEST_BROWSERS=Chrome
npm run all
```


## License

MIT