import Spinner from 'react-bootstrap/Spinner'; // Importation du composant Spinner de react-bootstrap

// Définition du composant fonctionnel LoadingBox
export default function LoadingBox() {
  return (
    // Utilisation du composant Spinner de react-bootstrap avec une animation de type "border" et un rôle "status"
    <Spinner animation="border" role="status">
      {/* Texte caché visuellement pour les lecteurs d'écran, indiquant que le contenu est en cours de chargement */}
      <span className="visually-hidden">Loading...</span>
    </Spinner>
  );
}
