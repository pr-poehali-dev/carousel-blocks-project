import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold gradient-text">О проекте</h1>
            <Button variant="outline" onClick={() => window.history.back()}>
              <Icon name="ArrowLeft" size={18} className="mr-2" />
              Назад
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-block p-6 rounded-full bg-gradient-to-r from-primary via-secondary to-accent mb-6">
            <Icon name="Sparkles" size={64} className="text-white" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
            MediaHub
          </h2>
          <p className="text-xl text-muted-foreground">
            Современная платформа для эксклюзивного контента
          </p>
        </div>

        <div className="grid gap-6 mb-12">
          <Card className="p-6 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 animate-fade-in">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <Icon name="Target" size={32} className="text-primary" />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-2">Наша миссия</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Предоставить доступ к качественному и эксклюзивному контенту для наших пользователей. 
                  Мы стремимся создать удобную и безопасную платформу с лучшими материалами.
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6 hover:shadow-xl hover:shadow-secondary/10 transition-all duration-300 animate-fade-in" style={{ animationDelay: '100ms' }}>
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-secondary/10">
                <Icon name="Layers" size={32} className="text-secondary" />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-2">Что мы предлагаем</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <Icon name="Check" size={20} className="text-secondary mt-0.5 flex-shrink-0" />
                    <span>Тщательно отобранный каталог премиум контента</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Icon name="Check" size={20} className="text-secondary mt-0.5 flex-shrink-0" />
                    <span>Удобная система навигации и фильтрации</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Icon name="Check" size={20} className="text-secondary mt-0.5 flex-shrink-0" />
                    <span>Регулярные обновления и новые материалы</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Icon name="Check" size={20} className="text-secondary mt-0.5 flex-shrink-0" />
                    <span>Персональный подход к каждому подписчику</span>
                  </li>
                </ul>
              </div>
            </div>
          </Card>

          <Card className="p-6 hover:shadow-xl hover:shadow-accent/10 transition-all duration-300 animate-fade-in" style={{ animationDelay: '200ms' }}>
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-accent/10">
                <Icon name="Shield" size={32} className="text-accent" />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-2">Безопасность</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Мы гарантируем конфиденциальность ваших данных и безопасность платежей. 
                  Вся информация надежно защищена современными технологиями шифрования.
                </p>
              </div>
            </div>
          </Card>
        </div>

        <div className="text-center">
          <Button
            size="lg"
            className="bg-gradient-to-r from-primary via-secondary to-accent hover:opacity-90 transition-opacity px-8"
            onClick={() => window.location.href = '/'}
          >
            <Icon name="Home" size={20} className="mr-2" />
            Перейти в каталог
          </Button>
        </div>
      </div>
    </div>
  );
}
