import React, { useState } from "react";
import api from "@/api/client";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

import { Search, Heart } from "lucide-react";
import { useFavorites } from "@/context/FavoritesContext";
import { cn } from "@/lib/utils";

const RangeExplorerPage = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const { isFavorite, toggleFavorite } = useFavorites();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!startDate || !endDate) return;

    setLoading(true);
    try {
      const response = await api.get(
        `/range?start=${startDate}&end=${endDate}`
      );
      setResults(response.data.reverse());
    } catch {
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-24 pb-12 px-4 max-w-7xl mx-auto min-h-screen">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold mb-4 tracking-tight">Time Travel</h1>
        <p className="text-muted-foreground">
          Explore a range of cosmic events.
        </p>
      </div>

      <Card className="max-w-2xl mx-auto p-6 mb-12 border-border bg-card shadow-sm">
        <form
          onSubmit={handleSearch}
          className="flex flex-col sm:flex-row gap-4 items-end"
        >
          <div className="w-full">
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Start Date
            </label>
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="w-full">
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              End Date
            </label>
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full"
            />
          </div>
          <Button type="submit" className="w-full sm:w-auto rounded-full">
            <Search className="w-4 h-4 mr-2" />
            Scan
          </Button>
        </form>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading
          ? Array(6)
              .fill(0)
              .map((_, i) => (
                <Skeleton key={i} className="aspect-square rounded-xl" />
              ))
          : results.map((item, index) => (
              <motion.div
                key={item.date}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="overflow-hidden h-full group border-border bg-card shadow-sm hover:shadow-md transition-shadow">
                  <div className="aspect-video relative overflow-hidden bg-muted">
                    {item.mediaType === "video" ? (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
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
                      variant="secondary"
                      size="icon"
                      className="absolute top-2 right-2 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => toggleFavorite(item)}
                    >
                      <Heart
                        className={cn(
                          "w-5 h-5",
                          isFavorite(item.date) && "fill-red-500 text-red-500"
                        )}
                      />
                    </Button>
                  </div>
                  <div className="p-4">
                    <div className="text-xs font-medium text-muted-foreground mb-1">
                      {item.date}
                    </div>
                    <h3 className="font-semibold line-clamp-1 leading-tight">
                      {item.title}
                    </h3>
                  </div>
                </Card>
              </motion.div>
            ))}
      </div>
    </div>
  );
};

export default RangeExplorerPage;
