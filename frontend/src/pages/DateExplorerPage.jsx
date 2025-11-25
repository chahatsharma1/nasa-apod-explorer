import React, { useState, useEffect } from "react";
import api from "@/api/client";
import { format } from "date-fns";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar as CalendarIcon, Heart } from "lucide-react";
import { useFavorites } from "@/context/FavoritesContext";
import { cn } from "@/lib/utils";

const DateExplorerPage = () => {
  const [date, setDate] = useState(new Date());
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const { isFavorite, toggleFavorite } = useFavorites();

  useEffect(() => {
    if (!date) return;

    const fetchDate = async () => {
      setLoading(true);
      try {
        const formattedDate = format(date, "yyyy-MM-dd");
        const response = await api.get("", {
          params: { date: formattedDate },
        });

        setData(response.data);
      } catch {
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchDate();
  }, [date]);

  return (
    <div className="pt-24 pb-12 px-4 max-w-7xl mx-auto min-h-screen">
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <div className="w-full lg:w-auto lg:sticky lg:top-24">
          <Card className="p-6 border-border bg-card w-full lg:w-auto shadow-sm">
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-2 px-1">
                <CalendarIcon className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold">Select Date</h2>
              </div>
              <div className="p-1">
                <input
                  type="date"
                  value={date ? format(date, "yyyy-MM-dd") : ""}
                  max={format(new Date(), "yyyy-MM-dd")}
                  min="1995-06-16"
                  onChange={(e) => {
                    const newDate = e.target.value
                      ? new Date(e.target.value)
                      : null;
                    setDate(newDate);
                  }}
                  className="w-full p-2 rounded-md border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <p className="text-xs text-muted-foreground mt-2 px-1">
                  Choose a date to view the Astronomy Picture of the Day.
                </p>
              </div>
            </div>
          </Card>
        </div>

        <div className="flex-1 w-full">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                <Skeleton className="w-full aspect-video rounded-xl" />
                <Skeleton className="h-10 w-2/3" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </motion.div>
            ) : data ? (
              <motion.div
                key="content"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
              >
                <Card className="overflow-hidden border-border bg-card shadow-sm">
                  <div className="relative group">
                    {data.mediaType === "video" ? (
                      <iframe
                        src={data.url}
                        title={data.title}
                        className="w-full aspect-video border-0"
                        allowFullScreen
                      />
                    ) : (
                      <img
                        src={data.url}
                        alt={data.title}
                        className="w-full h-auto object-cover max-h-[600px]"
                      />
                    )}

                    <Button
                      variant="secondary"
                      size="icon"
                      className="absolute top-4 right-4 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                      onClick={() => toggleFavorite(data)}
                    >
                      <Heart
                        className={cn(
                          "w-5 h-5",
                          isFavorite(data.date) && "fill-red-500 text-red-500"
                        )}
                      />
                    </Button>
                  </div>
                  <div className="p-8">
                    <div className="flex items-baseline justify-between mb-4">
                      <h2 className="text-3xl font-bold leading-tight">
                        {data.title}
                      </h2>
                      <span className="text-sm font-mono text-muted-foreground whitespace-nowrap ml-4">
                        {data.date}
                      </span>
                    </div>
                    <p className="text-muted-foreground leading-relaxed text-lg">
                      {data.explanation}
                    </p>
                  </div>
                </Card>
              </motion.div>
            ) : (
              <div className="flex items-center justify-center h-64 text-muted-foreground bg-muted/30 rounded-xl border border-dashed border-border">
                Select a date to explore the archives.
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default DateExplorerPage;
