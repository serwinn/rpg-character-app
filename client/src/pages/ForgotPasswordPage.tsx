import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { KeyRound, AlertCircle, ArrowLeft } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import FormField from '../components/ui/FormField';
import { VITE_BACKEND_URL as API_URL } from '../config';
import axios from 'axios';

interface ForgotPasswordFormValues {
  email: string;
}

const ForgotPasswordPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const { register, handleSubmit, formState: { errors } } = useForm<ForgotPasswordFormValues>();
  
  const onSubmit = async (data: ForgotPasswordFormValues) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await axios.post(`${API_URL}/auth/forgot-password`, data);
      setSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to process request');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center justify-center gap-2">
            <KeyRound size={24} />
            <span>Reset hasła</span>
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          {success ? (
            <div className="text-center">
              <p className="text-green-600 mb-4">
                Jeśli konto o podanym adresie email istnieje, otrzymasz wiadomość z instrukcjami resetowania hasła.
              </p>
              <Link
                to="/login"
                className="text-red-800 hover:text-red-700 flex items-center justify-center gap-2"
              >
                <ArrowLeft size={16} />
                Powrót do logowania
              </Link>
            </div>
          ) : (
            <>
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
                
                <Button
                  type="submit"
                  fullWidth
                  isLoading={isLoading}
                  className="mt-4"
                >
                  Wyślij link resetujący
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
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ForgotPasswordPage;