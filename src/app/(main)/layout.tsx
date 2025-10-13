import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { Provider } from "jotai";
import Script from "next/script";
import GlobalLightbox from "@/components/GlobalLightbox";
import QueryProvider from "@/components/QueryProvider";
import EnvProvider from "@/utils/env/EnvProvider";
import { ENV_PREFIX } from "@/utils/env/envprefix";
import getEnv from "@/utils/env/getEnv";

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
        <QueryProvider>
          <Provider>
            <EnvProvider value={env}>
              {children}
              <GlobalLightbox />
            </EnvProvider>
          </Provider>
        </QueryProvider>
      </body>
    </html>
  );
}
