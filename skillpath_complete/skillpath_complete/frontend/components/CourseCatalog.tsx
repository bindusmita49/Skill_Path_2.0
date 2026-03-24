"use client";

import React, { useState } from "react";
import { BookOpen, Clock, Activity } from "lucide-react";

export default function CourseCatalog() {
  const [activeFilter, setActiveFilter] = useState("All");

  const filters = ["All", "Technical", "Business", "Operational", "Product"];

  const courses = [
    { title: "Advanced React Patterns", domain: "Technical", level: "Senior", duration: "12h", rule: "Missing modern component architecture" },
    { title: "B2B Sales Psychology", domain: "Business", level: "Mid", duration: "8h", rule: "New to enterprise client acquisition" },
    { title: "Agile Masterclass", domain: "Operational", level: "All", duration: "4h", rule: "No prior experience in sprint planning" },
    { title: "System Design for APIs", domain: "Technical", level: "Senior", duration: "16h", rule: "Transitioning to backend architecture" },
    { title: "Product Analytics 101", domain: "Product", level: "Junior", duration: "6h", rule: "Lacks data-driven decision making" },
    { title: "Cloud Cost Optimization", domain: "Operational", level: "Mid", duration: "5h", rule: "Handling AWS/GCP budgets" },
  ];

  const filtered = activeFilter === "All" ? courses : courses.filter(c => c.domain === activeFilter);

  return (
    <section className="py-24 bg-bg dark:bg-bg-dark border-t border-ruler">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-8">
          <div>
            <h2 className="text-4xl font-display font-bold mb-4">
              35 Verified Courses.<br/><span className="text-ink-muted">Zero Hallucination.</span>
            </h2>
            <p className="max-w-xl text-ink-muted">
              Pre-approved micro-modules. The AI only selects what's necessary, ignoring the rest.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {filters.map(f => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-4 py-2 rounded-full border text-sm font-bold transition-all ${
                  activeFilter === f 
                    ? "bg-ink text-bg border-ink dark:bg-white dark:text-black dark:border-white" 
                    : "border-ruler text-ink-muted hover:border-ink hover:text-ink"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((course, i) => (
            <div 
              key={i} 
              className="group hover-card p-6 border border-ruler bg-white/50 dark:bg-black/50 backdrop-blur rounded-xl relative overflow-hidden"
            >
              <div className="flex justify-between items-start mb-4">
                <span className="px-2 py-1 bg-accent/10 text-accent text-xs font-bold uppercase rounded">{course.domain}</span>
                <span className="flex items-center gap-1 text-xs text-ink-muted font-mono"><Clock className="w-3 h-3"/> {course.duration}</span>
              </div>
              
              <h3 className="text-xl font-bold font-display mb-2">{course.title}</h3>
              
              <div className="flex items-center gap-2 mb-6">
                <Activity className="w-4 h-4 text-ink-muted" />
                <span className="text-xs text-ink-muted uppercase">{course.level} Level</span>
              </div>

              {/* Hover Reveal Block */}
              <div className="absolute inset-0 bg-ink dark:bg-white text-bg dark:text-ink p-6 translate-y-[101%] group-hover:translate-y-0 transition-transform duration-300 ease-out flex flex-col justify-center">
                <div className="text-xs font-mono uppercase opacity-50 mb-2">Rule Engine Status</div>
                <div className="font-bold text-lg leading-tight mb-2">Included in pathway when:</div>
                <div className="text-sm opacity-80 border-l-2 border-accent pl-3">{course.rule}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
