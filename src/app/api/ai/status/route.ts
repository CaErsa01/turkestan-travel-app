import {
  getProviderModel,
  getSetupUrl,
  resolveProvider,
  GROQ_SETUP_URL,
} from "@/modules/ai/services/resolve-provider";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const provider = resolveProvider();
  const activeProvider = provider ?? "groq";

  return Response.json({
    configured: provider !== null,
    provider: activeProvider,
    model: provider ? getProviderModel(provider) : getProviderModel("groq"),
    freeTier: true,
    setupUrl: getSetupUrl(activeProvider),
    groqSetupUrl: GROQ_SETUP_URL,
    noInstall: true,
  });
}
