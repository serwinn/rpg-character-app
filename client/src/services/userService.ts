import axios from 'axios';
import { VITE_BACKEND_URL as API_URL } from '../config';

// Get all players (GM only)
export const getAllPlayers = async () => {
  try {
    const response = await axios.get(`${API_URL}/users/players`);
    return response.data;
  } catch (error) {
    console.error('Błąd podczas pobierania graczy:', error);
    throw error;
  }
};