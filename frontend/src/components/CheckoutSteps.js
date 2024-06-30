import React from 'react'; // Importation de React
import Row from 'react-bootstrap/Row'; // Importation du composant Row de react-bootstrap
import Col from 'react-bootstrap/Col'; // Importation du composant Col de react-bootstrap

// Définition du composant fonctionnel CheckoutSteps
export default function CheckoutSteps(props) {
  return (
    // Utilisation du composant Row de react-bootstrap avec une classe CSS personnalisée
    <Row className="checkout-steps">
      {/* Utilisation du composant Col de react-bootstrap pour chaque étape de la procédure de paiement */}
      {/* Ajout de la classe 'active' si la prop correspondante est vraie */}
      <Col className={props.step1 ? 'active' : ''}>Sign-In</Col>
      <Col className={props.step2 ? 'active' : ''}>Shipping</Col>
      <Col className={props.step3 ? 'active' : ''}>Payment</Col>
    </Row>
  );
}
