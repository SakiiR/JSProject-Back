const user = require('../model/User'); // On en a déjà parlé, vous vous en rappelez?
const mongoose = require('mongoose'); // Import du schéma
const User = mongoose.model('User', user); // Création du modèle à partir du schéma

function respond(err, result, res) { // Fonction utilisée tout au long du contrôleur pour répondre
  if (err) {
    return res.status(500).json({error: err});
  }
  return res.json(result);
}

const userController = {
  getAll: (req, res) => {  // Récupérer tous les items de la TodoList
    User.find({}, (err, users) => {
      return respond(err, users, res);
    });
  },
  create: (req, res) => { // Créer une tâche
    const newUser = new User(req.body);
    newUser.save((err, savedUser) => {
      return respond(err, savedUser, res);
    });
  },
  get: (req, res) => { // Récupérer une tâche
    User.findById(req.params.id, (err, user) => {
      return respond(err, user, res);
    });
  },
  update: (req, res) => { // Mettre à jour une tâche
    TodoItem.findByIdAndUpdate(req.params.id, req.body, (err, user) => {
      return respond(err, user, res);
    });
  },
  delete: (req, res) => { // Supprimer une tâche
    User.findByIdAndRemove(req.params.id, (err, user) => {
      return respond(err, user, res);
    });
  }
};

module.exports = userController; // Export du contrôleur