import express from 'express'; // Importation d'Express pour créer l'application web
import data from './data.js'; // Importation des données de seed
import mongoose from 'mongoose'; // Importation de Mongoose pour interagir avec MongoDB
import dotenv from 'dotenv'; // Importation de dotenv pour gérer les variables d'environnement
import seedRouter from './routes/seedRoutes.js'; // Importation du routeur de seed
import productRouter from './routes/productRoutes.js'; // Importation du routeur des produits
import userRouter from './routes/userRoutes.js'; // Importation du routeur des utilisateurs

dotenv.config(); // Chargement des variables d'environnement depuis un fichier .env

// Connexion à MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('connected to db'); // Message de succès si la connexion est réussie
  })
  .catch((err) => {
    console.log(err.message); // Message d'erreur si la connexion échoue
  });

const app = express(); // Création de l'application Express

app.use(express.json()); // Middleware pour analyser les corps des requêtes contenant des données JSON
app.use(express.urlencoded({ extended: true })); // Middleware pour analyser les corps des requêtes contenant des données URL-encodées

// Définition des routes
app.use('/api/seed', seedRouter); // Route pour initialiser les données de seed
app.use('/api/products', productRouter); // Route pour les produits
app.use('/api/users', userRouter); // Route pour les utilisateurs

// Middleware pour gérer les erreurs
app.use((err, req, res, next) => {
  res.status(500).send({ message: err.message }); // Envoi d'une réponse avec le message d'erreur
});

const port = process.env.PORT || 5000; // Définition du port sur lequel le serveur va écouter (à partir des variables d'environnement ou par défaut 5000)
app.listen(port, () => {
  console.log(`serve at http://localhost:${port}`); // Message indiquant que le serveur est en cours d'exécution
});
