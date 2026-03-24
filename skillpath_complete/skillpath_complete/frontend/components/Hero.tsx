"use client";

import React, { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRefs = useRef<(HTMLHeadingElement | null)[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Canvas Network Particles
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      const particles: any[] = [];
      const numParticles = Math.floor(window.innerWidth / 20);

      for (let i = 0; i < numParticles; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          radius: Math.random() * 2 + 1,
        });
      }

      const animate = () => {
        if (!ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "rgba(232, 93, 36, 0.4)"; // accent color

        particles.forEach((p, i) => {
          p.x += p.vx;
          p.y += p.vy;

          if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
          if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();

          for (let j = i + 1; j < particles.length; j++) {
            const p2 = particles[j];
            const dx = p.x - p2.x;
            const dy = p.y - p2.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 100) {
              ctx.beginPath();
              ctx.strokeStyle = `rgba(232, 93, 36, ${0.15 - dist / 1000})`;
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.stroke();
            }
          }
        });

        requestAnimationFrame(animate);
      };
      animate();
    }

    // GSAP Parallax
    if (containerRef.current) {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      tl.to(canvasRef.current, { y: 200, opacity: 0, ease: "none" }, 0);
      
      titleRefs.current.forEach((el, index) => {
        if (el) {
          tl.to(el, { y: 100 + index * 50, ease: "none" }, 0);
        }
      });
    }

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <section 
      ref={containerRef} 
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
      id="hero"
    >
      <canvas ref={canvasRef} className="absolute inset-0 z-0 opacity-40 mix-blend-multiply dark:mix-blend-screen pointer-events-none" />
      
      {/* Rulers and Guides */}
      <div className="absolute left-0 top-0 h-full w-12 border-r border-ruler flex flex-col items-center py-20 z-0">
        <div className="text-[10px] font-mono text-ink-muted rotate-90 whitespace-nowrap opacity-50">Height: 100vh</div>
        <div className="absolute top-1/2 -left-1 w-3 h-[1px] bg-accent"></div>
        <div className="mt-auto space-y-4">
          {"SKILL\nPATH".split("").map((char, i) => (
            <div key={i} className="text-xs font-bold text-ink hover:text-accent font-display transition-colors">
              {char}
            </div>
          ))}
        </div>
      </div>
      
      <div className="absolute right-0 top-0 h-full w-12 border-l border-ruler flex flex-col items-center py-20 z-0 hidden md:flex">
         <div className="mt-auto space-y-4">
          {"THINK\nBUILD".split("").map((char, i) => (
            <div key={i} className="text-xs font-bold text-ink hover:text-accent font-display transition-colors">
              {char}
            </div>
          ))}
        </div>
      </div>

      <div className="absolute top-20 right-20 text-[10px] font-mono text-ink-muted hidden md:block border-b border-ruler pb-1">Width: 100vw</div>

      {/* Main Content */}
      <div className="container relative z-10 px-8 text-center flex flex-col items-center">
        <div className="space-y-[-2vw] sm:space-y-[-4vw]">
          <h1 
            ref={el => titleRefs.current[0] = el}
            className="font-sketch font-bold text-[15vw] leading-none text-ink tracking-tighter"
          >
            SKILL
          </h1>
          <h1 
            ref={el => titleRefs.current[1] = el}
            className="font-sketch font-bold text-[15vw] leading-none text-transparent bg-clip-text bg-gradient-to-br from-accent to-accent-2 tracking-tighter"
          >
            PATH
          </h1>
          <h1 
            ref={el => titleRefs.current[2] = el}
            className="font-sketch font-bold text-[15vw] leading-none text-ink tracking-tighter"
          >
            2.0
          </h1>
        </div>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="mt-8 text-xl md:text-2xl text-ink-muted font-medium max-w-2xl mx-auto"
        >
          India's Most Intelligent Onboarding Engine
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="mt-10 flex flex-col sm:flex-row gap-4 items-center"
        >
          <a href="#demo" className="px-8 py-4 bg-accent text-white font-bold rounded hover-card btn-primary-shimmer text-lg w-full sm:w-auto text-center border border-accent">
            Try Demo →
          </a>
          <a href="https://github.com" target="_blank" rel="noreferrer" className="px-8 py-4 bg-transparent text-ink border border-ink font-bold rounded hover-card text-lg w-full sm:w-auto text-center hover:bg-grid">
            View on GitHub
          </a>
        </motion.div>

        {/* Floating Badges */}
        <div className="mt-16 flex flex-wrap justify-center gap-4 hidden md:flex">
          {['48h built', '0% hallucination', '89% accuracy'].map((badge, i) => (
            <motion.div 
              key={badge}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.4 + i * 0.1 }}
              className="px-4 py-2 border border-ruler bg-bg/50 backdrop-blur-sm rounded-full text-xs font-mono font-bold uppercase"
            >
              {badge}
            </motion.div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce cursor-pointer opacity-50 z-20">
        <ArrowDown onClick={() => document.getElementById('problem')?.scrollIntoView({ behavior: 'smooth' })} />
      </div>
    </section>
  );
}
