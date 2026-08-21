import axios from "axios";

// Every /api/auth/* route fails with { success: false, error: { message } } -
// pull that out, falling back to a generic message for network errors etc.
export function extractErrorMessage(error: unknown, fallback: string): string {
    if (axios.isAxiosError(error)) {
        return error.response?.data?.error?.message ?? fallback;
    }
    return fallback;
}
