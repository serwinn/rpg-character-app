import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { UserPlus, AlertCircle, User, Shield } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import FormField from '../components/ui/FormField';
import { useAuth, UserRole } from '../contexts/AuthContext';

interface RegisterFormValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: UserRole;
}

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register: registerUser } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const { register, handleSubmit, watch, formState: { errors } } = useForm<RegisterFormValues>({
    defaultValues: {
      role: 'PLAYER'
    }
  });
  
  const password = watch('password');
  
  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await registerUser(data.name, data.email, data.password, data.role);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-[80vh] flex items-center justify-center py-8">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center justify-center gap-2">
            <UserPlus size={24} />
            <span>Załóż konto</span>
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-800 rounded-md flex items-start">
              <AlertCircle size={18} className="mr-2 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
          
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormField
              label="Imię"
              htmlFor="name"
              error={errors.name?.message}
              required
            >
              <Input
                id="name"
                fullWidth
                placeholder="Jan Kowalski"
                {...register('name', { 
                  required: 'Imię jest wymagane',
                  minLength: {
                    value: 2,
                    message: 'Imię musi mieć co najmniej 2 znaki'
                  }
                })}
              />
            </FormField>
            
            <FormField
              label="Email"
              htmlFor="email"
              error={errors.email?.message}
              required
            >
              <Input
                id="email"
                type="email"
                fullWidth
                placeholder="twoj.email@przyklad.com"
                {...register('email', { 
                  required: 'Email jest wymagany',
                  pattern: {
                    value: /\S+@\S+\.\S+/,
                    message: 'Wprowadź poprawny adres email'
                  }
                })}
              />
            </FormField>
            
            <FormField
              label="Hasło"
              htmlFor="password"
              error={errors.password?.message}
              required
            >
              <Input
                id="password"
                type="password"
                fullWidth
                placeholder="••••••••"
                {...register('password', { 
                  required: 'Hasło jest wymagane',
                  minLength: {
                    value: 6,
                    message: 'Hasło musi mieć co najmniej 6 znaków'
                  }
                })}
              />
            </FormField>
            
            <FormField
              label="Potwierdź hasło"
              htmlFor="confirmPassword"
              error={errors.confirmPassword?.message}
              required
            >
              <Input
                id="confirmPassword"
                type="password"
                fullWidth
                placeholder="••••••••"
                {...register('confirmPassword', { 
                  required: 'Potwierdzenie hasła jest wymagane',
                  validate: value => value === password || 'Hasła nie są zgodne'
                })}
              />
            </FormField>
            
            <FormField
              label="Rola"
              htmlFor="role"
              required
            >
              <div className="flex gap-4 mt-1">
                <label className="flex items-center p-3 border border-amber-300 rounded-md cursor-pointer hover:bg-amber-100 transition-colors">
                  <input
                    type="radio"
                    value="PLAYER"
                    className="mr-2"
                    {...register('role')}
                  />
                  <User size={16} className="mr-1" />
                  Gracz
                </label>
                
                <label className="flex items-center p-3 border border-amber-300 rounded-md cursor-pointer hover:bg-amber-100 transition-colors">
                  <input
                    type="radio"
                    value="GM"
                    className="mr-2"
                    {...register('role')}
                  />
                  <Shield size={16} className="mr-1" />
                  Mistrz Gry
                </label>
              </div>
            </FormField>
            
            <Button
              type="submit"
              fullWidth
              isLoading={isLoading}
              className="mt-4"
            >
              Zarejestruj się
            </Button>
            
            <div className="mt-4 text-center">
              <p className="text-stone-600">
                Masz już konto?{' '}
                <Link to="/login" className="text-red-800 hover:text-red-700">
                  Zaloguj się tutaj
                </Link>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegisterPage;