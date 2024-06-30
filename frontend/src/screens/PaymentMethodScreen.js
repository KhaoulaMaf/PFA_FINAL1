import React, { useContext, useEffect, useState } from 'react'; // Importation des hooks nécessaires depuis React
import { Helmet } from 'react-helmet-async'; // Pour gérer les balises <head>
import { useNavigate } from 'react-router-dom'; // Pour naviguer programatiquement
import Form from 'react-bootstrap/Form'; // Composant Form de react-bootstrap
import Button from 'react-bootstrap/Button'; // Composant Button de react-bootstrap
import CheckoutSteps from '../components/CheckoutSteps'; // Composant personnalisé pour les étapes de paiement
import { Store } from '../Store'; // Importation du contexte personnalisé Store

export default function PaymentMethodScreen() {
  const navigate = useNavigate(); // Hook pour naviguer programatiquement
  const { state, dispatch: ctxDispatch } = useContext(Store); // Utilisation du contexte Store
  const {
    cart: { shippingAddress, paymentMethod }, // Extraction de l'adresse de livraison et de la méthode de paiement depuis l'état global
  } = state;

  // Utilisation de useState pour gérer l'état de la méthode de paiement sélectionnée
  const [paymentMethodName, setPaymentMethod] = useState(
    paymentMethod || 'PayPal'
  );

  // Utilisation de useEffect pour rediriger si l'adresse de livraison n'est pas définie
  useEffect(() => {
    if (!shippingAddress.address) {
      navigate('/shipping'); // Redirection vers la page de livraison
    }
  }, [shippingAddress, navigate]);

  // Fonction pour gérer la soumission du formulaire
  const submitHandler = (e) => {
    e.preventDefault();
    ctxDispatch({ type: 'SAVE_PAYMENT_METHOD', payload: paymentMethodName }); // Dispatch de l'action pour enregistrer la méthode de paiement
    localStorage.setItem('paymentMethod', paymentMethodName); // Enregistrement de la méthode de paiement dans le localStorage
    navigate('/'); // Redirection vers la page d'accueil ou la page suivante
  };

  return (
    <div>
      <CheckoutSteps step1 step2 step3></CheckoutSteps> {/* Composant pour afficher les étapes de paiement */}
      <div className="container small-container">
        <Helmet>
          <title>Méthode de paiement</title> {/* Définition du titre de la page */}
        </Helmet>
        <h1 className="my-3">Méthode de paiement</h1> {/* Titre de la section */}
        <Form onSubmit={submitHandler}> {/* Formulaire pour sélectionner la méthode de paiement */}
          <div className="mb-3">
            <Form.Check
              type="radio"
              id="PayPal"
              label="PayPal"
              value="PayPal"
              checked={paymentMethodName === 'PayPal'}
              onChange={(e) => setPaymentMethod(e.target.value)} // Mise à jour de l'état lors de la sélection
            />
          </div>
          <div className="mb-3">
            <Form.Check
              type="radio"
              id="carte bancaire"
              label="Carte bancaire"
              value="carte bancaire"
              checked={paymentMethodName === 'carte bancaire'}
              onChange={(e) => setPaymentMethod(e.target.value)} // Mise à jour de l'état lors de la sélection
            />
          </div>
          <div className="mb-3">
            <Form.Check
              type="radio"
              id="A la livraison"
              label="A la livraison"
              value="A la livraison"
              checked={paymentMethodName === 'A la livraison'}
              onChange={(e) => setPaymentMethod(e.target.value)} // Mise à jour de l'état lors de la sélection
            />
          </div>
          <div className="mb-3">
            <Button type="submit">Continuer</Button> {/* Bouton pour soumettre le formulaire */}
          </div>
        </Form>
      </div>
    </div>
  );
}
