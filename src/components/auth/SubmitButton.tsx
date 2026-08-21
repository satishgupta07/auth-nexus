import type { ButtonHTMLAttributes } from "react";

type SubmitButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    pending?: boolean;
};

export function SubmitButton({
    pending,
    children,
    disabled,
    className,
    ...props
}: SubmitButtonProps) {
    return (
        <button
            type="submit"
            disabled={disabled || pending}
            className={`flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-brand-violet via-brand-magenta to-brand-cyan px-4 py-2.5 text-sm font-semibold text-zinc-950 transition-opacity disabled:cursor-not-allowed disabled:opacity-50 ${className ?? ""}`}
            {...props}
        >
            {pending && (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-950/40 border-t-zinc-950" />
            )}
            {children}
        </button>
    );
}
