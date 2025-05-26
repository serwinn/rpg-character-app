import FormField from '../../ui/FormField';
import Input from '../../ui/Input';

interface Background {
  description: string;
  ideology: string;
  significantPeople: string;
  significantPlaces: string;
  possessions: string;
  traits: string;
  injuries: string;
  phobias: string;
  arcaneItems: string;
  encounters: string;
  expenses: string;
  cash: string;
  assets: string;
}

interface Character {
  background?: Background; // <-- background may be undefined if not present in root
  [key: string]: any;
}

interface BackgroundTabProps {
  character: Character;
  onChange: (field: string, value: any) => void;
}

const defaultBackground: Background = {
  description: '',
  ideology: '',
  significantPeople: '',
  significantPlaces: '',
  possessions: '',
  traits: '',
  injuries: '',
  phobias: '',
  arcaneItems: '',
  encounters: '',
  expenses: '',
  cash: '',
  assets: ''
};

const BackgroundTab = ({ character, onChange }: BackgroundTabProps) => {
  // Support both flattened and nested data (from server)
  // If background is present, use it. Otherwise, try to map from root fields.
  let background: Background;
  if (character.background) {
    background = { ...defaultBackground, ...character.background };
  } else {
    // Flattened: fields are at root level
    background = {
      description: character.description ?? '',
      ideology: character.ideology ?? '',
      significantPeople: character.significantPeople ?? '',
      significantPlaces: character.significantPlaces ?? '',
      possessions: character.possessions ?? '',
      traits: character.traits ?? '',
      injuries: character.injuries ?? '',
      phobias: character.phobias ?? '',
      arcaneItems: character.arcaneItems ?? '',
      encounters: character.encounters ?? '',
      expenses: character.expenses ?? '',
      cash: character.cash ?? '',
      assets: character.assets ?? ''
    };
  }

  // Update background field (always update at root level for compatibility)
  const updateBackground = (field: string, value: string) => {
    // If background is nested, update background object
    if (character.background) {
      const updatedBackground = { ...background, [field]: value };
      onChange('background', updatedBackground);
    } else {
      // If flattened, update root field
      onChange(field, value);
    }
  };

  return (
    <div className="space-y-6">
      {/* Opis postaci */}
      <div>
        <FormField label={<span className="text-lg font-medium font-cinzel text-red-900">Opis postaci</span>} htmlFor="description">
          <textarea
            id="description"
            value={background.description}
            onChange={(e) => updateBackground('description', e.target.value)}
            className="w-full px-3 py-2 bg-amber-50 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 min-h-[100px]"
            placeholder="Opisz wygląd i osobowość swojej postaci..."
          />
        </FormField>
      </div>
      {/* Ideologia i przekonania */}
      <div>
        <FormField label={<span className="text-lg font-medium font-cinzel text-red-900">Ideologia i przekonania</span>} htmlFor="ideology">
          <textarea
            id="ideology"
            value={background.ideology}
            onChange={(e) => updateBackground('ideology', e.target.value)}
            className="w-full px-3 py-2 bg-amber-50 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 min-h-[80px]"
            placeholder="Jakie są przekonania i wartości twojej postaci..."
          />
        </FormField>
      </div>
      {/* Ważne osoby i miejsca */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <FormField label={<span className="text-lg font-medium font-cinzel text-red-900">Ważne osoby</span>} htmlFor="significantPeople">
            <textarea
              id="significantPeople"
              value={background.significantPeople}
              onChange={(e) => updateBackground('significantPeople', e.target.value)}
              className="w-full px-3 py-2 bg-amber-50 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 min-h-[80px]"
              placeholder="Kto jest ważny dla twojej postaci..."
            />
          </FormField>
        </div>
        <div>
          <FormField label={<span className="text-lg font-medium font-cinzel text-red-900">Znaczące miejsca</span>} htmlFor="significantPlaces">
            <textarea
              id="significantPlaces"
              value={background.significantPlaces}
              onChange={(e) => updateBackground('significantPlaces', e.target.value)}
              className="w-full px-3 py-2 bg-amber-50 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 min-h-[80px]"
              placeholder="Jakie miejsca są ważne dla twojej postaci..."
            />
          </FormField>
        </div>
      </div>
      {/* Rzeczy osobiste i przymioty */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <FormField label={<span className="text-lg font-medium font-cinzel text-red-900">Rzeczy osobiste</span>} htmlFor="possessions">
            <textarea
              id="possessions"
              value={background.possessions}
              onChange={(e) => updateBackground('possessions', e.target.value)}
              className="w-full px-3 py-2 bg-amber-50 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 min-h-[80px]"
              placeholder="Jakie przedmioty nosi ze sobą twoja postać..."
            />
          </FormField>
        </div>
        <div>
          <FormField label={<span className="text-lg font-medium font-cinzel text-red-900">Przymioty</span>} htmlFor="traits">
            <textarea
              id="traits"
              value={background.traits}
              onChange={(e) => updateBackground('traits', e.target.value)}
              className="w-full px-3 py-2 bg-amber-50 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 min-h-[80px]"
              placeholder="Cechy charakterystyczne twojej postaci..."
            />
          </FormField>
        </div>
      </div>
      {/* Urazy/blizny i fobie/manie */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <FormField label={<span className="text-lg font-medium font-cinzel text-red-900">Urazy/blizny</span>} htmlFor="injuries">
            <textarea
              id="injuries"
              value={background.injuries}
              onChange={(e) => updateBackground('injuries', e.target.value)}
              className="w-full px-3 py-2 bg-amber-50 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 min-h-[80px]"
              placeholder="Jakie urazy i blizny posiada twoja postać..."
            />
          </FormField>
        </div>
        <div>
          <FormField label={<span className="text-lg font-medium font-cinzel text-red-900">Fobie/Manie</span>} htmlFor="phobias">
            <textarea
              id="phobias"
              value={background.phobias}
              onChange={(e) => updateBackground('phobias', e.target.value)}
              className="w-full px-3 py-2 bg-amber-50 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 min-h-[80px]"
              placeholder="Czego boi się twoja postać..."
            />
          </FormField>
        </div>
      </div>
      {/* Tajemne księgi, zaklęcia i artefakty oraz spotkania z dziwnymi istotami */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <FormField label={<span className="text-lg font-medium font-cinzel text-red-900">Tajemne księgi, zaklęcia i artefakty</span>} htmlFor="arcaneItems">
            <textarea
              id="arcaneItems"
              value={background.arcaneItems}
              onChange={(e) => updateBackground('arcaneItems', e.target.value)}
              className="w-full px-3 py-2 bg-amber-50 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 min-h-[80px]"
              placeholder="Jakie magiczne przedmioty posiada twoja postać..."
            />
          </FormField>
        </div>
        <div>
          <FormField label={<span className="text-lg font-medium font-cinzel text-red-900">Spotkania z dziwnymi istotami</span>} htmlFor="encounters">
            <textarea
              id="encounters"
              value={background.encounters}
              onChange={(e) => updateBackground('encounters', e.target.value)}
              className="w-full px-3 py-2 bg-amber-50 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 min-h-[80px]"
              placeholder="Jakie dziwne istoty napotkała twoja postać..."
            />
          </FormField>
        </div>
      </div>
      {/* Gotówka i dobytek */}
      <div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FormField label={<span className="text-lg font-medium font-cinzel text-red-900">Poziom wydatków</span>} htmlFor="expenses">
            <Input
              id="expenses"
              value={background.expenses}
              onChange={(e) => updateBackground('expenses', e.target.value)}
              placeholder="np. Przeciętny"
              fullWidth
            />
          </FormField>
          <FormField label={<span className="text-lg font-medium font-cinzel text-red-900">Gotówka</span>} htmlFor="cash">
            <Input
              id="cash"
              value={background.cash}
              onChange={(e) => updateBackground('cash', e.target.value)}
              placeholder="np. 1000 zł"
              fullWidth
            />
          </FormField>
          <FormField label={<span className="text-lg font-medium font-cinzel text-red-900">Dobytek</span>} htmlFor="assets">
            <Input
              id="assets"
              value={background.assets}
              onChange={(e) => updateBackground('assets', e.target.value)}
              placeholder="np. Mieszkanie, samochód"
              fullWidth
            />
          </FormField>
        </div>
      </div>
    </div>
  );
};

export default BackgroundTab;