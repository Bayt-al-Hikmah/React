import { BrowserRouter, Route, Routes } from 'react-router';
import Header from './components/Header';
import { ThemeProvider } from './context/ThemeContext';
import HomePage from './pages/HomePage';
import NotFoundPage from './pages/NotFoundPage';
import ShowDetailsPage from './pages/ShowDetailsPage';
import './App.css';

function AppRoutes() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/shows/:showId" element={<ShowDetailsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppRoutes />
    </ThemeProvider>
  );
}
