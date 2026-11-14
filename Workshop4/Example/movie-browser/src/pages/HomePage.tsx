import { useState, type FormEvent } from 'react';
import ShowCard from '../components/ShowCard';
import type { Show, ShowSearchResult } from '../types/show';

type SearchStatus = 'idle' | 'loading' | 'success' | 'error';

export default function HomePage() {
  const [query, setQuery] = useState('');
  const [shows, setShows] = useState<Show[]>([]);
  const [status, setStatus] = useState<SearchStatus>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  async function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const searchTerm = query.trim();
    if (!searchTerm) return;

    setStatus('loading');
    setErrorMessage('');

    try {
      const response = await fetch(
        `https://api.tvmaze.com/search/shows?q=${encodeURIComponent(searchTerm)}`,
      );
      if (!response.ok) throw new Error(`Search failed with status ${response.status}.`);

      // The API response is typed for this teaching example. Validate external data
      // at runtime in a production application before trusting its structure.
      const results = (await response.json()) as ShowSearchResult[];
      setShows(results.map((result) => result.show));
      setStatus('success');
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'An unexpected error occurred.');
      setStatus('error');
    }
  }

  return (
    <main className="page-content">
      <section className="hero">
        <p className="eyebrow">Discover something to watch</p>
        <h1>Find your next show</h1>
        <p>Search the TV Maze catalogue and open a result to see more details.</p>
        <form className="search-form" onSubmit={handleSearch}>
          <label className="visually-hidden" htmlFor="show-search">Show name</label>
          <input
            id="show-search"
            type="search"
            placeholder="Try a show name..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            required
          />
          <button type="submit" disabled={status === 'loading'}>
            {status === 'loading' ? 'Searching...' : 'Search'}
          </button>
        </form>
      </section>

      {status === 'loading' && <p className="notice" role="status">Searching shows...</p>}
      {status === 'error' && <p className="notice notice--error" role="alert">{errorMessage}</p>}
      {status === 'success' && shows.length === 0 && (
        <p className="notice">No shows matched that search. Try another title.</p>
      )}

      {status === 'success' && shows.length > 0 && (
        <section aria-labelledby="results-heading">
          <div className="section-heading">
            <h2 id="results-heading">Search results</h2>
            <span>{shows.length} found</span>
          </div>
          <div className="show-grid">
            {shows.map((show) => <ShowCard key={show.id} show={show} />)}
          </div>
        </section>
      )}
    </main>
  );
}
