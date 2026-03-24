"use client";

import React, { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Problem from "@/components/Problem";
import ScrollySection from "@/components/ScrollySection";
import HorizontalScroll from "@/components/HorizontalScroll";
import LiveDemo from "@/components/LiveDemo";
import Metrics from "@/components/Metrics";
import Architecture from "@/components/Architecture";
import CourseCatalog from "@/components/CourseCatalog";
import Team from "@/components/Team";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";

export default function Home() {
  useEffect(() => {
    // Scroll progress bar
    const updateProgress = () => {
      const scrolled = document.documentElement.scrollTop;
      const maxScroll = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const progress = (scrolled / maxScroll);
      const progressBar = document.getElementById("global-progress-bar");
      if (progressBar) {
        progressBar.style.transform = `scaleX(${progress})`;
      }
    };
    window.addEventListener("scroll", updateProgress);

    // Keyboard Shortcuts
    let keysPressed: string[] = [];
    const konamiCode = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];

    const handleKeyDown = (e: KeyboardEvent) => {
      // Single Key Shortcuts
      if (document.activeElement?.tagName !== "INPUT" && document.activeElement?.tagName !== "TEXTAREA") {
        if (e.key.toLowerCase() === "d") {
          document.getElementById("demo")?.scrollIntoView({ behavior: "smooth" });
        }
        if (e.key.toLowerCase() === "g") {
          window.open("https://github.com", "_blank");
        }
      }

      // Konami Code
      keysPressed.push(e.key);
      if (keysPressed.length > konamiCode.length) {
        keysPressed.shift();
      }
      
      if (keysPressed.join(",") === konamiCode.join(",")) {
        triggerConfetti();
        keysPressed = [];
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const triggerConfetti = () => {
    // Simple DOM-based confetti
    const colors = ["#E85D24", "#2563EB", "#1A1A16", "#F5F3EC"];
    for (let i = 0; i < 150; i++) {
      const conf = document.createElement("div");
      conf.style.position = "fixed";
      conf.style.width = "10px";
      conf.style.height = "10px";
      conf.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      conf.style.left = Math.random() * 100 + "vw";
      conf.style.top = "-10px";
      conf.style.zIndex = "9999";
      conf.style.transform = `rotate(${Math.random() * 360}deg)`;
      document.body.appendChild(conf);

      const animation = conf.animate([
        { transform: `translate3d(0, 0, 0) rotate(0deg)`, opacity: 1 },
        { transform: `translate3d(${Math.random() * 200 - 100}px, 100vh, 0) rotate(${Math.random() * 720}deg)`, opacity: 0 }
      ], {
        duration: Math.random() * 2000 + 3000,
        easing: "cubic-bezier(.37,0,.63,1)"
      });

      animation.onfinish = () => conf.remove();
    }
  };

  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <Problem />
      <ScrollySection />
      <HorizontalScroll />
      <LiveDemo />
      <Metrics />
      <Architecture />
      <CourseCatalog />

      <Team />
      <FAQ />
      <Footer />

      {/* Keyboard Shortcuts Hint */}
      <div className="fixed bottom-4 right-4 text-[10px] font-mono uppercase text-ink-muted bg-bg/80 dark:bg-black/80 backdrop-blur px-2 py-1 rounded shadow hidden md:block z-50 pointer-events-none">
        ⌨️ Press <strong className="text-accent [text-shadow:0_0_10px_rgba(232,93,36,0.3)]">D</strong> for Demo, <strong className="text-accent">G</strong> for GitHub
      </div>
    </main>
  );
}
