import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { useNavigate } from 'react-router-dom';

export default function Subscription() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full p-8 md:p-12 animate-scale-in bg-gradient-to-br from-card via-card to-muted border-primary/20">
        <div className="text-center mb-8">
          <div className="inline-block p-4 rounded-full bg-gradient-to-r from-primary via-secondary to-accent mb-4">
            <Icon name="Crown" size={48} className="text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
            Премиум подписка
          </h1>
          <p className="text-muted-foreground text-lg">
            Получите полный доступ ко всему контенту
          </p>
        </div>

        <div className="space-y-6 mb-8">
          <div className="flex items-start gap-4">
            <div className="p-2 rounded-lg bg-primary/10">
              <Icon name="Check" size={24} className="text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-1">Безлимитный доступ</h3>
              <p className="text-muted-foreground">
                Просматривайте любой контент без ограничений
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-2 rounded-lg bg-secondary/10">
              <Icon name="Zap" size={24} className="text-secondary" />
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-1">Эксклюзивный контент</h3>
              <p className="text-muted-foreground">
                Доступ к премиум материалам и новинкам
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-2 rounded-lg bg-accent/10">
              <Icon name="Shield" size={24} className="text-accent" />
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-1">Приоритетная поддержка</h3>
              <p className="text-muted-foreground">
                Быстрая помощь и персональный менеджер
              </p>
            </div>
          </div>
        </div>

        <div className="bg-muted/50 rounded-xl p-6 mb-8 border border-primary/10">
          <div className="flex items-baseline justify-center gap-2 mb-2">
            <span className="text-5xl font-bold gradient-text">990₽</span>
            <span className="text-muted-foreground">/месяц</span>
          </div>
          <p className="text-center text-muted-foreground text-sm">
            Отменить можно в любой момент
          </p>
        </div>

        <div className="space-y-3">
          <Button
            size="lg"
            className="w-full bg-gradient-to-r from-primary via-secondary to-accent hover:opacity-90 transition-opacity text-lg py-6"
          >
            <Icon name="Sparkles" size={20} className="mr-2" />
            Оформить подписку
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="w-full"
            onClick={() => navigate('/')}
          >
            Вернуться назад
          </Button>
        </div>
      </Card>
    </div>
  );
}