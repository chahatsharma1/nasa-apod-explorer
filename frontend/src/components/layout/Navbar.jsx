import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Rocket, Sun, Moon, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/context/ThemeContext";
import { AnimatePresence, motion } from "framer-motion";

const Navbar = () => {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { path: "/", label: "Home" },
    { path: "/today", label: "Today" },
    { path: "/date", label: "Date" },
    { path: "/range", label: "Range" },
    { path: "/gallery", label: "Gallery" },
    { path: "/favorites", label: "Favorites" },
  ];

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border h-16 flex items-center justify-center px-4 transition-colors duration-300">
      <div className="max-w-7xl w-full flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="p-2 rounded-full bg-primary text-primary-foreground">
            <Rocket className="w-5 h-5" />
          </div>
          <span className="text-xl font-bold tracking-tight hidden sm:block">
            NASA <span className="font-light">APOD</span>
          </span>
        </Link>

        <div className="flex items-center gap-2 sm:gap-6">
          <div className="hidden md:flex items-center gap-6">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary flex items-center gap-2",
                    isActive ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="rounded-full"
          >
            {theme === "dark" ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden rounded-full"
            onClick={toggleMenu}
          >
            {isMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-16 left-0 right-0 bg-background border-b border-border p-4 md:hidden shadow-lg"
          >
            <div className="flex flex-col space-y-4">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={cn(
                      "text-sm font-medium p-2 rounded-md transition-colors hover:bg-muted",
                      isActive
                        ? "text-primary bg-muted/50"
                        : "text-muted-foreground"
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
