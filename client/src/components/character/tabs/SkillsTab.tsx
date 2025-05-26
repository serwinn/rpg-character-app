import { useState, useEffect } from 'react';
import { Search, Plus, Trash2 } from 'lucide-react';
import Input from '../../ui/Input';
import Button from '../../ui/Button';

interface Skill {
  id: string;
  name: string;
  baseValue: number | string; // baseValue can be a number or a string for custom skills
  value: number;
  extra?: string;
  custom?: boolean;
}

interface Character {
  skills?: Skill[];
  [key: string]: any;
}

interface SkillsTabProps {
  character: Character;
  onChange: (field: string, value: any) => void;
}

// Utility to get the deepest data layer
function getDeepCharacter(raw: any): any {
  let current = raw;
  while (
    current?.data &&
    typeof current.data === 'object' &&
    current.data !== current
  ) {
    if (
      (Array.isArray(current.skills) && current.skills.length > 0) ||
      (current.attributes && Object.keys(current.attributes).length > 0)
    ) {
      break;
    }
    current = current.data;
  }
  return current;
}

// Default skills for new characters (full names, not editable)
const defaultSkills = [
  { name: 'Antropologia', baseValue: 1 },
  { name: 'Archeologia', baseValue: 1 },
  { name: 'Broń Palna (Karabin/Strzelba)', baseValue: 25 },
  { name: 'Broń Palna (Krótka)', baseValue: 20 },
  { name: 'Charakteryzacja', baseValue: 5 },
  { name: 'Elektryka', baseValue: 10 },
  { name: 'Gadanina', baseValue: 5 },
  { name: 'Historia', baseValue: 5 },
  { name: 'Jeździectwo', baseValue: 5 },
  { name: 'Język Obcy', baseValue: 1, extra: '' }, // editable field
  { name: 'Język Ojczysty (WYK)', baseValue: 0, extra: '' }, // editable field
  { name: 'Korzystanie z Bibliotek', baseValue: 20 },
  { name: 'Księgowość', baseValue: 5 },
  { name: 'Majętność', baseValue: 0 },
  { name: 'Mechanika', baseValue: 10 },
  { name: 'Medycyna', baseValue: 1 },
  { name: 'Mity Cthulhu', baseValue: 0 },
  { name: 'Nasłuchiwanie', baseValue: 20 },
  { name: 'Nauka', baseValue: 1, extra: '' }, // 3 editable fields
  { name: 'Nauka', baseValue: 1, extra: '' },
  { name: 'Nauka', baseValue: 1, extra: '' },
  { name: 'Nawigacja', baseValue: 10 },
  { name: 'Obsługa Ciężkiego Sprzętu', baseValue: 1 },
  { name: 'Okultyzm', baseValue: 5 },
  { name: 'Perswazja', baseValue: 10 },
  { name: 'Pierwsza Pomoc', baseValue: 30 },
  { name: 'Pilotowanie', baseValue: 1, extra: '' }, // editable field
  { name: 'Pływanie', baseValue: 20 },
  { name: 'Prawo', baseValue: 5 },
  { name: 'Prowadzenie Samochodu', baseValue: 20 },
  { name: 'Psychoanaliza', baseValue: 1 },
  { name: 'Psychologia', baseValue: 10 },
  { name: 'Rzucanie', baseValue: 20 },
  { name: 'Skakanie', baseValue: 20 },
  { name: 'Spostrzegawczość', baseValue: 25 },
  { name: 'Sztuka/Rzemiosło', baseValue: 5, extra: '' }, // 3 editable fields
  { name: 'Sztuka/Rzemiosło', baseValue: 5, extra: '' },
  { name: 'Sztuka/Rzemiosło', baseValue: 5, extra: '' },
  { name: 'Sztuka Przetrwania', baseValue: 10, extra: '' }, // editable field
  { name: 'Ślusarstwo', baseValue: 1 },
  { name: 'Tropienie', baseValue: 10 },
  { name: 'Ukrywanie', baseValue: 20 },
  { name: 'Unik (1/2 ZR)', baseValue: 0 },
  { name: 'Urok Osobisty', baseValue: 15 },
  { name: 'Walka Wręcz (Bijatyka)', baseValue: 25 },
  { name: 'Wiedza o Naturze', baseValue: 10 },
  { name: 'Wspinaczka', baseValue: 20 },
  { name: 'Wycena', baseValue: 5 },
  { name: 'Zastraszanie', baseValue: 15 },
  { name: 'Zręczne Palce', baseValue: 10 }
];

const isExtraEditable = (name: string) =>
  ['Język Obcy', 'Język Ojczysty (WYK)', 'Nauka', 'Sztuka/Rzemiosło', 'Pilotowanie', 'Sztuka Przetrwania'].includes(name);

const calculateValue = (value: number, type: 'half' | 'fifth') => {
  if (!value && value !== 0) return 0;
  return type === 'half' ? Math.floor(value / 2) : Math.floor(value / 5);
};

const splitToColumnsTopDown = <T,>(arr: T[], columns: number): T[][] => {
  const perCol = Math.ceil(arr.length / columns);
  return Array.from({ length: columns }, (_, colIdx) =>
    arr.slice(colIdx * perCol, (colIdx + 1) * perCol)
  );
};

const SkillsTab = ({ character, onChange }: SkillsTabProps) => {
  const normalizedCharacter = getDeepCharacter(character);
  const [searchTerm, setSearchTerm] = useState('');
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillBase, setNewSkillBase] = useState(1);
  const [checked, setChecked] = useState<{ [id: string]: boolean }>({});

  const skills: Skill[] = normalizedCharacter.skills || [];

  useEffect(() => {
    if (!skills.length) {
      const newSkills = defaultSkills.map(s => ({
        id: Date.now() + Math.random().toString(),
        name: s.name,
        baseValue: s.baseValue,
        value: '',
        extra: s.extra ?? '',
        custom: false
      }));
      onChange('skills', newSkills);
    }
  }, []);

  const updateSkill = (id: string, field: string, value: any) => {
    const updatedSkills = skills.map(skill => {
      if (skill.id === id) {
        return { ...skill, [field]: value };
      }
      return skill;
    });
    onChange('skills', updatedSkills);
  };

  const addSkill = () => {
    if (!newSkillName.trim()) return;
    const newSkill: Skill = {
      id: Date.now() + Math.random().toString(),
      name: newSkillName,
      baseValue: newSkillBase,
      value: newSkillBase,
      custom: true
    };
    onChange('skills', [...skills, newSkill]);
    setNewSkillName('');
    setNewSkillBase(1);
  };

  const removeSkill = (id: string) => {
    onChange('skills', skills.filter(skill => skill.id !== id));
    setChecked(prev => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
  };

  const filteredSkills = skills.filter(skill =>
    skill.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (skill.extra && skill.extra.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const columns = splitToColumnsTopDown(filteredSkills, 3);

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-center mb-2 gap-2">
        <h3 className="text-sm font-semibold font-cinzel text-red-900">Umiejętności</h3>
        <div className="relative w-full md:w-64">
          <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
            <Search size={14} className="text-stone-500" />
          </div>
          <input
            type="text"
            placeholder="Szukaj..."
            className="pl-7 pr-2 py-0.5 w-full bg-amber-50 border border-amber-300 rounded text-xs"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <div className="flex gap-6">
        {columns.map((col, colIdx) => (
          <div key={colIdx} className="flex-1 bg-amber-50 rounded border border-amber-200 p-2">
            <table className="w-full border-collapse text-[11px]">
              <thead>
                <tr className="bg-amber-100">
                  <th className="px-1 py-0.5 border-b border-amber-300"></th>
                  <th className="text-left px-1 py-0.5 border-b border-amber-300">Nazwa&nbsp;+&nbsp;%</th>
                  <th className="px-1 py-0.5 border-b border-amber-300">Wartość</th>
                  <th className="px-1 py-0.5 border-b border-amber-300">1/2</th>
                  <th className="px-1 py-0.5 border-b border-amber-300">1/5</th>
                  <th className="px-1 py-0.5 border-b border-amber-300">Dodatkowe</th>
                  <th className="px-1 py-0.5 border-b border-amber-300"></th>
                </tr>
              </thead>
              <tbody>
                {col.map(skill => (
                  <tr key={skill.id} className="border-b border-amber-200 hover:bg-amber-100">
                    <td className="px-1 py-0.5 text-center">
                      <input
                        type="checkbox"
                        checked={!!checked[skill.id]}
                        onChange={e =>
                          setChecked(prev => ({ ...prev, [skill.id]: e.target.checked }))
                        }
                        aria-label="Zaznacz umiejętność"
                      />
                    </td>
                    <td className="px-1 py-0.5 whitespace-nowrap">
                      {skill.name}
                      {typeof skill.baseValue === 'number'
                        ? skill.baseValue > 0 && (
                            <span className="text-stone-500 ml-1">
                              ({skill.baseValue.toString().padStart(2, '0')}%)
                            </span>
                          )
                        : skill.baseValue && (
                            <span className="text-stone-500 ml-1">
                              ({skill.baseValue})
                            </span>
                          )
                      }
                    </td>
                    <td className="px-1 py-0.5">
                      <Input
                        type="number"
                        value={skill.value}
                        onChange={e => updateSkill(skill.id, 'value', parseInt(e.target.value) || 0)}
                        min={0}
                        max={99}
                        className="w-12 text-[11px] px-1 py-0.5"
                      />
                    </td>
                    <td className="px-1 py-0.5 text-center">{calculateValue(skill.value, 'half')}</td>
                    <td className="px-1 py-0.5 text-center">{calculateValue(skill.value, 'fifth')}</td>
                    <td className="px-1 py-0.5 w-20">
                      {isExtraEditable(skill.name) ? (
                        <Input
                          value={skill.extra || ''}
                          onChange={e => updateSkill(skill.id, 'extra', e.target.value)}
                          placeholder={
                            skill.name === 'Język Obcy' ? 'Język' :
                            skill.name === 'Język Ojczysty (WYK)' ? 'Język' :
                            skill.name === 'Nauka' ? 'Dziedzina' :
                            skill.name === 'Sztuka/Rzemiosło' ? 'Typ' :
                            skill.name === 'Pilotowanie' ? 'Pojazd' :
                            skill.name === 'Sztuka Przetrwania' ? 'Opis' : ''
                          }
                          className="w-full text-[11px] px-1 py-0.5"
                        />
                      ) : null}
                    </td>
                    <td className="px-1 py-0.5 text-center">
                      {skill.custom && (
                        <button
                          type="button"
                          className="text-red-500 hover:text-red-700"
                          title="Usuń"
                          onClick={() => removeSkill(skill.id)}
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2 mt-2">
        <Input
          type="text"
          placeholder="Nowa umiejętność"
          value={newSkillName}
          onChange={e => setNewSkillName(e.target.value)}
          className="text-xs w-40"
        />
        <Input
          type="number"
          min={0}
          max={99}
          value={newSkillBase}
          onChange={e => setNewSkillBase(parseInt(e.target.value) || 0)}
          className="text-xs w-16"
        />
        <Button size="sm" variant="outline" onClick={addSkill}>
          <Plus size={14} className="mr-1" /> Dodaj
        </Button>
      </div>
    </div>
  );
};

export default SkillsTab;