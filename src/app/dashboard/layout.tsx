import QueryProvider from "@/components/QueryProvider";
import "./dashboard.css";
import EnvProvider from "@/utils/env/EnvProvider";
import getEnv from "@/utils/env/getEnv";

export default function Layout({ children }: { children: React.ReactNode }) {
    const env = getEnv();
    return (
        <EnvProvider value={env}>
            <QueryProvider>
                {children}
            </QueryProvider>
        </EnvProvider>
    );
}