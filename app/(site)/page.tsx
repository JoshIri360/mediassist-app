import React from 'react';
import { MultiStepLoaderDemo } from '@/components/multi-loader';
import { FloatingNavDemo } from '@/components/navbar';
import { HeroSection } from '@/components/hero';
import { ProblemSolution } from '@/components/problem-solution';
import { GlowingStarsTeam } from '@/components/team';
import { HomePreview } from '@/components/preview';
import { Footer } from '@/components/footer';
import { ThemeProvider } from "@/components/theme-provider";

const HomePage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <MultiStepLoaderDemo />
        <FloatingNavDemo />
        <HeroSection />
        <ProblemSolution />
        <GlowingStarsTeam />
        <HomePreview />
        <Footer />
      </ThemeProvider>
    </div>
  );
};

export default HomePage;
