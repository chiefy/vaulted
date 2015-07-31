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
    req.secret_id = id;
    next();
  });

  router.route('/secret/:id')

  .get(function getRoute(req, res) {
    app.vault.read({
        id: req.secret_id
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
        id: req.secret_id
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
        id: req.secret_id
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