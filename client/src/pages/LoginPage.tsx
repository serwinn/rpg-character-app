import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { LogIn, AlertCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import FormField from '../components/ui/FormField';
import { useAuth } from '../contexts/AuthContext';

interface LoginFormValues {
  email: string;
  password: string;
}

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>();
  
  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await login(data.email, data.password);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center justify-center gap-2">
            <LogIn size={24} />
            <span>Zaloguj się</span>
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
              label="Email"
              htmlFor="email"
              error={errors.email?.message}
              required
            >
              <Input
                id="email"
                type="email"
                fullWidth
                placeholder="twój.email@przyklad.com"
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
            
            <Button
              type="submit"
              fullWidth
              isLoading={isLoading}
              className="mt-4"
            >
              Zaloguj się
            </Button>
            
            <div className="mt-4 text-center">
              <p className="text-stone-600">
                Nie masz konta?{' '}
                <Link to="/register" className="text-red-800 hover:text-red-700">
                  Zarejestruj się tutaj
                </Link>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;