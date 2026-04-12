import { useState } from 'react';
import { Button } from '../../../../components/ui/button';
import { Card, CardContent } from '../../../../components/ui/card';
import { Input } from '../../../../components/ui/input';
import { Label } from '../../../../components/ui/label';
import { Alert, AlertDescription } from '../../../../components/ui/alert';
import { ThemeToggle } from '../../../components/shared/ThemeToggle';
import { Eye, EyeOff, LogIn, AlertTriangle, Car } from 'lucide-react';
import type { User } from '../../../types';

interface LoginProps {
  onLogin: (user: User) => void;
  onSwitchToRegister: () => void;
}

export function Login({ onLogin, onSwitchToRegister }: LoginProps) {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!formData.email.trim()) { setError('Por favor, informe seu e-mail'); setIsLoading(false); return; }
    if (!validateEmail(formData.email)) { setError('Por favor, informe um e-mail válido'); setIsLoading(false); return; }
    if (!formData.password) { setError('Por favor, informe sua senha'); setIsLoading(false); return; }
    if (formData.password.length < 6) { setError('A senha deve ter pelo menos 6 caracteres'); setIsLoading(false); return; }

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find((u: any) => u.email.toLowerCase() === formData.email.toLowerCase());

      if (!user) { setError('E-mail não encontrado. Verifique ou cadastre-se.'); setIsLoading(false); return; }
      if (user.password !== formData.password) { setError('Senha incorreta. Tente novamente.'); setIsLoading(false); return; }

      const loggedUser = { id: user.id, name: user.name, email: user.email };
      localStorage.setItem('currentUser', JSON.stringify(loggedUser));
      localStorage.setItem('loginDate', new Date().toISOString());
      onLogin(loggedUser);
    } catch {
      setError('Erro interno. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted/30 flex flex-col max-w-md mx-auto relative">

      {/* ── TOP BAR ── */}
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
      </div>

      {/* ── CONTENT ── */}
      <div className="flex-1 flex flex-col justify-center px-4 py-8 gap-5">

        {/* Hero */}
        <div className="text-center space-y-1 pb-2">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center shadow-lg">
              <Car className="w-10 h-10 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-2xl">Bem-vindo ao CMDV</h1>
          <p className="text-sm text-muted-foreground">
            Acesse sua carteira digital de manutenção veicular
          </p>
        </div>

        {/* Form Card */}
        <Card className="shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <LogIn className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold">Entrar na conta</p>
                <p className="text-xs text-muted-foreground">Digite suas credenciais</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive" className="py-2">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription className="text-xs">{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-sm">E-mail *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="seu@email.com"
                  required
                  disabled={isLoading}
                  className="h-11 text-base"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-sm">Senha *</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    placeholder="Sua senha"
                    required
                    disabled={isLoading}
                    className="h-11 text-base pr-11"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button type="submit" className="w-full h-11 mt-2" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                    Entrando...
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4 mr-2" />
                    Entrar
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Register CTA */}
        <Card className="shadow-sm">
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground text-center mb-3">Ainda não tem uma conta?</p>
            <Button
              variant="outline"
              onClick={onSwitchToRegister}
              disabled={isLoading}
              className="w-full h-11"
            >
              Criar nova conta
            </Button>
          </CardContent>
        </Card>

        {/* Info */}
        <div className="flex items-start gap-2 bg-muted/50 border border-border/50 rounded-xl p-3">
          <span className="text-base shrink-0">💡</span>
          <p className="text-xs text-muted-foreground">
            <strong>Sistema offline:</strong> Seus dados ficam salvos localmente no seu dispositivo.
          </p>
        </div>
      </div>
    </div>
  );
}