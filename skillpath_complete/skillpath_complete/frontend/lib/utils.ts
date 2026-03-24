import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// GSAP text scramble effect utility
export const scrambleText = (el: HTMLElement, newText: string) => {
  const chars = '!<>-_\\\\/[]{}—=+*^?#________';
  let iter = 0;
  const original = el.innerText;
  
  const interval = setInterval(() => {
    el.innerText = original
      .split('')
      .map((char, index) => {
        if (index < iter) {
          return newText[index] || '';
        }
        return chars[Math.floor(Math.random() * chars.length)];
      })
      .join('');
    
    if (iter >= newText.length) {
      clearInterval(interval);
      el.innerText = newText;
    }
    iter += 1 / 3;
  }, 30);
};
