import React from 'react';
import { useFavorites } from '@/context/FavoritesContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

const FavoritesPage = () => {
  const { favorites, toggleFavorite } = useFavorites();

  return (
    <div className="pt-24 pb-12 px-4 max-w-7xl mx-auto min-h-screen">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold mb-4 tracking-tight">Your Collection</h1>
        <p className="text-muted-foreground">
          {favorites.length === 0 
            ? "You haven't saved any cosmic moments yet." 
            : `You have collected ${favorites.length} memories.`}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {favorites.map((item, index) => (
          <motion.div
            key={item.date}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="overflow-hidden group h-full flex flex-col">
              <div className="aspect-video relative overflow-hidden bg-muted">
                {item.mediaType === 'video' ? (
                   <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
                     Video Content
                   </div>
                ) : (
                  <img
                    src={item.url}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                )}
                <Button
                  size="icon"
                  className="absolute top-2 right-2 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background text-red-500 shadow-sm"
                  onClick={() => toggleFavorite(item)}
                >
                  <Heart className="w-5 h-5 fill-current" />
                </Button>
              </div>
              
              <div className="p-5 flex-1 flex flex-col">
                <div className="text-xs font-medium text-muted-foreground mb-2">{item.date}</div>
                <h3 className="text-lg font-semibold leading-tight mb-3 line-clamp-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-3 mb-4 flex-1">
                  {item.explanation}
                </p>
                
                {item.hdUrl && (
                  <a href={item.hdUrl} target="_blank" rel="noopener noreferrer" className="mt-auto">
                    <Button variant="outline" size="sm" className="w-full gap-2">
                      <ExternalLink className="w-4 h-4" />
                      View HD
                    </Button>
                  </a>
                )}
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default FavoritesPage;
