var cmd = require('./cmd');
var translate = require('diagram-js/lib/i18n/translate');

var PropertiesPanel = require('./PropertiesPanel');

module.exports = {
  __depends__: [
    cmd,
    translate
  ],
  __init__: [ 'propertiesPanel' ],
  propertiesPanel: [ 'type', PropertiesPanel ]
};
