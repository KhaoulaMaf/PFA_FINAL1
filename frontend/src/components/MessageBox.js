import Alert from 'react-bootstrap/Alert'; // Importation du composant Alert de react-bootstrap

// Définition du composant fonctionnel MessageBox
export default function MessageBox(props) {
  return (
    // Utilisation du composant Alert de react-bootstrap
    // Le variant est déterminé par la prop 'variant' ou par défaut 'info'
    <Alert variant={props.variant || 'info'}>
      {/* Affichage du contenu passé en tant qu'enfant */}
      {props.children}
    </Alert>
  );
}
