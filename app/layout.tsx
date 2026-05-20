import { ReactNode } from 'react';
import './globals.css';

const SITE_NAME = 'The Drinking Cog';

export const metadata = {
  metadataBase: new URL('https://thedrinkingcog.vercel.app'),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`
  },
  robots: {
    follow: true,
    index: true
  }
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
