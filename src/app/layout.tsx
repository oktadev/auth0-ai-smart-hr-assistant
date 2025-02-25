import './globals.css';
import { Roboto_Mono, Inter } from 'next/font/google';
import Image from 'next/image';
import { Github } from 'lucide-react';

import { ActiveLink } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Toaster } from '@/components/ui/sonner';
import React from 'react';
const robotoMono = Roboto_Mono({ weight: '400', subsets: ['latin'] });
const publicSans = Inter({ weight: '400', subsets: ['latin'] });

const TITLE = 'Auth0 Assistant0: An Auth0 + LangChain + Next.js Template';
const DESCRIPTION = 'Starter template showing how to use Auth0 in LangChain + Next.js projects.';

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>{TITLE}</title>
        <link rel="shortcut icon" type="image/svg+xml" href="/images/favicon.png" />
        <meta name="description" content={DESCRIPTION} />
        <meta property="og:title" content={TITLE} />
        <meta property="og:description" content={DESCRIPTION} />
        <meta property="og:image" content="/images/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={TITLE} />
        <meta name="twitter:description" content={DESCRIPTION} />
        <meta name="twitter:image" content="/images/og-image.png" />
      </head>
      <body className={publicSans.className}>
        <div className="bg-secondary grid grid-rows-[auto,1fr] h-[100dvh]">
          <div className="grid grid-cols-[1fr,auto] gap-2 p-4 bg-black/25">
            <div className="flex gap-4 flex-col md:flex-row md:items-center">
              <a
                href="https://a0.to/ai-event"
                rel="noopener noreferrer"
                target="_blank"
                className="flex items-center gap-2 px-4"
              >
                <Image src="/images/auth0-ai-logo.svg" alt="Auth0 AI Logo" className="h-8" width={143} height={32} />
              </a>
              <span className={`${robotoMono.className} text-white text-2xl`}>SmartHR</span>
              <nav className="flex gap-1 flex-col md:flex-row">
                <ActiveLink href="/">Chat</ActiveLink>
              </nav>
            </div>
            <div className="flex justify-center">
              <Button asChild variant="header" size="default">
                <a href="https://github.com/oktadev/auth0-ai-smart-hr-assistant" target="_blank">
                  <Github className="size-3" />
                  <span>Open in GitHub</span>
                </a>
              </Button>
            </div>
          </div>
          <div className="gradient-up bg-gradient-to-b from-white/10 to-white/0 relative grid border-input border-b-0">
            <div className="absolute inset-0">{children}</div>
          </div>
        </div>
        <Toaster />
      </body>
    </html>
  );
}
