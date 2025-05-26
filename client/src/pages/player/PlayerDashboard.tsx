import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PlusCircle, Search, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { useAuth } from '../../contexts/AuthContext';
import { getPlayerCharacters } from '../../services/characterService';

interface Character {
  id: string;
  name: string;
  occupation: string;
  lastUpdated: string;
  avatar?: string | null;
}

const PlayerDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [characters, setCharacters] = useState<Character[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        const data = await getPlayerCharacters();
        setCharacters(data);
      } catch (error) {
        console.error('Failed to fetch characters:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCharacters();
  }, []);
  
  const filteredCharacters = characters.filter(character => 
    character.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    character.occupation.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleCreateCharacter = () => {
    navigate('/player/character/new');
  };
  
  if (isLoading) {
    return <LoadingSpinner size="large" />;
  }
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-cinzel text-red-900">Moje postaci</h1>
          <p className="text-stone-600">
            Zarządzaj swoimi postaciami i przeglądaj ich szczegóły
          </p>
        </div>
        
        <Button onClick={handleCreateCharacter}>
          <PlusCircle size={16} className="mr-2" />
          Stwórz nową postać
        </Button>
      </div>
      
      {filteredCharacters.length === 0 ? (
        <Card>
          <CardContent className="py-8">
            <div className="text-center">
              <Users className="mx-auto h-12 w-12 text-stone-400" />
              <h3 className="mt-2 text-lg font-medium text-stone-900">Nie znaleziono postaci</h3>
              {characters.length > 0 ? (
                <p className="mt-1 text-stone-500">Spróbuj zmienić kryteria wyszukiwania</p>
              ) : (
                <div className="mt-4">
                  <p className="text-stone-500 mb-4">Stwórz swoją pierwszą postać, aby rozpocząć</p>
                  <Button onClick={handleCreateCharacter}>
                    <PlusCircle size={16} className="mr-2" />
                    Stwórz postać
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCharacters.map((character) => (
            <Link 
              key={character.id} 
              to={`/player/character/${character.id}`}
              className="block transition-transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-amber-500 rounded-lg"
            >
              <Card>
                <CardHeader className="pb-3 flex items-center gap-4">
                  {character.avatar && (
                    <img
                      src={character.avatar}
                      alt={`${character.name} avatar`}
                      className="w-14 h-14 object-cover rounded-full border border-stone-300"
                    />
                  )}
                  <CardTitle>{character.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-stone-600 mb-2">
                    <span className="font-medium">Zawód:</span> {character.occupation}
                  </p>
                  <p className="text-xs text-stone-500">
                    Ostatnio aktualizowane: {new Date(character.lastUpdated).toLocaleString()}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default PlayerDashboard;