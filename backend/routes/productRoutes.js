import express from 'express'; // Importation d'Express
import expressAsyncHandler from 'express-async-handler'; // Importation de express-async-handler pour gérer les exceptions dans les routes asynchrones
import Product from '../models/productModel.js'; // Importation du modèle de produit
import { isAuth, isAdmin } from '../utils.js'; // Importation des middlewares d'authentification et d'autorisation

const productRouter = express.Router(); // Création d'un routeur Express

// Route pour obtenir tous les produits
productRouter.get('/', async (req, res) => {
  const products = await Product.find(); // Recherche de tous les produits
  res.send(products); // Envoi des produits en réponse
});

// Route pour obtenir tous les produits pour l'administration (nécessite authentification et autorisation admin)
productRouter.get(
  '/admin',
  isAuth, // Middleware d'authentification
  isAdmin, // Middleware d'autorisation admin
  expressAsyncHandler(async (req, res) => {
    const products = await Product.find(); // Recherche de tous les produits
    res.send(products); // Envoi des produits en réponse
  })
);

// Route pour créer un nouveau produit (nécessite authentification et autorisation admin)
productRouter.post(
  '/',
  isAuth, // Middleware d'authentification
  isAdmin, // Middleware d'autorisation admin
  expressAsyncHandler(async (req, res) => {
    const newProduct = new Product({
      name: 'sample name ' + Date.now(),
      slug: 'sample-name-' + Date.now(),
      image: '/images/poison.jpg',
      price: 0,
      category: 'sample category',
      brand: 'sample brand',
      countInStock: 0,
      rating: 0,
      numReviews: 0,
      description: 'sample description',
    });
    const product = await newProduct.save(); // Sauvegarde du nouveau produit dans la base de données
    res.send({ message: 'Product Created', product }); // Envoi de la réponse avec le produit créé
  })
);

// Route pour mettre à jour un produit existant (nécessite authentification et autorisation admin)
productRouter.put(
  '/:id',
  isAuth, // Middleware d'authentification
  isAdmin, // Middleware d'autorisation admin
  expressAsyncHandler(async (req, res) => {
    const productId = req.params.id;
    const product = await Product.findById(productId); // Recherche du produit par ID
    if (product) {
      product.name = req.body.name;
      product.slug = req.body.slug;
      product.price = req.body.price;
      product.image = req.body.image;
      product.category = req.body.category;
      product.brand = req.body.brand;
      product.countInStock = req.body.countInStock;
      product.description = req.body.description;
      await product.save(); // Sauvegarde des modifications
      res.send({ message: 'Product Updated' }); // Envoi de la réponse
    } else {
      res.status(404).send({ message: 'Product Not Found' }); // Envoi de la réponse si le produit n'est pas trouvé
    }
  })
);

// Route pour supprimer un produit existant (nécessite authentification et autorisation admin)
productRouter.delete(
  '/:id',
  isAuth, // Middleware d'authentification
  isAdmin, // Middleware d'autorisation admin
  expressAsyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id); // Recherche du produit par ID
    if (product) {
      await product.deleteOne(); // Suppression du produit
      res.send({ message: 'Product Deleted' }); // Envoi de la réponse
    } else {
      res.status(404).send({ message: 'Product Not Found' }); // Envoi de la réponse si le produit n'est pas trouvé
    }
  })
);

// Route pour rechercher des produits en fonction de la catégorie et de la requête de recherche
productRouter.get(
  '/search',
  expressAsyncHandler(async (req, res) => {
    const { query } = req;
    const category = query.category || '';
    const searchQuery = query.query || '';

    const queryFilter =
      searchQuery && searchQuery !== 'all'
        ? {
            name: {
              $regex: searchQuery,
              $options: 'i', // Insensible à la casse
            },
          }
        : {};
    const categoryFilter = category && category !== 'all' ? { category } : {};

    const products = await Product.find({
      ...queryFilter,
      ...categoryFilter,
    });

    res.send({ products }); // Envoi des produits trouvés en réponse
  })
);

// Route pour obtenir toutes les catégories distinctes
productRouter.get(
  '/categories',
  expressAsyncHandler(async (req, res) => {
    const categories = await Product.find().distinct('category'); // Recherche des catégories distinctes
    res.send(categories); // Envoi des catégories en réponse
  })
);

// Route pour obtenir un produit par son slug
productRouter.get('/slug/:slug', async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug }); // Recherche du produit par slug
  if (product) {
    res.send(product); // Envoi du produit en réponse
  } else {
    res.status(404).send({ message: 'Product Not Found' }); // Envoi de la réponse si le produit n'est pas trouvé
  }
});

// Route pour obtenir un produit par son ID
productRouter.get('/:id', async (req, res) => {
  const product = await Product.findById(req.params.id); // Recherche du produit par ID
  if (product) {
    res.send(product); // Envoi du produit en réponse
  } else {
    res.status(404).send({ message: 'Product Not Found' }); // Envoi de la réponse si le produit n'est pas trouvé
  }
});

export default productRouter; // Exportation du routeur de produits
