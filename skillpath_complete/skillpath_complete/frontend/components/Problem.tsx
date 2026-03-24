"use client";

import React, { useEffect, useRef, useCallback } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { XCircle, Brain, Target } from "lucide-react";

/* ─── Per-card colour themes (unchanged) ────────────────────────── */
const CARD_THEMES = [
  {
    accent:    "#f97316",
    glow:      "rgba(249,115,22,0.18)",
    border:    "rgba(249,115,22,0.5)",
    badge:     "rgba(249,115,22,0.12)",
    iconClr:   "#f97316",
    tagBg:     "rgba(249,115,22,0.1)",
    tagBorder: "rgba(249,115,22,0.4)",
    glass:     "rgba(249,115,22,0.08)",
    shine:     "rgba(255,160,80,0.18)",
  },
  {
    accent:    "#a78bfa",
    glow:      "rgba(167,139,250,0.18)",
    border:    "rgba(167,139,250,0.5)",
    badge:     "rgba(167,139,250,0.12)",
    iconClr:   "#a78bfa",
    tagBg:     "rgba(167,139,250,0.1)",
    tagBorder: "rgba(167,139,250,0.4)",
    glass:     "rgba(167,139,250,0.08)",
    shine:     "rgba(200,170,255,0.18)",
  },
  {
    accent:    "#34d399",
    glow:      "rgba(52,211,153,0.18)",
    border:    "rgba(52,211,153,0.5)",
    badge:     "rgba(52,211,153,0.12)",
    iconClr:   "#34d399",
    tagBg:     "rgba(52,211,153,0.1)",
    tagBorder: "rgba(52,211,153,0.4)",
    glass:     "rgba(52,211,153,0.08)",
    shine:     "rgba(100,255,190,0.18)",
  },
];

/* ─── Single animated Problem card ──────────────────────────────── */
function ProblemCard({
  card,
  i,
  cardRef,
}: {
  card: { title: string; desc: string; icon: React.ElementType; mini: string };
  i: number;
  cardRef: (el: HTMLDivElement | null) => void;
}) {
  const th         = CARD_THEMES[i];
  const Icon       = card.icon;
  const wrapRef    = useRef<HTMLDivElement>(null);
  const glareRef   = useRef<HTMLDivElement>(null);
  const glassRef   = useRef<HTMLDivElement>(null);
  const rafId      = useRef<number | null>(null);

  /* ── Mouse enter: start floating up ── */
  const onEnter = useCallback(() => {
    const el = wrapRef.current;
    if (!el) return;
    gsap.to(el, {
      y:         -18,
      scale:     1.035,
      duration:  1,
      ease:      "elastic.out(1, 0.5)",
    });
    if (glassRef.current) {
      gsap.to(glassRef.current, { opacity: 1, duration: 0.4 });
    }
  }, []);

  /* ── Mouse leave: settle back ── */
  const onLeave = useCallback(() => {
    const el = wrapRef.current;
    if (!el) return;
    if (rafId.current) cancelAnimationFrame(rafId.current);
    gsap.to(el, {
      y:          0,
      scale:      1,
      rotateX:    0,
      rotateY:    0,
      duration:   0.9,
      ease:       "elastic.out(1, 0.4)",
    });
    if (glareRef.current) {
      gsap.to(glareRef.current, { opacity: 0, duration: 0.4 });
    }
    if (glassRef.current) {
      gsap.to(glassRef.current, { opacity: 0, duration: 0.5 });
    }
  }, []);

  /* ── Mouse move: tilt + glare spotlight follows cursor ── */
  const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = wrapRef.current;
    if (!el) return;

    if (rafId.current) cancelAnimationFrame(rafId.current);

    rafId.current = requestAnimationFrame(() => {
      const rect   = el.getBoundingClientRect();
      const cx     = rect.left + rect.width  / 2;
      const cy     = rect.top  + rect.height / 2;
      const dx     = e.clientX - cx;
      const dy     = e.clientY - cy;
      const maxRot = 12;
      const rotY   =  (dx / (rect.width  / 2)) * maxRot;
      const rotX   = -(dy / (rect.height / 2)) * maxRot;

      gsap.to(el, {
        rotateX:   rotX,
        rotateY:   rotY,
        duration:  0.25,
        ease:      "power2.out",
        overwrite: "auto",
      });

      /* glare spotlight position */
      if (glareRef.current) {
        const px = ((e.clientX - rect.left) / rect.width)  * 100;
        const py = ((e.clientY - rect.top)  / rect.height) * 100;
        glareRef.current.style.background =
          `radial-gradient(circle at ${px}% ${py}%, ${th.shine} 0%, transparent 65%)`;
        gsap.to(glareRef.current, { opacity: 1, duration: 0.2 });
      }
    });
  }, [th.shine]);

  return (
    /* perspective wrapper — needed for 3-D tilt */
    <div style={{ perspective: "900px", perspectiveOrigin: "50% 50%" }}>
      <div
        ref={(el) => {
          (wrapRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
          cardRef(el);
        }}
        className="relative overflow-hidden text-left rounded-xl p-8"
        style={{
          background:      `linear-gradient(135deg, ${th.glow} 0%, rgba(13,13,11,0.6) 100%)`,
          border:          `1px solid ${th.border}`,
          boxShadow:       `0 0 32px ${th.glow}, 0 4px 24px rgba(0,0,0,0.3)`,
          willChange:      "transform",
          transformStyle:  "preserve-3d",
          cursor:          "pointer",
          /* smooth baseline transition for box-shadow colour */
          transition:      "box-shadow 0.6s ease",
        }}
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
        onMouseMove={onMove}
        /* deepen shadow on hover via inline style override in onEnter/onLeave */
      >
        {/* ── GLASS overlay (appears on hover) ── */}
        <div
          ref={glassRef}
          className="absolute inset-0 rounded-xl pointer-events-none"
          style={{
            opacity:        0,
            background:     `linear-gradient(135deg, ${th.glass} 0%, rgba(255,255,255,0.04) 60%, transparent 100%)`,
            backdropFilter: "blur(6px) saturate(1.4)",
            WebkitBackdropFilter: "blur(6px) saturate(1.4)",
            border:         `1px solid ${th.border}`,
            transition:     "opacity 0.4s ease",
            zIndex:         1,
          }}
        />

        {/* ── GLARE spotlight that follows the mouse ── */}
        <div
          ref={glareRef}
          className="absolute inset-0 rounded-xl pointer-events-none"
          style={{
            opacity: 0,
            zIndex:  2,
            mixBlendMode: "screen",
          }}
        />

        {/* ── Card content (z-index above overlays) ── */}
        <div className="relative" style={{ zIndex: 3 }}>
          {/* ERR badge */}
          <div
            className="absolute top-0 right-0 px-2 py-1 text-[10px] font-mono rounded"
            style={{ background: th.badge, color: th.accent, border: `1px solid ${th.border}` }}
          >
            [ERR_0{i + 1}]
          </div>

          {/* Glowing icon */}
          <div
            className="w-12 h-12 mb-6 rounded-lg flex items-center justify-center"
            style={{
              background: th.tagBg,
              border:     `1px solid ${th.tagBorder}`,
              boxShadow:  `0 0 14px ${th.glow}`,
            }}
          >
            <Icon className="w-6 h-6" style={{ color: th.iconClr }} />
          </div>

          <h4 className="text-xl font-bold font-display mb-3" style={{ color: th.accent }}>
            {card.title}
          </h4>
          <p className="text-ink-muted leading-relaxed mb-6 text-[15px]">
            {card.desc}
          </p>

          {/* Mini tag */}
          <div
            className="text-xs font-mono p-3 rounded border-l-2"
            style={{
              background:      th.tagBg,
              borderLeftColor: th.accent,
              color:           th.accent,
            }}
          >
            {card.mini}
          </div>
        </div>

        {/* Ambient corner glow */}
        <div
          className="absolute -top-8 -left-8 w-32 h-32 rounded-full pointer-events-none"
          style={{ background: th.glow, filter: "blur(24px)", opacity: 0.5, zIndex: 0 }}
        />
      </div>
    </div>
  );
}

/* ─── Section ────────────────────────────────────────────────────── */
export default function Problem() {
  const containerRef = useRef<HTMLElement>(null);
  const cardsRef     = useRef<(HTMLDivElement | null)[]>([]);
  const lineRef      = useRef<HTMLDivElement>(null);

  useEffect(() => {
    /* header line draw */
    if (lineRef.current) {
      gsap.fromTo(lineRef.current,
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: { trigger: containerRef.current, start: "top 80%" },
        }
      );
    }

    /* entrance pop-up */
    if (cardsRef.current.length > 0) {
      gsap.set(cardsRef.current, {
        y: 80, opacity: 0, scale: 0.85,
        rotationX: 12, transformOrigin: "50% 100%", transformPerspective: 800,
      });

      ScrollTrigger.create({
        trigger: containerRef.current,
        start:   "top 62%",
        once:    true,
        onEnter: () => {
          gsap.to(cardsRef.current, {
            y: 0, opacity: 1, scale: 1, rotationX: 0,
            duration: 0.7, ease: "back.out(1.8)", stagger: 0.14,
          });
        },
      });
    }
  }, []);

  const cards = [
    { title: "Format Fatigue",    desc: "Traditional ATS systems collapse when faced with non-standard resumes.",            icon: XCircle, mini: "Before: Manual Extr. | After: JSON Structured" },
    { title: "Cognitive Overload", desc: "Generic catalog dumps overwhelm hires missing core context.",                       icon: Brain,   mini: "Before: 60+ Courses | After: 4 Laser-Focused" },
    { title: "Zero ROI Tracking", desc: "Companies spend months training candidates on skills they already have.",            icon: Target,  mini: "Before: Blind Spend | After: Analytics Driven" },
  ];

  return (
    <section ref={containerRef} id="problem" className="py-32 relative text-ink">
      <div className="container px-4 md:px-8 mx-auto max-w-7xl">
        <div className="flex items-center gap-4 mb-12">
          <h2 className="text-sm font-bold uppercase tracking-widest text-ink/70 shrink-0">
            01 — The Problem
          </h2>
          <div ref={lineRef} className="h-px bg-ruler flex-grow origin-left" />
        </div>

        <h3 className="text-4xl md:text-6xl font-display font-bold leading-tight max-w-4xl text-balance mb-24">
          <span className="text-accent">₹38 Lakh Crore </span>
          Lost to Redundant Training.
        </h3>

        <div className="grid md:grid-cols-3 gap-8">
          {cards.map((card, i) => (
            <ProblemCard
              key={card.title}
              card={card}
              i={i}
              cardRef={(el) => { cardsRef.current[i] = el; }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
