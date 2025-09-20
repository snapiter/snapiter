import QueryProvider from "@/components/QueryProvider";
import "./dashboard.css";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <QueryProvider>
            {children}
        </QueryProvider>
    );
}