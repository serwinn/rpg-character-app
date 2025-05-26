import { useEffect, useState } from 'react';
import { X, AlertCircle, RotateCcw } from 'lucide-react';
import Button from '../ui/Button';
import LoadingSpinner from '../ui/LoadingSpinner';
import { getCharacterVersions, restoreCharacterVersion } from '../../services/characterService';

interface CharacterVersion {
  id: string;
  createdAt: string;
  data: any;
}

interface VersionHistoryModalProps {
  characterId: string;
  onClose: () => void;
}

const VersionHistoryModal = ({ characterId, onClose }: VersionHistoryModalProps) => {
  const [versions, setVersions] = useState<CharacterVersion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRestoring, setIsRestoring] = useState(false);
  
  useEffect(() => {
    const fetchVersions = async () => {
      try {
        const data = await getCharacterVersions(characterId);
        setVersions(data);
      } catch (error) {
        console.error('Failed to fetch versions:', error);
        setError('Failed to load version history. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchVersions();
  }, [characterId]);
  
  const handleRestore = async (versionId: string) => {
    if (window.confirm('Are you sure you want to restore this version? Current changes will be lost.')) {
      setIsRestoring(true);
      
      try {
        await restoreCharacterVersion(characterId, versionId);
        onClose();
        // Force a page reload to show the restored version
        window.location.reload();
      } catch (error) {
        console.error('Failed to restore version:', error);
        setError('Failed to restore version. Please try again.');
      } finally {
        setIsRestoring(false);
      }
    }
  };
  
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    };
    return new Date(dateString).toLocaleString(undefined, options);
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-amber-50 rounded-lg shadow-xl w-full max-w-3xl max-h-[80vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b border-amber-200">
          <h2 className="text-xl font-bold font-cinzel text-red-900">Historia wersji</h2>
          <button
            onClick={onClose}
            className="text-stone-500 hover:text-stone-700"
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="flex-grow overflow-y-auto p-4">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner />
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
              <p className="mt-2 text-red-600">{error}</p>
              <Button className="mt-4" onClick={onClose}>Zamknij</Button>
            </div>
          ) : versions.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-stone-600">Brak historii wersji dla tej postaci.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {versions.map((version) => (
                <div 
                  key={version.id} 
                  className="border border-amber-200 rounded-md p-4 hover:bg-amber-100 transition-colors"
                >
                  <div className="flex justify-between items-start mb-2">
                    <p className="font-medium">
                      {formatDate(version.createdAt)}
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRestore(version.id)}
                      disabled={isRestoring}
                    >
                      <RotateCcw size={14} className="mr-1" />
                      Przywróć
                    </Button>
                  </div>
                  
                  <div className="text-sm text-stone-600">
                    <p><span className="font-medium">Imię:</span> {version.data.name || 'Bez nazwy'}</p>
                    <p><span className="font-medium">Zawód:</span> {version.data.occupation || 'Brak'}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="border-t border-amber-200 p-4 flex justify-end">
          <Button variant="secondary" onClick={onClose}>
            Zamknij
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VersionHistoryModal;