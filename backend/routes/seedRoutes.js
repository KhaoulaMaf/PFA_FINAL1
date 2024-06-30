import express from 'express'; // Importation d'Express pour créer le routeur
import data from '../data.js'; // Importation du fichier de données contenant les produits et les utilisateurs
import Product from '../models/productModel.js'; // Importation du modèle de produit
import User from '../models/userModel.js'; // Importation du modèle d'utilisateur

const seedRouter = express.Router(); // Création d'un routeur Express

// Route pour insérer des données initiales dans la base de données
seedRouter.get('/', async (req, res) => {
  await Product.deleteMany({}); // Suppression de tous les produits existants dans la base de données
  const createdProducts = await Product.insertMany(data.products); // Insertion des produits depuis data.js

  await User.deleteMany({}); // Suppression de tous les utilisateurs existants dans la base de données
  const createdUsers = await User.insertMany(data.users); // Insertion des utilisateurs depuis data.js

  // Envoi de la réponse contenant les produits et utilisateurs créés
  res.send({ createdProducts, createdUsers });
});

export default seedRouter; // Exportation du routeur de seed
