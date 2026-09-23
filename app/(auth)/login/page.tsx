import { AuthScreen } from "@/components/auth/auth-screen";
import { getAuthProviders } from "@/lib/supabase/auth-settings";

export default async function LoginPage() {
  const providers = await getAuthProviders();
  return <AuthScreen mode="login" providers={providers} />;
}
