export function FieldError({ children }: { children?: string }) {
    if (!children) return null;
    return <p className="text-xs text-red-400">{children}</p>;
}
