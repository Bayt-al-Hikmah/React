import { Link } from 'react-router';
import type { Show } from '../types/show';

type ShowCardProps = {
  show: Show;
};

export default function ShowCard({ show }: ShowCardProps) {
  return (
    <article className="show-card">
      {show.image?.medium ? (
        <img className="show-card__image" src={show.image.medium} alt={`Poster for ${show.name}`} />
      ) : (
        <div className="show-card__placeholder" aria-hidden="true">No image</div>
      )}
      <div className="show-card__body">
        <h2>{show.name}</h2>
        <p className="rating">
          {show.rating?.average != null ? `Rating: ${show.rating.average}/10` : 'No rating available'}
        </p>
        <Link to={`/shows/${show.id}`}>View details</Link>
      </div>
    </article>
  );
}
