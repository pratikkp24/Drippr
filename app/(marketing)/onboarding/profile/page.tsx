import { redirect } from "next/navigation";
import { getUser } from "@/lib/supabase/server";
import prisma from "@/lib/prisma";
import OnboardingProfileForm from "./profile-form";

export default async function OnboardingProfilePage() {
  const user = await getUser();
  if (!user) redirect("/signin");

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id }
  });

  // If user already has a username, skip onboarding profile and go to home or next step
  if (dbUser?.username) {
    redirect("/home");
  }

  return <OnboardingProfileForm />;
}
