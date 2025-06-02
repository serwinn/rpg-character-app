import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { KeyReset, AlertCircle, ArrowLeft } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import FormField from '../components/ui/FormField';
import { VITE_BACKEND_URL as API_URL } from '../config';
import axios from 'axios';

interface ResetPasswordFormValues {
  password: string;
  confirmPassword: string;
}

const ResetPasswordPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { register, handleSubmit, watch, formState: { errors } } = useForm<ResetPasswordFormValues>();
  
  const password = watch('password');
  
  const onSubmit = async (data: ResetPasswordFormValues) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await axios.post(`${API_URL}/auth/reset-password/${token}`, {
        password: data.password
      });
      
      // Redirect to login with success message
      navigate('/login', { 
        state: { message: 'Hasło zostało zmienione. Możesz się teraz zalogować.' }
      });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to reset password');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center justify-center gap-2">
            <KeyReset size={24} />
            <span>Ustaw nowe hasło</span>
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
              label="Nowe hasło"
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
              label="Potwierdź nowe hasło"
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
            
            <Button
              type="submit"
              fullWidth
              isLoading={isLoading}
              className="mt-4"
            >
              Zmień hasło
            </Button>
            
            <div className="mt-4 text-center">
              <Link
                to="/login"
                className="text-red-800 hover:text-red-700 flex items-center justify-center gap-2"
              >
                <ArrowLeft size={16} />
                Powrót do logowania
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResetPasswordPage;