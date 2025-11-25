import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ArrowRight, Globe } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 overflow-hidden bg-background transition-colors duration-300">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="z-10 max-w-3xl"
      >
        <div className="mb-8 inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border bg-secondary/50 text-secondary-foreground text-xs font-medium tracking-widest uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-primary" />
          Daily Astronomy
        </div>
        
        <h1 className="text-6xl md:text-8xl font-bold tracking-tighter mb-8 text-foreground">
          NASA APOD <br />
          <span className="font-light text-muted-foreground">
            EXPLORER
          </span>
        </h1>
        
        <p className="text-xl text-muted-foreground mb-12 max-w-xl mx-auto leading-relaxed font-light">
          A minimal interface for the cosmos. Experience NASA's Astronomy Picture of the Day in a distraction-free environment.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/today">
            <Button size="lg" className="h-14 px-10 text-lg gap-2 rounded-full">
              Start Exploring
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
          
          <Link to="/gallery">
            <Button size="lg" variant="outline" className="h-14 px-10 text-lg gap-2 rounded-full">
              <Globe className="w-5 h-5" />
              View Gallery
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default LandingPage;
