import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

const API_ADMIN = 'https://functions.poehali.dev/11c97d34-7b89-44eb-85c7-e76dbb0f3279';

export default function Admin() {
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState('');
  const [link, setLink] = useState('');
  const [images, setImages] = useState(['', '', '']);
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleAddBlock = async () => {
    if (!title || images.some(img => !img) || !link) {
      toast({
        title: 'Ошибка',
        description: 'Заполните все поля',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      const tagsArray = tags.split(',').map(t => t.trim()).filter(t => t);
      const response = await fetch(API_ADMIN, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'add_item',
          title,
          tags: tagsArray,
          images,
          link,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast({
          title: 'Блок добавлен',
          description: 'Новый блок успешно добавлен в каталог',
        });
        setTitle('');
        setTags('');
        setLink('');
        setImages(['', '', '']);
      } else {
        toast({
          title: 'Ошибка',
          description: data.error || 'Не удалось добавить блок',
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

  const handleCreateUser = async () => {
    if (!newUsername || !newPassword) {
      toast({
        title: 'Ошибка',
        description: 'Введите логин и пароль',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(API_ADMIN, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.dumps({
          action: 'create_user',
          username: newUsername,
          password: newPassword,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast({
          title: 'Пользователь создан',
          description: `Логин: ${newUsername}`,
        });
        setNewUsername('');
        setNewPassword('');
      } else {
        toast({
          title: 'Ошибка',
          description: data.error || 'Не удалось создать пользователя',
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
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold gradient-text">Админ-панель</h1>
            <Button variant="outline" onClick={() => window.history.back()}>
              <Icon name="ArrowLeft" size={18} className="mr-2" />
              Назад
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="grid gap-8">
          <Card className="p-6 animate-fade-in">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-primary/10">
                <Icon name="Plus" size={24} className="text-primary" />
              </div>
              <h2 className="text-2xl font-bold">Добавить новый блок</h2>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Заголовок</Label>
                <Input
                  id="title"
                  placeholder="Название контента"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Теги (через запятую)</Label>
                <Input
                  id="tags"
                  placeholder="Видео, Фото, Премиум"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                />
                <div className="flex gap-2 flex-wrap mt-2">
                  {tags.split(',').filter(t => t.trim()).map((tag, i) => (
                    <Badge key={i} variant="secondary">
                      {tag.trim()}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="link">Ссылка для авторизованных пользователей</Label>
                <Input
                  id="link"
                  type="url"
                  placeholder="https://example.com/content"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                />
              </div>

              <div className="space-y-4">
                <Label>Изображения карусели (3 шт)</Label>
                {images.map((img, index) => (
                  <div key={index} className="space-y-2">
                    <Label htmlFor={`image-${index}`} className="text-sm text-muted-foreground">
                      Изображение {index + 1}
                    </Label>
                    <Input
                      id={`image-${index}`}
                      type="url"
                      placeholder="https://example.com/image.jpg"
                      value={img}
                      onChange={(e) => {
                        const newImages = [...images];
                        newImages[index] = e.target.value;
                        setImages(newImages);
                      }}
                    />
                  </div>
                ))}
              </div>

              <Button
                size="lg"
                className="w-full bg-gradient-to-r from-primary via-secondary to-accent hover:opacity-90 transition-opacity"
                onClick={handleAddBlock}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Icon name="Loader2" size={20} className="mr-2 animate-spin" />
                    Добавление...
                  </>
                ) : (
                  <>
                    <Icon name="Upload" size={20} className="mr-2" />
                    Добавить блок
                  </>
                )}
              </Button>
            </div>
          </Card>

          <Card className="p-6 animate-fade-in" style={{ animationDelay: '100ms' }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-secondary/10">
                <Icon name="Users" size={24} className="text-secondary" />
              </div>
              <h2 className="text-2xl font-bold">Управление пользователями</h2>
            </div>

            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="new-username">Логин</Label>
                  <Input
                    id="new-username"
                    placeholder="username"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">Пароль</Label>
                  <Input
                    id="new-password"
                    type="password"
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full"
                onClick={handleCreateUser}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Icon name="Loader2" size={20} className="mr-2 animate-spin" />
                    Создание...
                  </>
                ) : (
                  <>
                    <Icon name="UserPlus" size={20} className="mr-2" />
                    Создать пользователя
                  </>
                )}
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}