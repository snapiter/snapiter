"use client";

import React, { createContext } from "react";

type EnvConfig = {
    SNAPITER_RUNTIME_MAPTILER_KEY: string;
}

export const EnvContext = createContext<EnvConfig>({
    SNAPITER_RUNTIME_MAPTILER_KEY: ""
});

export default function EnvProvider({ children, value }: { children: React.ReactNode, value: EnvConfig }) {
    return (
        <EnvContext.Provider value={value} >
            {children}
        </EnvContext.Provider>
    )
}