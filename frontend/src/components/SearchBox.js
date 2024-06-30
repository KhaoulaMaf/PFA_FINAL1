import React, { useState } from 'react'; // Importation des hooks nécessaires depuis React
import Button from 'react-bootstrap/Button'; // Importation du composant Button de react-bootstrap
import Form from 'react-bootstrap/Form'; // Importation du composant Form de react-bootstrap
import InputGroup from 'react-bootstrap/InputGroup'; // Importation du composant InputGroup de react-bootstrap
import FormControl from 'react-bootstrap/FormControl'; // Importation du composant FormControl de react-bootstrap
import { useNavigate } from 'react-router-dom'; // Importation du hook useNavigate de react-router-dom pour la navigation

// Définition du composant fonctionnel SearchBox
export default function SearchBox() {
  const navigate = useNavigate(); // Utilisation du hook useNavigate pour obtenir la fonction de navigation
  const [query, setQuery] = useState(''); // Utilisation du hook useState pour gérer l'état de la requête de recherche

  // Fonction pour gérer la soumission du formulaire
  const submitHandler = (e) => {
    e.preventDefault(); // Empêche le comportement par défaut du formulaire
    // Navigue vers la page de recherche avec la requête, ou vers /search si la requête est vide
    navigate(query ? `/search/?query=${query}` : '/search');
  };

  return (
    // Utilisation du composant Form de react-bootstrap avec une classe pour le style et un gestionnaire de soumission
    <Form className="d-flex me-auto" onSubmit={submitHandler}>
      <InputGroup>
        {/* Utilisation du composant FormControl de react-bootstrap pour le champ de saisie */}
        <FormControl
          type="text"
          name="q"
          id="q"
          onChange={(e) => setQuery(e.target.value)} // Met à jour l'état de la requête de recherche lorsque l'utilisateur tape
          placeholder="rechercher..." // Placeholder pour le champ de saisie
          aria-label="Search Products" // Accessibilité : étiquette pour le champ de saisie
          aria-describedby="button-search" // Accessibilité : décrit le champ de saisie par le bouton de recherche
        ></FormControl>
        {/* Bouton pour soumettre le formulaire */}
        <Button variant="outline-primary" type="submit" id="button-search">
          <i className="fas fa-search"></i> {/* Icône de recherche */}
        </Button>
      </InputGroup>
    </Form>
  );
}
