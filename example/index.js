var Vaulted = require('../'),
    express = require('express'),
    vault = new Vaulted({
      vault_url: 'http://192.168.59.103:8200'
    }),
    app = express(),
    server;

app.get('/', function(req, res) {
  vault.getSealedStatus();

  res.send('hi');
});

server = app.listen(3000, function () {
  var
    host = server.address().address,
    port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);

});


