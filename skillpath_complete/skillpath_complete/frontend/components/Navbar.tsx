"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { scrambleText, cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const navLinks = [
  { text: 'Problem', href: '#problem' },
  { text: 'Solution', href: '#solution' },
  { text: 'How It Works', href: '#how-it-works' },
  { text: 'Team', href: '#team' },
  { text: 'Demo', href: '#demo' }
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, {
      rootMargin: "-20% 0px -80% 0px"
    });

    navLinks.forEach(link => {
      const section = document.querySelector(link.href);
      if (section) observer.observe(section);
    });

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, []);

  const handleMouseEnter = (e: React.MouseEvent<HTMLAnchorElement>, originalText: string) => {
    scrambleText(e.currentTarget as HTMLElement, originalText);
  };

  return (
    <nav className={cn(
      "fixed top-0 left-0 w-full z-40 transition-all duration-300 border-b border-transparent",
      isScrolled ? "glass-nav ruler-border" : "bg-transparent py-2"
    )}>
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex justify-between items-center h-16">
        <Link href="/" className="font-display font-bold text-xl tracking-tight uppercase flex items-center gap-2">
          <div className="w-6 h-6 bg-accent rounded-sm" />
          SkillPath<span className="text-accent">2.0</span>
        </Link>
        
        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-8 text-sm font-medium tracking-wide uppercase">
          {navLinks.map((link) => (
            <a 
              key={link.href} 
              href={link.href}
              className={cn(
                "relative link-underline py-1",
                activeSection === link.href.substring(1) ? "text-accent" : "text-ink-muted hover:text-ink"
              )}
              onMouseEnter={(e) => handleMouseEnter(e, link.text)}
            >
              {link.text}
            </a>
          ))}
          <a href="#demo" className="px-5 py-2.5 bg-ink text-bg text-sm font-bold uppercase rounded hover-card btn-primary-shimmer hover:bg-ink-muted dark:bg-bg dark:text-ink hover:text-bg">
            Get Started
          </a>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden text-ink p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-bg border-b border-ruler flex flex-col items-center py-4 space-y-4 font-display font-bold text-lg uppercase glass-nav"
          >
            {navLinks.map((link) => (
              <a 
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-ink-muted hover:text-accent w-full text-center py-2"
              >
                {link.text}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
