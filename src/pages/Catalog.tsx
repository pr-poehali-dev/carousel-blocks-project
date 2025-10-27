import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import Icon from '@/components/ui/icon';
import { useNavigate } from 'react-router-dom';

interface CatalogItem {
  id: number;
  title: string;
  tags: string[];
  images: string[];
  link: string;
}

const API_CATALOG = 'https://functions.poehali.dev/2aa77094-8ea8-4a44-813a-1a381216d7e6';

export default function Catalog() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [catalogItems, setCatalogItems] = useState<CatalogItem[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const itemsPerPage = 12;

  const sessionToken = localStorage.getItem('session_token');
  const isAuthenticated = !!sessionToken;

  useEffect(() => {
    const fetchCatalog = async () => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams({
          page: currentPage.toString(),
          limit: itemsPerPage.toString(),
          ...(selectedTag && { tag: selectedTag }),
        });

        const response = await fetch(`${API_CATALOG}?${params}`);
        const data = await response.json();

        setCatalogItems(data.items || []);
        setAllTags(data.allTags || []);
        setTotalPages(data.totalPages || 1);
      } catch (error) {
        console.error('Failed to fetch catalog:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCatalog();
  }, [currentPage, selectedTag]);

  const handleItemClick = (item: CatalogItem) => {
    if (isAuthenticated) {
      window.open(item.link, '_blank');
    } else {
      navigate('/subscription');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('session_token');
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold gradient-text cursor-pointer" onClick={() => navigate('/')}>
            MediaHub
          </h1>
          <div className="flex gap-3">
            {isAuthenticated ? (
              <>
                <Button variant="outline" onClick={() => navigate('/admin')} className="hover-scale">
                  <Icon name="Settings" size={18} className="mr-2" />
                  Админ
                </Button>
                <Button variant="outline" onClick={handleLogout} className="hover-scale">
                  <Icon name="LogOut" size={18} className="mr-2" />
                  Выход
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={() => navigate('/login')} className="hover-scale">
                  <Icon name="LogIn" size={18} className="mr-2" />
                  Вход
                </Button>
                <Button 
                  className="bg-gradient-to-r from-primary via-secondary to-accent hover-scale"
                  onClick={() => navigate('/subscription')}
                >
                  <Icon name="Crown" size={18} className="mr-2" />
                  Подписка
                </Button>
              </>
            )}
            <Button variant="ghost" onClick={() => navigate('/about')} className="hover-scale">
              <Icon name="Info" size={18} />
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex flex-wrap gap-2 animate-fade-in">
          <Button
            variant={selectedTag === null ? 'default' : 'outline'}
            onClick={() => {
              setSelectedTag(null);
              setCurrentPage(1);
            }}
            className="hover-scale"
          >
            Все
          </Button>
          {allTags.map(tag => (
            <Button
              key={tag}
              variant={selectedTag === tag ? 'default' : 'outline'}
              onClick={() => {
                setSelectedTag(tag);
                setCurrentPage(1);
              }}
              className="hover-scale"
            >
              {tag}
            </Button>
          ))}
        </div>

        <div className="mb-8">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                return (
                  <PaginationItem key={pageNum}>
                    <PaginationLink
                      onClick={() => setCurrentPage(pageNum)}
                      isActive={currentPage === pageNum}
                      className="cursor-pointer hover-scale"
                    >
                      {pageNum}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}
              <PaginationItem>
                <PaginationNext
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Icon name="Loader2" size={48} className="animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {catalogItems.map((item, index) => (
              <Card
                key={item.id}
                className="overflow-hidden hover:shadow-2xl hover:shadow-primary/20 transition-all duration-300 animate-scale-in cursor-pointer group"
                style={{ animationDelay: `${index * 50}ms` }}
                onClick={() => handleItemClick(item)}
              >
                <div className="relative">
                  <Carousel className="w-full">
                    <CarouselContent>
                      {item.images.map((img, imgIndex) => (
                        <CarouselItem key={imgIndex}>
                          <div className="aspect-[2/3] bg-muted relative overflow-hidden">
                            <img
                              src={img}
                              alt={`${item.title} - ${imgIndex + 1}`}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <CarouselPrevious className="left-2" />
                      <CarouselNext className="right-2" />
                    </div>
                  </Carousel>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-2 line-clamp-1">{item.title}</h3>
                  <div className="flex flex-wrap gap-2">
                    {item.tags.map(tag => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="bg-gradient-to-r from-primary/20 to-secondary/20 hover:from-primary/30 hover:to-secondary/30 transition-colors"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {!isLoading && catalogItems.length > 0 && (
          <div className="mt-8">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  return (
                    <PaginationItem key={pageNum}>
                      <PaginationLink
                        onClick={() => setCurrentPage(pageNum)}
                        isActive={currentPage === pageNum}
                        className="cursor-pointer hover-scale"
                      >
                        {pageNum}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}
                <PaginationItem>
                  <PaginationNext
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    </div>
  );
}
