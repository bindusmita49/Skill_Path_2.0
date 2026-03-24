"use client";

import React, { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

export default function HorizontalScroll() {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !sectionRef.current) return;

    const panels = gsap.utils.toArray(".horizontal-panel");
    const getScrollAmount = () => -(container.scrollWidth - window.innerWidth);

    const tween = gsap.to(panels, {
      x: getScrollAmount,
      ease: "none",
      scrollTrigger: {
        trigger: sectionRef.current,
        pin: true,
        start: "top top",
        end: () => `+=${getScrollAmount() * -1}`,
        scrub: 1,
        invalidateOnRefresh: true,
      }
    });

    return () => {
      tween.kill();
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <section ref={sectionRef} id="how-it-works" className="h-screen w-full flex bg-bg relative overflow-hidden">
      <div 
        ref={containerRef} 
        className="flex h-full w-[400vw] absolute inset-y-0"
      >
        {/* Panel 1 */}
        <div className="horizontal-panel w-screen h-full flex items-center justify-center border-r border-ruler bg-bg/50">
          <div 
            onClick={() => {
              const el = document.getElementById("demo");
              if (el) {
                // Quick/2x speed smooth scroll
                const targetPos = el.getBoundingClientRect().top + window.scrollY;
                const startPos = window.scrollY;
                const distance = targetPos - startPos;
                const duration = 400; // Fast scroll (2x speed than typical 800ms)
                let start: number | null = null;
                
                const step = (timestamp: number) => {
                  if (!start) start = timestamp;
                  const progress = timestamp - start;
                  // EaseOutCubic
                  const ease = 1 - Math.pow(1 - progress / duration, 3);
                  window.scrollTo(0, startPos + distance * Math.min(ease, 1));
                  if (progress < duration) window.requestAnimationFrame(step);
                };
                window.requestAnimationFrame(step);
              }
            }}
            className="max-w-xl text-center p-12 bg-white/5 backdrop-blur-md border-2 border-dashed border-accent/50 rounded-2xl relative cursor-pointer group hover:bg-accent/10 hover:-translate-y-2 transition-all duration-300 hover:shadow-[0_0_30px_rgba(249,115,22,0.2)]"
          >
            <div className="absolute inset-0 bg-accent/5 rounded-2xl scale-0 group-hover:scale-100 transition-transform duration-500 ease-out" />
            <div className="text-3xl font-bold font-display uppercase tracking-widest mb-6 text-accent group-hover:scale-105 transition-transform duration-300">Drop Resume Here</div>
            <div className="text-6xl group-hover:-translate-y-2 transition-transform duration-300 drop-shadow-[0_0_15px_rgba(249,115,22,0.4)]">📄</div>
            <div className="mt-8 font-mono text-sm opacity-60 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              Wait for context extraction <span className="text-accent group-hover:translate-x-2 transition-transform duration-300">→</span>
            </div>
          </div>
        </div>
        
        {/* Panel 2 */}
        <div className="horizontal-panel w-screen h-full flex items-center justify-center border-r border-ruler bg-ink">
          <div className="max-w-xl w-full text-bg p-8 font-mono text-sm leading-relaxed overflow-hidden">
            <div className="text-accent mb-4">{"{"}</div>
            <div className="pl-4">"candidate": "Alice Smith",</div>
            <div className="pl-4">"skills": [</div>
            <div className="pl-8 text-green-400">"React", "Node.js", "MongoDB"</div>
            <div className="pl-4">]</div>
            <div className="text-accent mt-4">{"}"}</div>
            <div className="text-xs uppercase tracking-widest text-[#6B6A62] mt-8">[ Zero Hallucination Mode Active ]</div>
          </div>
        </div>

        {/* Panel 3 */}
        <div className="horizontal-panel w-screen h-full flex flex-col items-center justify-center border-r border-ruler bg-bg relative">
          <div className="absolute inset-0 bg-blueprint opacity-10"></div>
          <h3 className="text-3xl font-display font-bold mb-8 z-10 text-balance text-center">Identifying the Delta</h3>
          <div className="w-64 h-64 rounded-full border border-ruler flex items-center justify-center relative bg-white/50 z-10 shadow-xl">
             {/* Fake Radar Chart - simplified with CSS for mock up */}
             <div className="absolute inset-[15%] rounded-full border border-dashed border-red-400/50"></div>
             <div className="absolute inset-[25%] rounded-full border border-dashed border-green-400/50"></div>
             <div className="w-1/2 h-full bg-red-400/20 rounded-l-full"></div>
             <div className="w-1/2 h-full bg-green-400/20 rounded-r-full"></div>
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xl font-bold">Δ 40%</div>
          </div>
        </div>

        {/* Panel 4 */}
        <div className="horizontal-panel w-screen h-full flex flex-col items-center justify-center bg-bg-dark text-white relative">
          <h3 className="text-4xl font-display font-bold mb-16 text-accent">Your Accelerated Pathway</h3>
          <div className="w-[80%] h-1 bg-ruler relative">
            <div className="absolute top-0 left-0 h-full bg-accent w-3/4"></div>
            {[0, 30, 60, 90].map((left, i) => (
              <div 
                key={i} 
                className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white border outline outline-offset-4 outline-accent transition-all duration-300 hover:scale-150 cursor-pointer"
                style={{ left: `${left}%` }}
              >
                <div className="absolute top-full mt-4 left-1/2 -translate-x-1/2 text-xs font-mono whitespace-nowrap bg-ink px-2 py-1 rounded">Module {i+1}</div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
