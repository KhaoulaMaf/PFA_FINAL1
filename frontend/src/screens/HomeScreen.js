// Importation des hooks nécessaires depuis React
import { useEffect, useReducer } from 'react';
// Importation de la bibliothèque axios pour les requêtes HTTP
import axios from 'axios';
// Importation de use-reducer-logger pour le débogage du reducer
import logger from 'use-reducer-logger';
// Importation des composants de react-bootstrap
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
// Importation de composants personnalisés
import Product from '../components/Product';
import { Helmet } from 'react-helmet-async'; // Pour gérer les balises <head>
import LoadingBox from '../components/LoadingBox'; // Composant pour afficher le chargement
import MessageBox from '../components/MessageBox'; // Composant pour afficher les messages d'erreur

// Définition du reducer pour gérer les états et actions
const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST': // Action pour déclencher la requête de récupération des produits
      return { ...state, loading: true };
    case 'FETCH_SUCCESS': // Action pour gérer la réussite de la requête
      return { ...state, products: action.payload, loading: false };
    case 'FETCH_FAIL': // Action pour gérer l'échec de la requête
      return { ...state, loading: false, error: action.payload };
    default: // Action par défaut
      return state;
  }
};

function HomeScreen() {
  // Utilisation de useReducer pour gérer l'état des produits, le chargement et les erreurs
  const [{ loading, error, products }, dispatch] = useReducer(logger(reducer), {
    products: [],
    loading: true,
    error: '',
  });

  // Utilisation de useEffect pour exécuter le code après le montage du composant
  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' }); // Dispatch de l'action de requête
      try {
        const result = await axios.get('/api/products'); // Requête pour obtenir les produits
        dispatch({ type: 'FETCH_SUCCESS', payload: result.data }); // Dispatch de l'action de succès avec les données
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: err.message }); // Dispatch de l'action d'échec avec le message d'erreur
      }
    };
    fetchData(); // Appel de la fonction fetchData
  }, []);

  return (
    <div>
      <Helmet>
        <title>SCENT</title> {/* Définition du titre de la page */}
      </Helmet>
      <h1>Liste de produits</h1> {/* Titre de la page */}
      <div className="products">
        {loading ? ( // Affichage conditionnel basé sur l'état de chargement
          <LoadingBox /> // Composant de chargement
        ) : error ? ( // Affichage conditionnel basé sur l'état d'erreur
          <MessageBox variant="danger">{error}</MessageBox> // Composant d'erreur avec le message
        ) : (
          <Row>
            {products.map((product) => ( // Boucle pour afficher chaque produit
              <Col key={product.slug} sm={6} md={4} lg={3} className="mb-3">
                <Product product={product}></Product> {/* Affichage du composant Product */}
              </Col>
            ))}
          </Row>
        )}
      </div>
    </div>
  );
}

export default HomeScreen; // Exportation du composant HomeScreen
