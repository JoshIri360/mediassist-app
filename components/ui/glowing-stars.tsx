"use client";

import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/utils/cn";

export const GlowingStarsBackgroundCard = ({
    className,
    children,
    illustrationType,
  }: {
    className?: string;
    children?: React.ReactNode;
    illustrationType: number;
  }) => {
    const [mouseEnter, setMouseEnter] = useState(false);
  
    return (
      <div
        onMouseEnter={() => setMouseEnter(true)}
        onMouseLeave={() => setMouseEnter(false)}
        className={cn(
          "bg-[linear-gradient(110deg,#333_0.6%,#222)] p-4 max-w-[300px] lg:max-w-[600px] mx-auto max-h-[20rem] h-full w-full rounded-xl border border-[#eaeaea] dark:border-neutral-600",
          className
        )}
      >
        <div className="flex justify-center items-center">
          <Illustration mouseEnter={mouseEnter} type={illustrationType} />
        </div>
        <div className="px-2 pb-2">{children}</div>
      </div>
    );
  };

export const GlowingStarsDescription = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  return (
    <p className={cn("text-base text-white max-w-[16rem]", className)}>
      {children}
    </p>
  );
};

export const GlowingStarsTitle = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  return (
    <h2 className={cn("font-bold text-xl text-[#eaeaea] text-left", className)}>
      {children}
    </h2>
  );
};

export const Illustration = ({ mouseEnter, type }: { mouseEnter: boolean; type: number }) => {
    const stars = 108;
    const columns = 18;
    const [glowingStars, setGlowingStars] = useState<number[]>([]);
    const highlightedStars = useRef<number[]>([]);
  
    useEffect(() => {
      const interval = setInterval(() => {
        highlightedStars.current = Array.from({ length: 5 }, () =>
          Math.floor(Math.random() * stars)
        );
        setGlowingStars([...highlightedStars.current]);
      }, 3000);
      return () => clearInterval(interval);
    }, []);
  
    return (
      <div
        className="h-48 p-1 w-full"
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          gap: `1px`,
        }}
      >
        {[...Array(stars)].map((_, starIdx) => {
          const isGlowing = glowingStars.includes(starIdx);
          const delay = (starIdx % 10) * 0.1;
          const staticDelay = starIdx * 0.01;
          return (
            <div key={`matrix-col-${starIdx}`} className="relative flex items-center justify-center">
              <Star isGlowing={mouseEnter ? true : isGlowing} delay={mouseEnter ? staticDelay : delay} />
              {mouseEnter && <Glow delay={staticDelay} type={type} />}
              <AnimatePresence mode="wait">
                {isGlowing && <Glow delay={delay} type={type} />}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    );
  };  

  const Star = ({ isGlowing, delay }: { isGlowing: boolean; delay: number }) => {
    return (
      <motion.div
        key={delay}
        initial={{ scale: 1 }}
        animate={{ scale: isGlowing ? [1, 1.2, 2.5, 2.2, 1.5] : 1, background: isGlowing ? "#fff" : "#666" }}
        transition={{ duration: 2, ease: "easeInOut", delay: delay }}
        className="bg-[#666] h-[1px] w-[1px] rounded-full relative z-20"
      ></motion.div>
    );
  };

  const Glow = ({ delay, type }: { delay: number; type: number }) => {
    const colors = ["bg-blue-500", "bg-purple-500", "bg-green-500", "bg-red-500", "bg-white"];
    const shadows = ["shadow-blue-400", "shadow-purple-400", "shadow-green-400", "shadow-red-400", "shadow-white"];

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2, ease: "easeInOut", delay: delay }}
        exit={{ opacity: 0 }}
        className={`absolute left-1/2 -translate-x-1/2 z-10 h-[4px] w-[4px] rounded-full ${colors[type-1]} blur-[1px] shadow-2xl ${shadows[type-1]}`}
      />
    );
};

  
