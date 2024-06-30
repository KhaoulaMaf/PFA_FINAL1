import Axios from 'axios'; // Importation de la bibliothèque pour les requêtes HTTP
import { Link, useLocation, useNavigate } from 'react-router-dom'; // Hooks pour la navigation et les paramètres de route
import Container from 'react-bootstrap/Container'; // Composant Container de react-bootstrap
import Form from 'react-bootstrap/Form'; // Composant Form de react-bootstrap
import Button from 'react-bootstrap/Button'; // Composant Button de react-bootstrap
import { Helmet } from 'react-helmet-async'; // Pour gérer les balises <head>
import { useContext, useEffect, useState } from 'react'; // Importation des hooks nécessaires depuis React
import { Store } from '../Store'; // Importation du contexte personnalisé Store
import { toast } from 'react-toastify'; // Importation de la bibliothèque pour afficher les notifications toast
import { getError } from '../utils'; // Importation de la fonction utilitaire pour gérer les erreurs

export default function SigninScreen() {
  const navigate = useNavigate(); // Hook pour naviguer programatiquement
  const { search } = useLocation(); // Hook pour récupérer les paramètres de la recherche dans l'URL
  const redirectInUrl = new URLSearchParams(search).get('redirect'); // Extraction du paramètre de redirection de l'URL
  const redirect = redirectInUrl ? redirectInUrl : '/'; // Définition de la route de redirection

  // Utilisation de useState pour gérer l'état des champs du formulaire
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { state, dispatch: ctxDispatch } = useContext(Store); // Utilisation du contexte Store
  const { userInfo } = state; // Extraction des informations de l'utilisateur depuis l'état global

  // Fonction pour gérer la soumission du formulaire
  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await Axios.post('/api/users/signin', {
        email,
        password,
      }); // Envoi des informations de connexion à l'API
      ctxDispatch({ type: 'USER_SIGNIN', payload: data }); // Mise à jour des informations de l'utilisateur dans le contexte
      localStorage.setItem('userInfo', JSON.stringify(data)); // Mise à jour des informations de l'utilisateur dans le localStorage
      navigate(redirect || '/'); // Redirection vers la page spécifiée ou la page d'accueil
    } catch (err) {
      toast.error(getError(err)); // Notification d'erreur
    }
  };

  // Utilisation de useEffect pour rediriger l'utilisateur s'il est déjà connecté
  useEffect(() => {
    if (userInfo) {
      navigate(redirect); // Redirection vers la page spécifiée
    }
  }, [navigate, redirect, userInfo]);

  return (
    <Container className="small-container">
      <Helmet>
        <title>Sign In</title> {/* Définition du titre de la page */}
      </Helmet>
      <h1 className="my-3">Sign In</h1> {/* Titre de la page */}
      <Form onSubmit={submitHandler}> {/* Formulaire pour la connexion */}
        <Form.Group className="mb-3" controlId="email">
          <Form.Label>Email</Form.Label> {/* Étiquette pour le champ de l'email */}
          <Form.Control
            type="email"
            required
            onChange={(e) => setEmail(e.target.value)}
          /> {/* Champ de saisie pour l'email */}
        </Form.Group>
        <Form.Group className="mb-3" controlId="password">
          <Form.Label>Password</Form.Label> {/* Étiquette pour le champ du mot de passe */}
          <Form.Control
            type="password"
            required
            onChange={(e) => setPassword(e.target.value)}
          /> {/* Champ de saisie pour le mot de passe */}
        </Form.Group>
        <div className="mb-3">
          <Button type="submit">Sign In</Button> {/* Bouton pour soumettre le formulaire */}
        </div>
        <div className="mb-3">
          Pas de compte ?{' '}
          <Link to={`/signup?redirect=${redirect}`}>creer un compte</Link> {/* Lien vers la page de création de compte */}
        </div>
      </Form>
    </Container>
  );
}
