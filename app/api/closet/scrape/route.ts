import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const { url } = await req.json();

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Microlink scraping
    const microlinkUrl = `https://api.microlink.io?url=${encodeURIComponent(url)}&palette=true&audio=false&video=false`;
    const res = await fetch(microlinkUrl);
    
    if (!res.ok) {
      throw new Error("Failed to fetch metadata from Microlink");
    }

    const data = await res.json();
    const metadata = data.data;

    // Map Microlink response to our expected piece data
    return NextResponse.json({
      title: metadata.title,
      brand: metadata.publisher || new URL(url).hostname.replace("www.", "").split(".")[0],
      image: metadata.image?.url || metadata.logo?.url,
      price: undefined, // Microlink raw data doesn't always have price in a standard way, would need more sophisticated parsing
    });
  } catch (error: any) {
    console.error("Scrape error:", error);
    return NextResponse.json({ error: error.message || "Failed to scrape product" }, { status: 500 });
  }
}
