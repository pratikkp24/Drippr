import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { getUser } from "@/lib/supabase/server";

export default async function MyDropsPage() {
  const user = await getUser();
  if (!user) redirect("/signin");

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { username: true }
  });

  if (!dbUser) redirect("/onboarding/profile");
  redirect(`/profile/${dbUser.username}`);
}
