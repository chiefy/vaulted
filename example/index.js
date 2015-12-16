var
  Vaulted = require('vaulted'),
  express = require('express'),
  app = express(),
  router = express.Router(),
  body_parser = require('body-parser').json(),
  server;

app.use(body_parser);
app.use(router);

require('./routes.js')(app, router);

server = app.listen(process.env.PORT || 3000, function() {
  var
    host = server.address().address,
    port = server.address().port;

  app.vault = new Vaulted();

  app.vault
    .init()
    .bind(app.vault)
    .then(app.vault.unSeal)
    .catch(function caughtError(err) {
      console.error('Could not initialize or unseal vault.' + err.message);
      process.exit(1);
    });

  console.log('Vaulted example server listening at http://%s:%s', host, port);

});

