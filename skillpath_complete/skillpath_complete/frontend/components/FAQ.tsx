"use client";

import React, { useState } from "react";
import { Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    { q: "How is SkillPath different from standard ATS?", a: "Unlike regex-based ATS that fails on creative formatting, SkillPath uses Claude 3.5 Sonnet to semantically understand intent and extract verified skills regardless of layout." },
    { q: "Does it hallucinate non-existent skills?", a: "No. We enforce strict JSON schemas and require explicit textual evidence for every skill extracted. If the evidence is weak, it's marked as missing." },
    { q: "How are the training pathways generated?", a: "By comparing the extracted candidate profile against the target JD, we run a delta analysis and map the missing competencies to our curated micro-course catalog." },
    { q: "What's the average time saved per hire?", a: "Our beta tests show an average of 6.2 redundant courses bypassed per candidate, saving approximately 14 days of onboard training time." },
    { q: "Is the data secure?", a: "Yes. All processing is ephemeral. Resumes and generated JSON traces are not stored after the session unless explicitly requested." },
    { q: "Can we integrate this with Workday/Greenhouse?", a: "SkillPath provides a RESTful GraphQL API, enabling seamless integration with any modern ATS or HRIS system." },
    { q: "Why focus on 'Zero Redundancy'?", a: "Enterprises waste millions training engineers on skills they already acquired at previous roles. Tailored pathways eliminate this cognitive and financial drain." },
    { q: "Can I try it right now?", a: "Yes, use the Live Demo section above. Upload any PDF resume and paste a Job Description to see the engine in action." }
  ];

  return (
    <section className="py-24 bg-bg dark:bg-bg-dark border-t border-ruler relative">
      <div className="container mx-auto px-4 max-w-4xl relative z-10">
        <h2 className="text-3xl md:text-5xl font-display font-bold text-center mb-16">
          <span className="text-ink-muted">Frequently Asked</span> Questions
        </h2>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div 
              key={i} 
              className={`border border-ruler rounded bg-white/50 dark:bg-black/50 backdrop-blur transition-colors ${openIndex === i ? "border-accent dark:border-accent" : "hover:border-ink/50"}`}
            >
              <button 
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full text-left px-6 py-5 flex items-center justify-between font-bold font-display"
              >
                <span>{faq.q}</span>
                <span className={`transform transition-transform duration-300 ${openIndex === i ? "rotate-45 text-accent" : ""}`}>
                  <Plus className="w-5 h-5" />
                </span>
              </button>
              
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 text-ink-muted leading-relaxed">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
