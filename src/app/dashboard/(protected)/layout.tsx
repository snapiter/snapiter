import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../../globals.css";
import Header from "@/components/dashboard/Header";
import Footer from "@/components/dashboard/Footer";
import LoadingBar from "@/components/dashboard/LoadingBar";
import ErrorBox from "@/components/dashboard/ErrorBox";
import { Provider } from "jotai";

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
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}
      >
      <Provider>
        <Header />
        <LoadingBar />
        <ErrorBox />
        <main className="container mx-auto px-4 max-w-7xl relative py-4 flex-grow">
          {children}
        </main>
        <Footer />
        </Provider>
      </body>
    </html>
  );
}
