var IO = require('matthewmueller-io'),
    parse = require('component-url').parse;

/**
 * parse the URL
 */

var url = parse(window.location);
var io = IO('ws://localhost:9000' + url.pathname);

/**
 * Socket
 */

io.emit('test', 'hello')

io.on('test', function(message) {
  console.log('message', message);
})
