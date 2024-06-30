import React, { useContext, useEffect, useState } from 'react'; // Importation des hooks nécessaires depuis React
import { Helmet } from 'react-helmet-async'; // Pour gérer les balises <head>
import Form from 'react-bootstrap/Form'; // Composant Form de react-bootstrap
import Button from 'react-bootstrap/Button'; // Composant Button de react-bootstrap
import { useNavigate } from 'react-router-dom'; // Hook pour naviguer programatiquement
import { Store } from '../Store'; // Importation du contexte personnalisé Store
import CheckoutSteps from '../components/CheckoutSteps'; // Composant personnalisé pour les étapes de paiement

export default function ShippingAddressScreen() {
  const navigate = useNavigate(); // Hook pour naviguer programatiquement
  const { state, dispatch: ctxDispatch } = useContext(Store); // Utilisation du contexte Store
  const {
    userInfo, // Informations de l'utilisateur
    cart: { shippingAddress }, // Adresse de livraison actuelle
  } = state;
  
  // Utilisation de useState pour gérer l'état des champs du formulaire
  const [fullName, setFullName] = useState(shippingAddress.fullName || '');
  const [address, setAddress] = useState(shippingAddress.address || '');
  const [city, setCity] = useState(shippingAddress.city || '');
  const [postalCode, setPostalCode] = useState(shippingAddress.postalCode || '');
  const [country, setCountry] = useState(shippingAddress.country || '');
  
  // Utilisation de useEffect pour rediriger si l'utilisateur n'est pas connecté
  useEffect(() => {
    if (!userInfo) {
      navigate('/signin?redirect=/shipping'); // Redirection vers la page de connexion
    }
  }, [userInfo, navigate]);

  // Fonction pour gérer la soumission du formulaire
  const submitHandler = (e) => {
    e.preventDefault();
    ctxDispatch({
      type: 'SAVE_SHIPPING_ADDRESS', // Dispatch de l'action pour sauvegarder l'adresse de livraison
      payload: {
        fullName,
        address,
        city,
        postalCode,
        country,
      },
    });
    localStorage.setItem(
      'shippingAddress',
      JSON.stringify({
        fullName,
        address,
        city,
        postalCode,
        country,
      })
    ); // Enregistrement de l'adresse de livraison dans le localStorage
    navigate('/payment'); // Redirection vers la page de paiement
  };
  
  return (
    <div>
      <Helmet>
        <title>Infos personnelles</title> {/* Définition du titre de la page */}
      </Helmet>

      <CheckoutSteps step1 step2></CheckoutSteps> {/* Composant pour afficher les étapes de paiement */}
      <div className="container small-container">
        <h1 className="my-3">Shipping Address</h1> {/* Titre de la page */}
        <Form onSubmit={submitHandler}> {/* Formulaire pour entrer l'adresse de livraison */}
          <Form.Group className="mb-3" controlId="fullName">
            <Form.Label>Nom complet</Form.Label> {/* Étiquette pour le champ du nom complet */}
            <Form.Control
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            /> {/* Champ de saisie pour le nom complet */}
          </Form.Group>
          <Form.Group className="mb-3" controlId="address">
            <Form.Label>Addresse</Form.Label> {/* Étiquette pour le champ de l'adresse */}
            <Form.Control
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            /> {/* Champ de saisie pour l'adresse */}
          </Form.Group>
          <Form.Group className="mb-3" controlId="city">
            <Form.Label>ville</Form.Label> {/* Étiquette pour le champ de la ville */}
            <Form.Control
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
            /> {/* Champ de saisie pour la ville */}
          </Form.Group>
          <Form.Group className="mb-3" controlId="postalCode">
            <Form.Label>Code postal</Form.Label> {/* Étiquette pour le champ du code postal */}
            <Form.Control
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              required
            /> {/* Champ de saisie pour le code postal */}
          </Form.Group>
          <Form.Group className="mb-3" controlId="country">
            <Form.Label>pays</Form.Label> {/* Étiquette pour le champ du pays */}
            <Form.Control
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              required
            /> {/* Champ de saisie pour le pays */}
          </Form.Group>
          <div className="mb-3">
            <Button variant="primary" type="submit">
              Continuer {/* Bouton pour soumettre le formulaire */}
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}
