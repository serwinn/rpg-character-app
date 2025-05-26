import { useState, useEffect } from 'react';
import { HelpCircle } from 'lucide-react';
import Input from '../../ui/Input';

// Types for better type safety
type AttributeKey =
  | 'strength'
  | 'constitution'
  | 'size'
  | 'dexterity'
  | 'appearance'
  | 'intelligence'
  | 'power'
  | 'education';

type DerivedKey =
  | 'movement'
  | 'sanity'
  | 'luck'
  | 'hitPoints'
  | 'magicPoints';

interface Character {
  attributes: Record<AttributeKey, number>;
  derived: {
    movement: {
      value: number;
      moveUp: boolean;
      moveDown: boolean;
    };
    sanity: {
      value: number;
      temporary: boolean;
      indefinite: boolean;
    };
    luck: {
      value: number;
      max: number;
    };
    hitPoints: {
      value: number;
      max: number;
      majorWound: boolean;
    };
    magicPoints: {
      value: number;
      max: number;
    };
  };
  [key: string]: any;
}

interface StatsTabProps {
  character: Character;
  onChange: (field: string, value: any) => void;
}

// Extracted attribute input for DRYness
const AttributeInput = ({
  label,
  value,
  onChange,
  half,
  fifth,
}: {
  label: string;
  value: number | '';
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  half: number;
  fifth: number;
}) => (
  <div className="border border-amber-200 rounded-md p-3 bg-amber-50/50">
    <h4 className="font-medium mb-2">{label}</h4>
    <div className="grid grid-cols-3 gap-2">
      <div>
        <Input
          type="number"
          value={value}
          onChange={onChange}
          fullWidth
          aria-label={label}
        />
        <p className="text-xs text-center mt-1">Cecha</p>
      </div>
      <div>
        <Input type="number" value={half} readOnly fullWidth aria-label={`${label} 1/2`} />
        <p className="text-xs text-center mt-1">1/2</p>
      </div>
      <div>
        <Input type="number" value={fifth} readOnly fullWidth aria-label={`${label} 1/5`} />
        <p className="text-xs text-center mt-1">1/5</p>
      </div>
    </div>
  </div>
);

const StatsTab = ({ character, onChange }: StatsTabProps) => {
  const [showAttributeHelp, setShowAttributeHelp] = useState(false);

  // Provide safe defaults for all nested properties
  const attributes = {
    ...(character.attributes || {}),
    strength: character.attributes?.strength ?? 0,
    constitution: character.attributes?.constitution ?? 0,
    size: character.attributes?.size ?? 0,
    dexterity: character.attributes?.dexterity ?? 0,
    appearance: character.attributes?.appearance ?? 0,
    intelligence: character.attributes?.intelligence ?? 0,
    power: character.attributes?.power ?? 0,
    education: character.attributes?.education ?? 0,
  };

  const derived = {
    movement: { ...(character.derived?.movement || {}), value: character.derived?.movement?.value ?? 0, moveUp: character.derived?.movement?.moveUp ?? false, moveDown: character.derived?.movement?.moveDown ?? false },
    sanity: { ...(character.derived?.sanity || {}), value: character.derived?.sanity?.value ?? 0, temporary: character.derived?.sanity?.temporary ?? false, indefinite: character.derived?.sanity?.indefinite ?? false },
    luck: { ...(character.derived?.luck || {}), value: character.derived?.luck?.value ?? 0, max: character.derived?.luck?.max ?? 0 },
    hitPoints: { ...(character.derived?.hitPoints || {}), value: character.derived?.hitPoints?.value ?? 0, max: character.derived?.hitPoints?.max ?? 0, majorWound: character.derived?.hitPoints?.majorWound ?? false },
    magicPoints: { ...(character.derived?.magicPoints || {}), value: character.derived?.magicPoints?.value ?? 0, max: character.derived?.magicPoints?.max ?? 0 },
  };

  // Update attribute with type safety and allow empty string for clearing
  const updateAttribute = (attribute: AttributeKey, value: number | '') => {
    const newAttributes = { ...attributes, [attribute]: value === '' ? 0 : value };
    onChange('attributes', newAttributes);
  };

  // Update derived stat with type safety
  const updateDerived = <T extends DerivedKey, F extends keyof typeof derived[T]>(
    stat: T,
    field: F,
    value: any
  ) => {
    const newDerived = {
      ...derived,
      [stat]: {
        ...derived[stat],
        [field]: value,
      },
    };
    onChange('derived', newDerived);
  };

  // Calculate half and fifth values
  const calculateValue = (value: number, type: 'half' | 'fifth') => {
    if (!value) return 0;
    return type === 'half' ? Math.floor(value / 2) : Math.floor(value / 5);
  };

  return (
    <div className="space-y-8">
      {/* Attributes section */}
      <div>
        <div className="flex items-center mb-4">
          <h3 className="text-lg font-medium font-cinzel text-red-900">Cechy</h3>
          <button
            type="button"
            onClick={() => setShowAttributeHelp(!showAttributeHelp)}
            className="ml-2 text-stone-500 hover:text-stone-700"
            aria-label="Pokaż pomoc"
          >
            <HelpCircle size={16} />
          </button>
        </div>

        {showAttributeHelp && (
          <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-md text-sm">
            <p className="text-stone-700 mb-2">
              Cechy określają podstawowe właściwości twojej postaci. Dla każdej cechy:
            </p>
            <ul className="list-disc ml-5 text-stone-600 space-y-1">
              <li>Wprowadź wartość podstawową (zwykle między 1-99)</li>
              <li>Wartości 1/2 i 1/5 są obliczane automatycznie</li>
              <li>Wartość 1/2 jest używana dla testów o normalnej trudności</li>
              <li>Wartość 1/5 jest używana dla testów o wysokiej trudności</li>
            </ul>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          <AttributeInput
            label="Siła (S)"
            value={attributes.strength ?? ''}
            onChange={e => updateAttribute('strength', e.target.value === '' ? '' : parseInt(e.target.value))}
            half={calculateValue(attributes.strength, 'half')}
            fifth={calculateValue(attributes.strength, 'fifth')}
          />
          <AttributeInput
            label="Kondycja (KON)"
            value={attributes.constitution ?? ''}
            onChange={e => updateAttribute('constitution', e.target.value === '' ? '' : parseInt(e.target.value))}
            half={calculateValue(attributes.constitution, 'half')}
            fifth={calculateValue(attributes.constitution, 'fifth')}
          />
          <AttributeInput
            label="Budowa ciała (BC)"
            value={attributes.size ?? ''}
            onChange={e => updateAttribute('size', e.target.value === '' ? '' : parseInt(e.target.value))}
            half={calculateValue(attributes.size, 'half')}
            fifth={calculateValue(attributes.size, 'fifth')}
          />
          <AttributeInput
            label="Zręczność (ZR)"
            value={attributes.dexterity ?? ''}
            onChange={e => updateAttribute('dexterity', e.target.value === '' ? '' : parseInt(e.target.value))}
            half={calculateValue(attributes.dexterity, 'half')}
            fifth={calculateValue(attributes.dexterity, 'fifth')}
          />
          <AttributeInput
            label="Wygląd (WYG)"
            value={attributes.appearance ?? ''}
            onChange={e => updateAttribute('appearance', e.target.value === '' ? '' : parseInt(e.target.value))}
            half={calculateValue(attributes.appearance, 'half')}
            fifth={calculateValue(attributes.appearance, 'fifth')}
          />
          <AttributeInput
            label="Inteligencja (INT)"
            value={attributes.intelligence ?? ''}
            onChange={e => updateAttribute('intelligence', e.target.value === '' ? '' : parseInt(e.target.value))}
            half={calculateValue(attributes.intelligence, 'half')}
            fifth={calculateValue(attributes.intelligence, 'fifth')}
          />
          <AttributeInput
            label="Moc (MOC)"
            value={attributes.power ?? ''}
            onChange={e => updateAttribute('power', e.target.value === '' ? '' : parseInt(e.target.value))}
            half={calculateValue(attributes.power, 'half')}
            fifth={calculateValue(attributes.power, 'fifth')}
          />
          <AttributeInput
            label="Wykształcenie (WYK)"
            value={attributes.education ?? ''}
            onChange={e => updateAttribute('education', e.target.value === '' ? '' : parseInt(e.target.value))}
            half={calculateValue(attributes.education, 'half')}
            fifth={calculateValue(attributes.education, 'fifth')}
          />
        </div>
      </div>

      {/* Derived stats section */}
      <div>
        <h3 className="text-lg font-medium font-cinzel text-red-900 mb-4">Pochodne</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {/* Movement */}
          <div className="border border-amber-200 rounded-md p-3 bg-amber-50/50">
            <h4 className="font-medium mb-2">Ruch</h4>
            <div className="flex items-center gap-4">
              <Input
                type="number"
                value={derived.movement.value ?? ''}
                onChange={e => updateDerived('movement', 'value', e.target.value === '' ? 0 : parseInt(e.target.value))}
                className="w-20"
                aria-label="Ruch"
              />
              <div className="flex items-center gap-2">
                <label className="flex items-center text-sm">
                  <input
                    type="checkbox"
                    checked={derived.movement.moveUp}
                    onChange={e => updateDerived('movement', 'moveUp', e.target.checked)}
                    className="mr-1"
                    aria-label="Ruch +1"
                  />
                  +1
                </label>
                <label className="flex items-center text-sm">
                  <input
                    type="checkbox"
                    checked={derived.movement.moveDown}
                    onChange={e => updateDerived('movement', 'moveDown', e.target.checked)}
                    className="mr-1"
                    aria-label="Ruch -1"
                  />
                  -1
                </label>
              </div>
            </div>
          </div>

          {/* Sanity */}
          <div className="border border-amber-200 rounded-md p-3 bg-amber-50/50">
            <h4 className="font-medium mb-2">Poczytalność</h4>
            <div className="flex items-center gap-4">
              <Input
                type="number"
                value={derived.sanity.value ?? ''}
                onChange={e => updateDerived('sanity', 'value', e.target.value === '' ? 0 : parseInt(e.target.value))}
                className="w-20"
                aria-label="Poczytalność"
              />
              <div className="flex items-center gap-2">
                <label className="flex items-center text-sm">
                  <input
                    type="checkbox"
                    checked={derived.sanity.temporary}
                    onChange={e => updateDerived('sanity', 'temporary', e.target.checked)}
                    className="mr-1"
                    aria-label="Poczytalność chwilowa"
                  />
                  Chwilowa
                </label>
                <label className="flex items-center text-sm">
                  <input
                    type="checkbox"
                    checked={derived.sanity.indefinite}
                    onChange={e => updateDerived('sanity', 'indefinite', e.target.checked)}
                    className="mr-1"
                    aria-label="Poczytalność czasowa"
                  />
                  Czasowa
                </label>
              </div>
            </div>
          </div>

          {/* Luck */}
          <div className="border border-amber-200 rounded-md p-3 bg-amber-50/50">
            <h4 className="font-medium mb-2">Szczęście</h4>
            <div className="flex items-center gap-3">
              <div>
                <label className="text-xs block mb-1" htmlFor="luck-value">Wartość</label>
                <Input
                  id="luck-value"
                  type="number"
                  value={derived.luck.value ?? ''}
                  onChange={e => updateDerived('luck', 'value', e.target.value === '' ? 0 : parseInt(e.target.value))}
                  className="w-20"
                  aria-label="Szczęście wartość"
                />
              </div>
              <div>
                <label className="text-xs block mb-1" htmlFor="luck-max">Maksimum</label>
                <Input
                  id="luck-max"
                  type="number"
                  value={derived.luck.max ?? ''}
                  onChange={e => updateDerived('luck', 'max', e.target.value === '' ? 0 : parseInt(e.target.value))}
                  className="w-20"
                  aria-label="Szczęście maksimum"
                />
              </div>
            </div>
          </div>

          {/* Hit Points */}
          <div className="border border-amber-200 rounded-md p-3 bg-amber-50/50">
            <h4 className="font-medium mb-2">Punkty wytrzymałości</h4>
            <div className="flex items-center gap-3">
              <div>
                <label className="text-xs block mb-1" htmlFor="hp-value">Wartość</label>
                <Input
                  id="hp-value"
                  type="number"
                  value={derived.hitPoints.value ?? ''}
                  onChange={e => updateDerived('hitPoints', 'value', e.target.value === '' ? 0 : parseInt(e.target.value))}
                  className="w-20"
                  aria-label="Wytrzymałość wartość"
                />
              </div>
              <div>
                <label className="text-xs block mb-1" htmlFor="hp-max">Maksimum</label>
                <Input
                  id="hp-max"
                  type="number"
                  value={derived.hitPoints.max ?? ''}
                  onChange={e => updateDerived('hitPoints', 'max', e.target.value === '' ? 0 : parseInt(e.target.value))}
                  className="w-20"
                  aria-label="Wytrzymałość maksimum"
                />
              </div>
              <div className="ml-2">
                <label className="flex items-center text-sm">
                  <input
                    type="checkbox"
                    checked={derived.hitPoints.majorWound}
                    onChange={e => updateDerived('hitPoints', 'majorWound', e.target.checked)}
                    className="mr-1"
                    aria-label="Ciężka rana"
                  />
                  Ciężka rana
                </label>
              </div>
            </div>
          </div>

          {/* Magic Points */}
          <div className="border border-amber-200 rounded-md p-3 bg-amber-50/50">
            <h4 className="font-medium mb-2">Punkty magii</h4>
            <div className="flex items-center gap-3">
              <div>
                <label className="text-xs block mb-1" htmlFor="mp-value">Wartość</label>
                <Input
                  id="mp-value"
                  type="number"
                  value={derived.magicPoints.value ?? ''}
                  onChange={e => updateDerived('magicPoints', 'value', e.target.value === '' ? 0 : parseInt(e.target.value))}
                  className="w-20"
                  aria-label="Punkty magii wartość"
                />
              </div>
              <div>
                <label className="text-xs block mb-1" htmlFor="mp-max">Maksimum</label>
                <Input
                  id="mp-max"
                  type="number"
                  value={derived.magicPoints.max ?? ''}
                  onChange={e => updateDerived('magicPoints', 'max', e.target.value === '' ? 0 : parseInt(e.target.value))}
                  className="w-20"
                  aria-label="Punkty magii maksimum"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsTab;