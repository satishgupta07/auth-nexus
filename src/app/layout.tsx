import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AuthNexus",
  description: "Authentication done right.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col relative overflow-x-hidden">
        <div
          aria-hidden
          className="pointer-events-none fixed inset-0 -z-10 opacity-40 blur-3xl"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, var(--color-brand-violet), transparent 40%), radial-gradient(circle at 80% 30%, var(--color-brand-cyan), transparent 40%), radial-gradient(circle at 50% 80%, var(--color-brand-magenta), transparent 40%)",
          }}
        />
        {children}
        <Toaster
          position="top-right"
          toastOptions={{ style: { background: "#13131a", color: "#f4f4f5" } }}
        />
      </body>
    </html>
  );
}
