import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import Icon from '@/components/ui/icon';

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
}

interface Video {
  id: number;
  title: string;
  duration: string;
  views: number;
  status: string;
  category: string;
}

interface Category {
  id: number;
  name: string;
  videosCount: number;
  description: string;
}

interface Comment {
  id: number;
  author: string;
  content: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

interface AnalyticsData {
  totalViews: number;
  totalVideos: number;
  totalUsers: number;
  totalComments: number;
  monthlyViews: number[];
  popularCategories: { name: string; views: number }[];
}

export default function Index() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentSection, setCurrentSection] = useState('dashboard');
  const [loginForm, setLoginForm] = useState({ identifier: '', password: '' });
  const [loading, setLoading] = useState(false);

  // Mock данные
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalViews: 125400,
    totalVideos: 284,
    totalUsers: 1520,
    totalComments: 892,
    monthlyViews: [45000, 52000, 48000, 61000, 58000, 73000, 65000, 71000, 68000, 82000, 75000, 89000],
    popularCategories: [
      { name: 'Технологии', views: 45200 },
      { name: 'Образование', views: 32100 },
      { name: 'Развлечения', views: 28900 },
      { name: 'Наука', views: 19300 }
    ]
  });

  const [videos, setVideos] = useState<Video[]>([
    { id: 1, title: 'Введение в React', duration: '12:34', views: 15400, status: 'published', category: 'Технологии' },
    { id: 2, title: 'CSS Grid Layout', duration: '8:22', views: 9800, status: 'published', category: 'Технологии' },
    { id: 3, title: 'JavaScript ES2024', duration: '18:45', views: 22100, status: 'draft', category: 'Технологии' },
    { id: 4, title: 'Математические основы', duration: '25:12', views: 11200, status: 'published', category: 'Образование' }
  ]);

  const [categories, setCategories] = useState<Category[]>([
    { id: 1, name: 'Технологии', videosCount: 48, description: 'Видео о новых технологиях и программировании' },
    { id: 2, name: 'Образование', videosCount: 32, description: 'Образовательный контент и курсы' },
    { id: 3, name: 'Развлечения', videosCount: 24, description: 'Развлекательные видео и шоу' },
    { id: 4, name: 'Наука', videosCount: 18, description: 'Научные исследования и открытия' }
  ]);

  const [comments, setComments] = useState<Comment[]>([
    { id: 1, author: 'Александр К.', content: 'Отличное видео! Очень понятно объяснено.', status: 'pending', createdAt: '2024-09-06T10:30:00Z' },
    { id: 2, author: 'Мария В.', content: 'Спасибо за подробный разбор темы.', status: 'approved', createdAt: '2024-09-06T09:15:00Z' },
    { id: 3, author: 'Дмитрий С.', content: 'Можно ли сделать видео про TypeScript?', status: 'pending', createdAt: '2024-09-06T08:45:00Z' },
    { id: 4, author: 'Елена Н.', content: 'Не согласна с подходом в видео.', status: 'rejected', createdAt: '2024-09-05T16:20:00Z' }
  ]);

  const [users, setUsers] = useState<User[]>([
    { id: 1, username: 'admin', email: 'admin@example.com', role: 'Administrator' },
    { id: 2, username: 'editor', email: 'editor@example.com', role: 'Editor' },
    { id: 3, username: 'user1', email: 'user1@example.com', role: 'User' },
    { id: 4, username: 'moderator', email: 'moderator@example.com', role: 'Moderator' }
  ]);

  // Имитация авторизации через Strapi
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Имитация API запроса
    setTimeout(() => {
      if (loginForm.identifier === 'admin' && loginForm.password === 'password') {
        setIsLoggedIn(true);
        setCurrentSection('dashboard');
      } else {
        alert('Неверные учетные данные');
      }
      setLoading(false);
    }, 1000);
  };

  const handleCommentStatus = (commentId: number, status: 'approved' | 'rejected') => {
    setComments(prev => prev.map(comment => 
      comment.id === commentId ? { ...comment, status } : comment
    ));
  };

  // Компонент графика
  const Chart = ({ data }: { data: number[] }) => {
    const maxValue = Math.max(...data);
    return (
      <div className="flex items-end justify-between h-32 gap-1">
        {data.map((value, index) => (
          <div key={index} className="flex-1 flex flex-col items-center">
            <div 
              className="w-full bg-primary rounded-t-sm transition-all duration-500 hover:bg-primary/80"
              style={{ height: `${(value / maxValue) * 100}%`, minHeight: '4px' }}
            />
            <span className="text-xs text-muted-foreground mt-1">
              {['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'][index]}
            </span>
          </div>
        ))}
      </div>
    );
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2 text-2xl">
              <Icon name="Shield" className="text-primary" />
              Админ панель Strapi
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="identifier">Email или логин</Label>
                <Input
                  id="identifier"
                  type="text"
                  value={loginForm.identifier}
                  onChange={(e) => setLoginForm({...loginForm, identifier: e.target.value})}
                  placeholder="admin"
                  required
                />
              </div>
              <div>
                <Label htmlFor="password">Пароль</Label>
                <Input
                  id="password"
                  type="password"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                  placeholder="password"
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Icon name="Loader2" className="mr-2 h-4 w-4 animate-spin" />
                    Авторизация...
                  </>
                ) : (
                  'Войти'
                )}
              </Button>
              <p className="text-sm text-muted-foreground text-center">
                Демо: admin / password
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Хедер */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Icon name="Database" className="text-primary h-8 w-8" />
            <h1 className="text-xl font-semibold">Strapi Admin</h1>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="secondary">Администратор</Badge>
            <Button variant="outline" onClick={() => setIsLoggedIn(false)}>
              <Icon name="LogOut" className="mr-2 h-4 w-4" />
              Выйти
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Боковая панель */}
        <nav className="w-64 bg-white border-r border-gray-200 h-[calc(100vh-73px)] p-4">
          <div className="space-y-1">
            {[
              { id: 'dashboard', name: 'Дашборд', icon: 'LayoutDashboard' },
              { id: 'videos', name: 'Видео', icon: 'Video' },
              { id: 'categories', name: 'Категории', icon: 'FolderOpen' },
              { id: 'tags', name: 'Теги', icon: 'Tag' },
              { id: 'playlists', name: 'Плейлисты', icon: 'ListVideo' },
              { id: 'comments', name: 'Комментарии', icon: 'MessageCircle' },
              { id: 'users', name: 'Пользователи', icon: 'Users' },
              { id: 'analytics', name: 'Аналитика', icon: 'BarChart3' },
              { id: 'settings', name: 'Настройки', icon: 'Settings' }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setCurrentSection(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                  currentSection === item.id
                    ? 'bg-primary text-primary-foreground'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Icon name={item.icon as any} size={18} />
                {item.name}
              </button>
            ))}
          </div>
        </nav>

        {/* Основной контент */}
        <main className="flex-1 p-6 overflow-auto">
          {currentSection === 'dashboard' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-semibold mb-1">Дашборд</h2>
                <p className="text-muted-foreground">Общая статистика и показатели</p>
              </div>

              {/* Статистические карточки */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Всего просмотров</p>
                        <p className="text-2xl font-bold">{analytics.totalViews.toLocaleString()}</p>
                      </div>
                      <Icon name="Eye" className="h-8 w-8 text-blue-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Видео</p>
                        <p className="text-2xl font-bold">{analytics.totalVideos}</p>
                      </div>
                      <Icon name="Video" className="h-8 w-8 text-green-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Пользователи</p>
                        <p className="text-2xl font-bold">{analytics.totalUsers}</p>
                      </div>
                      <Icon name="Users" className="h-8 w-8 text-purple-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Комментарии</p>
                        <p className="text-2xl font-bold">{analytics.totalComments}</p>
                      </div>
                      <Icon name="MessageCircle" className="h-8 w-8 text-orange-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Графики */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Просмотры по месяцам</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Chart data={analytics.monthlyViews} />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Популярные категории</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {analytics.popularCategories.map((category, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm font-medium">{category.name}</span>
                        <div className="flex items-center gap-2">
                          <Progress 
                            value={(category.views / analytics.popularCategories[0].views) * 100} 
                            className="w-20"
                          />
                          <span className="text-sm text-muted-foreground w-12 text-right">
                            {(category.views / 1000).toFixed(0)}k
                          </span>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {currentSection === 'videos' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-semibold">Видео</h2>
                  <p className="text-muted-foreground">Управление видеоконтентом</p>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <Icon name="Plus" className="mr-2 h-4 w-4" />
                      Добавить видео
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Новое видео</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label>Название</Label>
                        <Input placeholder="Введите название видео" />
                      </div>
                      <div>
                        <Label>Категория</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Выберите категорию" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((cat) => (
                              <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Описание</Label>
                        <Textarea placeholder="Введите описание видео" />
                      </div>
                      <Button className="w-full">Создать видео</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Название</TableHead>
                        <TableHead>Длительность</TableHead>
                        <TableHead>Просмотры</TableHead>
                        <TableHead>Статус</TableHead>
                        <TableHead>Категория</TableHead>
                        <TableHead>Действия</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {videos.map((video) => (
                        <TableRow key={video.id}>
                          <TableCell className="font-medium">{video.title}</TableCell>
                          <TableCell>{video.duration}</TableCell>
                          <TableCell>{video.views.toLocaleString()}</TableCell>
                          <TableCell>
                            <Badge variant={video.status === 'published' ? 'default' : 'secondary'}>
                              {video.status === 'published' ? 'Опубликован' : 'Черновик'}
                            </Badge>
                          </TableCell>
                          <TableCell>{video.category}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">
                                <Icon name="Edit" className="h-4 w-4" />
                              </Button>
                              <Button variant="destructive" size="sm">
                                <Icon name="Trash2" className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          )}

          {currentSection === 'comments' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-semibold">Модерация комментариев</h2>
                <p className="text-muted-foreground">Управление пользовательскими комментариями</p>
              </div>

              <Tabs defaultValue="pending" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="pending">На модерации ({comments.filter(c => c.status === 'pending').length})</TabsTrigger>
                  <TabsTrigger value="approved">Одобренные ({comments.filter(c => c.status === 'approved').length})</TabsTrigger>
                  <TabsTrigger value="rejected">Отклоненные ({comments.filter(c => c.status === 'rejected').length})</TabsTrigger>
                </TabsList>

                <TabsContent value="pending" className="space-y-4">
                  {comments.filter(c => c.status === 'pending').map((comment) => (
                    <Card key={comment.id}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback>{comment.author[0]}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium text-sm">{comment.author}</p>
                                <p className="text-xs text-muted-foreground">
                                  {new Date(comment.createdAt).toLocaleDateString('ru-RU')}
                                </p>
                              </div>
                            </div>
                            <p className="text-sm">{comment.content}</p>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              onClick={() => handleCommentStatus(comment.id, 'approved')}
                            >
                              <Icon name="Check" className="h-4 w-4 mr-1" />
                              Одобрить
                            </Button>
                            <Button 
                              size="sm" 
                              variant="destructive"
                              onClick={() => handleCommentStatus(comment.id, 'rejected')}
                            >
                              <Icon name="X" className="h-4 w-4 mr-1" />
                              Отклонить
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>

                <TabsContent value="approved" className="space-y-4">
                  {comments.filter(c => c.status === 'approved').map((comment) => (
                    <Card key={comment.id} className="bg-green-50">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback>{comment.author[0]}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium text-sm">{comment.author}</p>
                                <p className="text-xs text-muted-foreground">
                                  {new Date(comment.createdAt).toLocaleDateString('ru-RU')}
                                </p>
                              </div>
                              <Badge variant="default" className="bg-green-600">Одобрен</Badge>
                            </div>
                            <p className="text-sm">{comment.content}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>

                <TabsContent value="rejected" className="space-y-4">
                  {comments.filter(c => c.status === 'rejected').map((comment) => (
                    <Card key={comment.id} className="bg-red-50">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback>{comment.author[0]}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium text-sm">{comment.author}</p>
                                <p className="text-xs text-muted-foreground">
                                  {new Date(comment.createdAt).toLocaleDateString('ru-RU')}
                                </p>
                              </div>
                              <Badge variant="destructive">Отклонен</Badge>
                            </div>
                            <p className="text-sm">{comment.content}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>
              </Tabs>
            </div>
          )}

          {currentSection === 'categories' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-semibold">Категории</h2>
                  <p className="text-muted-foreground">Управление категориями контента</p>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <Icon name="Plus" className="mr-2 h-4 w-4" />
                      Добавить категорию
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Новая категория</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label>Название</Label>
                        <Input placeholder="Введите название категории" />
                      </div>
                      <div>
                        <Label>Описание</Label>
                        <Textarea placeholder="Введите описание категории" />
                      </div>
                      <Button className="w-full">Создать категорию</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map((category) => (
                  <Card key={category.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        {category.name}
                        <div className="flex gap-1">
                          <Button variant="outline" size="sm">
                            <Icon name="Edit" className="h-4 w-4" />
                          </Button>
                          <Button variant="destructive" size="sm">
                            <Icon name="Trash2" className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">{category.description}</p>
                        <div className="flex items-center gap-2">
                          <Icon name="Video" className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">{category.videosCount} видео</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {currentSection === 'users' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-semibold">Пользователи</h2>
                  <p className="text-muted-foreground">Управление пользователями системы</p>
                </div>
                <Button>
                  <Icon name="UserPlus" className="mr-2 h-4 w-4" />
                  Добавить пользователя
                </Button>
              </div>

              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Пользователь</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Роль</TableHead>
                        <TableHead>Действия</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback>{user.username[0].toUpperCase()}</AvatarFallback>
                              </Avatar>
                              <span className="font-medium">{user.username}</span>
                            </div>
                          </TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            <Badge variant={user.role === 'Administrator' ? 'default' : 'secondary'}>
                              {user.role}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">
                                <Icon name="Edit" className="h-4 w-4" />
                              </Button>
                              <Button variant="destructive" size="sm">
                                <Icon name="Trash2" className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          )}

          {(currentSection === 'tags' || currentSection === 'playlists' || currentSection === 'analytics' || currentSection === 'settings') && (
            <div className="space-y-6">
              <Card>
                <CardContent className="p-12 text-center">
                  <Icon name="Construction" className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Раздел в разработке</h3>
                  <p className="text-muted-foreground">
                    {currentSection === 'tags' && 'Управление тегами скоро будет доступно'}
                    {currentSection === 'playlists' && 'Управление плейлистами скоро будет доступно'}
                    {currentSection === 'analytics' && 'Подробная аналитика скоро будет доступна'}
                    {currentSection === 'settings' && 'Настройки системы скоро будут доступны'}
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}