export default function Main({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
        <main className="flex-1 px-2">
            {children}
        </main>
    );
}