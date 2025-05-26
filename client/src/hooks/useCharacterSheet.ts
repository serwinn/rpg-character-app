import { useEffect, useState } from 'react';
import { useSocket } from '../contexts/SocketContext';
import { useAuth } from '../contexts/AuthContext';
import { 
  getCharacter, 
  createCharacter, 
  updateCharacter as updateCharacterAPI,
  deleteCharacter as deleteCharacterAPI
} from '../services/characterService';
import { FEATURES, AUTO_SAVE_DELAY } from '../config';

export const useCharacterSheet = (
  id: string, 
  isNewCharacter: boolean = false,
  isGM: boolean = false
) => {
  const { user } = useAuth();
  const { socket } = useSocket();
  
  const [character, setCharacter] = useState<any>({});
  const [originalCharacter, setOriginalCharacter] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [saveTimeoutId, setSaveTimeoutId] = useState<NodeJS.Timeout | null>(null);
  
  // Fetch character data on component mount
  useEffect(() => {
    const fetchCharacter = async () => {
      if (isNewCharacter) {
        // Initialize a new character
        const newCharacter = {
          name: '',
          occupation: '',
          playerId: user?.role === 'PLAYER' ? user?.id : '',
          attributes: {},
          derived: {},
          skills: [],
          weapons: [],
          combat: {},
          background: {}
        };
        
        setCharacter(newCharacter);
        setOriginalCharacter(JSON.parse(JSON.stringify(newCharacter)));
        setIsLoading(false);
        return;
      }
      
      try {
        const data = await getCharacter(id);
        setCharacter(data);
        setOriginalCharacter(JSON.parse(JSON.stringify(data)));
      } catch (error) {
        console.error('Failed to fetch character:', error);
        setError('Nie udało się załadować danych postaci. Spróbuj ponownie.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCharacter();
  }, [id, isNewCharacter, user]);
  
  // Socket.io real-time updates
  useEffect(() => {
    if (!socket || isNewCharacter) return;
    
    // Listen for character updates
    socket.on(`character:update:${id}`, (updatedCharacter) => {
      // Only update if the update is not from the current user's action
      if (!isSaving) {
        setCharacter(updatedCharacter);
        setOriginalCharacter(JSON.parse(JSON.stringify(updatedCharacter)));
        setHasUnsavedChanges(false);
      }
    });
    
    return () => {
      socket.off(`character:update:${id}`);
    };
  }, [socket, id, isNewCharacter, isSaving]);
  
  // Update character field
  const updateCharacterField = (field: string, value: any) => {
    setCharacter(prev => {
      // Handle nested fields with dot notation (e.g., 'attributes.strength')
      if (field.includes('.')) {
        const [parent, child] = field.split('.');
        return {
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: value
          }
        };
      }
      
      // Handle regular fields
      return {
        ...prev,
        [field]: value
      };
    });
    
    setHasUnsavedChanges(true);
    
    // Auto-save functionality
    if (FEATURES.autoSave && !isNewCharacter) {
      if (saveTimeoutId) {
        clearTimeout(saveTimeoutId);
      }
      
      const timeoutId = setTimeout(() => {
        saveCharacter();
      }, AUTO_SAVE_DELAY);
      
      setSaveTimeoutId(timeoutId);
    }
  };
  
  // Save character
  const saveCharacter = async () => {
    if (saveTimeoutId) {
      clearTimeout(saveTimeoutId);
      setSaveTimeoutId(null);
    }
    
    setIsSaving(true);
    
    try {
      let savedCharacter;
      
      if (isNewCharacter) {
        savedCharacter = await createCharacter(character);
      } else {
        savedCharacter = await updateCharacterAPI(id, character);
      }
      
      setCharacter(savedCharacter);
      setOriginalCharacter(JSON.parse(JSON.stringify(savedCharacter)));
      setHasUnsavedChanges(false);
      
      return savedCharacter;
    } catch (error) {
      console.error('Failed to save character:', error);
      throw error;
    } finally {
      setIsSaving(false);
    }
  };
  
  // Delete character
  const deleteCharacter = async () => {
    try {
      await deleteCharacterAPI(id);
    } catch (error) {
      console.error('Failed to delete character:', error);
      throw error;
    }
  };
  
  return {
    character,
    isLoading,
    error,
    isSaving,
    hasUnsavedChanges,
    updateCharacter: updateCharacterField,
    saveCharacter,
    deleteCharacter
  };
};