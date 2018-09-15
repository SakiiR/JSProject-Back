var app = require('./app');
var config = require('./config');
var port = process.env.API_PORT || config['API_PORT'];

var server = app.listen(port, function() {
  console.log('Express server listening on port ' + port);
});
