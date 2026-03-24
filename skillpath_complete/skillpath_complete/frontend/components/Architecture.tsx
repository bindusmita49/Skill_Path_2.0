"use client";

import React, { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

const NODE_COLORS = {
  browser:  { stroke: "#38bdf8", glow: "#38bdf840", label: "#e0f2fe" },  // sky blue
  flask:    { stroke: "#f97316", glow: "#f9731640", label: "#fed7aa" },  // orange
  parser:   { stroke: "#a78bfa", glow: "#a78bfa40", label: "#ede9fe" },  // violet
  analyzer: { stroke: "#34d399", glow: "#34d39940", label: "#d1fae5" },  // emerald
  catalog:  { stroke: "#fb7185", glow: "#fb718540", label: "#ffe4e6" },  // rose
  claude:   { stroke: "#facc15", glow: "#facc1540", label: "#fef9c3" },  // yellow
  json:     { stroke: "#4ade80", glow: "#4ade8040", label: "#bbf7d0" },  // green
};

export default function Architecture() {
  const svgRef      = useRef<SVGSVGElement>(null);
  const sectionRef  = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    /* ── collect every animated path ── */
    const allPaths = Array.from(svgRef.current.querySelectorAll<SVGPathElement>("path[data-draw]"));

    allPaths.forEach((path) => {
      const length = path.getTotalLength();
      gsap.set(path, { strokeDasharray: length, strokeDashoffset: length, opacity: 1 });
    });

    /* ── staggered draw on scroll ── */
    gsap.to(allPaths, {
      strokeDashoffset: 0,
      duration: 1.6,
      ease: "power2.inOut",
      stagger: 0.18,
      scrollTrigger: {
        trigger: svgRef.current,
        start: "top 72%",
      },
    });

    /* ── node pulse animations ── */
    const nodes = Array.from(svgRef.current.querySelectorAll<SVGRectElement | SVGCircleElement>("[data-node]"));
    gsap.set(nodes, { opacity: 0, scale: 0.7, transformOrigin: "center" });
    gsap.to(nodes, {
      opacity: 1,
      scale: 1,
      duration: 0.5,
      ease: "back.out(1.7)",
      stagger: 0.1,
      scrollTrigger: {
        trigger: svgRef.current,
        start: "top 72%",
      },
    });

    /* ── continuous glow pulse on nodes ── */
    nodes.forEach((node, i) => {
      gsap.to(node, {
        opacity: 0.7,
        duration: 1.4 + i * 0.15,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: i * 0.2,
      });
    });

    return () => { ScrollTrigger.getAll().forEach(t => t.kill()); };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-24 border-t border-ruler"
      style={{ background: "#050508" }}
    >
      <div className="container mx-auto px-4 max-w-5xl text-center">
        <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">
          <span className="text-accent underline decoration-ruler underline-offset-8">Architecture.</span>{" "}
          <span className="text-white">Under the Hood</span>
        </h2>
        <p className="text-sm font-mono text-slate-400 mb-12 tracking-widest uppercase">
          Scroll to trace the data flow ↓
        </p>

        <div
          className="w-full relative rounded-xl overflow-hidden flex items-center justify-center"
          style={{
            background: "linear-gradient(135deg,#0a0a12 0%,#0d0d1a 100%)",
            border: "1px solid rgba(255,255,255,0.07)",
            boxShadow: "0 0 80px #38bdf820 inset",
            height: 600,
          }}
        >
          {/* subtle grid overlay */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none opacity-20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <pattern id="archGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#archGrid)" />
          </svg>

          <svg
            ref={svgRef}
            viewBox="0 0 1000 600"
            className="w-full h-full max-w-4xl relative z-10"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {/* ════════════════ GLOW FILTERS ════════════════ */}
            <defs>
              {Object.entries(NODE_COLORS).map(([k, c]) => (
                <filter key={k} id={`glow-${k}`} x="-40%" y="-40%" width="180%" height="180%">
                  <feGaussianBlur stdDeviation="6" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              ))}
            </defs>

            {/* ════════════════ NODES ════════════════ */}

            {/* Browser (Next.js) */}
            <g transform="translate(60, 250)" data-node filter="url(#glow-browser)">
              <rect width="130" height="60" rx="6"
                stroke={NODE_COLORS.browser.stroke} strokeWidth="2"
                fill={NODE_COLORS.browser.glow} data-node />
              <text x="65" y="38" textAnchor="middle"
                style={{ fontSize: 11, fontFamily: "monospace", fill: NODE_COLORS.browser.label }}>
                Browser (Next.js)
              </text>
            </g>

            {/* Flask API */}
            <g transform="translate(340, 250)" data-node filter="url(#glow-flask)">
              <rect width="130" height="60" rx="6"
                stroke={NODE_COLORS.flask.stroke} strokeWidth="2.5"
                fill={NODE_COLORS.flask.glow} data-node />
              <text x="65" y="38" textAnchor="middle"
                style={{ fontSize: 12, fontFamily: "monospace", fill: NODE_COLORS.flask.label }}>
                Flask API
              </text>
            </g>

            {/* Parser.py */}
            <g transform="translate(590, 130)" data-node filter="url(#glow-parser)">
              <rect width="130" height="44" rx="4"
                stroke={NODE_COLORS.parser.stroke} strokeWidth="1.5" strokeDasharray="5 3"
                fill={NODE_COLORS.parser.glow} data-node />
              <text x="65" y="27" textAnchor="middle"
                style={{ fontSize: 11, fontFamily: "monospace", fill: NODE_COLORS.parser.label }}>
                Parser.py
              </text>
            </g>

            {/* Analyzer.py */}
            <g transform="translate(590, 258)" data-node filter="url(#glow-analyzer)">
              <rect width="130" height="44" rx="4"
                stroke={NODE_COLORS.analyzer.stroke} strokeWidth="1.5" strokeDasharray="5 3"
                fill={NODE_COLORS.analyzer.glow} data-node />
              <text x="65" y="27" textAnchor="middle"
                style={{ fontSize: 11, fontFamily: "monospace", fill: NODE_COLORS.analyzer.label }}>
                Analyzer.py
              </text>
            </g>

            {/* Catalog.py */}
            <g transform="translate(590, 386)" data-node filter="url(#glow-catalog)">
              <rect width="130" height="44" rx="4"
                stroke={NODE_COLORS.catalog.stroke} strokeWidth="1.5" strokeDasharray="5 3"
                fill={NODE_COLORS.catalog.glow} data-node />
              <text x="65" y="27" textAnchor="middle"
                style={{ fontSize: 11, fontFamily: "monospace", fill: NODE_COLORS.catalog.label }}>
                Catalog.py
              </text>
            </g>

            {/* Claude API */}
            <g transform="translate(840, 250)" data-node filter="url(#glow-claude)">
              <circle cx="50" cy="30" r="46"
                stroke={NODE_COLORS.claude.stroke} strokeWidth="2.5"
                fill={NODE_COLORS.claude.glow} data-node />
              <text x="50" y="35" textAnchor="middle"
                style={{ fontSize: 12, fontFamily: "monospace", fontWeight: 700, fill: NODE_COLORS.claude.label }}>
                Claude API
              </text>
            </g>

            {/* ════════════════ CONNECTING PATHS ════════════════ */}

            {/* Browser → Flask */}
            <path data-draw d="M 190 280 L 340 280"
              stroke={NODE_COLORS.flask.stroke} strokeWidth="2" />

            {/* Flask → Parser */}
            <path data-draw d="M 470 275 L 530 275 L 530 152 L 590 152"
              stroke={NODE_COLORS.parser.stroke} strokeWidth="1.5" />

            {/* Flask → Analyzer */}
            <path data-draw d="M 470 280 L 590 280"
              stroke={NODE_COLORS.analyzer.stroke} strokeWidth="1.5" />

            {/* Flask → Catalog */}
            <path data-draw d="M 470 285 L 530 285 L 530 408 L 590 408"
              stroke={NODE_COLORS.catalog.stroke} strokeWidth="1.5" />

            {/* Parser → Claude */}
            <path data-draw d="M 720 152 L 775 152 L 775 280 L 840 280"
              stroke={NODE_COLORS.claude.stroke} strokeWidth="1.5" />

            {/* Analyzer → Claude */}
            <path data-draw d="M 720 280 L 840 280"
              stroke={NODE_COLORS.claude.stroke} strokeWidth="1.5" />

            {/* Catalog → Claude */}
            <path data-draw d="M 720 408 L 775 408 L 775 310 L 840 310"
              stroke={NODE_COLORS.claude.stroke} strokeWidth="1.5" />

            {/* Return Path: Claude → Flask (JSON) */}
            <path data-draw d="M 840 300 Q 650 530 400 320"
              stroke={NODE_COLORS.json.stroke} strokeWidth="2" strokeDasharray="7 4" />

            {/* JSON label */}
            <text x="614" y="468" textAnchor="middle"
              style={{ fontSize: 10, fontFamily: "monospace", fill: NODE_COLORS.json.label }}>
              ⚡ Structured JSON Output
            </text>

            {/* Arrow heads (static, visible after paths draw) */}
            <polygon points="340,275 328,270 328,280" fill={NODE_COLORS.flask.stroke} />
            <polygon points="590,152 578,147 578,157" fill={NODE_COLORS.parser.stroke} />
            <polygon points="590,280 578,275 578,285" fill={NODE_COLORS.analyzer.stroke} />
            <polygon points="590,408 578,403 578,413" fill={NODE_COLORS.catalog.stroke} />
            <polygon points="840,280 828,274 828,286" fill={NODE_COLORS.claude.stroke} />
          </svg>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap justify-center gap-6 mt-8">
          {[
            { label: "Browser",  color: NODE_COLORS.browser.stroke },
            { label: "Flask API", color: NODE_COLORS.flask.stroke },
            { label: "Modules",  color: NODE_COLORS.parser.stroke },
            { label: "Claude AI", color: NODE_COLORS.claude.stroke },
            { label: "JSON Return", color: NODE_COLORS.json.stroke },
          ].map(({ label, color }) => (
            <div key={label} className="flex items-center gap-2 text-xs font-mono text-slate-400">
              <span className="w-3 h-3 rounded-full inline-block" style={{ background: color, boxShadow: `0 0 6px ${color}` }} />
              {label}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
