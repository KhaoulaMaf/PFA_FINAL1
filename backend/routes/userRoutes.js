import express from 'express'; // Importation d'Express pour créer le routeur
import bcrypt from 'bcryptjs'; // Importation de bcryptjs pour le hachage des mots de passe
import expressAsyncHandler from 'express-async-handler'; // Importation de express-async-handler pour gérer les exceptions dans les routes asynchrones
import User from '../models/userModel.js'; // Importation du modèle d'utilisateur
import { isAuth, isAdmin, generateToken } from '../utils.js'; // Importation des middlewares d'authentification et d'autorisation, et de la fonction de génération de token

const userRouter = express.Router(); // Création d'un routeur Express

// Route pour obtenir tous les utilisateurs (nécessite authentification et autorisation admin)
userRouter.get(
  '/',
  isAuth, // Middleware d'authentification
  isAdmin, // Middleware d'autorisation admin
  expressAsyncHandler(async (req, res) => {
    const users = await User.find({}); // Recherche de tous les utilisateurs
    res.send(users); // Envoi des utilisateurs en réponse
  })
);

// Route pour obtenir un utilisateur par ID (nécessite authentification et autorisation admin)
userRouter.get(
  '/:id',
  isAuth, // Middleware d'authentification
  isAdmin, // Middleware d'autorisation admin
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id); // Recherche de l'utilisateur par ID
    if (user) {
      res.send(user); // Envoi de l'utilisateur en réponse
    } else {
      res.status(404).send({ message: 'User Not Found' }); // Envoi de la réponse si l'utilisateur n'est pas trouvé
    }
  })
);

// Route pour mettre à jour un utilisateur par ID (nécessite authentification et autorisation admin)
userRouter.put(
  '/:id',
  isAuth, // Middleware d'authentification
  //isAdmin, // Middleware d'autorisation admin
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id); // Recherche de l'utilisateur par ID
    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.isAdmin = Boolean(req.body.isAdmin);
      const updatedUser = await user.save(); // Sauvegarde des modifications
      res.send({ message: 'User Updated', user: updatedUser }); // Envoi de la réponse
    } else {
      res.status(404).send({ message: 'User Not Found' }); // Envoi de la réponse si l'utilisateur n'est pas trouvé
    }
  })
);

// Route pour supprimer un utilisateur par ID (nécessite authentification et autorisation admin)
userRouter.delete(
  '/:id',
  isAuth, // Middleware d'authentification
  isAdmin, // Middleware d'autorisation admin
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id); // Recherche de l'utilisateur par ID
    if (user) {
      if (user.email === 'boutabia@example.com') {
        res.status(400).send({ message: 'Can Not Delete Admin User' }); // Vérification pour ne pas supprimer l'utilisateur admin par défaut
        return;
      }
      await user.deleteOne(); // Suppression de l'utilisateur
      res.send({ message: 'User Deleted' }); // Envoi de la réponse
    } else {
      res.status(404).send({ message: 'User Not Found' }); // Envoi de la réponse si l'utilisateur n'est pas trouvé
    }
  })
);

// Route pour se connecter
userRouter.post(
  '/signin',
  expressAsyncHandler(async (req, res) => {
    const user = await User.findOne({ email: req.body.email }); // Recherche de l'utilisateur par email
    if (user) {
      if (bcrypt.compareSync(req.body.password, user.password)) {
        res.send({
          _id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
          token: generateToken(user), // Génération et envoi du token
        });
        return;
      }
    }
    res.status(401).send({ message: 'Invalid email or password' }); // Envoi de la réponse si les identifiants sont incorrects
  })
);

// Route pour s'inscrire
userRouter.post(
  '/signup',
  expressAsyncHandler(async (req, res) => {
    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password), // Hachage du mot de passe
    });
    const user = await newUser.save(); // Sauvegarde du nouvel utilisateur
    res.send({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user), // Génération et envoi du token
    });
  })
);

// Route pour mettre à jour le profil de l'utilisateur connecté
userRouter.put(
  '/profile',
  isAuth, // Middleware d'authentification
  expressAsyncHandler(async (req, res) => {
    try{
      const user = await User.findById(req.user._id); // Recherche de l'utilisateur par ID
      if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        if (req.body.password) {
          user.password = bcrypt.hashSync(req.body.password, 8); // Hachage du nouveau mot de passe si fourni
        }
  
        const updatedUser = await user.save(); // Sauvegarde des modifications
        res.send({
          _id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          isAdmin: updatedUser.isAdmin,
          token: generateToken(updatedUser), // Génération et envoi du token mis à jour
        });
      } else {
        res.status(404).send({ message: 'User not found' }); // Envoi de la réponse si l'utilisateur n'est pas trouvé
      }
    }catch(error){
      console.log(error);
    }
   
  })
);

export default userRouter; // Exportation du routeur d'utilisateurs
