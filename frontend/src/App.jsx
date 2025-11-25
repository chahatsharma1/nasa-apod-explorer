import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import LandingPage from '@/pages/LandingPage';
import TodayPage from '@/pages/TodayPage';
import DateExplorerPage from '@/pages/DateExplorerPage';
import RangeExplorerPage from '@/pages/RangeExplorerPage';
import GalleryPage from '@/pages/GalleryPage';
import FavoritesPage from '@/pages/FavoritesPage';
import { ThemeProvider } from '@/context/ThemeContext';
import { FavoritesProvider } from '@/context/FavoritesContext';

function App() {
  return (
    <ThemeProvider>
      <FavoritesProvider>
        <Router>
          <Navbar />
          <main className="relative z-10 min-h-screen bg-background transition-colors duration-300">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/today" element={<TodayPage />} />
              <Route path="/date" element={<DateExplorerPage />} />
              <Route path="/range" element={<RangeExplorerPage />} />
              <Route path="/gallery" element={<GalleryPage />} />
              <Route path="/favorites" element={<FavoritesPage />} />
            </Routes>
          </main>
        </Router>
      </FavoritesProvider>
    </ThemeProvider>
  );
}

export default App;
