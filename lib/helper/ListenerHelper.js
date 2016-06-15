'use strict';

function getListenerType(listener) {
  var cls = listener && listener.get('class'),
      expression = listener && listener.get('expression'),
      delegateExpression = listener && listener.get('delegateExpression'),
      script = listener && listener.get('script');

  if (cls !== undefined) {
    return 'class';
  }

  if (expression !== undefined) {
    return 'expression';
  }

  if (delegateExpression !== undefined) {
    return 'delegateExpression';
  }

  if (script !== undefined) {
    return 'script';
  }

  return 'class';
}

module.exports.getListenerType = getListenerType;