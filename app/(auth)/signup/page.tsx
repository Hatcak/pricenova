import { AuthScreen } from "@/components/auth/auth-screen";
import { getAuthProviders } from "@/lib/supabase/auth-settings";

export default async function SignupPage() {
  const providers = await getAuthProviders();
  return <AuthScreen mode="signup" providers={providers} />;
}
