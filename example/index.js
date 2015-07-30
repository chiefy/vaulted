var Vaulted = require('vaulted'),
  express = require('express'),
  app = express(),
  server;

app.get('/', function(req, res) {
  res.send('hi');
});

server = app.listen(3000, function() {
  var
    host = server.address().address,
    port = server.address().port,
    vault;

  vault = new Vaulted();
  vault
    .init()
    .then(vault.getSealedStatus.bind(vault))
    .then(vault.unSeal.bind(vault))
    .then(function(vault) {
      return vault.write({
        id: 'poop',
        body: {
          'awesome': true,
          'poopy': 'yes'
        }
      });
    })
    .then(function readSecret() {
      return vault.read({
        id: 'poop'
      });
    })
    .then(function gotSecret(secret){
      console.log('GOT SECRET!', secret);
    });

  console.log('Example app listening at http://%s:%s', host, port);

});