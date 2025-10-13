/* biome-ignore lint: Needed for environment */

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../../globals.css";
import { Footer } from "@snapiter/designsystem";
import { Provider } from "jotai";
import ErrorBox from "@/components/dashboard/layout/ErrorBox";
import Header from "@/components/dashboard/layout/Header";
import LoadingBar from "@/components/dashboard/layout/LoadingBar";
import QueryProvider from "@/components/QueryProvider";
import EnvProvider from "@/utils/env/EnvProvider";
import getEnv from "@/utils/env/getEnv";
import "../dashboard.css";
import Script from "next/script";
import { ENV_PREFIX } from "@/utils/env/envprefix";

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
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}
      >
        <EnvProvider value={env}>
          <QueryProvider>
            <Provider>
              <Header />
              <LoadingBar />
              <ErrorBox />
              <div className="flex flex-1 relative">{children}</div>
              <Footer withMenu={false} />
            </Provider>
          </QueryProvider>
        </EnvProvider>
      </body>
    </html>
  );
}
