import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PlayerDashboard from './pages/player/PlayerDashboard';
import PlayerCharacterSheet from './pages/player/PlayerCharacterSheet';
import GMDashboard from './pages/gm/GMDashboard';
import GMCharacterSheet from './pages/gm/GMCharacterSheet';
import NotFoundPage from './pages/NotFoundPage';
import LoadingSpinner from './components/ui/LoadingSpinner';

// Protected route component
const ProtectedRoute = ({ 
  children, 
  requiredRole = null 
}: { 
  children: React.ReactNode;
  requiredRole?: 'PLAYER' | 'GM' | null;
}) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

function App() {
  const { user } = useAuth();

  // Determine where to redirect based on user role
  const getHomePage = () => {
    if (!user) return <Navigate to="/login" replace />;
    return user.role === 'GM' 
      ? <Navigate to="/gm/dashboard" replace />
      : <Navigate to="/player/dashboard" replace />;
  };

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Home route - redirects based on auth status and role */}
        <Route index element={getHomePage()} />
        
        {/* Auth routes */}
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        
        {/* Player routes */}
        <Route path="player">
          <Route path="dashboard" element={
            <ProtectedRoute requiredRole="PLAYER">
              <PlayerDashboard />
            </ProtectedRoute>
          } />
          <Route path="character/:id" element={
            <ProtectedRoute requiredRole="PLAYER">
              <PlayerCharacterSheet />
            </ProtectedRoute>
          } />
        </Route>
        
        {/* GM routes */}
        <Route path="gm">
          <Route path="dashboard" element={
            <ProtectedRoute requiredRole="GM">
              <GMDashboard />
            </ProtectedRoute>
          } />
          <Route path="character/:id" element={
            <ProtectedRoute requiredRole="GM">
              <GMCharacterSheet />
            </ProtectedRoute>
          } />
        </Route>
        
        {/* 404 route */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;