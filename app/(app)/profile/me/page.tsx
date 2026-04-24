import { redirect } from "next/navigation";
import { getUser } from "@/lib/supabase/server";
import prisma from "@/lib/prisma";

export default async function MeProfilePage() {
  const authUser = await getUser();
  if (!authUser) redirect("/signin");

  const dbUser = await prisma.user.findUnique({
    where: { id: authUser.id }
  });

  if (!dbUser) {
    redirect("/onboarding/profile");
  }

  redirect(`/profile/${dbUser.username}`);
}
