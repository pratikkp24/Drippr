import { redirect } from "next/navigation";
import { getUser } from "@/lib/supabase/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function MeProfilePage() {
  let authUser;
  try {
    authUser = await getUser();
  } catch (err) {
    console.error("[/profile/me] getUser failed:", err);
    redirect("/signin?error=" + encodeURIComponent("Couldn’t load your session."));
  }
  if (!authUser) redirect("/signin");

  let dbUser;
  try {
    dbUser = await prisma.user.findUnique({
      where: { id: authUser.id },
      select: { username: true }
    });
  } catch (err) {
    console.error("[/profile/me] prisma lookup failed:", err);
    redirect("/signin?error=" + encodeURIComponent("Couldn’t load your account."));
  }

  if (!dbUser) redirect("/onboarding/profile");
  redirect(`/profile/${dbUser.username}`);
}
