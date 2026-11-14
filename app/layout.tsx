import type {Metadata} from 'next';
import { Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: 'Microorganisms in Aquatic Environments | 3D Interactive Simulation',
  description: '15-scene interactive 3D WebGL educational simulation exploring aquatic microbiology, vertical zonation, physicochemical gradients, and biogeochemical cycles.',
  applicationName: 'AquaMicrobe 3D',
  generator: 'Next.js',
  authors: [{name: 'Mahin Muhammad Mazumder'}],
  keywords: ['aquatic microbiology', 'WebGL', 'Three.js', 'biogeochemical cycles', 'education'],
  metadataBase: new URL('https://mahin-muhammad-mazumder.github.io/microorganisms-in-aquatic-environments/'),
  openGraph: {
    title: 'Microorganisms in Aquatic Environments | 3D Interactive Simulation',
    description: '15-scene interactive 3D WebGL educational simulation exploring aquatic microbiology, vertical zonation, physicochemical gradients, and biogeochemical cycles.',
    type: 'website',
    url: 'https://mahin-muhammad-mazumder.github.io/microorganisms-in-aquatic-environments/',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Microorganisms in Aquatic Environments | 3D Interactive Simulation',
    description: '15-scene interactive 3D WebGL educational simulation exploring aquatic microbiology, vertical zonation, physicochemical gradients, and biogeochemical cycles.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={`${plusJakarta.variable} ${jetbrainsMono.variable} dark`}>
      <body className="bg-[#050d1a] text-slate-100 antialiased overflow-hidden select-none" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
