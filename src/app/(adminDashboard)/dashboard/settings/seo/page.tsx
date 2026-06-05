"use client";

import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import toast from "react-hot-toast";
import { getSettings, updateSettings } from "@/actions/settings/settings";
import GlobalLoading from "@/app/loading";

export default function SEOSettings() {
  const queryClient = useQueryClient();
  const { data: res, isLoading } = useQuery({
    queryKey: ["settings"],
    queryFn: getSettings,
  });

  const [form, setForm] = useState({
    siteName: "",
    metaTitle: "",
    metaDescription: "",
    keywords: "",
    ogImage: "",
    googleAnalyticsId: "",
    enableSitemap: true,
  });

  useEffect(() => {
    const s = res?.payload as any;
    if (!s) return;
    setForm({
      siteName: s.siteName ?? "",
      metaTitle: s.metaTitle ?? "",
      metaDescription: s.metaDescription ?? "",
      keywords: (s.keywords ?? []).join(", "),
      ogImage: s.ogImage ?? "",
      googleAnalyticsId: s.googleAnalyticsId ?? "",
      enableSitemap: s.enableSitemap ?? true,
    });
  }, [res]);

  const save = useMutation({
    mutationFn: () =>
      updateSettings({
        siteName: form.siteName,
        metaTitle: form.metaTitle,
        metaDescription: form.metaDescription,
        keywords: form.keywords
          .split(",")
          .map((k) => k.trim())
          .filter(Boolean),
        ogImage: form.ogImage,
        googleAnalyticsId: form.googleAnalyticsId,
        enableSitemap: form.enableSitemap,
      }),
    onSuccess: (r) => {
      if (!r.success) {
        toast.error(r.message || "Failed to update");
        return;
      }
      toast.success("SEO settings updated");
      queryClient.invalidateQueries({ queryKey: ["settings"] });
    },
    onError: () => toast.error("Failed to update settings"),
  });

  if (isLoading) return <GlobalLoading />;

  return (
    <div className="max-w-2xl space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Global SEO Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Field label="Site Name">
            <Input value={form.siteName} onChange={(e) => setForm({ ...form, siteName: e.target.value })} placeholder="Rashadul Portfolio" />
          </Field>
          <Field label="Meta Title">
            <Input value={form.metaTitle} onChange={(e) => setForm({ ...form, metaTitle: e.target.value })} placeholder="John Doe | Portfolio" />
          </Field>
          <Field label="Meta Description">
            <Textarea rows={3} value={form.metaDescription} onChange={(e) => setForm({ ...form, metaDescription: e.target.value })} />
          </Field>
          <Field label="Keywords (comma separated)">
            <Input value={form.keywords} onChange={(e) => setForm({ ...form, keywords: e.target.value })} placeholder="nextjs, react, developer" />
          </Field>
          <Field label="OG Image URL">
            <Input value={form.ogImage} onChange={(e) => setForm({ ...form, ogImage: e.target.value })} placeholder="https://..." />
          </Field>
          <Field label="Google Analytics ID">
            <Input value={form.googleAnalyticsId} onChange={(e) => setForm({ ...form, googleAnalyticsId: e.target.value })} placeholder="G-XXXXXXX" />
          </Field>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.enableSitemap}
              onChange={(e) => setForm({ ...form, enableSitemap: e.target.checked })}
            />
            Enable Auto-Sitemap
          </label>
          <Button onClick={() => save.mutate()} disabled={save.isPending}>
            {save.isPending ? "Saving..." : "Update SEO"}
          </Button>
        </CardContent>
      </Card>
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
