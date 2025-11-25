import React, { useEffect, useState } from "react";
import api from "@/api/client";
import { format, subDays } from "date-fns";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { useFavorites } from "@/context/FavoritesContext";
import { cn } from "@/lib/utils";

const GalleryPage = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const { isFavorite, toggleFavorite } = useFavorites();

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const end = new Date();
        const start = subDays(end, 30);
        const response = await api.get(
          `/range?start=${format(start, "yyyy-MM-dd")}&end=${format(
            end,
            "yyyy-MM-dd"
          )}`
        );
        setImages(response.data.reverse());
      } catch {
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, []);

  return (
    <div className="pt-24 pb-12 px-4 max-w-7xl mx-auto min-h-screen">
      <h1 className="text-4xl font-bold mb-8 text-center tracking-tight">
        Cosmic Gallery
      </h1>

      {loading && (
        <div className="w-full flex justify-center items-center py-20">
          <p className="text-lg text-muted-foreground animate-pulse font-light tracking-wide">
            Loading cosmic collection...
          </p>
        </div>
      )}

      <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
        {loading
          ? Array(12)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="break-inside-avoid mb-6">
                  <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
                    <Skeleton className="w-full aspect-[4/3]" />
                    <div className="p-4 space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/4" />
                    </div>
                  </div>
                </div>
              ))
          : images.map((img, index) => (
              <motion.div
                key={img.date}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="break-inside-avoid"
              >
                <Card className="overflow-hidden group relative border-border bg-card shadow-sm hover:shadow-md transition-all duration-300">
                  <div
                    className="cursor-pointer"
                    onClick={() => setSelectedImage(img)}
                  >
                    {img.mediaType === "video" ? (
                      <div className="w-full aspect-video bg-muted flex items-center justify-center text-muted-foreground text-sm">
                        Video Content
                      </div>
                    ) : (
                      <img
                        src={img.url}
                        alt={img.title}
                        className="w-full h-auto object-cover"
                        loading="lazy"
                      />
                    )}
                    <div className="p-4">
                      <h3 className="font-medium text-sm line-clamp-1 mb-1">
                        {img.title}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {img.date}
                      </p>
                    </div>
                  </div>

                  <Button
                    variant="secondary"
                    size="icon"
                    className="absolute top-2 right-2 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(img);
                    }}
                  >
                    <Heart
                      className={cn(
                        "w-5 h-5",
                        isFavorite(img.date) && "fill-red-500 text-red-500"
                      )}
                    />
                  </Button>
                </Card>
              </motion.div>
            ))}
      </div>

      <Dialog
        open={!!selectedImage}
        onOpenChange={() => setSelectedImage(null)}
      >
        <DialogContent className="max-w-4xl bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              {selectedImage?.title}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              {selectedImage?.date}
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4">
            {selectedImage?.mediaType === "video" ? (
              <iframe
                src={selectedImage.url}
                title={selectedImage.title}
                className="w-full aspect-video rounded-lg"
                allowFullScreen
              />
            ) : (
              <img
                src={selectedImage?.hdUrl || selectedImage?.url}
                alt={selectedImage?.title}
                className="w-full max-h-[70vh] object-contain rounded-lg"
              />
            )}

            <div className="mt-4 flex justify-between items-start gap-4">
              <p className="text-muted-foreground text-sm leading-relaxed max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                {selectedImage?.explanation}
              </p>
              <Button
                size="icon"
                variant="outline"
                className="shrink-0 rounded-full"
                onClick={() => toggleFavorite(selectedImage)}
              >
                <Heart
                  className={cn(
                    "w-5 h-5",
                    selectedImage &&
                      isFavorite(selectedImage.date) &&
                      "fill-red-500 text-red-500"
                  )}
                />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GalleryPage;
