import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import { Scroll } from 'lucide-react';
import { useEffect } from 'react';

const Layout = () => {
  // Add Google Fonts for the RPG theme
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Spectral:wght@400;500;600&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header>
        <Navbar />
      </header>
      
      {/* Main content */}
      <main className="flex-grow container mx-auto p-4 sm:p-6">
        <Outlet />
      </main>
      
      {/* Footer */}
      <footer className="py-4 bg-red-900 bg-opacity-90 text-amber-50">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center">
            <Scroll size={20} className="mr-2" />
            <span className="font-cinzel">Karty Postaci RPG</span>
          </div>
          <div className="text-sm">© 2025 Wszelkie prawa zastrzeżone</div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;