/**
 * Module Dependencies
 */

var port = process.argv[2] || 3000,
    express = require('express'),
    app = module.exports = express();

/**
 * Configuration
 */

app.set('views', __dirname);
app.use(express.static(__dirname))
/**
 * Routes
 */

app.get('*', function(req, res) {
  res.sendfile('./index.html');
});

/**
 * Listen
 */

if(!module.parent) {
  app.listen(port);
  console.log('Server started on port', port);
}
