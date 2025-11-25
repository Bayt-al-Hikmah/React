import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import ShowDetail from './components/ShowDetail';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import './App.css';
// A small Header component to hold the Theme Toggle
function Header() {
  const { darkMode, toggleTheme } = useTheme();
  return (
    <header>
      <span>🎬 MovieDB</span>
      <button onClick={toggleTheme}>
        {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
      </button>
    </header>
  );
}

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/show/:id" element={<ShowDetail />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;