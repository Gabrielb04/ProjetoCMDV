import { useState } from 'react';
import { Button } from '../../../../components/ui/button';
import { Card, CardContent } from '../../../../components/ui/card';
import { Input } from '../../../../components/ui/input';
import { Label } from '../../../../components/ui/label';
import { Alert, AlertDescription } from '../../../../components/ui/alert';
import { ThemeToggle } from '../../../components/shared/ThemeToggle';
import { AlertTriangle, ArrowLeft, Car, CheckCircle, Mail } from 'lucide-react';
import { authService } from '../../../services/authService';

interface ForgotPasswordProps {
  onBackToLogin: () => void;
}

export function ForgotPassword({ onBackToLogin }: ForgotPasswordProps) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email.trim()) {
      setError('Por favor, informe seu e-mail.');
      return;
    }

    if (!validateEmail(email)) {
      setError('Por favor, informe um e-mail válido.');
      return;
    }

    setIsLoading(true);

    try {
      await authService.sendPasswordResetEmail(email);
      setSuccess('Enviamos um link de recuperação para seu e-mail. Verifique sua caixa de entrada e spam.');
    } catch (error: any) {
      console.error('Erro ao enviar recuperação de senha:', error);
      setError(getResetErrorMessage(error?.message));
    } finally {
      setIsLoading(false);
    }
  };

  const getResetErrorMessage = (message?: string) => {
    if (!message) return 'Não foi possível enviar o e-mail de recuperação. Tente novamente.';
    if (message === 'EMAIL_NOT_REGISTERED') return 'Este e-mail não está cadastrado. Verifique o endereço ou crie uma nova conta.';
    if (message.includes('Supabase não configurado')) return message;
    if (message.includes('email_cadastrado')) return message;
    if (message.includes('rate limit') || message.includes('email rate limit exceeded')) {
      return 'Muitas tentativas seguidas. Aguarde alguns minutos e tente novamente.';
    }
    return 'Não foi possível enviar o e-mail de recuperação. Verifique o e-mail e tente novamente.';
  };

  return (
    <div className="min-h-screen bg-muted/30 flex flex-col max-w-md mx-auto relative">
      <div className="bg-card border-b sticky top-0 z-30 px-4 pt-3 pb-3 shadow-sm">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={onBackToLogin}
            disabled={isLoading}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Voltar</span>
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-primary rounded-full flex items-center justify-center shrink-0">
              <Car className="w-3.5 h-3.5 text-primary-foreground" />
            </div>
            <ThemeToggle />
          </div>
        </div>
        <div className="mt-2">
          <h1 className="text-lg font-semibold">Recuperar senha</h1>
          <p className="text-xs text-muted-foreground">Receba um link para criar uma nova senha</p>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center px-4 py-8 gap-5">
        <Card className="shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <Mail className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold">Informe seu e-mail</p>
                <p className="text-xs text-muted-foreground">Usaremos o e-mail cadastrado na sua conta</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive" className="py-2">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription className="text-xs">{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="py-2 border-green-500/40 bg-green-500/10 text-green-700 dark:text-green-300">
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription className="text-xs">{success}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-1.5">
                <Label htmlFor="recovery-email" className="text-sm">E-mail *</Label>
                <Input
                  id="recovery-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  required
                  disabled={isLoading || !!success}
                  className="h-11 text-base"
                />
              </div>

              <Button type="submit" className="w-full h-11" disabled={isLoading || !!success}>
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Mail className="w-4 h-4 mr-2" />
                    Enviar link de recuperação
                  </>
                )}
              </Button>

              {success && (
                <Button type="button" variant="outline" className="w-full h-11" onClick={onBackToLogin}>
                  Voltar para o login
                </Button>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
