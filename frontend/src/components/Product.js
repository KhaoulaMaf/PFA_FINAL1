import Card from 'react-bootstrap/Card'; // Importation du composant Card de react-bootstrap
import Button from 'react-bootstrap/Button'; // Importation du composant Button de react-bootstrap
import { Link } from 'react-router-dom'; // Importation du composant Link de react-router-dom pour les liens de navigation
import Rating from './Rating'; // Importation du composant personnalisé Rating
import axios from 'axios'; // Importation de la bibliothèque pour les requêtes HTTP
import { useContext } from 'react'; // Importation du hook useContext depuis React
import { Store } from '../Store'; // Importation du contexte personnalisé Store

function Product(props) {
  // Déstructuration des props pour obtenir le produit
  const { product } = props;

  // Utilisation du hook useContext pour accéder au contexte Store
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;

  // Fonction pour ajouter le produit au panier
  const addToCartHandler = async (item) => {
    const existItem = cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    // Vérification de la disponibilité du produit en stock
    const { data } = await axios.get(`/api/products/${item._id}`);
    if (data.countInStock < quantity) {
      window.alert('Sorry. Product is out of stock'); // Affichage d'une alerte si le produit est en rupture de stock
      return;
    }
    // Dispatch de l'action pour ajouter le produit au panier
    ctxDispatch({
      type: 'CART_ADD_ITEM',
      payload: { ...item, quantity },
    });
  };

  return (
    // Utilisation du composant Card de react-bootstrap pour afficher le produit
    <Card>
      {/* Lien vers la page du produit */}
      <Link to={`/product/${product.slug}`}>
        <img src={product.image} className="card-img-top" alt={product.name} />
      </Link>
      <Card.Body>
        {/* Lien vers la page du produit avec le titre */}
        <Link to={`/product/${product.slug}`}>
          <Card.Title>{product.name}</Card.Title>
        </Link>
        {/* Composant Rating pour afficher la note du produit */}
        <Rating rating={product.rating} numReviews={product.numReviews} />
        {/* Prix du produit */}
        <Card.Text>${product.price}</Card.Text>
        {/* Bouton pour ajouter au panier ou afficher la rupture de stock */}
        {product.countInStock === 0 ? (
          <Button variant="danger" disabled>
            rupture de stock
          </Button>
        ) : (
          <Button onClick={() => addToCartHandler(product)}>
            ajouter au panier
          </Button>
        )}
      </Card.Body>
    </Card>
  );
}

export default Product; // Exportation du composant Product
