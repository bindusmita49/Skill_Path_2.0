import type { Metadata } from 'next';
import { Syne, DM_Sans, Permanent_Marker } from 'next/font/google';
import './globals.css';
import LoadingScreen from '@/components/LoadingScreen';
import { ThemeProvider } from '@/components/ThemeProvider';

const syne = Syne({ 
  subsets: ['latin'], 
  weight: ['400', '600', '800'],
  variable: '--font-display',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-body',
});

const permanentMarker = Permanent_Marker({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-sketch',
});

export const metadata: Metadata = {
  title: 'SkillPath — AI Onboarding Engine | CODERS',
  description: 'AI-Powered Adaptive Onboarding Engine. Built in 48 hours.',
  openGraph: {
    title: 'SkillPath — AI Onboarding Engine | CODERS',
    description: 'AI-Powered Adaptive Onboarding Engine. Built in 48 hours.',
    images: [{
      url: '/images/og-image.jpeg',
      width: 1200,
      height: 630,
    }],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${syne.variable} ${dmSans.variable} ${permanentMarker.variable} font-body bg-blueprint`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <LoadingScreen />
          <div className="fixed top-0 left-0 w-full h-1 bg-gradient-to-r from-accent to-accent-2 origin-left z-50 transform scale-x-0" id="global-progress-bar"></div>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
