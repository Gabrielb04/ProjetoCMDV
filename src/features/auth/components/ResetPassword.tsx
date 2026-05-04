import { useState } from 'react';
import { Button } from '../../../../components/ui/button';
import { Card, CardContent } from '../../../../components/ui/card';
import { Input } from '../../../../components/ui/input';
import { Label } from '../../../../components/ui/label';
import { Alert, AlertDescription } from '../../../../components/ui/alert';
import { ThemeToggle } from '../../../components/shared/ThemeToggle';
import { AlertTriangle, Car, CheckCircle, Eye, EyeOff, LockKeyhole } from 'lucide-react';
import { authService } from '../../../services/authService';

interface ResetPasswordProps {
  onPasswordUpdated: () => void;
}

export function ResetPassword({ onPasswordUpdated }: ResetPasswordProps) {
  const [formData, setFormData] = useState({ password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.password) {
      setError('Por favor, informe a nova senha.');
      return;
    }

    if (formData.password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }

    setIsLoading(true);

    try {
      await authService.updatePassword(formData.password);
      setSuccess('Senha alterada com sucesso. Você já pode entrar com a nova senha.');
      window.history.replaceState({}, document.title, '/');
      setTimeout(onPasswordUpdated, 1200);
    } catch (error: any) {
      console.error('Erro ao alterar senha:', error);
      setError(getUpdateErrorMessage(error?.message));
    } finally {
      setIsLoading(false);
    }
  };

const getUpdateErrorMessage = (message?: string) => {
  if (!message) return 'Não foi possível alterar a senha. Tente solicitar um novo link.';

  const msg = message.toLowerCase();

  if (msg.includes('same') || msg.includes('different') || msg.includes('new password')) {
    return 'A nova senha não pode ser igual à senha atual.';
  }

  if (msg.includes('auth session missing') || msg.includes('session_not_found')) {
    return 'Link expirado ou inválido. Solicite um novo link em “Esqueci minha senha”.';
  }

  if (msg.includes('password should be') || msg.includes('weak password')) {
    return 'A senha não atende aos requisitos mínimos de segurança.';
  }

  return 'Não foi possível alterar a senha. Tente solicitar um novo link.';
};

  return (
    <div className="min-h-screen bg-muted/30 flex flex-col max-w-md mx-auto relative">
      <div className="bg-card border-b sticky top-0 z-30 px-4 pt-3 pb-3 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center shrink-0">
              <Car className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="text-sm font-semibold tracking-tight">CMDV</span>
          </div>
          <ThemeToggle />
        </div>
        <div className="mt-3">
          <h1 className="text-lg font-semibold">Criar nova senha</h1>
          <p className="text-xs text-muted-foreground">Digite e confirme sua nova senha</p>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center px-4 py-8 gap-5">
        <Card className="shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <LockKeyhole className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold">Nova senha</p>
                <p className="text-xs text-muted-foreground">Use no mínimo 6 caracteres</p>
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
                <Label htmlFor="new-password" className="text-sm">Nova senha *</Label>
                <div className="relative">
                  <Input
                    id="new-password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    placeholder="Nova senha"
                    required
                    disabled={isLoading || !!success}
                    className="h-11 text-base pr-11"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading || !!success}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="confirm-new-password" className="text-sm">Confirmar senha *</Label>
                <div className="relative">
                  <Input
                    id="confirm-new-password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    placeholder="Confirme a nova senha"
                    required
                    disabled={isLoading || !!success}
                    className="h-11 text-base pr-11"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={isLoading || !!success}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button type="submit" className="w-full h-11" disabled={isLoading || !!success}>
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <LockKeyhole className="w-4 h-4 mr-2" />
                    Alterar senha
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
