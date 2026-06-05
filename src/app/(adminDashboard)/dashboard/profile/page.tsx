"use client";

import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import toast from "react-hot-toast";
import {
  getMyProfile,
  updateMe,
  updateMyProfile,
  uploadAvatar,
  uploadResumeFile,
  type SocialLinks,
} from "@/actions/profile/profile";
import GlobalLoading from "@/app/loading";

export default function ProfilePage() {
  const queryClient = useQueryClient();

  const { data: res, isLoading } = useQuery({
    queryKey: ["my-profile"],
    queryFn: getMyProfile,
  });

  const [account, setAccount] = useState({ name: "", email: "" });
  const [profile, setProfile] = useState({
    headline: "",
    bio: "",
    location: "",
    website: "",
    isPublic: true,
  });
  const [social, setSocial] = useState<SocialLinks>({});

  useEffect(() => {
    const p = res?.payload as any;
    if (!p) return;
    setAccount({ name: p.user?.name ?? "", email: p.user?.email ?? "" });
    setProfile({
      headline: p.headline ?? "",
      bio: p.bio ?? "",
      location: p.location ?? "",
      website: p.website ?? "",
      isPublic: p.isPublic ?? true,
    });
    setSocial(p.socialLinks ?? {});
  }, [res]);

  const saveProfile = useMutation({
    mutationFn: async () => {
      const a = await updateMe(account);
      const pr = await updateMyProfile({ ...profile, socialLinks: social });
      return { a, pr };
    },
    onSuccess: ({ a, pr }) => {
      if (!a.success || !pr.success) {
        toast.error(a.message || pr.message || "Failed to save");
        return;
      }
      toast.success("Profile saved");
      queryClient.invalidateQueries({ queryKey: ["my-profile"] });
    },
    onError: () => toast.error("Failed to save profile"),
  });

  const avatarMutation = useMutation({
    mutationFn: (file: File) => {
      const fd = new FormData();
      fd.append("avatar", file);
      return uploadAvatar(fd);
    },
    onSuccess: (r) => {
      if (r.success) toast.success("Avatar updated");
      else toast.error(r.message);
      queryClient.invalidateQueries({ queryKey: ["my-profile"] });
    },
    onError: () => toast.error("Avatar upload failed"),
  });

  const resumeMutation = useMutation({
    mutationFn: (file: File) => {
      const fd = new FormData();
      fd.append("resume", file);
      return uploadResumeFile(fd);
    },
    onSuccess: (r) => {
      if (r.success) toast.success("Resume uploaded");
      else toast.error(r.message);
      queryClient.invalidateQueries({ queryKey: ["my-profile"] });
    },
    onError: () => toast.error("Resume upload failed"),
  });

  if (isLoading) return <GlobalLoading />;

  const p = res?.payload as any;

  return (
    <div className="max-w-4xl space-y-6">
      <h1 className="text-3xl font-bold">Manage Profile</h1>

      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="personal">Personal Info</TabsTrigger>
          <TabsTrigger value="social">Social Links</TabsTrigger>
          <TabsTrigger value="files">Avatar & Resume</TabsTrigger>
        </TabsList>

        {/* Personal */}
        <TabsContent value="personal" className="space-y-4 pt-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Field label="Full Name">
              <Input value={account.name} onChange={(e) => setAccount({ ...account, name: e.target.value })} />
            </Field>
            <Field label="Email">
              <Input value={account.email} onChange={(e) => setAccount({ ...account, email: e.target.value })} />
            </Field>
            <Field label="Headline">
              <Input value={profile.headline} onChange={(e) => setProfile({ ...profile, headline: e.target.value })} />
            </Field>
            <Field label="Location">
              <Input value={profile.location} onChange={(e) => setProfile({ ...profile, location: e.target.value })} />
            </Field>
            <Field label="Website">
              <Input value={profile.website} onChange={(e) => setProfile({ ...profile, website: e.target.value })} />
            </Field>
          </div>
          <Field label="Bio">
            <Textarea
              className="min-h-28"
              value={profile.bio}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
            />
          </Field>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={profile.isPublic}
              onChange={(e) => setProfile({ ...profile, isPublic: e.target.checked })}
            />
            Public profile
          </label>
          <Button onClick={() => saveProfile.mutate()} disabled={saveProfile.isPending}>
            {saveProfile.isPending ? "Saving..." : "Save Profile"}
          </Button>
        </TabsContent>

        {/* Social */}
        <TabsContent value="social" className="space-y-4 pt-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {(["github", "linkedin", "twitter", "instagram", "youtube", "devto", "hashnode"] as const).map((k) => (
              <Field key={k} label={k[0].toUpperCase() + k.slice(1)}>
                <Input
                  placeholder={`https://...`}
                  value={social[k] ?? ""}
                  onChange={(e) => setSocial({ ...social, [k]: e.target.value })}
                />
              </Field>
            ))}
          </div>
          <Button onClick={() => saveProfile.mutate()} disabled={saveProfile.isPending}>
            {saveProfile.isPending ? "Saving..." : "Save Links"}
          </Button>
        </TabsContent>

        {/* Files */}
        <TabsContent value="files" className="space-y-6 pt-4">
          <Card>
            <CardHeader><CardTitle className="text-base">Avatar</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {p?.avatar?.url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.avatar.url} alt="avatar" className="h-20 w-20 rounded-full object-cover" />
              )}
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => e.target.files?.[0] && avatarMutation.mutate(e.target.files[0])}
              />
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-base">Resume (PDF)</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {p?.resume?.url && (
                <a href={p.resume.url} target="_blank" className="text-sm text-blue-600 underline">
                  View current resume
                </a>
              )}
              <Input
                type="file"
                accept="application/pdf"
                onChange={(e) => e.target.files?.[0] && resumeMutation.mutate(e.target.files[0])}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>
      {children}
    </div>
  );
}
