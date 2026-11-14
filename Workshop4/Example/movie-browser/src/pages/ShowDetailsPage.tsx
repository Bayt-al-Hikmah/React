import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router';
import type { Show } from '../types/show';

type LoadStatus = 'loading' | 'success' | 'error';

function markupToText(markup: string): string {
  return new DOMParser().parseFromString(markup, 'text/html').body.textContent?.trim() ?? '';
}

export default function ShowDetailsPage() {
  const { showId } = useParams();
  const [show, setShow] = useState<Show | null>(null);
  const [status, setStatus] = useState<LoadStatus>('loading');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!showId) {
      setErrorMessage('A show ID is required.');
      setStatus('error');
      return;
    }

    const controller = new AbortController();

    async function loadShow() {
      try {
        setStatus('loading');
        setErrorMessage('');
        const response = await fetch(`https://api.tvmaze.com/shows/${encodeURIComponent(showId)}`, {
          signal: controller.signal,
        });
        if (!response.ok) throw new Error(`Could not load this show (${response.status}).`);

        const data = (await response.json()) as Show;
        setShow(data);
        setStatus('success');
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') return;
        setErrorMessage(error instanceof Error ? error.message : 'An unexpected error occurred.');
        setStatus('error');
      }
    }

    void loadShow();
    return () => controller.abort();
  }, [showId]);

  if (status === 'loading') return <main className="page-content"><p role="status">Loading show details...</p></main>;
  if (status === 'error') return <main className="page-content"><p role="alert">{errorMessage}</p><Link to="/">Back to search</Link></main>;
  if (!show) return <main className="page-content"><p>Show not found.</p><Link to="/">Back to search</Link></main>;

  return (
    <main className="page-content">
      <Link className="back-link" to="/">← Back to search</Link>
      <article className="detail-layout">
        {show.image?.original && <img className="detail-poster" src={show.image.original} alt={`Poster for ${show.name}`} />}
        <div>
          <p className="eyebrow">Show details</p>
          <h1>{show.name}</h1>
          <p className="rating">
            {show.rating?.average != null ? `Rating: ${show.rating.average}/10` : 'No rating available'}
          </p>
          <p className="summary">
            {show.summary ? markupToText(show.summary) : 'No summary is available for this show.'}
          </p>
        </div>
      </article>
    </main>
  );
}
