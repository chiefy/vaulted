var
  _ = require('lodash');

module.exports = function createRouter(app, router) {

  function onError(res, message, error) {
    console.error(message + ': ' + error.message);
    return res.status(error.statusCode || 500).json({
      success: false,
      error: error
    });
  }

  router.param('id', function getId(req, res, next, id) {
    if (!_.isString(id) || id.length === 0) {
      throw new Error('ID parameter is not a string or zero-length');
    }
    req.id = id;
    next();
  });

  router
    .route('/mounts')
    .get(function getMounts(req, res) {
      app.vault.getMounts()
        .then(function(mounts) {
          console.info('Got mount list.');
          res.json(mounts);
        })
        .catch(function onError(err) {
          res.status(err.statusCode).json(err.error);
        });
    });

  router
    .route('/mounts/:id')
    .post(function createMount(req, res) {
      app.vault.createMount({
          body: req.body,
          id: req.id
        })
        .then(function success(mount) {
          console.info('Created new mount!');
          res.json(mount);
        })
        .catch(_.partial(onError, res, 'There was an error reading the secret'));
    });

  router.route('/secret/:id')
    .get(function getRoute(req, res) {
      app.vault.read({
          id: req.id
        })
        .then(function success(secret) {
          console.info('Succesfully wrote secret!');
          res.status(res.statusCode).json(secret);
        })
        .catch(_.partial(onError, res, 'There was an error reading the secret'));
    })
    .put(function putRoute(req, res) {
      app.vault.write({
          body: req.body,
          id: req.id
        })
        .then(function success() {
          console.info('Succesfully wrote secret!');
          res.status(res.statusCode).json({
            success: true
          });
        })
        .catch(_.partial(onError, res, 'There was an error writing the secret'));
    })
    .delete(function deleteRoute(req, res) {
      app.vault.delete({
          id: req.id
        })
        .then(function success() {
          console.info('Succesfully deleted secret!');
          res.status(res.statusCode).json({
            success: true
          });
        })
        .catch(_.partial(onError, res, 'There was an error deleting the secret'));
    });

};
