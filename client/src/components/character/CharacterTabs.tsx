import { motion } from 'framer-motion';
import { 
  User, 
  BarChart2, 
  Book, 
  Swords, 
  FileText 
} from 'lucide-react';

interface CharacterTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const CharacterTabs = ({ activeTab, onTabChange }: CharacterTabsProps) => {
  const tabs = [
    { id: 'basic', label: 'Dane badacza', icon: <User size={16} /> },
    { id: 'stats', label: 'Cechy', icon: <BarChart2 size={16} /> },
    { id: 'skills', label: 'Umiejętności', icon: <Book size={16} /> },
    { id: 'combat', label: 'Walka i uzbrojenie', icon: <Swords size={16} /> },
    { id: 'background', label: 'Historia badacza', icon: <FileText size={16} /> },
  ];
  
  return (
    <div className="border-b border-amber-200 overflow-x-auto">
      <div className="flex">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`relative tab flex items-center gap-1.5 py-3 px-4 ${
              activeTab === tab.id ? 'tab-active' : ''
            }`}
            onClick={() => onTabChange(tab.id)}
            type="button"
          >
            {tab.icon}
            <span>{tab.label}</span>
            
            {activeTab === tab.id && (
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-900"
                layoutId="tab-indicator"
              />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CharacterTabs;