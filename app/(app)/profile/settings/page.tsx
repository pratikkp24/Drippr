"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ArrowLeft, Camera, Settings as SettingsIcon, User, Globe, FileText, Sparkles } from "lucide-react";
import Link from "next/link";

export default function SettingsPage() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    displayName: "",
    username: "",
    bio: "",
    styleSignature: "",
    location: "",
    avatarUrl: ""
  });

  useEffect(() => {
    async function fetchUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/signin");
        return;
      }

      const res = await fetch(`/api/user/me`);
      if (res.ok) {
        const data = await res.json();
        setFormData({
          displayName: data.displayName || "",
          username: data.username || "",
          bio: data.bio || "",
          styleSignature: data.styleSignature || "",
          location: data.location || "",
          avatarUrl: data.avatarUrl || ""
        });
      }
      setLoading(false);
    }
    fetchUser();
  }, [supabase, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch("/api/user/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error || "Failed to update profile");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg">
      <div className="max-w-[600px] mx-auto px-lg py-xl">
        <header className="flex items-center mb-2xl">
          <button 
            onClick={() => router.back()}
            className="w-10 h-10 rounded-full flex items-center justify-center text-text-3 hover:text-primary hover:bg-surface transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="fraunces text-[32px] text-text-1 ml-md">Settings</h1>
        </header>

        <form onSubmit={handleSubmit} className="space-y-xl">
          {/* Avatar Section */}
          <section className="flex flex-col items-center p-xl bg-surface border border-border rounded-2xl">
            <div className="relative w-24 h-24 rounded-full overflow-hidden mb-md border-2 border-border shadow-sm">
              <img
                src={formData.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.displayName || "User")}&bg=E6DDCF&color=1F3D2B&size=200`}
                alt="Profile"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
                <Camera className="w-6 h-6 text-white" />
              </div>
            </div>
            <p className="text-[13px] font-sans text-text-3">Tap to change photo</p>
          </section>

          {/* Profile Details */}
          <div className="space-y-lg">
            <h2 className="font-sans font-medium text-[14px] text-text-3 uppercase tracking-widest">Profile Details</h2>
            
            <div className="space-y-md">
              <div>
                <label className="block text-[13px] font-sans font-medium text-text-2 mb-xs flex items-center">
                  <User className="w-4 h-4 mr-xs" /> Display Name
                </label>
                <input
                  type="text"
                  className="input-field w-full h-[48px] bg-surface border border-border rounded-md px-md text-[15px] text-text-1 focus:outline-none focus:border-primary transition-colors"
                  value={formData.displayName}
                  onChange={(e) => setFormData(prev => ({ ...prev, displayName: e.target.value }))}
                  required
                />
              </div>

              <div>
                <label className="block text-[13px] font-sans font-medium text-text-2 mb-xs flex items-center">
                  <Globe className="w-4 h-4 mr-xs" /> Username
                </label>
                <div className="relative">
                  <span className="absolute left-md top-1/2 -translate-y-1/2 text-text-3 text-[15px]">@</span>
                  <input
                    type="text"
                    className="input-field w-full h-[48px] bg-surface border border-border rounded-md pl-8 pr-md text-[15px] text-text-1 focus:outline-none focus:border-primary transition-colors"
                    value={formData.username}
                    onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value.toLowerCase() }))}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[13px] font-sans font-medium text-text-2 mb-xs flex items-center">
                  <FileText className="w-4 h-4 mr-xs" /> Bio
                </label>
                <textarea
                  className="input-field w-full h-[100px] bg-surface border border-border rounded-md p-md text-[15px] text-text-1 focus:outline-none focus:border-primary transition-colors resize-none"
                  placeholder="Tell your story..."
                  value={formData.bio}
                  onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                />
              </div>

              <div>
                <label className="block text-[13px] font-sans font-medium text-text-2 mb-xs flex items-center">
                  <Sparkles className="w-4 h-4 mr-xs" /> Style Signature
                </label>
                <input
                  type="text"
                  className="input-field w-full h-[48px] bg-surface border border-border rounded-md px-md text-[15px] text-text-1 focus:outline-none focus:border-primary transition-colors"
                  placeholder="e.g., Elevated basics with a pop of color"
                  value={formData.styleSignature}
                  onChange={(e) => setFormData(prev => ({ ...prev, styleSignature: e.target.value }))}
                />
              </div>

              <div>
                <label className="block text-[13px] font-sans font-medium text-text-2 mb-xs flex items-center">
                  <Globe className="w-4 h-4 mr-xs" /> Location
                </label>
                <input
                  type="text"
                  className="input-field w-full h-[48px] bg-surface border border-border rounded-md px-md text-[15px] text-text-1 focus:outline-none focus:border-primary transition-colors"
                  placeholder="Mumbai, India"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                />
              </div>
            </div>
          </div>

          {error && <p className="text-[13px] text-error">{error}</p>}
          {success && <p className="text-[13px] text-success">Profile updated successfully!</p>}

          <button
            type="submit"
            disabled={saving}
            className="w-full h-[54px] bg-primary text-bg font-sans font-medium text-[16px] rounded-md hover:bg-primary-hover transition-colors disabled:opacity-70"
          >
            {saving ? "Saving Changes..." : "Save Changes"}
          </button>
        </form>

        <div className="mt-2xl pt-2xl border-t border-border">
          <h2 className="font-sans font-medium text-[14px] text-text-3 uppercase tracking-widest mb-lg text-error">Account Actions</h2>
          <button 
            type="button"
            className="w-full h-[48px] bg-surface text-error border border-error/20 rounded-md font-sans font-medium text-[14px] hover:bg-error/5 transition-colors"
          >
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
}
