"use client";

import React from "react";
import CountUp from "react-countup";
import { useInView } from "framer-motion";
import { useRef } from "react";

export default function Metrics() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const metrics = [
    { value: 89, suffix: "%", label: "Matching Accuracy", src: "Based on 500+ trial parses" },
    { value: 0, suffix: "%", label: "Hallucination Rate", src: "Verified via structured JSON enforce" },
    { value: 6.2, decimals: 1, label: "Courses Saved / Hire", src: "Average redundancy eliminated" },
    { value: 14, suffix: "s", label: "Processing Pipeline", src: "End-to-end extraction time" }
  ];

  return (
    <section ref={ref} className="py-24 bg-bg-dark text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-blueprint opacity-[0.03] pointer-events-none"></div>
      
      <div className="container mx-auto px-4 md:px-8 max-w-7xl relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-8 divide-x-0 md:divide-x divide-ruler/20">
          
          {metrics.map((m, i) => (
            <div key={i} className="flex flex-col items-center justify-center text-center px-4">
              <div className="text-5xl md:text-7xl font-display font-bold text-accent mb-4 tracking-tighter">
                {isInView ? (
                  <CountUp 
                    start={0} 
                    end={m.value} 
                    duration={2.5} 
                    decimals={m.decimals || 0}
                    useEasing={true}
                  />
                ) : "0"}
                {m.suffix && <span className="text-3xl md:text-5xl">{m.suffix}</span>}
              </div>
              
              <div className="text-sm font-bold uppercase tracking-widest text-ink bg-white/10 px-3 py-1 mb-3">
                {m.label}
              </div>
              
              <div className="text-xs font-mono text-ink-muted mt-auto">
                {m.src}
              </div>
            </div>
          ))}

        </div>
      </div>
    </section>
  );
}
