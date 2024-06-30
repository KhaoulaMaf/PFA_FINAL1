import axios from 'axios'; // Importation de la bibliothèque pour les requêtes HTTP
import { useContext, useEffect, useReducer } from 'react'; // Importation des hooks nécessaires depuis React
import { useNavigate, useParams } from 'react-router-dom'; // Hooks pour la navigation et les paramètres de route
import Row from 'react-bootstrap/Row'; // Composant Row de react-bootstrap
import Col from 'react-bootstrap/Col'; // Composant Col de react-bootstrap
import Card from 'react-bootstrap/Card'; // Composant Card de react-bootstrap
import ListGroup from 'react-bootstrap/ListGroup'; // Composant ListGroup de react-bootstrap
import Badge from 'react-bootstrap/Badge'; // Composant Badge de react-bootstrap
import Button from 'react-bootstrap/Button'; // Composant Button de react-bootstrap
import Rating from '../components/Rating'; // Composant personnalisé pour afficher les évaluations
import { Helmet } from 'react-helmet-async'; // Pour gérer les balises <head>
import LoadingBox from '../components/LoadingBox'; // Composant pour afficher le chargement
import MessageBox from '../components/MessageBox'; // Composant pour afficher les messages d'erreur
import { getError } from '../utils'; // Fonction utilitaire pour gérer les erreurs
import { Store } from '../Store'; // Importation du contexte personnalisé Store

// Définition du reducer pour gérer les états et actions
const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, product: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

function ProductScreen() {
  const navigate = useNavigate(); // Hook pour naviguer programatiquement
  const params = useParams(); // Hook pour récupérer les paramètres de la route
  const { slug } = params; // Extraction du slug depuis les paramètres

  // Utilisation de useReducer pour gérer l'état du chargement, des erreurs et des produits
  const [{ loading, error, product }, dispatch] = useReducer(reducer, {
    product: [],
    loading: true,
    error: '',
  });

  // Utilisation de useEffect pour récupérer les données du produit
  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const result = await axios.get(`/api/products/slug/${slug}`);
        dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };
    fetchData();
  }, [slug]);

  const { state, dispatch: ctxDispatch } = useContext(Store); // Utilisation du contexte Store
  const { cart } = state; // Extraction de l'état du panier

  // Fonction pour ajouter un produit au panier
  const addToCartHandler = async () => {
    const existItem = cart.cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${product._id}`);
    if (data.countInStock < quantity) {
      window.alert('Sorry. Product is out of stock'); // Alerte si le produit est en rupture de stock
      return;
    }
    ctxDispatch({
      type: 'CART_ADD_ITEM',
      payload: { ...product, quantity },
    });
    navigate('/cart'); // Navigation vers la page du panier
  };

  return loading ? (
    <LoadingBox /> // Affichage du composant de chargement
  ) : error ? (
    <MessageBox variant="danger">{error}</MessageBox> // Affichage du message d'erreur
  ) : (
    <div>
      <Row>
        <Col md={6}>
          <img
            className="img-large"
            src={product.image}
            alt={product.name}
          ></img> {/* Affichage de l'image du produit */}
        </Col>
        <Col md={3}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <Helmet>
                <title>{product.name}</title> {/* Définition du titre de la page */}
              </Helmet>
              <h1>{product.name}</h1> {/* Affichage du nom du produit */}
            </ListGroup.Item>
            <ListGroup.Item>
              <Rating
                rating={product.rating}
                numReviews={product.numReviews}
              ></Rating> {/* Affichage de l'évaluation du produit */}
            </ListGroup.Item>
            <ListGroup.Item>prix : ${product.price}</ListGroup.Item> {/* Affichage du prix du produit */}
            <ListGroup.Item>
              Description:
              <p>{product.description}</p> {/* Affichage de la description du produit */}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={3}>
          <Card>
            <Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Row>
                    <Col>prix:</Col>
                    <Col>${product.price}</Col> {/* Affichage du prix dans la carte */}
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Status:</Col>
                    <Col>
                      {product.countInStock > 0 ? (
                        <Badge bg="success">en stock</Badge> 
                      ) : (
                        <Badge bg="danger">indisponible</Badge>
                      )}
                    </Col>
                  </Row>
                </ListGroup.Item>
                {product.countInStock > 0 && (
                  <ListGroup.Item>
                    <div className="d-grid">
                      <Button onClick={addToCartHandler} variant="primary">
                        Ajouter au panier {/* Bouton pour ajouter le produit au panier */}
                      </Button>
                    </div>
                  </ListGroup.Item>
                )}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default ProductScreen; // Exportation du composant ProductScreen
