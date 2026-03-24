"use client";

import React from "react";
import { Github, Linkedin } from "lucide-react";

export default function Team() {
  const team = [
    { name: "BISWANATH DASH", role: "AI & Backend Architecture", college: "IISc", class: "img-team-alice" },
    { name: "BINDUSMITA CHOUDRY", role: "Frontend UI/UX", college: "IISc", class: "img-team-bob" }
  ];

  return (
    <section id="team" className="py-24 bg-bg dark:bg-bg-dark border-t border-ruler">
      <div className="container mx-auto px-4 max-w-5xl text-center">
        <h2 className="text-sm font-bold uppercase tracking-widest text-ink/70 mb-4 font-mono">
          Built in 48 Hours · BY THE CODERS
        </h2>
        <h3 className="text-4xl md:text-5xl font-display font-bold mb-16">
          The <span className="text-accent underline decoration-ruler underline-offset-4">Engineers</span>
        </h3>

        <div className="flex flex-wrap justify-center gap-8 text-left">
          {team.map((member, i) => (
            <div key={i} className="group hover-card w-64 h-80 relative perspective-1000 cursor-pointer">
              <div className="w-full h-full relative preserve-3d transition-transform duration-500 group-hover:rotate-y-180">
                
                {/* Front */}
                <div className="absolute w-full h-full backface-hidden bg-white/50 dark:bg-black/50 border border-ruler rounded-2xl p-6 flex flex-col items-center justify-center">
                  <div className={`w-32 h-32 rounded-full mb-6 items-center justify-center text-xs font-mono text-ink-muted bg-gray-200 dark:bg-gray-800 ${member.class}`}>
                    .{member.class}
                  </div>
                  <h4 className="font-display font-bold text-xl mb-1">{member.name}</h4>
                  <div className="text-ink-muted text-sm text-center mb-2">{member.role}</div>
                  <div className="text-xs font-mono uppercase bg-ruler/20 px-2 py-1 object-cover">{member.college}</div>
                </div>

                {/* Back */}
                <div className="absolute w-full h-full backface-hidden rotate-y-180 bg-ink text-bg border border-ruler rounded-2xl p-6 flex flex-col items-center justify-center gap-4">
                  <h4 className="font-display font-bold text-xl mb-4 text-bg">{member.name}</h4>
                  <a href="#" className="flex items-center gap-2 hover:text-accent transition-colors w-full justify-center border border-white/20 py-2 rounded">
                    <Linkedin className="w-5 h-5"/> LinkedIn
                  </a>
                  <a href="#" className="flex items-center gap-2 hover:text-accent transition-colors w-full justify-center border border-white/20 py-2 rounded">
                    <Github className="w-5 h-5"/> GitHub
                  </a>
                </div>

              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
