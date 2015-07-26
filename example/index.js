var Vaulted = require('../'),
    express = require('express'),
    vault = new Vaulted({
      addr: 'http://vault:8200'
    }),
    app = express(),
    server;

app.get('/', function(req, res) {
  res.send('hi');
});

server = app.listen(3000, function () {
  var
    host = server.address().address,
    port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);

});

