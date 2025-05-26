import { Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import Button from '../components/ui/Button';

const NotFoundPage = () => {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center p-4">
      <div className="bg-amber-50 bg-opacity-95 p-8 rounded-lg shadow-lg border border-amber-200 max-w-lg">
        <div className="flex justify-center mb-6">
          <div className="bg-red-100 p-4 rounded-full">
            <MapPin size={48} className="text-red-800" />
          </div>
        </div>
        
        <h1 className="text-4xl font-bold font-cinzel mb-4 text-red-900">Zagubiony w świecie gry</h1>
        
        <p className="text-stone-700 mb-8">
          Wygląda na to, że twoja postać zboczyła z mapy. Ta strona nie istnieje w naszym świecie kampanii.
        </p>
        
        <div className="flex justify-center">
          <Link to="/">
            <Button>
              Powrót do karczmy
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;