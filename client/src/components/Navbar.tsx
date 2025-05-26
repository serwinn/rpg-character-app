import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, Scroll, Users } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-red-900 bg-opacity-90 text-amber-50 shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo and brand */}
          <Link to="/" className="flex items-center">
            <Scroll className="h-8 w-8 mr-2" />
            <span className="font-cinzel text-xl font-bold">Karty Postaci RPG</span>
          </Link>
          
          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                {user.role === 'GM' ? (
                  <Link to="/gm/dashboard" className="hover:text-amber-200 transition-colors duration-200">
                    Panel MG
                  </Link>
                ) : (
                  <Link to="/player/dashboard" className="hover:text-amber-200 transition-colors duration-200">
                    Moje postaci
                  </Link>
                )}
                <div className="px-4 py-1 bg-amber-800 bg-opacity-60 rounded-full flex items-center">
                  <Users size={16} className="mr-2" />
                  <span className="mr-1">{user.name}</span>
                  <span className="text-xs bg-amber-200 text-red-900 px-2 py-0.5 rounded-full">
                    {user.role}
                  </span>
                </div>
                <button 
                  onClick={handleLogout}
                  className="flex items-center hover:text-amber-200 transition-colors duration-200"
                >
                  <LogOut size={16} className="mr-1" />
                  Wyloguj
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-amber-200 transition-colors duration-200">
                  Zaloguj się
                </Link>
                <Link 
                  to="/register" 
                  className="bg-amber-700 px-4 py-1.5 rounded-md hover:bg-amber-600 transition-colors duration-200"
                >
                  Zarejestruj się
                </Link>
              </>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-amber-50 hover:text-amber-200 focus:outline-none"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-red-900 bg-opacity-95 pb-4 px-4">
          <div className="flex flex-col space-y-3">
            {user ? (
              <>
                <div className="px-4 py-2 bg-amber-800 bg-opacity-60 rounded-md flex items-center">
                  <Users size={16} className="mr-2" />
                  <span className="mr-1">{user.name}</span>
                  <span className="text-xs bg-amber-200 text-red-900 px-2 py-0.5 rounded-full ml-2">
                    {user.role}
                  </span>
                </div>
                {user.role === 'GM' ? (
                  <Link 
                    to="/gm/dashboard" 
                    className="px-4 py-2 hover:bg-red-800 rounded-md transition-colors duration-200"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Panel MG
                  </Link>
                ) : (
                  <Link 
                    to="/player/dashboard" 
                    className="px-4 py-2 hover:bg-red-800 rounded-md transition-colors duration-200"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Moje postaci
                  </Link>
                )}
                <button 
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center px-4 py-2 hover:bg-red-800 rounded-md transition-colors duration-200"
                >
                  <LogOut size={16} className="mr-2" />
                  Wyloguj
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="px-4 py-2 hover:bg-red-800 rounded-md transition-colors duration-200"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Zaloguj się
                </Link>
                <Link 
                  to="/register" 
                  className="px-4 py-2 bg-amber-700 rounded-md hover:bg-amber-600 transition-colors duration-200"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Zarejestruj się
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;