"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function LoadingScreen() {
  const [isVisible, setIsVisible] = useState(true);
  const [text, setText] = useState("");
  const fullText = "Initializing SkillPath Engine_";
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const hasSeen = sessionStorage.getItem("skillpath_loading_seen");
    if (hasSeen) {
      setIsVisible(false);
      return;
    }

    let i = 0;
    const typingInterval = setInterval(() => {
      setText(fullText.slice(0, i));
      i++;
      if (i > fullText.length) clearInterval(typingInterval);
    }, 50);

    const start = Date.now();
    const duration = 2500;
    
    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - start;
      const newProgress = Math.min((elapsed / duration) * 100, 100);
      setProgress(newProgress);
      
      if (newProgress >= 100) {
        clearInterval(progressInterval);
        setTimeout(() => {
          setIsVisible(false);
          sessionStorage.setItem("skillpath_loading_seen", "true");
        }, 300);
      }
    }, 16);

    return () => {
      clearInterval(typingInterval);
      clearInterval(progressInterval);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="loading-screen"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black text-green-500 font-mono tracking-wider"
      >
        <div className="w-full max-w-md px-4">
          <div className="text-sm mb-4 h-6 uppercase">{text}</div>
          <div className="h-1 w-full bg-gray-900 overflow-hidden relative border border-gray-800">
            <motion.div 
              className="h-full bg-green-500"
              style={{ width: `${progress}%` }}
              layout
            />
          </div>
          <div className="text-xs mt-2 text-right opacity-50">{Math.floor(progress)}%</div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
