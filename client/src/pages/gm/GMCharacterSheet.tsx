import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, History, Trash2, AlertCircle, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import CharacterTabs from '../../components/character/CharacterTabs';
import BasicInfoTab from '../../components/character/tabs/BasicInfoTab';
import StatsTab from '../../components/character/tabs/StatsTab';
import SkillsTab from '../../components/character/tabs/SkillsTab';
import CombatTab from '../../components/character/tabs/CombatTab';
import BackgroundTab from '../../components/character/tabs/BackgroundTab';
import VersionHistoryModal from '../../components/character/VersionHistoryModal';
import DeleteConfirmationModal from '../../components/ui/DeleteConfirmationModal';
import { useCharacterSheet } from '../../hooks/useCharacterSheet';
import { getAllPlayers } from '../../services/userService';

interface Player {
  id: string;
  name: string;
}

const GMCharacterSheet = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNewCharacter = id === 'new';
  
  const [activeTab, setActiveTab] = useState('basic');
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [players, setPlayers] = useState<Player[]>([]);
  
  const { 
    character, 
    isLoading, 
    error, 
    isSaving,
    hasUnsavedChanges,
    updateCharacter,
    saveCharacter,
    deleteCharacter
  } = useCharacterSheet(id || 'new', isNewCharacter, true);
  
  // Fetch players for the GM view
  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const data = await getAllPlayers();
        setPlayers(data);
      } catch (error) {
        console.error('Failed to fetch players:', error);
      }
    };
    
    fetchPlayers();
  }, []);
  
  // Handle tab change
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };
  
  // Handle save
  const handleSave = async () => {
    try {
      await saveCharacter();
      if (isNewCharacter) {
        navigate('/gm/dashboard');
      }
    } catch (error) {
      console.error('Failed to save character:', error);
    }
  };
  
  // Handle delete
  const handleDelete = async () => {
    try {
      await deleteCharacter();
      navigate('/gm/dashboard');
    } catch (error) {
      console.error('Failed to delete character:', error);
    }
  };
  
  // Handle player assignment
  const handlePlayerChange = (playerId: string) => {
    updateCharacter('playerId', playerId);
  };
  
  if (isLoading) {
    return <LoadingSpinner size="large" />;
  }
  
  if (error) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
            <h3 className="mt-2 text-lg font-medium text-stone-900">Błąd ładowania postaci</h3>
            <p className="mt-1 text-stone-500">{error}</p>
            <Button 
              className="mt-4" 
              onClick={() => navigate('/gm/dashboard')}
            >
              Powrót do panelu głównego
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold font-cinzel text-red-900">
            {isNewCharacter ? 'Stwórz nową postać' : character.name || 'Karta postaci'}
          </h1>
          <p className="text-stone-600">
            {isNewCharacter 
              ? 'Uzupełnij dane, aby stworzyć postać'
              : `${character.occupation || 'Brak zawodu'}`
            }
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {!isNewCharacter && (
            <>
              <Button 
                variant="outline" 
                onClick={() => setShowVersionHistory(true)}
              >
                <History size={16} className="mr-2" />
                Historia
              </Button>
              
              <Button 
                variant="danger" 
                onClick={() => setShowDeleteConfirmation(true)}
              >
                <Trash2 size={16} className="mr-2" />
                Usuń
              </Button>
            </>
          )}
          
          <Button 
            onClick={handleSave}
            isLoading={isSaving}
            disabled={!hasUnsavedChanges && !isNewCharacter}
          >
            <Save size={16} className="mr-2" />
            Zapisz
          </Button>
        </div>
      </div>
      
      {/* Auto-save indicator */}
      {hasUnsavedChanges && !isNewCharacter && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-amber-100 text-amber-800 px-4 py-2 rounded-md flex items-center"
        >
          <span className="text-sm">Masz niezapisane zmiany</span>
        </motion.div>
      )}
      
      {/* Player Assignment (GM only) */}
      <Card className="bg-amber-100 border-amber-300">
        <CardContent className="py-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="flex items-center">
              <Users size={18} className="mr-2 text-amber-800" />
              <label htmlFor="playerId" className="font-medium text-amber-900">
                Przypisz do gracza:
              </label>
            </div>
            <select
              id="playerId"
              value={character.playerId || ''}
              onChange={(e) => handlePlayerChange(e.target.value)}
              className="px-3 py-1.5 bg-amber-50 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="">-- Wybierz gracza --</option>
              {players.map((player) => (
                <option key={player.id} value={player.id}>
                  {player.name}
                </option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>
      
      {/* Character Tabs */}
      <Card>
        <CharacterTabs activeTab={activeTab} onTabChange={handleTabChange} />
        
        <CardContent>
          {activeTab === 'basic' && (
            <BasicInfoTab 
              character={character} 
              onChange={updateCharacter} 
              isNewCharacter={isNewCharacter}
            />
          )}
          
          {activeTab === 'stats' && (
            <StatsTab 
              character={character} 
              onChange={updateCharacter}
            />
          )}
          
          {activeTab === 'skills' && (
            <SkillsTab 
              character={character} 
              onChange={updateCharacter}
            />
          )}
          
          {activeTab === 'combat' && (
            <CombatTab 
              character={character} 
              onChange={updateCharacter}
            />
          )}
          
          {activeTab === 'background' && (
            <BackgroundTab 
              character={character} 
              onChange={updateCharacter}
            />
          )}
        </CardContent>
      </Card>
      
      {/* Version History Modal */}
      {showVersionHistory && (
        <VersionHistoryModal
          characterId={id!}
          onClose={() => setShowVersionHistory(false)}
        />
      )}
      
      {/* Delete Confirmation Modal */}
      {showDeleteConfirmation && (
        <DeleteConfirmationModal
          title="Usuń postać"
          message="Czy na pewno chcesz usunąć tę postać? Tej operacji nie można cofnąć."
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteConfirmation(false)}
        />
      )}
    </div>
  );
};

export default GMCharacterSheet;