import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PlusCircle, Search, Users, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { getAllCharacters } from '../../services/characterService';

interface Character {
  id: string;
  name: string;
  player: {
    id: string;
    name: string;
  };
  occupation: string;
  lastUpdated: string;
}

const GMDashboard = () => {
  const navigate = useNavigate();
  const [characters, setCharacters] = useState<Character[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        const data = await getAllCharacters();
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
    character.occupation.toLowerCase().includes(searchTerm.toLowerCase()) ||
    character.player.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleCreateCharacter = () => {
    navigate('/gm/character/new');
  };
  
  if (isLoading) {
    return <LoadingSpinner size="large" />;
  }
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-cinzel text-red-900">Panel Mistrza Gry</h1>
          <p className="text-stone-600">
            Zarządzaj postaciami i przeglądaj ich szczegóły
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
                  <p className="text-stone-500 mb-4">Stwórz postać, aby rozpocząć</p>
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
            <Card key={character.id} className="transition-all hover:shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle>{character.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-stone-600 mb-2">
                  <span className="font-medium">Zawód:</span> {character.occupation}
                </p>
                <p className="text-stone-600 mb-2">
                  <span className="font-medium">Gracz:</span> {character.player ? character.player.name : 'Brak przypisanego gracza'}
                </p>
                <p className="text-xs text-stone-500">
                  Ostatnia aktualizacja: {new Date(character.lastUpdated).toLocaleString()}
                </p>
              </CardContent>
              <CardFooter className="pt-3 border-t border-amber-200">
                <Link 
                  to={`/gm/character/${character.id}`}
                  className="text-red-800 hover:text-red-700 flex items-center text-sm font-medium"
                >
                  Podgląd i edycja postaci
                  <ExternalLink size={14} className="ml-1" />
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default GMDashboard;