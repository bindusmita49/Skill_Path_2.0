"use client";

import React from "react";
import Link from 'next/link';
import { Twitter, Github, Linkedin, Mail } from 'lucide-react';

export default function Footer() {
  const marqueeText = "SKILLPATH✦ AI-POWERED◆ ZERO-REDUNDANCY★ ONBOARDING● ADAPTIVE● ".repeat(5);

  return (
    <footer className="bg-bg dark:bg-bg-dark border-t border-ruler overflow-hidden relative">
      
      {/* Infinite Marquee */}
      <div className="w-full border-b border-ruler py-3 flex bg-ink text-bg overflow-hidden whitespace-nowrap group relative z-10">
        <div className="animate-[scroll_20s_linear_infinite] group-hover:[animation-play-state:paused] flex gap-8 whitespace-nowrap font-display font-bold uppercase tracking-widest text-lg">
          {marqueeText}
        </div>
        <div className="absolute top-0 left-0 animate-[scroll_20s_linear_infinite] group-hover:[animation-play-state:paused] flex gap-8 whitespace-nowrap font-display font-bold uppercase tracking-widest text-lg ml-[100%]">
          {marqueeText}
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 py-20 max-w-7xl relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          <div className="col-span-2 lg:col-span-2 flex flex-col gap-6 pr-8">
            <Link href="/" className="font-display font-bold text-2xl tracking-tight uppercase flex items-center gap-2 w-max">
              <div className="w-6 h-6 bg-accent rounded-sm" />
              SkillPath<span className="text-accent">2.0</span>
            </Link>
            <p className="text-ink-muted leading-relaxed max-w-sm">
              India's Most Intelligent Onboarding Engine. Eliminating format fatigue and onboarding redundancy through semantic AI analysis.
            </p>
            <div className="flex gap-4 mt-auto">
              <a href="#" aria-label="Twitter"><Twitter className="w-5 h-5 text-ink-muted hover:text-accent transition-colors"/></a>
              <a href="#" aria-label="GitHub"><Github className="w-5 h-5 text-ink-muted hover:text-accent transition-colors"/></a>
              <a href="#" aria-label="LinkedIn"><Linkedin className="w-5 h-5 text-ink-muted hover:text-accent transition-colors"/></a>
              <a href="#" aria-label="Email"><Mail className="w-5 h-5 text-ink-muted hover:text-accent transition-colors"/></a>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h4 className="font-bold uppercase tracking-widest text-xs mb-2 font-mono">Product</h4>
            {['Features', 'API Docs', 'Integrations', 'Pricing', 'Changelog'].map(l => <a key={l} href="#" className="text-sm text-ink-muted hover:text-accent transition-colors link-underline w-max">{l}</a>)}
          </div>

          <div className="flex flex-col gap-4">
            <h4 className="font-bold uppercase tracking-widest text-xs mb-2 font-mono">Team</h4>
            {['About Us', 'Careers', 'Blog', 'Contact'].map(l => <a key={l} href="#" className="text-sm text-ink-muted hover:text-accent transition-colors link-underline w-max">{l}</a>)}
          </div>

          <div className="flex flex-col gap-4">
            <h4 className="font-bold uppercase tracking-widest text-xs mb-2 font-mono">Resources</h4>
            {['Playbook', 'Skill Graph API', 'Support', 'Terms of Service', 'Privacy'].map(l => <a key={l} href="#" className="text-sm text-ink-muted hover:text-accent transition-colors link-underline w-max">{l}</a>)}
          </div>
        </div>

        <div className="pt-8 border-t border-ruler flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-mono text-ink-muted">
          <div>Built with <span className="text-red-500">❤️</span> BY THE CODERS</div>
          <div>© {new Date().getFullYear()} SkillPath Team · MIT License</div>
        </div>
      </div>
    </footer>
  );
}
