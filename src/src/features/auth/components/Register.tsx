import { useState } from 'react';
import { Button } from '../../../../components/ui/button';
import { Card, CardContent } from '../../../../components/ui/card';
import { Input } from '../../../../components/ui/input';
import { Label } from '../../../../components/ui/label';
import { Alert, AlertDescription } from '../../../../components/ui/alert';
import { ThemeToggle } from '../../../components/shared/ThemeToggle';
import { Eye, EyeOff, UserPlus, AlertTriangle, Car, ArrowLeft, CheckCircle } from 'lucide-react';
import type { User } from '../../../types';

interface RegisterProps {
  onRegister: (user: User) => void;
  onSwitchToLogin: () => void;
}

export function Register({ onRegister, onSwitchToLogin }: RegisterProps) {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validateName  = (name: string)  => name.trim().length >= 2 && /^[a-zA-ZÀ-ÿ\s]+$/.test(name.trim());

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!formData.name.trim()) { setError('Por favor, informe seu nome'); setIsLoading(false); return; }
    if (!validateName(formData.name)) { setError('Nome deve ter pelo menos 2 caracteres e conter apenas letras'); setIsLoading(false); return; }
    if (!formData.email.trim()) { setError('Por favor, informe seu e-mail'); setIsLoading(false); return; }
    if (!validateEmail(formData.email)) { setError('Por favor, informe um e-mail válido'); setIsLoading(false); return; }
    if (!formData.password) { setError('Por favor, crie uma senha'); setIsLoading(false); return; }
    if (formData.password.length < 6) { setError('A senha deve ter pelo menos 6 caracteres'); setIsLoading(false); return; }
    if (formData.password !== formData.confirmPassword) { setError('As senhas não coincidem'); setIsLoading(false); return; }

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const existingUser = users.find((u: any) => u.email.toLowerCase() === formData.email.toLowerCase());
      if (existingUser) { setError('Este e-mail já está cadastrado. Tente fazer login ou use outro e-mail.'); setIsLoading(false); return; }

      const newUser = {
        id: Date.now().toString(),
        name: formData.name.trim(),
        email: formData.email.toLowerCase().trim(),
        password: formData.password,
        createdAt: new Date().toISOString()
      };

      localStorage.setItem('users', JSON.stringify([...users, newUser]));
      const loggedUser = { id: newUser.id, name: newUser.name, email: newUser.email };
      localStorage.setItem('currentUser', JSON.stringify(loggedUser));
      localStorage.setItem('loginDate', new Date().toISOString());

      await new Promise(resolve => setTimeout(resolve, 500));
      onRegister(loggedUser);
    } catch {
      setError('Erro interno. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordStrength = (password: string) => {
    if (password.length === 0) return { strength: 0, text: '', color: '' };
    let strength = 0;
    if (password.length >= 6) strength += 25;
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    if (strength <= 25) return { strength, text: 'Fraca', color: 'text-red-500', bar: 'bg-red-500' };
    if (strength <= 50) return { strength, text: 'Regular', color: 'text-yellow-500', bar: 'bg-yellow-500' };
    if (strength <= 75) return { strength, text: 'Boa', color: 'text-blue-500', bar: 'bg-blue-500' };
    return { strength, text: 'Forte', color: 'text-green-500', bar: 'bg-green-500' };
  };

  const passwordStrength = getPasswordStrength(formData.password);

  return (
    <div className="min-h-screen bg-muted/30 flex flex-col max-w-md mx-auto relative">

      {/* ── TOP BAR ── */}
      <div className="bg-card border-b sticky top-0 z-30 px-4 pt-3 pb-3 shadow-sm">
        <div className="flex items-center justify-between">
          <button
            onClick={onSwitchToLogin}
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
          <h1 className="text-lg font-semibold">Criar nova conta</h1>
          <p className="text-xs text-muted-foreground">Cadastre-se para usar sua carteira digital</p>
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div className="flex-1 flex flex-col px-4 py-5 gap-4">

        {/* Form Card */}
        <Card className="shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <UserPlus className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold">Dados da conta</p>
                <p className="text-xs text-muted-foreground">Preencha os campos abaixo</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive" className="py-2">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription className="text-xs">{error}</AlertDescription>
                </Alert>
              )}

              {/* Nome */}
              <div className="space-y-1.5">
                <Label htmlFor="name" className="text-sm">Nome *</Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Seu nome completo"
                  required
                  disabled={isLoading}
                  className="h-11 text-base"
                />
              </div>

              {/* E-mail */}
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

              {/* Senha */}
              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-sm">Senha *</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    placeholder="Mínimo 6 caracteres"
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
                {formData.password && (
                  <div className="space-y-1 pt-1">
                    <div className="w-full bg-muted rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full transition-all duration-300 ${passwordStrength.bar}`}
                        style={{ width: `${passwordStrength.strength}%` }}
                      />
                    </div>
                    <p className={`text-xs ${passwordStrength.color}`}>
                      Força da senha: {passwordStrength.text}
                    </p>
                  </div>
                )}
              </div>

              {/* Confirmar Senha */}
              <div className="space-y-1.5">
                <Label htmlFor="confirmPassword" className="text-sm">Confirmar senha *</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    placeholder="Digite a senha novamente"
                    required
                    disabled={isLoading}
                    className="h-11 text-base pr-11"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={isLoading}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {formData.confirmPassword && (
                  <div className="flex items-center gap-1 pt-0.5">
                    {formData.password === formData.confirmPassword ? (
                      <>
                        <CheckCircle className="w-3 h-3 text-green-500" />
                        <p className="text-xs text-green-500">Senhas coincidem</p>
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="w-3 h-3 text-red-500" />
                        <p className="text-xs text-red-500">Senhas não coincidem</p>
                      </>
                    )}
                  </div>
                )}
              </div>

              <Button type="submit" className="w-full h-11 mt-2" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                    Criando conta...
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4 mr-2" />
                    Criar conta
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Info */}
        <div className="flex items-start gap-2 bg-muted/50 border border-border/50 rounded-xl p-3">
          <span className="text-base shrink-0">💡</span>
          <div className="space-y-0.5">
            <p className="text-xs text-muted-foreground">
              <strong>Sistema offline:</strong> Seus dados ficam salvos localmente no seu dispositivo.
            </p>
            <p className="text-xs text-muted-foreground">
              🔒 Suas informações são mantidas privadas e seguras.
            </p>
          </div>
        </div>

        {/* Back link */}
        <button
          onClick={onSwitchToLogin}
          disabled={isLoading}
          className="text-sm text-muted-foreground hover:text-foreground text-center pb-4 transition-colors"
        >
          Já tem uma conta? <span className="text-primary font-medium">Entrar</span>
        </button>
      </div>
    </div>
  );
}