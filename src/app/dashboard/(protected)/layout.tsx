import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../../globals.css";
import Header from "@/components/dashboard/layout/Header";
import Footer from "@/components/dashboard/layout/Footer";
import LoadingBar from "@/components/dashboard/layout/LoadingBar";
import ErrorBox from "@/components/dashboard/layout/ErrorBox";
import { Provider } from "jotai";
import Menu from "@/components/dashboard/layout/Menu";

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
          <div className="flex flex-1 relative">
            {children}
          </div>
          <Footer />
        </Provider>
      </body>
    </html>
  );
}
