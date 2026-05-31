import { Agent, fetch as undiciFetch } from "undici";

function shouldUseInsecureTls(): boolean {
  return (
    process.env.AI_INSECURE_TLS === "1" ||
    process.env.NODE_TLS_REJECT_UNAUTHORIZED === "0" ||
    (process.platform === "win32" && process.env.NODE_ENV !== "production")
  );
}

/** Node fetch on Windows dev often fails SSL (antivirus/proxy). Auto-bypass locally. */
export function getAiFetch(): typeof fetch {
  if (!shouldUseInsecureTls()) return fetch;

  const dispatcher = new Agent({ connect: { rejectUnauthorized: false } });
  return ((url: RequestInfo | URL, init?: RequestInit) =>
    undiciFetch(url as string, {
      ...(init as Record<string, unknown>),
      dispatcher,
    }) as unknown as Promise<Response>) as typeof fetch;
}
