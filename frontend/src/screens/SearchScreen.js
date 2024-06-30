import React, { useEffect, useReducer, useState } from 'react'; // Importation des hooks nécessaires depuis React
import { Link, useNavigate, useLocation } from 'react-router-dom'; // Hooks pour la navigation et les paramètres de route
import axios from 'axios'; // Importation de la bibliothèque pour les requêtes HTTP
import { toast } from 'react-toastify'; // Importation de la bibliothèque pour afficher les notifications toast
import { getError } from '../utils'; // Importation de la fonction utilitaire pour gérer les erreurs
import { Helmet } from 'react-helmet-async'; // Pour gérer les balises <head>
import Row from 'react-bootstrap/Row'; // Composant Row de react-bootstrap
import Col from 'react-bootstrap/Col'; // Composant Col de react-bootstrap
import LoadingBox from '../components/LoadingBox'; // Composant pour afficher le chargement
import MessageBox from '../components/MessageBox'; // Composant pour afficher les messages d'erreur
import Button from 'react-bootstrap/Button'; // Composant Button de react-bootstrap
import Product from '../components/Product'; // Composant personnalisé pour afficher un produit

// Définition du reducer pour gérer les états et actions
const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        products: action.payload.products,
        loading: false,
      };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default function SearchScreen() {
  const navigate = useNavigate(); // Hook pour naviguer programatiquement
  const { search } = useLocation(); // Hook pour récupérer les paramètres de la recherche dans l'URL
  const sp = new URLSearchParams(search); // Création d'un objet URLSearchParams pour analyser les paramètres de recherche
  const category = sp.get('category') || 'all'; // Récupération de la catégorie depuis les paramètres de recherche
  const query = sp.get('query') || 'all'; // Récupération de la requête depuis les paramètres de recherche

  // Utilisation de useReducer pour gérer l'état du chargement, des erreurs et des produits
  const [{ loading, error, products }, dispatch] = useReducer(reducer, {
    loading: true,
    error: '',
  });

  // Utilisation de useEffect pour récupérer les données des produits correspondant à la recherche
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(
          `/api/products/search?query=${query}&category=${category}`
        );
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({
          type: 'FETCH_FAIL',
          payload: getError(err),
        });
      }
    };
    fetchData();
  }, [category, query]);

  const [categories, setCategories] = useState([]); // État pour les catégories de produits
  // Utilisation de useEffect pour récupérer les catégories de produits
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(`/api/products/categories`);
        setCategories(data);
      } catch (err) {
        toast.error(getError(err));
      }
    };
    fetchCategories();
  }, []);

  // Fonction pour obtenir l'URL de filtre basé sur la catégorie et la requête
  const getFilterUrl = (filter) => {
    const filterCategory = filter.category || category;
    const filterQuery = filter.query || query;
    return `/search?category=${filterCategory}&query=${filterQuery}`;
  };

  return (
    <div>
      <Helmet>
        <title>Recherche de produits</title> {/* Définition du titre de la page */}
      </Helmet>
      <Row>
        <Col md={3}>
          <h3>CATEGORIES</h3> {/* Titre pour les catégories */}
          <div>
            <ul>
              <li>
                <Link
                  className={'all' === category ? 'text-bold' : ''}
                  to={getFilterUrl({ category: 'all' })}
                >
                  Toutes categories {/* Lien pour toutes les catégories */}
                </Link>
              </li>
              {categories.map((c) => (
                <li key={c}>
                  <Link
                    className={c === category ? 'text-bold' : ''}
                    to={getFilterUrl({ category: c })}
                  >
                    {c} {/* Lien pour chaque catégorie */}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </Col>
        <Col md={9}>
          {loading ? (
            <LoadingBox></LoadingBox> // Affichage du composant de chargement
          ) : error ? (
            <MessageBox variant="danger">{error}</MessageBox> // Affichage du message d'erreur
          ) : (
            <>
              <Row className="justify-content-between mb-3">
                <Col md={6}>
                  <div>
                    {products.length === 0 ? 'Pas de ' : products.length}{' '}
                    Resultats
                    {query !== 'all' && ' : ' + query} {/* Affichage de la requête */}
                    {category !== 'all' && ' : ' + category} {/* Affichage de la catégorie */}
                    {query !== 'all' || category !== 'all' ? (
                      <Button
                        variant="light"
                        onClick={() => navigate('/search')}
                      >
                        <i className="fas fa-times-circle"></i> {/* Bouton pour réinitialiser la recherche */}
                      </Button>
                    ) : null}
                  </div>
                </Col>
              </Row>
              {products.length === 0 && (
                <MessageBox>No Product Found</MessageBox> // Message si aucun produit n'est trouvé
              )}
              <Row>
                {products.map((product) => (
                  <Col sm={6} lg={4} className="mb-3" key={product._id}>
                    <Product product={product}></Product> {/* Affichage de chaque produit */}
                  </Col>
                ))}
              </Row>
            </>
          )}
        </Col>
      </Row>
    </div>
  );
}
