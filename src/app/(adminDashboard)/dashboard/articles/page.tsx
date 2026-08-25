"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Eye, EyeOff, Pencil, Plus, Star, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { createArticle, deleteArticle, getAdminArticles, updateArticle } from "@/actions/articles/articles";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

type Article = { _id: string; title: string; slug: string; excerpt?: string; content?: string; status: "draft" | "published" | "archived"; isFeatured?: boolean; category?: string; tags?: string[] };
const blank = { title: "", excerpt: "", content: "", category: "", tags: "", status: "draft" as Article["status"], isFeatured: false };

export default function ArticlesPage() {
  const client = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ["admin-articles"], queryFn: getAdminArticles });
  const articles: Article[] = data?.payload ?? [];
  const [editing, setEditing] = useState<Article | null>(null);
  const [form, setForm] = useState({ ...blank });
  const [open, setOpen] = useState(false);
  const [removing, setRemoving] = useState<Article | null>(null);
  const refresh = () => client.invalidateQueries({ queryKey: ["admin-articles"] });

  const save = useMutation({
    mutationFn: () => {
      const payload = { ...form, tags: form.tags.split(",").map((tag) => tag.trim()).filter(Boolean) };
      return editing ? updateArticle(editing.slug, payload) : createArticle(payload);
    },
    onSuccess: (result) => {
      if (!result.success) return toast.error(result.message || "Could not save article");
      toast.success(editing ? "Article updated" : "Article created");
      refresh(); setOpen(false); setEditing(null);
    },
    onError: () => toast.error("Could not save article"),
  });
  const remove = useMutation({
    mutationFn: (slug: string) => deleteArticle(slug),
    onSuccess: () => { toast.success("Article deleted"); refresh(); setRemoving(null); },
    onError: () => toast.error("Could not delete article"),
  });
  const quickUpdate = useMutation({
    mutationFn: ({ article, changes }: { article: Article; changes: { status?: Article["status"]; isFeatured?: boolean } }) => updateArticle(article.slug, changes),
    onSuccess: (result) => { if (!result.success) return toast.error(result.message || "Could not update article"); refresh(); },
    onError: () => toast.error("Could not update article"),
  });

  const create = () => { setEditing(null); setForm({ ...blank }); setOpen(true); };
  const edit = (article: Article) => { setEditing(article); setForm({ title: article.title, excerpt: article.excerpt ?? "", content: article.content ?? "", category: article.category ?? "", tags: (article.tags ?? []).join(", "), status: article.status, isFeatured: !!article.isFeatured }); setOpen(true); };

  return <div className="space-y-6">
    <div className="flex items-center justify-between"><div><h1 className="text-3xl font-bold">Articles</h1><p className="text-sm text-muted-foreground">Create, publish, feature, or archive your posts.</p></div><Button onClick={create}><Plus className="mr-2 h-4 w-4" />New article</Button></div>
    <Card className="overflow-x-auto"><table className="w-full text-sm"><thead className="border-b text-left text-muted-foreground"><tr><th className="p-4">Article</th><th className="p-4">Category</th><th className="p-4">Status</th><th className="p-4 text-right">Actions</th></tr></thead><tbody>
      {!isLoading && articles.length === 0 && <tr><td colSpan={4} className="p-10 text-center text-muted-foreground">No articles yet.</td></tr>}
      {articles.map((article) => <tr key={article._id} className="border-b last:border-0"><td className="p-4 font-medium">{article.title}{article.isFeatured && <Star className="ml-2 inline h-4 w-4 fill-yellow-400 text-yellow-400" />}</td><td className="p-4">{article.category || "—"}</td><td className="p-4"><Badge className={article.status === "published" ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-700"}>{article.status}</Badge></td><td className="space-x-1 p-4 text-right">
        <Button variant="ghost" size="icon" title={article.status === "published" ? "Unpublish" : "Publish"} onClick={() => quickUpdate.mutate({ article, changes: { status: article.status === "published" ? "draft" : "published" } })}>{article.status === "published" ? <Eye className="h-4 w-4 text-emerald-600" /> : <EyeOff className="h-4 w-4" />}</Button>
        <Button variant="ghost" size="icon" title="Toggle featured" onClick={() => quickUpdate.mutate({ article, changes: { isFeatured: !article.isFeatured } })}><Star className={article.isFeatured ? "h-4 w-4 fill-yellow-400 text-yellow-400" : "h-4 w-4"} /></Button>
        <Button variant="ghost" size="icon" title="Edit" onClick={() => edit(article)}><Pencil className="h-4 w-4" /></Button><Button variant="ghost" size="icon" className="text-red-500" title="Delete" onClick={() => setRemoving(article)}><Trash2 className="h-4 w-4" /></Button>
      </td></tr>)}
    </tbody></table></Card>
    <Dialog open={open} onOpenChange={setOpen}><DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl"><DialogHeader><DialogTitle>{editing ? "Edit article" : "New article"}</DialogTitle><DialogDescription>Drafts stay private until you publish them.</DialogDescription></DialogHeader><div className="space-y-3"><Input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /><Input placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} /><Input placeholder="Tags, comma separated" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} /><Textarea placeholder="Short excerpt" value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} /><Textarea className="min-h-56" placeholder="Article content" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} /><div className="flex gap-6"><label className="flex items-center gap-2 text-sm">Status <select className="rounded border p-1" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as Article["status"] })}><option value="draft">Draft</option><option value="published">Published</option><option value="archived">Archived</option></select></label><label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} />Featured</label></div></div><DialogFooter><Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button><Button disabled={!form.title || !form.content || save.isPending} onClick={() => save.mutate()}>{editing ? "Save changes" : "Create article"}</Button></DialogFooter></DialogContent></Dialog>
    <ConfirmDialog open={!!removing} onOpenChange={(value) => !value && setRemoving(null)} title="Delete article" description={`Delete “${removing?.title}”? This cannot be undone.`} confirmText="Delete article" loading={remove.isPending} onConfirm={() => removing && remove.mutate(removing.slug)} />
  </div>;
}
