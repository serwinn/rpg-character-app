import { useRef, useState } from 'react';
import FormField from '../../ui/FormField';
import Input from '../../ui/Input';

interface Character {
  name: string;
  occupation: string;
  age: number;
  gender: string;
  residence: string;
  birthplace: string;
  avatar?: string; // base64 string
  [key: string]: any;
}

interface BasicInfoTabProps {
  character: Character;
  onChange: (field: string, value: any) => void;
  isNewCharacter?: boolean;
}

const MAX_AVATAR_SIZE = 1024 * 1024; // 1MB

const BasicInfoTab = ({ character, onChange, isNewCharacter = false }: BasicInfoTabProps) => {
  // Always prefer top-level avatar if present, fallback to version.data
  const data = character?.version?.data ? { ...character.version.data, avatar: character.avatar ?? character.version.data.avatar } : character;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarError, setAvatarError] = useState<string | null>(null);

  // Handle avatar file upload and convert to base64
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_AVATAR_SIZE) {
      setAvatarError('Plik awatara jest za duży (maks. 1MB)');
      return;
    }
    setAvatarError(null);
    const reader = new FileReader();
    reader.onload = (ev) => {
      const base64 = ev.target?.result as string;
      // Always update top-level avatar
      onChange('avatar', base64);
      // If using versioned data, update avatar in version.data too
      if (character.version && character.version.data) {
        onChange('version', {
          ...character.version,
          data: {
            ...character.version.data,
            avatar: base64,
          },
        });
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex items-start gap-10">
      {/* Sekcja awatara */}
      <div>
        <div className="w-40 h-64 bg-amber-100 border border-amber-300 flex items-center justify-center overflow-hidden rounded-lg">
          {data.avatar ? (
            <img
              src={data.avatar}
              alt="Awatar"
              className="object-cover w-full h-full"
            />
          ) : (
            <span className="text-stone-400 text-xs">Brak awatara</span>
          )}
        </div>
        <div className="mt-2 flex flex-col items-center">
          <button
            type="button"
            className="text-xs text-amber-700 hover:underline"
            onClick={() => fileInputRef.current?.click()}
          >
            Wybierz awatar
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarChange}
          />
          {avatarError && (
            <span className="text-xs text-red-600 mt-1">{avatarError}</span>
          )}
        </div>
      </div>
      {/* Sekcja pól */}
      <div className="flex-1 flex flex-col gap-4 justify-start">
        {[
          { label: "Imię", htmlFor: "name", value: data.name || '', onChange: (e: any) => onChange('name', e.target.value), placeholder: "Imię postaci", required: isNewCharacter, type: "text" },
          { label: "Zawód", htmlFor: "occupation", value: data.occupation || '', onChange: (e: any) => onChange('occupation', e.target.value), placeholder: "Zawód postaci", type: "text" },
          { label: "Wiek", htmlFor: "age", value: data.age || '', onChange: (e: any) => onChange('age', parseInt(e.target.value) || ''), placeholder: "Wiek", type: "number" },
          { label: "Płeć", htmlFor: "gender", value: data.gender || '', onChange: (e: any) => onChange('gender', e.target.value), placeholder: "Płeć", type: "text" },
          { label: "Miejsce zamieszkania", htmlFor: "residence", value: data.residence || '', onChange: (e: any) => onChange('residence', e.target.value), placeholder: "Miejsce zamieszkania", type: "text" },
          { label: "Miejsce urodzenia", htmlFor: "birthplace", value: data.birthplace || '', onChange: (e: any) => onChange('birthplace', e.target.value), placeholder: "Miejsce urodzenia", type: "text" },
        ].map((field, idx) => (
          <div key={field.htmlFor} className="flex items-center gap-4">
            <div className="w-48">
              <label htmlFor={field.htmlFor} className="block text-sm font-medium text-gray-700">
                {field.label}{field.required && <span className="text-red-500">*</span>}
              </label>
            </div>
            <div className="flex-1">
              <Input
                id={field.htmlFor}
                type={field.type}
                value={field.value}
                onChange={field.onChange}
                placeholder={field.placeholder}
                fullWidth
                required={field.required}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BasicInfoTab;