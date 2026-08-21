import { forwardRef, type InputHTMLAttributes } from "react";

import { FieldError } from "./FieldError";

type TextInputProps = InputHTMLAttributes<HTMLInputElement> & {
    label: string;
    error?: string;
};

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
    function TextInput({ label, error, id, className, ...props }, ref) {
        const inputId = id ?? props.name;
        return (
            <div className="flex flex-col gap-1.5">
                <label htmlFor={inputId} className="text-sm font-medium text-zinc-300">
                    {label}
                </label>
                <input
                    ref={ref}
                    id={inputId}
                    className={`${"rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-zinc-50 placeholder:text-zinc-500 outline-none transition-colors focus:border-brand-violet"} ${className ?? ""}`}
                    {...props}
                />
                <FieldError>{error}</FieldError>
            </div>
        );
    }
);
