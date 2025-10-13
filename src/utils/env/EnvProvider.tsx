"use client";

import type React from "react";
import { createContext } from "react";
import { DEFAULT_ENV, type EnvConfig } from "./envprefix";

export const EnvContext = createContext<EnvConfig>(DEFAULT_ENV);

export default function EnvProvider({
  children,
  value,
}: {
  children: React.ReactNode;
  value: EnvConfig;
}) {
  return <EnvContext.Provider value={value}>{children}</EnvContext.Provider>;
}
