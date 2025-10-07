"use client";

import React, { createContext } from "react";

export const EnvContext = createContext<Record<string, string | undefined>>({});

export default function EnvProvider({ children, value }: { children: React.ReactNode, value: Record<string, string | undefined> }) {
    return (
        <EnvContext.Provider value={value} >
            {children}
        </EnvContext.Provider>
    )
}