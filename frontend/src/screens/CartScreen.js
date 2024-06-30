// Importation des modules nécessaires depuis les bibliothèques tierces
import { useContext } from 'react'; // Hook pour utiliser le contexte React
import { Store } from '../Store'; // Importation du contexte personnalisé Store
import { Helmet } from 'react-helmet-async'; // Gestion des balises <head> pour les métadonnées
import Row from 'react-bootstrap/Row'; // Composant Row de react-bootstrap
import Col from 'react-bootstrap/Col'; // Composant Col de react-bootstrap
import MessageBox from '../components/MessageBox'; // Composant personnalisé pour afficher les messages
import ListGroup from 'react-bootstrap/ListGroup'; // Composant ListGroup de react-bootstrap
import Button from 'react-bootstrap/Button'; // Composant Button de react-bootstrap
import Card from 'react-bootstrap/Card'; // Composant Card de react-bootstrap

import { Link, useNavigate } from 'react-router-dom'; // Composants pour la navigation et les liens
import axios from 'axios'; // Bibliothèque pour faire des requêtes HTTP

// Composant fonctionnel principal pour l'écran du panier
export default function CartScreen() {
  const navigate = useNavigate(); // Hook pour naviguer programatiquement
  const { state, dispatch: ctxDispatch } = useContext(Store); // Utilisation du contexte Store
  const {
    cart: { cartItems }, // Extraction des éléments du panier depuis l'état global
  } = state;

  // Fonction pour mettre à jour la quantité d'un article dans le panier
  const updateCartHandler = async (item, quantity) => {
    const { data } = await axios.get(`/api/products/${item._id}`); // Récupération des données du produit depuis l'API
    if (data.countInStock < quantity) { // Vérification du stock disponible
      window.alert('Sorry. Product is out of stock'); // Alerte si le produit est en rupture de stock
      return;
    }
    ctxDispatch({
      type: 'CART_ADD_ITEM', // Dispatch d'une action pour ajouter l'article au panier
      payload: { ...item, quantity },
    });
  };

  // Fonction pour retirer un article du panier
  const removeItemHandler = (item) => {
    ctxDispatch({ type: 'CART_REMOVE_ITEM', payload: item }); // Dispatch d'une action pour retirer l'article du panier
  };

  // Fonction pour gérer le processus de passage à la caisse
  const checkoutHandler = () => {
    navigate('/signin?redirect=/shipping'); // Redirection vers la page de connexion si l'utilisateur n'est pas connecté
  };

  return (
    <div>
      <Helmet>
        <title>Panier</title> {/* Définition du titre de la page */}
      </Helmet>
      <h1>Panier</h1> {/* Titre de la page */}
      <Row>
        <Col md={8}>
          {cartItems.length === 0 ? ( // Affichage conditionnel basé sur la présence d'articles dans le panier
            <MessageBox>
              Le panier est vide. <Link to="/">Go Shopping</Link> {/* Message si le panier est vide */}
            </MessageBox>
          ) : (
            <ListGroup>
              {cartItems.map((item) => ( // Boucle pour afficher chaque article du panier
                <ListGroup.Item key={item._id}>
                  <Row className="align-items-center">
                    <Col md={4}>
                      <img
                        src={item.image}
                        alt={item.name}
                        className="img-fluid rounded img-thumbnail"
                      /> {/* Affichage de l'image de l'article */}
                      <Link to={`/product/${item.slug}`}>{item.name}</Link> {/* Lien vers la page du produit */}
                    </Col>
                    <Col md={3}>
                      <Button
                        onClick={() => updateCartHandler(item, item.quantity - 1)}
                        variant="light"
                        disabled={item.quantity === 1}
                      >
                        <i className="fas fa-minus-circle"></i> {/* Bouton pour diminuer la quantité */}
                      </Button>{' '}
                      <span>{item.quantity}</span>{' '}
                      <Button
                        variant="light"
                        onClick={() => updateCartHandler(item, item.quantity + 1)}
                        disabled={item.quantity === item.countInStock}
                      >
                        <i className="fas fa-plus-circle"></i> {/* Bouton pour augmenter la quantité */}
                      </Button>
                    </Col>
                    <Col md={3}>${item.price}</Col> {/* Affichage du prix de l'article */}
                    <Col md={2}>
                      <Button
                        onClick={() => removeItemHandler(item)}
                        variant="light"
                      >
                        <i className="fas fa-trash"></i> {/* Bouton pour retirer l'article du panier */}
                      </Button>
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Col>
        <Col md={4}>
          <Card>
            <Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <h3>
                    Total ({cartItems.reduce((a, c) => a + c.quantity, 0)}{' '}
                    articles) : ${cartItems.reduce((a, c) => a + c.price * c.quantity, 0)}
                  </h3> {/* Calcul et affichage du total des articles et du prix */}
                </ListGroup.Item>
                <ListGroup.Item>
                  <div className="d-grid">
                    <Button
                      type="button"
                      variant="primary"
                      onClick={checkoutHandler}
                      disabled={cartItems.length === 0}
                    >
                      Payer maintenant
                    </Button> {/* Bouton pour passer à la caisse */}
                  </div>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
