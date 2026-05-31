export type ApiError = { code: string; message: string };

export async function apiCall<T>(
  fn: () => T | Promise<T>,
  options?: { delayMs?: number; errorRate?: number }
): Promise<T> {
  const delay = options?.delayMs ?? 300;
  await new Promise((r) => setTimeout(r, delay));
  if (options?.errorRate && Math.random() < options.errorRate) {
    throw { code: "NETWORK_ERROR", message: "Connection failed" } satisfies ApiError;
  }
  return fn();
}
