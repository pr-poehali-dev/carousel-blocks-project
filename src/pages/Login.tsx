import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const API_AUTH = 'https://functions.poehali.dev/1bf1bce3-bf99-4b22-880e-a5c323b4ea78';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(API_AUTH, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        localStorage.setItem('session_token', data.session_token);
        toast({
          title: 'Успешный вход',
          description: `Добро пожаловать, ${data.username}!`,
        });
        setTimeout(() => navigate('/'), 500);
      } else {
        toast({
          title: 'Ошибка входа',
          description: data.error || 'Неверный логин или пароль',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось подключиться к серверу',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-md w-full p-8 animate-scale-in bg-gradient-to-br from-card via-card to-muted border-primary/20">
        <div className="text-center mb-8">
          <div className="inline-block p-4 rounded-full bg-gradient-to-r from-primary via-secondary to-accent mb-4">
            <Icon name="Lock" size={48} className="text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold gradient-text mb-2">
            Вход в систему
          </h1>
          <p className="text-muted-foreground">
            Войдите для доступа к контенту
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="username" className="text-foreground">
              Логин
            </Label>
            <div className="relative">
              <Icon
                name="User"
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <Input
                id="username"
                type="text"
                placeholder="Введите логин"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-foreground">
              Пароль
            </Label>
            <div className="relative">
              <Icon
                name="KeyRound"
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <Input
                id="password"
                type="password"
                placeholder="Введите пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full bg-gradient-to-r from-primary via-secondary to-accent hover:opacity-90 transition-opacity"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Icon name="Loader2" size={20} className="mr-2 animate-spin" />
                Вход...
              </>
            ) : (
              <>
                <Icon name="LogIn" size={20} className="mr-2" />
                Войти
              </>
            )}
          </Button>

          <div className="text-center">
            <Button
              type="button"
              variant="link"
              className="text-muted-foreground hover:text-foreground"
              onClick={() => window.history.back()}
            >
              Вернуться назад
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}