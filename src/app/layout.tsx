import type { Metadata } from "next";

import "./globals.css";
import { geistMono, geistSans } from "@/config/fonts";
import { Providers } from "@/components";



export const metadata: Metadata = {
  title: {
    template: '%s | UNIK',
    default: 'UNIK — Tienda',
  },
  description: 'UNIK — productos importados para Colombia.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-[#111111]`}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
