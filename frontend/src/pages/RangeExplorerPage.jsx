import React, { useState } from "react";
import api from "@/api/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";

import {
  Search,
  Heart,
  Calendar as CalendarIcon,
  ArrowRight,
} from "lucide-react";
import { useFavorites } from "@/context/FavoritesContext";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";

const RangeExplorerPage = () => {
  const [range, setRange] = useState({ from: undefined, to: undefined });
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const { isFavorite, toggleFavorite } = useFavorites();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!range?.from || !range?.to) return;

    const start = range.from.toISOString().split("T")[0];
    const end = range.to.toISOString().split("T")[0];

    setLoading(true);
    setHasSearched(true);
    setResults([]);
    try {
      const response = await api.get(`/range?start=${start}&end=${end}`);
      setResults(response.data.reverse());
    } catch {
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-24 pb-12 px-4 max-w-7xl mx-auto min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative">
        <div className="lg:col-span-4 xl:col-span-3">
          <div className="sticky top-24 space-y-6">
            <div>
              <h1 className="text-4xl font-bold mb-2 tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Time Travel
              </h1>
              <p className="text-muted-foreground text-sm">
                Select a date range to explore a collection of cosmic events
                from the past.
              </p>
            </div>

            <Card className="p-2 border-border/50 bg-card/50 backdrop-blur-sm shadow-lg">
              <form onSubmit={handleSearch} className="space-y-6">
                <div className="space-y-4">
                  <div className="bg-background rounded-lg border p-1">
                    <Calendar
                      mode="range"
                      selected={range}
                      onSelect={setRange}
                      fromDate={new Date("1995-06-16")}
                      toDate={new Date()}
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={!range?.from || !range?.to || loading}
                >
                  {loading ? (
                    "Scanning Cosmos..."
                  ) : (
                    <>
                      <Search className="w-4 h-4 mr-2" />
                      Scan Range
                    </>
                  )}
                </Button>
              </form>
            </Card>
          </div>
        </div>
        <div className="lg:col-span-8 xl:col-span-9">
          {!hasSearched && !loading && (
            <div className="h-full min-h-[50vh] flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-muted rounded-xl bg-muted/5">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <CalendarIcon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Ready to Explore</h3>
              <p className="text-muted-foreground max-w-md">
                Select a start and end date from the calendar on the left to
                begin your journey through the APOD archives.
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AnimatePresence mode="popLayout">
              {loading
                ? Array(6)
                    .fill(0)
                    .map((_, i) => (
                      <motion.div
                        key={`skeleton-${i}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <Skeleton className="aspect-video w-full rounded-xl mb-3" />
                        <Skeleton className="h-4 w-2/3 mb-2" />
                        <Skeleton className="h-4 w-1/2" />
                      </motion.div>
                    ))
                : results.map((item, index) => (
                    <motion.div
                      key={item.date}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <Card className="overflow-hidden h-full group border-border/50 bg-card hover:bg-accent/5 hover:border-primary/20 transition-all duration-300 shadow-sm hover:shadow-lg">
                        <div className="aspect-video relative overflow-hidden bg-muted">
                          {item.mediaType === "video" ? (
                            <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground bg-secondary/30">
                              <div className="p-3 rounded-full bg-background/50 backdrop-blur mb-2">
                                <div className="w-0 h-0 border-t-[6px] border-t-transparent border-l-[10px] border-l-primary border-b-[6px] border-b-transparent ml-1" />
                              </div>
                              <span className="text-xs font-medium">
                                Video Content
                              </span>
                            </div>
                          ) : (
                            <img
                              src={item.url}
                              alt={item.title}
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                              loading="lazy"
                            />
                          )}

                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                          <Button
                            variant="secondary"
                            size="icon"
                            className="absolute top-2 right-2 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background shadow-sm opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-[-10px] group-hover:translate-y-0"
                            onClick={() => toggleFavorite(item)}
                          >
                            <Heart
                              className={cn(
                                "w-4 h-4 transition-colors",
                                isFavorite(item.date) &&
                                  "fill-red-500 text-red-500"
                              )}
                            />
                          </Button>
                        </div>

                        <div className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-mono text-primary/80 bg-primary/5 px-2 py-0.5 rounded">
                              {item.date}
                            </span>
                          </div>
                          <h3 className="font-semibold leading-tight group-hover:text-primary transition-colors line-clamp-2 mb-2">
                            {item.title}
                          </h3>
                          {item.explanation && (
                            <p className="text-xs text-muted-foreground line-clamp-2">
                              {item.explanation}
                            </p>
                          )}
                        </div>
                      </Card>
                    </motion.div>
                  ))}
            </AnimatePresence>
          </div>

          {hasSearched && results.length === 0 && !loading && (
            <div className="col-span-full flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
              <p>No results found for this range.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RangeExplorerPage;
