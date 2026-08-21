"use client";

import { forwardRef, useState, type InputHTMLAttributes } from "react";

import { FieldError } from "./FieldError";

type PasswordInputProps = InputHTMLAttributes<HTMLInputElement> & {
    label: string;
    error?: string;
};

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
    function PasswordInput({ label, error, id, className, ...props }, ref) {
        const [visible, setVisible] = useState(false);
        const inputId = id ?? props.name;

        return (
            <div className="flex flex-col gap-1.5">
                <label htmlFor={inputId} className="text-sm font-medium text-zinc-300">
                    {label}
                </label>
                <div className="relative">
                    <input
                        ref={ref}
                        id={inputId}
                        type={visible ? "text" : "password"}
                        className={`${"rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-zinc-50 placeholder:text-zinc-500 outline-none transition-colors focus:border-brand-violet"} w-full pr-10 ${className ?? ""}`}
                        {...props}
                    />
                    <button
                        type="button"
                        onClick={() => setVisible((v) => !v)}
                        className="absolute inset-y-0 right-0 flex items-center px-3 text-xs text-zinc-400 hover:text-zinc-200"
                        aria-label={visible ? "Hide password" : "Show password"}
                    >
                        {visible ? "Hide" : "Show"}
                    </button>
                </div>
                <FieldError>{error}</FieldError>
            </div>
        );
    }
);
