"use client";

import React, { createContext } from "react";
import { EnvConfig, DEFAULT_ENV } from "./envprefix";


export const EnvContext = createContext<EnvConfig>(DEFAULT_ENV);

export default function EnvProvider({ children, value }: { children: React.ReactNode, value: EnvConfig }) {
    return (
        <EnvContext.Provider value={value} >
            {children}
        </EnvContext.Provider>
    )
}