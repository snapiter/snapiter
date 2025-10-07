"use client";

import EnvProvider from "./EnvProvider";

export default function EnvProviderWrapper({
  initialEnv,
  children,
}: {
  initialEnv: Record<string, any>;
  children: React.ReactNode;
}) {
  return <EnvProvider value={initialEnv}>{children}</EnvProvider>;
}
