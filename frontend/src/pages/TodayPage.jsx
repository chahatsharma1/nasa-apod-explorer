import React, { useEffect, useState } from "react";
import api from "@/api/client";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Maximize2, Info, Heart } from "lucide-react";
import { motion } from "framer-motion";
import { useFavorites } from "@/context/FavoritesContext";
import { cn } from "@/lib/utils";

const TodayPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isFavorite, toggleFavorite } = useFavorites();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/today");
        setData(response.data);
      } catch {
        setError("Failed to load APOD data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-destructive">
        {error}
      </div>
    );
  }

  return (
    <div className="pt-24 pb-12 px-4 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col lg:flex-row gap-8 lg:h-[calc(100vh-10rem)]">
          <div className="flex-1 h-full min-h-[50vh] lg:min-h-0">
            <Card className="h-full w-full overflow-hidden shadow-lg border-border bg-card flex items-center justify-center bg-black/5 dark:bg-white/5">
              {loading ? (
                <Skeleton className="w-full h-full" />
              ) : (
                <div className="relative group w-full h-full flex items-center justify-center">
                  {data?.mediaType === "video" ? (
                    <iframe
                      src={data.url}
                      title={data.title}
                      className="w-full h-full border-0"
                      allowFullScreen
                    />
                  ) : (
                    <img
                      src={data?.url}
                      alt={data?.title}
                      className="w-full h-full object-cover"
                    />
                  )}

                  <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {data?.hdUrl && (
                      <a
                        href={data.hdUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button
                          variant="secondary"
                          size="icon"
                          className="rounded-full"
                        >
                          <Maximize2 className="w-5 h-5" />
                        </Button>
                      </a>
                    )}
                    <Button
                      variant="secondary"
                      size="icon"
                      className="rounded-full"
                      onClick={() => toggleFavorite(data)}
                    >
                      <Heart
                        className={cn(
                          "w-5 h-5",
                          isFavorite(data?.date) && "fill-red-500 text-red-500"
                        )}
                      />
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          </div>

          <div className="lg:w-1/3 h-full overflow-y-auto pr-2 custom-scrollbar space-y-6">
            <div>
              {loading ? (
                <Skeleton className="h-8 w-3/4 mb-4" />
              ) : (
                <h1 className="text-3xl md:text-4xl font-bold mb-2 leading-tight tracking-tight">
                  {data?.title}
                </h1>
              )}

              {loading ? (
                <Skeleton className="h-4 w-1/4" />
              ) : (
                <p className="text-muted-foreground font-mono text-sm tracking-wider">
                  {data?.date}
                </p>
              )}
            </div>

            <Card className="p-6 bg-card border-border shadow-sm">
              <div className="flex items-center gap-2 mb-4 text-muted-foreground">
                <Info className="w-5 h-5" />
                <span className="text-sm font-medium uppercase tracking-wider">
                  Explanation
                </span>
              </div>

              {loading ? (
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                </div>
              ) : (
                <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                  {data?.explanation}
                </p>
              )}

              {data?.copyright && (
                <div className="mt-4 pt-4 border-t border-border text-xs text-muted-foreground">
                  Copyright: {data.copyright}
                </div>
              )}
            </Card>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default TodayPage;
