// Définition du composant fonctionnel Rating
function Rating(props) {
  // Déstructuration des props pour obtenir la note, le nombre d'avis et une légende facultative
  const { rating, numReviews, caption } = props;
  
  // Retourne le JSX pour afficher les étoiles et les avis
  return (
    <div className="rating">
      {/* Affichage de la première étoile */}
      <span>
        <i
          className={
            rating >= 1
              ? 'fas fa-star' // Étoile pleine si la note est >= 1
              : rating >= 0.5
              ? 'fas fa-star-half-alt' // Demi-étoile si la note est >= 0.5
              : 'far fa-star' // Étoile vide sinon
          }
        />
      </span>
      {/* Affichage de la deuxième étoile */}
      <span>
        <i
          className={
            rating >= 2
              ? 'fas fa-star' // Étoile pleine si la note est >= 2
              : rating >= 1.5
              ? 'fas fa-star-half-alt' // Demi-étoile si la note est >= 1.5
              : 'far fa-star' // Étoile vide sinon
          }
        />
      </span>
      {/* Affichage de la troisième étoile */}
      <span>
        <i
          className={
            rating >= 3
              ? 'fas fa-star' // Étoile pleine si la note est >= 3
              : rating >= 2.5
              ? 'fas fa-star-half-alt' // Demi-étoile si la note est >= 2.5
              : 'far fa-star' // Étoile vide sinon
          }
        />
      </span>
      {/* Affichage de la quatrième étoile */}
      <span>
        <i
          className={
            rating >= 4
              ? 'fas fa-star' // Étoile pleine si la note est >= 4
              : rating >= 3.5
              ? 'fas fa-star-half-alt' // Demi-étoile si la note est >= 3.5
              : 'far fa-star' // Étoile vide sinon
          }
        />
      </span>
      {/* Affichage de la cinquième étoile */}
      <span>
        <i
          className={
            rating >= 5
              ? 'fas fa-star' // Étoile pleine si la note est >= 5
              : rating >= 4.5
              ? 'fas fa-star-half-alt' // Demi-étoile si la note est >= 4.5
              : 'far fa-star' // Étoile vide sinon
          }
        />
      </span>

      {/* Affichage de la légende ou du nombre d'avis */}
      {caption ? (
        <span>{caption}</span> // Affiche la légende si elle est fournie
      ) : (
        <span>{' ' + numReviews + ' reviews'}</span> // Sinon, affiche le nombre d'avis
      )}
    </div>
  );
}

export default Rating; // Exportation du composant Rating
