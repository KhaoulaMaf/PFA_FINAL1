import React, { useContext } from 'react'; // Importation des hooks nécessaires depuis React
import { Navigate } from 'react-router-dom'; // Importation du composant Navigate de react-router-dom pour la redirection
import { Store } from '../Store'; // Importation du contexte personnalisé Store

// Définition du composant fonctionnel ProtectedRoute
export default function ProtectedRoute({ children }) {
  // Utilisation du hook useContext pour accéder au contexte Store
  const { state } = useContext(Store);
  // Extraction des informations de l'utilisateur depuis l'état global
  const { userInfo } = state;
  
  // Vérifie si l'utilisateur est connecté
  // Si l'utilisateur est connecté, rend les enfants passés en tant que props
  // Sinon, redirige vers la page de connexion
  return userInfo ? children : <Navigate to="/signin" />;
}
