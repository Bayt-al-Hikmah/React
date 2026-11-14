import { Link } from 'react-router';

export default function NotFoundPage() {
  return (
    <main className="page-content empty-page">
      <p className="eyebrow">404</p>
      <h1>Page not found</h1>
      <p>The page you requested does not exist.</p>
      <Link to="/">Return to search</Link>
    </main>
  );
}
