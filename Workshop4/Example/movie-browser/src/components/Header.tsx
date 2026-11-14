import { Link, NavLink } from 'react-router';
import { useTheme } from '../context/ThemeContext';

export default function Header() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="site-header">
      <Link className="brand" to="/">Show Explorer</Link>
      <nav aria-label="Main navigation" className="main-nav">
        <NavLink to="/" end>Search</NavLink>
      </nav>
      <button className="theme-button" type="button" onClick={toggleTheme}>
        Switch to {theme === 'light' ? 'dark' : 'light'} theme
      </button>
    </header>
  );
}
