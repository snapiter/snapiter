import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../../globals.css";
import "../dashboard.css";
import { ENV_PREFIX } from "@/utils/env/envprefix";
import Script from "next/script";
import getEnv from "@/utils/env/getEnv";
import EnvProvider from "@/utils/env/EnvProvider";

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
  const env = getEnv();
  return (
    <html lang="en">
      <head>
        <Script
          id="runtimeEnv"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `window.${ENV_PREFIX}=${JSON.stringify(env)};`,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <EnvProvider value={env}>
          <main>{children}</main>
        </EnvProvider>
      </body>
    </html>
  );
}
