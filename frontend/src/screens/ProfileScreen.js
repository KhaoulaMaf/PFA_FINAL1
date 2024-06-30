import React, { useContext, useState } from 'react'; // Importation des hooks nécessaires depuis React
import { Helmet } from 'react-helmet-async'; // Pour gérer les balises <head>
import Form from 'react-bootstrap/Form'; // Composant Form de react-bootstrap
import Button from 'react-bootstrap/Button'; // Composant Button de react-bootstrap
import { Store } from '../Store'; // Importation du contexte personnalisé Store
import { toast } from 'react-toastify'; // Importation de la bibliothèque pour afficher les notifications toast
import { getError } from '../utils'; // Importation de la fonction utilitaire pour gérer les erreurs
import axios from 'axios'; // Importation de la bibliothèque pour les requêtes HTTP

export default function ProfileScreen() {
  const { state, dispatch: ctxDispatch } = useContext(Store); // Utilisation du contexte Store
  const { userInfo } = state; // Extraction des informations de l'utilisateur depuis l'état global

  // Utilisation de useState pour gérer l'état des champs du formulaire
  const [name, setName] = useState(userInfo.name);
  const [email, setEmail] = useState(userInfo.email);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Fonction pour gérer la soumission du formulaire
  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match'); // Notification d'erreur si les mots de passe ne correspondent pas
      return;
    }
    try {
      const { data } = await axios.put(
        '/api/users/profile',
        {
          name,
          email,
          password,
        },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` }, // Envoi du token pour l'autorisation
        }
      );

      ctxDispatch({ type: 'USER_SIGNIN', payload: data }); // Mise à jour des informations de l'utilisateur dans le contexte
      localStorage.setItem('userInfo', JSON.stringify(data)); // Mise à jour des informations de l'utilisateur dans le localStorage
      toast.success('User updated successfully'); // Notification de succès
    } catch (err) {
      toast.error(getError(err)); // Notification d'erreur
    }
  };

  return (
    <div className="container small-container">
      <Helmet>
        <title>Profil</title> {/* Définition du titre de la page */}
      </Helmet>
      <h1 className="my-3">Profil</h1> {/* Titre de la page */}
      <form onSubmit={submitHandler}> {/* Formulaire pour mettre à jour le profil */}
        <Form.Group className="mb-3" controlId="name">
          <Form.Label>Nom</Form.Label> {/* Étiquette pour le champ du nom */}
          <Form.Control
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          /> {/* Champ de saisie pour le nom */}
        </Form.Group>
        <Form.Group className="mb-3" controlId="email">
          <Form.Label>Email</Form.Label> {/* Étiquette pour le champ de l'email */}
          <Form.Control
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          /> {/* Champ de saisie pour l'email */}
        </Form.Group>
        <Form.Group className="mb-3" controlId="password">
          <Form.Label>Mot de passe</Form.Label> {/* Étiquette pour le champ du mot de passe */}
          <Form.Control
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          /> {/* Champ de saisie pour le mot de passe */}
        </Form.Group>
        <Form.Group className="mb-3" controlId="confirmPassword">
          <Form.Label>Confirmer le mot de passe</Form.Label> {/* Étiquette pour le champ de confirmation du mot de passe */}
          <Form.Control
            type="password"
            onChange={(e) => setConfirmPassword(e.target.value)}
          /> {/* Champ de saisie pour la confirmation du mot de passe */}
        </Form.Group>
        <div className="mb-3">
          <Button type="submit">Mettre à jour</Button> {/* Bouton pour soumettre le formulaire */}
        </div>
      </form>
    </div>
  );
}
