"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Sparkles, Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

// Define imagePlaceholders outside
const imagePlaceholders: { [key: number]: string } = {
  2017: "/images/2017.jpg",
  2018: "/images/2018.jpg",
  2019: "/images/2019.jpg",
  2020: "/images/2020.jpg",
  2021: "/images/2021.jpg",
  2022: "/images/2022.jpg",
  2023: "/images/2023.jpg",
  2024: "/images/2024.jpg",
  2025: "/images/2025.jpg",
};

// Memoized ImageContainer
const ImageContainer = React.memo(({ year }: { year: number }) => {
  console.log("ImageContainer rendered for year:", year);
  return (
    <motion.div
      key={year}
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -30, scale: 0.9 }}
      transition={{ duration: 3, type: "tween" }}
      onAnimationStart={() => console.log("Animation started for year:", year, "at", Date.now())}
      onAnimationComplete={(definition) =>
        console.log("Animation completed for year:", year, "with", definition, "at", Date.now())
      }
      className={cn(
        "w-[90%] max-w-[640px] mx-auto rounded-3xl overflow-hidden relative shadow-2xl aspect-[4/3] md:aspect-[16/9]"
      )}
    >
      <Image
        src={imagePlaceholders[year]}
        alt={`Year ${year}`}
        fill
        className={cn(
          "object-cover transition-transform duration-300",
          year === 2025 && "hover:scale-110 hover:rotate-6"
        )}
        priority={year === 2017}
      />
    </motion.div>
  );
});
ImageContainer.displayName = "ImageContainer";

// Snowfall component with 25% fewer snowflakes
const Snowfall: React.FC = () => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const snowflakes = Array.from({ length: 80 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      color: ["#FFFFFF", "#E0F7FA", "#B3E5FC", "#81D4FA", "#4FC3F7"][
        Math.floor(Math.random() * 5)
      ],
      size: Math.random() * 6 + 4,
      speedX: Math.random() * 0.5 - 0.25,
      speedY: Math.random() * 0.5 + 0.5,
      opacity: 1,
    }));

    const drawSnowflake = (x: number, y: number, size: number, color: string, opacity: number) => {
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.globalAlpha = opacity;
      ctx.lineWidth = 1;

      const angleStep = Math.PI / 3;
      for (let i = 0; i < 6; i++) {
        const angle = i * angleStep;
        const xEnd = x + Math.cos(angle) * size;
        const yEnd = y + Math.sin(angle) * size;
        ctx.moveTo(x, y);
        ctx.lineTo(xEnd, yEnd);
      }
      ctx.stroke();
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      snowflakes.forEach((s) => {
        drawSnowflake(s.x, s.y, s.size, s.color, s.opacity);
        s.y += s.speedY;
        s.x += s.speedX;
        s.speedY += 0.00;
        if (s.y > canvas.height + s.size) {
          s.y = -s.size;
          s.x = Math.random() * canvas.width;
          s.speedY = Math.random() * 0.5 + 0.5;
          s.opacity = 1;
        }
      });
      requestAnimationFrame(animate);
    };
    animate();

    return () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    };
  }, []);

  return <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 z-[5]" />;
};

// Main component
const RomanticBirthdayTimeline: React.FC = () => {
  const [currentYearIndex, setCurrentYearIndex] = useState<number>(0);
  const [isPlayingBackgroundMusic, setIsPlayingBackgroundMusic] = useState<boolean>(false);
  const [isPlayingBirthdayMusic, setIsPlayingBirthdayMusic] = useState<boolean>(false);
  const backgroundAudioRef = useRef<HTMLAudioElement>(null);
  const birthdayAudioRef = useRef<HTMLAudioElement>(null);

  console.log("Component rendered, currentYearIndex:", currentYearIndex);

  const years = [2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025];

  // Load background audio
  useEffect(() => {
    const audio = backgroundAudioRef.current;
    if (audio) {
      audio.load();
    }
  }, []);

  // Load birthday audio
  useEffect(() => {
    const audio = birthdayAudioRef.current;
    if (audio) {
      audio.load();
    }
  }, []);

  const updateTimeline = (yearIndex: number) => {
    console.log("Updating timeline to index:", yearIndex);
    setCurrentYearIndex(yearIndex);
  };

  const handlePrevClick = () => {
    console.log("Prev clicked, current index:", currentYearIndex);
    if (currentYearIndex > 0) updateTimeline(currentYearIndex - 1);
  };

  const handleNextClick = () => {
    console.log("Next clicked, current index:", currentYearIndex);
    if (currentYearIndex < years.length - 1) updateTimeline(currentYearIndex + 1);
  };

  const handleYearClick = (year: number) => {
    const index = years.indexOf(year);
    updateTimeline(index);
  };

  const handleSliderChange = (value: number[]) => {
    const index = years.indexOf(value[0]);
    updateTimeline(index);
  };

  const playBackgroundMusic = () => {
    if (backgroundAudioRef.current && !isPlayingBackgroundMusic) {
      backgroundAudioRef.current.play().then(() => setIsPlayingBackgroundMusic(true)).catch((e) => console.error("Background play error:", e));
    }
  };

  const pauseBackgroundMusic = () => {
    if (backgroundAudioRef.current && isPlayingBackgroundMusic) {
      backgroundAudioRef.current.pause();
      setIsPlayingBackgroundMusic(false);
    }
  };

  const playBirthdaySong = () => {
    if (birthdayAudioRef.current && !isPlayingBirthdayMusic) {
      if (backgroundAudioRef.current && isPlayingBackgroundMusic) {
        backgroundAudioRef.current.pause();
        setIsPlayingBackgroundMusic(false);
      }
      birthdayAudioRef.current.play().then(() => setIsPlayingBirthdayMusic(true)).catch((e) => console.error("Birthday play error:", e));
    }
  };

  const pauseBirthdaySong = () => {
    if (birthdayAudioRef.current && isPlayingBirthdayMusic) {
      birthdayAudioRef.current.pause();
      setIsPlayingBirthdayMusic(false);
      if (backgroundAudioRef.current) {
        backgroundAudioRef.current.play().then(() => setIsPlayingBackgroundMusic(true)).catch((e) => console.error("Background resume error:", e));
      }
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center py-6 sm:py-8 md:py-12 overflow-x-hidden font-Barriecito">
      <div className="container w-[90%] max-w-[640px] sm:max-w-4xl py-6 sm:py-8 bg-card rounded-3xl shadow-lg text-center relative">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl title-text mb-4 font-bold text-shadow-md tracking-wide">
          9 year story in pictures
        </h1>

        <div className="flex justify-center items-center gap-8 sm:gap-16 md:gap-32 mb-4 sm:mb-6">
          <motion.button
            onClick={handlePrevClick}
            disabled={currentYearIndex === 0}
            className={cn(
              "p-2 sm:p-3 rounded-full transition-all duration-300",
              "bg-primary hover:bg-primary/80",
              "text-primary-foreground shadow-md hover:shadow-lg",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
          >
            <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
          </motion.button>

          <motion.div whileHover={{ scale: 1.1 }} transition={{ type: "spring", stiffness: 400, damping: 20 }}>
            <Button
              variant="default"
              size="icon"
              className="rounded-full w-12 h-12 sm:w-16 sm:h-16 bg-accent hover:bg-accent/80 text-accent-foreground shadow-lg"
              onClick={isPlayingBackgroundMusic ? pauseBackgroundMusic : playBackgroundMusic}
            >
              {isPlayingBackgroundMusic ? <Pause className="w-6 h-6 sm:w-8 sm:h-8" /> : <Play className="w-6 h-6 sm:w-8 sm:h-8" />}
            </Button>
          </motion.div>

          <motion.button
            onClick={handleNextClick}
            disabled={currentYearIndex === years.length - 1}
            className={cn(
              "p-2 sm:p-3 rounded-full transition-all duration-300",
              "bg-primary hover:bg-primary/80",
              "text-primary-foreground shadow-md hover:shadow-lg",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
          >
            <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
          </motion.button>
        </div>

        <div className="flex flex-col items-center mb-8 sm:mb-10 relative">
          <div className="w-[90%] max-w-[640px] sm:max-w-4xl flex justify-between px-2 sm:px-4 relative timeline-years">
            {years.map((year, index) => (
              <div
                key={year}
                className={cn(
                  "text-foreground text-sm sm:text-base md:text-lg lg:text-xl cursor-pointer transition-colors duration-300 relative pt-4 sm:pt-6 md:pt-8",
                  index === currentYearIndex && "text-secondary font-bold text-lg sm:text-xl md:text-2xl drop-shadow-md"
                )}
                onClick={() => handleYearClick(year)}
              >
                {year}
              </div>
            ))}
          </div>
          <div className="w-[90%] max-w-[640px] sm:max-w-4xl mt-4 sm:mt-6">
            <Slider
              min={2017}
              max={2025}
              step={1}
              defaultValue={[2017]}
              value={[years[currentYearIndex]]}
              onValueChange={handleSliderChange}
              className="w-full timeline-slider"
            />
          </div>
        </div>

        <div className="relative w-[90%] max-w-[640px] sm:max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <ImageContainer key={`image-${years[currentYearIndex]}`} year={years[currentYearIndex]} />
          </AnimatePresence>

          {years[currentYearIndex] === 2025 && (
            <motion.div
              initial={{ scale: 0, opacity: 0, rotate: -10 }}
              animate={{ scale: 1, opacity: 1, rotate: -5 }}
              transition={{ duration: 5, type: "spring", stiffness: 100, delay: 7 }}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-card p-4 sm:p-6 rounded-3xl text-center shadow-2xl border-2 border-secondary backdrop-blur-md w-[90%] max-w-[360px] sm:max-w-md z-10"
            >
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-red-100 mb-2 sm:mb-4 font-bold tracking-wide drop-shadow-md">
                Happy Birthday!
                <Sparkles className="inline-block w-5 h-5 sm:w-6 sm:h-6 ml-1 sm:ml-2 text-accent animate-pulse" />
              </h2>
              <p className="text-sm sm:text-base md:text-lg lg:text-xl text-red-100 mb-2 sm:mb-4 font-roboto" style={{ fontFamily: "Roboto, sans-serif" }}>
                Wishing you a year filled with love, joy, and dreams come true.
              </p>
              <div className="flex items-center justify-center gap-2 sm:gap-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={isPlayingBirthdayMusic ? pauseBirthdaySong : playBirthdaySong}
                  className="rounded-full w-8 h-8 sm:w-10 sm:h-10 bg-secondary/80 hover:bg-secondary text-secondary-foreground"
                >
                  {isPlayingBirthdayMusic ? <Pause className="w-4 h-4 sm:w-5 sm:h-5" /> : <Play className="w-4 h-4 sm:w-5 sm:h-5" />}
                </Button>
                <span className="text-muted-foreground text-sm sm:text-base">
                  {isPlayingBirthdayMusic ? "Pause Music" : "Play Music"}
                </span>
              </div>
            </motion.div>
          )}
        </div>

        <Snowfall />
        <audio
          ref={backgroundAudioRef}
          src="/sounds/freedom.mp3"
          loop
          preload="auto"
          style={{ display: "none" }}
        />
        <audio
          ref={birthdayAudioRef}
          src="/sounds/blue.mp3"
          loop
          preload="auto"
          style={{ display: "none" }}
        />
      </div>
    </div>
  );
};

export default RomanticBirthdayTimeline;