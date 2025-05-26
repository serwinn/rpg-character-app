import { useState } from 'react';
import { X, AlertTriangle } from 'lucide-react';
import Button from './Button';

interface DeleteConfirmationModalProps {
  title: string;
  message: string;
  onConfirm: () => Promise<void>;
  onCancel: () => void;
}

const DeleteConfirmationModal = ({
  title,
  message,
  onConfirm,
  onCancel
}: DeleteConfirmationModalProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleConfirm = async () => {
    setIsDeleting(true);
    setError(null);
    
    try {
      await onConfirm();
    } catch (err: any) {
      setError(err.message || 'An error occurred. Please try again.');
      setIsDeleting(false);
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-amber-50 rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b border-amber-200">
          <h2 className="text-xl font-bold font-cinzel text-red-900">{title}</h2>
          <button
            onClick={onCancel}
            className="text-stone-500 hover:text-stone-700"
            disabled={isDeleting}
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="p-6">
          <div className="flex items-start">
            <AlertTriangle className="text-amber-600 mr-3 mt-0.5 h-6 w-6 flex-shrink-0" />
            <p className="text-stone-700">{message}</p>
          </div>
          
          {error && (
            <div className="mt-4 p-3 bg-red-100 border border-red-300 text-red-800 rounded-md">
              {error}
            </div>
          )}
        </div>
        
        <div className="border-t border-amber-200 p-4 flex justify-end space-x-3">
          <Button 
            variant="outline" 
            onClick={onCancel}
            disabled={isDeleting}
          >
            Anuluj
          </Button>
          <Button 
            variant="danger" 
            onClick={handleConfirm}
            isLoading={isDeleting}
          >
            Usuń
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;