import axios from 'axios';
import { VITE_BACKEND_URL as API_URL } from '../config';

// Get player's characters
export const getPlayerCharacters = async () => {
  try {
    const response = await axios.get(`${API_URL}/characters/player`);
    return response.data;
  } catch (error) {
    console.error('Błąd podczas pobierania postaci gracza:', error);
    throw error;
  }
};

// Get all characters (GM only)
export const getAllCharacters = async () => {
  try {
    const response = await axios.get(`${API_URL}/characters`);
    return response.data;
  } catch (error) {
    console.error('Błąd podczas pobierania wszystkich postaci:', error);
    throw error;
  }
};

// Get a specific character
export const getCharacter = async (id: string) => {
  try {
    const response = await axios.get(`${API_URL}/characters/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Błąd podczas pobierania postaci ${id}:`, error);
    throw error;
  }
};

// Create a new character
export const createCharacter = async (characterData: any) => {
  try {
    const response = await axios.post(`${API_URL}/characters`, characterData);
    return response.data;
  } catch (error) {
    console.error('Błąd podczas tworzenia postaci:', error);
    throw error;
  }
};

// Update a character
export const updateCharacter = async (id: string, characterData: any) => {
  try {
    const response = await axios.put(`${API_URL}/characters/${id}`, characterData);
    return response.data;
  } catch (error) {
    console.error(`Błąd podczas aktualizacji postaci ${id}:`, error);
    throw error;
  }
};

// Delete a character
export const deleteCharacter = async (id: string) => {
  try {
    await axios.delete(`${API_URL}/characters/${id}`);
  } catch (error) {
    console.error(`Błąd podczas usuwania postaci ${id}:`, error);
    throw error;
  }
};

// Get character versions
export const getCharacterVersions = async (characterId: string) => {
  try {
    const response = await axios.get(`${API_URL}/characters/${characterId}/versions`);
    return response.data;
  } catch (error) {
    console.error(`Błąd podczas pobierania wersji postaci ${characterId}:`, error);
    throw error;
  }
};

// Restore a character version
export const restoreCharacterVersion = async (characterId: string, versionId: string) => {
  try {
    const response = await axios.post(`${API_URL}/characters/${characterId}/versions/${versionId}/restore`);
    return response.data;
  } catch (error) {
    console.error(`Błąd podczas przywracania wersji ${versionId} dla postaci ${characterId}:`, error);
    throw error;
  }
};