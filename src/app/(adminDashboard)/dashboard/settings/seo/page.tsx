import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export const metadata: Metadata = {
  title: "SEO Settings",
  robots: { index: false, follow: false },
};

export default function SEOSettings() {
  return (
    <div className="max-w-2xl space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Global SEO Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Meta Title</label>
            <Input placeholder="John Doe | Portfolio" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Meta Description</label>
            <textarea className="w-full p-2 border rounded-md" rows={3} />
          </div>
          <div className="flex items-center gap-2">
             <input type="checkbox" id="sitemap" />
             <label htmlFor="sitemap" className="text-sm">Enable Auto-Sitemap</label>
          </div>
          <Button>Update SEO</Button>
        </CardContent>
      </Card>
    </div>
  );
}