"use client";

import React, { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { cn } from "@/lib/utils";
import { FileText, Cpu, Target, Route } from "lucide-react";

const chapters = [
  {
    title:   "Upload Resume",
    desc:    "Drop any unstructured PDF. Our engine ignores format fatigue and extracts raw text contextually.",
    icon:    FileText,
    color:   "#38bdf8",   // sky blue
    glow:    "rgba(56,189,248,0.22)",
    gradient:"linear-gradient(135deg,rgba(56,189,248,0.18) 0%,rgba(56,189,248,0.04) 100%)",
    tagBg:   "rgba(56,189,248,0.12)",
    tagBorder:"rgba(56,189,248,0.45)",
    phase:   "PHASE 01",
  },
  {
    title:   "AI Parses Skills",
    desc:    "Claude 3.5 Sonnet dissects the profile, building a structured JSON taxonomy of skills, tools, and evidence.",
    icon:    Cpu,
    color:   "#a78bfa",   // violet
    glow:    "rgba(167,139,250,0.22)",
    gradient:"linear-gradient(135deg,rgba(167,139,250,0.18) 0%,rgba(167,139,250,0.04) 100%)",
    tagBg:   "rgba(167,139,250,0.12)",
    tagBorder:"rgba(167,139,250,0.45)",
    phase:   "PHASE 02",
  },
  {
    title:   "Gap Analysis",
    desc:    "We run a delta between the Job Description requirements and the candidate's verified stack. Visualizing the exact readiness delta.",
    icon:    Target,
    color:   "#f97316",   // orange
    glow:    "rgba(249,115,22,0.22)",
    gradient:"linear-gradient(135deg,rgba(249,115,22,0.18) 0%,rgba(249,115,22,0.04) 100%)",
    tagBg:   "rgba(249,115,22,0.12)",
    tagBorder:"rgba(249,115,22,0.45)",
    phase:   "PHASE 03",
  },
  {
    title:   "Your Pathway",
    desc:    "A personalized, zero-redundancy curriculum is generated. Saving an average of 6.2 courses per hire.",
    icon:    Route,
    color:   "#4ade80",   // green
    glow:    "rgba(74,222,128,0.22)",
    gradient:"linear-gradient(135deg,rgba(74,222,128,0.18) 0%,rgba(74,222,128,0.04) 100%)",
    tagBg:   "rgba(74,222,128,0.12)",
    tagBorder:"rgba(74,222,128,0.45)",
    phase:   "PHASE 04",
  },
];

export default function ScrollySection() {
  const containerRef   = useRef<HTMLDivElement>(null);
  const leftPanelRef   = useRef<HTMLDivElement>(null);
  const rightTextsRef  = useRef<(HTMLDivElement | null)[]>([]);
  const [activeLayer, setActiveLayer] = useState(0);

  useEffect(() => {
    const mm = gsap.matchMedia();

    mm.add("(min-width: 768px)", () => {
      /* pin left panel */
      ScrollTrigger.create({
        trigger:    containerRef.current,
        start:      "top top+=100",
        end:        "bottom bottom",
        pin:        leftPanelRef.current,
        pinSpacing: false,
      });

      /* highlight active text + set activeLayer */
      rightTextsRef.current.forEach((text, i) => {
        if (!text) return;
        ScrollTrigger.create({
          trigger: text,
          start:   "top center",
          end:     "bottom center",
          onToggle: self => {
            if (self.isActive) {
              setActiveLayer(i);
              gsap.to(text, { opacity: 1, duration: 0.3 });
            } else {
              gsap.to(text, { opacity: 0.25, duration: 0.3 });
            }
          },
        });
      });
    });

    mm.add("(max-width: 767px)", () => {
      rightTextsRef.current.forEach(text => {
        if (text) gsap.to(text, { opacity: 1 });
      });
    });

    return () => { mm.revert(); };
  }, []);

  const ch = chapters[activeLayer];

  return (
    <section
      ref={containerRef}
      id="solution"
      className="relative min-h-screen py-32 border-t border-ruler"
      style={{ background: "#080810" }}
    >
      <div className="container mx-auto max-w-7xl px-4 md:px-8">
        {/* Section header */}
        <div className="mb-20 text-center">
          <p className="text-xs font-mono tracking-[0.25em] uppercase mb-3" style={{ color: ch.color }}>
            02 — The Solution
          </p>
          <h2 className="text-4xl md:text-6xl font-display font-bold text-white">
            How SkillPath Works
          </h2>
        </div>

        <div className="flex flex-col md:flex-row gap-16 relative">

          {/* ── Left Pinned Visual Panel ── */}
          <div className="w-full md:w-1/2 md:h-[calc(100vh-200px)] flex items-center justify-center relative md:static mb-16 md:mb-0">
            <div
              ref={leftPanelRef}
              className="w-full aspect-square md:max-w-md rounded-2xl relative overflow-hidden flex flex-col items-center justify-center transition-all duration-700"
              style={{
                background: ch.gradient,
                border:     `1px solid ${ch.tagBorder}`,
                boxShadow:  `0 0 60px ${ch.glow}, 0 0 120px ${ch.glow}`,
              }}
            >
              {/* Grid bg */}
              <div className="absolute inset-0 opacity-20">
                <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="sPanelGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="0.5" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#sPanelGrid)" />
                </svg>
              </div>

              {/* Corner accents */}
              <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 rounded-tl opacity-60" style={{ borderColor: ch.color }} />
              <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 rounded-tr opacity-60" style={{ borderColor: ch.color }} />
              <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 rounded-bl opacity-60" style={{ borderColor: ch.color }} />
              <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 rounded-br opacity-60" style={{ borderColor: ch.color }} />

              {/* Animated icon layers */}
              {chapters.map((chapter, index) => {
                const Icon = chapter.icon;
                return (
                  <div
                    key={index}
                    className={cn(
                      "absolute transition-all duration-700 ease-in-out transform flex flex-col items-center gap-6",
                      activeLayer === index
                        ? "opacity-100 scale-100 translate-y-0"
                        : "opacity-0 scale-75 translate-y-8 pointer-events-none"
                    )}
                  >
                    {/* Outer ring */}
                    <div
                      className="w-40 h-40 rounded-full flex items-center justify-center"
                      style={{
                        background: chapter.tagBg,
                        border:     `2px solid ${chapter.tagBorder}`,
                        boxShadow:  `0 0 40px ${chapter.glow}, 0 0 80px ${chapter.glow}`,
                      }}
                    >
                      <Icon
                        className="w-16 h-16"
                        strokeWidth={1.2}
                        style={{ color: chapter.color, filter: `drop-shadow(0 0 12px ${chapter.color})` }}
                      />
                    </div>

                    <div className="text-center">
                      <div
                        className="text-xs font-mono tracking-widest uppercase px-3 py-1 rounded mb-2"
                        style={{ background: chapter.tagBg, color: chapter.color, border: `1px solid ${chapter.tagBorder}` }}
                      >
                        [ LAYER 0{index + 1} ACTIVE ]
                      </div>
                      <div className="text-lg font-bold text-white mt-1">{chapter.title}</div>
                    </div>
                  </div>
                );
              })}

              {/* Phase counter bottom */}
              <div className="absolute bottom-5 left-0 right-0 flex justify-center gap-2">
                {chapters.map((c, i) => (
                  <div
                    key={i}
                    className="rounded-full transition-all duration-500"
                    style={{
                      width:      activeLayer === i ? 20 : 6,
                      height:     6,
                      background: activeLayer === i ? c.color : "rgba(255,255,255,0.2)",
                      boxShadow:  activeLayer === i ? `0 0 8px ${c.color}` : "none",
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* ── Right Scrolling Text ── */}
          <div className="w-full md:w-1/2 flex flex-col py-10 md:py-32 space-y-32">
            {chapters.map((chapter, i) => (
              <div
                key={i}
                ref={el => { rightTextsRef.current[i] = el; }}
                className="min-h-[50vh] flex flex-col justify-center opacity-25 transition-opacity"
              >
                {/* Phase tag */}
                <div
                  className="text-xs font-mono px-3 py-1 w-max rounded mb-5"
                  style={{
                    background:   chapter.tagBg,
                    color:        chapter.color,
                    border:       `1px solid ${chapter.tagBorder}`,
                    boxShadow:    `0 0 16px ${chapter.glow}`,
                  }}
                >
                  {chapter.phase}
                </div>

                <h3
                  className="text-4xl md:text-5xl font-display font-bold mb-6"
                  style={{ color: chapter.color, textShadow: `0 0 30px ${chapter.glow}` }}
                >
                  {chapter.title}
                </h3>

                <p className="text-xl leading-relaxed" style={{ color: "rgba(255,255,255,0.65)" }}>
                  {chapter.desc}
                </p>

                {/* Connector line to next step */}
                {i < chapters.length - 1 && (
                  <div
                    className="mt-12 w-px h-12 self-start ml-2 opacity-30 rounded"
                    style={{ background: chapter.color }}
                  />
                )}
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
