import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { Provider } from "jotai";
import QueryProvider from "@/components/QueryProvider";
import GlobalLightbox from "@/components/GlobalLightbox";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SnapIter",
  description: "Snap your Iter",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <QueryProvider>
          <Provider>
            {children}
            <GlobalLightbox />
          </Provider>
        </QueryProvider>
      </body>
    </html>
  );
}
