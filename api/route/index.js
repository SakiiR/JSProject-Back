const userController = require('../controller/user'); // Import du contrôleur

module.exports = (app) => {
  app.route('/users').get(userController.getAll);
  app.route('/users').post(userController.create);
  app.route('/users/:id').get(userController.get);
  app.route('/users/:id').put(userController.update);
  app.route('/users/:id').delete(userController.delete);

  app.use((req, res) => { // Middleware pour capturer une requête qui ne match aucune des routes définies plus tôt
    res.status(404).json({url: req.originalUrl, error: 'not found'});
  });
};