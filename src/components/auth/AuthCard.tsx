export function AuthCard({
    title,
    subtitle,
    children,
}: {
    title: string;
    subtitle?: string;
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen items-center justify-center px-4 py-12">
            <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">
                <h1 className="text-2xl font-semibold text-zinc-50">{title}</h1>
                {subtitle && <p className="mt-1 text-sm text-zinc-400">{subtitle}</p>}
                <div className="mt-6">{children}</div>
            </div>
        </div>
    );
}
