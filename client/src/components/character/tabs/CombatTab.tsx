import { Plus, Trash2 } from 'lucide-react';
import Button from '../../ui/Button';
import Input from '../../ui/Input';
import FormField from '../../ui/FormField';

interface Weapon {
  id: string;
  name: string;
  regular: string;
  hard: string;
  extreme: string;
  damage: string;
  range: string;
  attacks: string;
  ammo: string;
  malfunction: string;
}

interface Combat {
  damageBonus: string;
  build: string;
  dodge: number;
}

interface Character {
  weapons: Weapon[];
  combat: Combat;
  [key: string]: any;
}

interface CombatTabProps {
  character: Character;
  onChange: (field: string, value: any) => void;
}

const CombatTab = ({ character, onChange }: CombatTabProps) => {
  // Ensure weapons array exists
  const weapons = character.weapons || [];
  
  // Ensure combat object exists
  const combat = character.combat || {
    damageBonus: '',
    build: '',
    dodge: 0
  };
  
  // Add new weapon
  const addWeapon = () => {
    const newWeapon = {
      id: Date.now().toString(),
      name: '',
      regular: '',
      hard: '',
      extreme: '',
      damage: '',
      range: '',
      attacks: '',
      ammo: '',
      malfunction: ''
    };
    
    const updatedWeapons = [...weapons, newWeapon];
    onChange('weapons', updatedWeapons);
  };
  
  // Update weapon
  const updateWeapon = (id: string, field: string, value: string) => {
    const updatedWeapons = weapons.map(weapon => {
      if (weapon.id === id) {
        return { ...weapon, [field]: value };
      }
      return weapon;
    });
    
    onChange('weapons', updatedWeapons);
  };
  
  // Remove weapon
  const removeWeapon = (id: string) => {
    const updatedWeapons = weapons.filter(weapon => weapon.id !== id);
    onChange('weapons', updatedWeapons);
  };
  
  // Update combat stats
  const updateCombat = (field: string, value: any) => {
    const updatedCombat = { ...combat, [field]: value };
    onChange('combat', updatedCombat);
  };
  
  // Calculate half and fifth values for dodge
  const calculateValue = (value: number, type: 'half' | 'fifth') => {
    if (!value && value !== 0) return 0;
    return type === 'half' ? Math.floor(value / 2) : Math.floor(value / 5);
  };
  
  return (
    <div className="space-y-6">
      {/* Combat Stats */}
      <div>
        <h3 className="text-lg font-medium font-cinzel text-red-900 mb-4">Walka</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <FormField
            label="Modyfikator Obrażeń"
            htmlFor="damageBonus"
          >
            <Input
              id="damageBonus"
              value={combat.damageBonus || ''}
              onChange={(e) => updateCombat('damageBonus', e.target.value)}
              fullWidth
            />
          </FormField>
          
          <FormField
            label="Krzepa"
            htmlFor="build"
          >
            <Input
              id="build"
              value={combat.build || ''}
              onChange={(e) => updateCombat('build', e.target.value)}
              fullWidth
            />
          </FormField>
          
          <div className="border border-amber-200 rounded-md p-3 bg-amber-50/50">
            <h4 className="font-medium mb-2">Unik</h4>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <Input
                  type="number"
                  value={combat.dodge || ''}
                  onChange={(e) => updateCombat('dodge', parseInt(e.target.value) || 0)}
                  fullWidth
                />
                <p className="text-xs text-center mt-1">Wartość</p>
              </div>
              <div>
                <Input
                  type="number"
                  value={calculateValue(combat.dodge, 'half')}
                  readOnly
                  fullWidth
                />
                <p className="text-xs text-center mt-1">1/2</p>
              </div>
              <div>
                <Input
                  type="number"
                  value={calculateValue(combat.dodge, 'fifth')}
                  readOnly
                  fullWidth
                />
                <p className="text-xs text-center mt-1">1/5</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Weapons */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium font-cinzel text-red-900">Uzbrojenie</h3>
          <Button
            onClick={addWeapon}
            size="sm"
          >
            <Plus size={16} className="mr-1" />
            Dodaj broń
          </Button>
        </div>
        
        {weapons.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-amber-100">
                  <th className="text-left p-3 border-b border-amber-300">Broń</th>
                  <th className="p-3 border-b border-amber-300">Norm.</th>
                  <th className="p-3 border-b border-amber-300">Wym.</th>
                  <th className="p-3 border-b border-amber-300">Ekstr.</th>
                  <th className="p-3 border-b border-amber-300">Obrażenia</th>
                  <th className="p-3 border-b border-amber-300">Zasięg</th>
                  <th className="p-3 border-b border-amber-300">Ataki</th>
                  <th className="p-3 border-b border-amber-300">Amu.</th>
                  <th className="p-3 border-b border-amber-300">Zaw</th>
                  <th className="p-3 border-b border-amber-300"></th>
                </tr>
              </thead>
              <tbody>
                {weapons.map(weapon => (
                  <tr key={weapon.id} className="border-b border-amber-200 hover:bg-amber-50">
                    <td className="p-2">
                      <Input
                        value={weapon.name}
                        onChange={(e) => updateWeapon(weapon.id, 'name', e.target.value)}
                        placeholder="Nazwa broni"
                        className="w-full"
                      />
                    </td>
                    <td className="p-2">
                      <Input
                        value={weapon.regular}
                        onChange={(e) => updateWeapon(weapon.id, 'regular', e.target.value)}
                        placeholder="Norm."
                        className="w-16"
                      />
                    </td>
                    <td className="p-2">
                      <Input
                        value={weapon.hard}
                        onChange={(e) => updateWeapon(weapon.id, 'hard', e.target.value)}
                        placeholder="Wym."
                        className="w-16"
                      />
                    </td>
                    <td className="p-2">
                      <Input
                        value={weapon.extreme}
                        onChange={(e) => updateWeapon(weapon.id, 'extreme', e.target.value)}
                        placeholder="Ekstr."
                        className="w-16"
                      />
                    </td>
                    <td className="p-2">
                      <Input
                        value={weapon.damage}
                        onChange={(e) => updateWeapon(weapon.id, 'damage', e.target.value)}
                        placeholder="Obrażenia"
                        className="w-20"
                      />
                    </td>
                    <td className="p-2">
                      <Input
                        value={weapon.range}
                        onChange={(e) => updateWeapon(weapon.id, 'range', e.target.value)}
                        placeholder="Zasięg"
                        className="w-16"
                      />
                    </td>
                    <td className="p-2">
                      <Input
                        value={weapon.attacks}
                        onChange={(e) => updateWeapon(weapon.id, 'attacks', e.target.value)}
                        placeholder="Ataki"
                        className="w-16"
                      />
                    </td>
                    <td className="p-2">
                      <Input
                        value={weapon.ammo}
                        onChange={(e) => updateWeapon(weapon.id, 'ammo', e.target.value)}
                        placeholder="Amu."
                        className="w-16"
                      />
                    </td>
                    <td className="p-2">
                      <Input
                        value={weapon.malfunction}
                        onChange={(e) => updateWeapon(weapon.id, 'malfunction', e.target.value)}
                        placeholder="Zaw"
                        className="w-16"
                      />
                    </td>
                    <td className="p-2 text-center">
                      <button
                        onClick={() => removeWeapon(weapon.id)}
                        className="text-red-600 hover:text-red-800"
                        title="Usuń broń"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 bg-amber-50 border border-amber-200 rounded-md">
            <p className="text-stone-600 mb-3">Nie dodano jeszcze żadnej broni</p>
            <Button onClick={addWeapon}>
              <Plus size={16} className="mr-1" />
              Dodaj broń
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CombatTab;