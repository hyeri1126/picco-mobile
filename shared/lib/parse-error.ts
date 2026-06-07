import { AxiosError } from 'axios';

interface ApiErrorBody {
  success: false;
  error: { code: string; message: string };
}

export function getErrorCode(error: unknown): string | null {
  if (error instanceof AxiosError) {
    const body = error.response?.data as ApiErrorBody | undefined;
    return body?.error?.code ?? null;
  }
  return null;
}

export function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof AxiosError) {
    const body = error.response?.data as ApiErrorBody | undefined;
    return body?.error?.message ?? fallback;
  }
  return fallback;
}
