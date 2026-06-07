"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Star, Pencil, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import toast from "react-hot-toast";
import {
  getAdminProjects,
  createProject,
  updateProject,
  deleteProject,
} from "@/actions/projects/projects";
import GlobalLoading from "@/app/loading";

type Project = {
  _id: string;
  title: string;
  description: string;
  shortDescription?: string;
  category?: string;
  techStack?: string[];
  tags?: string[];
  liveUrl?: string;
  githubUrl?: string;
  isFeatured?: boolean;
  isPublished?: boolean;
};

const emptyForm = {
  title: "",
  description: "",
  shortDescription: "",
  category: "",
  techStack: "",
  tags: "",
  liveUrl: "",
  githubUrl: "",
  isFeatured: false,
  isPublished: true,
};

export default function ProjectsListPage() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);
  const [form, setForm] = useState({ ...emptyForm });
  const [files, setFiles] = useState<FileList | null>(null);
  const [toDelete, setToDelete] = useState<Project | null>(null);

  const { data: res, isLoading } = useQuery({
    queryKey: ["admin-projects"],
    queryFn: () => getAdminProjects(),
  });
  const projects: Project[] = res?.payload ?? [];

  const buildFormData = () => {
    const fd = new FormData();
    fd.append("title", form.title);
    fd.append("description", form.description);
    if (form.shortDescription) fd.append("shortDescription", form.shortDescription);
    if (form.category) fd.append("category", form.category);
    fd.append("isFeatured", String(form.isFeatured));
    fd.append("isPublished", String(form.isPublished));
    if (form.liveUrl) fd.append("liveUrl", form.liveUrl);
    if (form.githubUrl) fd.append("githubUrl", form.githubUrl);
    form.techStack
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .forEach((s) => fd.append("techStack", s));
    form.tags
      .split(",")
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean)
      .forEach((s) => fd.append("tags", s));
    if (files) Array.from(files).forEach((f) => fd.append("images", f));
    return fd;
  };

  const saveMutation = useMutation({
    mutationFn: async () => {
      const fd = buildFormData();
      return editing ? updateProject(editing._id, fd) : createProject(fd);
    },
    onSuccess: (r) => {
      if (!r.success) {
        toast.error(r.message || "Failed to save project");
        return;
      }
      toast.success(editing ? "Project updated" : "Project created");
      queryClient.invalidateQueries({ queryKey: ["admin-projects"] });
      closeDialog();
    },
    onError: () => toast.error("Failed to save project"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteProject(id),
    onSuccess: () => {
      toast.success("Project deleted");
      queryClient.invalidateQueries({ queryKey: ["admin-projects"] });
      setToDelete(null);
    },
    onError: () => toast.error("Failed to delete project"),
  });

  const openCreate = () => {
    setEditing(null);
    setForm({ ...emptyForm });
    setFiles(null);
    setOpen(true);
  };

  const openEdit = (p: Project) => {
    setEditing(p);
    setForm({
      title: p.title ?? "",
      description: p.description ?? "",
      shortDescription: p.shortDescription ?? "",
      category: p.category ?? "",
      techStack: (p.techStack ?? []).join(", "),
      tags: (p.tags ?? []).join(", "),
      liveUrl: p.liveUrl ?? "",
      githubUrl: p.githubUrl ?? "",
      isFeatured: !!p.isFeatured,
      isPublished: p.isPublished ?? true,
    });
    setFiles(null);
    setOpen(true);
  };

  const closeDialog = () => {
    if (saveMutation.isPending) return;
    setOpen(false);
    setEditing(null);
  };

  if (isLoading) return <GlobalLoading />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projects Portfolio</h1>
          <p className="text-sm text-muted-foreground">
            {projects.length} project{projects.length === 1 ? "" : "s"} total
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" /> Create Project
        </Button>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Project</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Tech Stack</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="py-10 text-center text-muted-foreground">
                  No projects yet. Create your first one.
                </TableCell>
              </TableRow>
            )}
            {projects.map((p) => (
              <TableRow key={p._id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    {p.title}
                    {p.isFeatured && (
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    )}
                  </div>
                  {p.shortDescription && (
                    <p className="mt-0.5 max-w-xs truncate text-xs text-muted-foreground">
                      {p.shortDescription}
                    </p>
                  )}
                </TableCell>
                <TableCell>
                  {p.category ? <Badge variant="outline">{p.category}</Badge> : "—"}
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {(p.techStack ?? []).slice(0, 3).map((s) => (
                      <span key={s} className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] dark:bg-slate-800">
                        {s}
                      </span>
                    ))}
                    {(p.techStack ?? []).length > 3 && (
                      <span className="text-[10px] text-muted-foreground">
                        +{(p.techStack ?? []).length - 3}
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={p.isPublished ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}>
                    {p.isPublished ? "Published" : "Draft"}
                  </Badge>
                </TableCell>
                <TableCell className="space-x-2 text-right">
                  <Button
                    variant="outline"
                    size="icon"
                    title="Edit"
                    onClick={() => openEdit(p)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    title="Delete"
                    className="text-red-500 hover:bg-red-50 hover:text-red-600"
                    onClick={() => setToDelete(p)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Create / Edit modal */}
      <Dialog open={open} onOpenChange={(o) => (o ? setOpen(true) : closeDialog())}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Project" : "Create Project"}</DialogTitle>
            <DialogDescription>
              {editing
                ? "Update the details for this project."
                : "Add a new project to your portfolio."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5 py-2">
            {/* Basics */}
            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="title">
                  Title <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title"
                  placeholder="e.g. E-Commerce Platform"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="description">
                  Description <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="description"
                  rows={4}
                  placeholder="Full description of the project…"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="short">Short description</Label>
                <Input
                  id="short"
                  placeholder="One-line summary shown in cards"
                  value={form.shortDescription}
                  onChange={(e) => setForm({ ...form, shortDescription: e.target.value })}
                />
              </div>
            </div>

            {/* Meta */}
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  placeholder="e.g. Web App"
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="tech">Tech stack</Label>
                <Input
                  id="tech"
                  placeholder="Comma separated (React, Node.js)"
                  value={form.techStack}
                  onChange={(e) => setForm({ ...form, techStack: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="tags">Tags</Label>
                <Input
                  id="tags"
                  placeholder="Comma separated (fullstack, api)"
                  value={form.tags}
                  onChange={(e) => setForm({ ...form, tags: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="live">Live URL</Label>
                <Input
                  id="live"
                  placeholder="https://…"
                  value={form.liveUrl}
                  onChange={(e) => setForm({ ...form, liveUrl: e.target.value })}
                />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="github">GitHub URL</Label>
                <Input
                  id="github"
                  placeholder="https://github.com/…"
                  value={form.githubUrl}
                  onChange={(e) => setForm({ ...form, githubUrl: e.target.value })}
                />
              </div>
            </div>

            {/* Images */}
            <div className="space-y-1.5">
              <Label htmlFor="images">Images</Label>
              <Input
                id="images"
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => setFiles(e.target.files)}
              />
              {editing && (
                <p className="text-xs text-muted-foreground">
                  New uploads are added to the existing images.
                </p>
              )}
            </div>

            {/* Flags */}
            <div className="flex flex-wrap gap-6 rounded-lg border bg-slate-50 p-3 dark:bg-slate-900/40">
              <label className="flex items-center gap-2 text-sm font-medium">
                <input
                  type="checkbox"
                  className="h-4 w-4 accent-primary"
                  checked={form.isFeatured}
                  onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
                />
                Featured
              </label>
              <label className="flex items-center gap-2 text-sm font-medium">
                <input
                  type="checkbox"
                  className="h-4 w-4 accent-primary"
                  checked={form.isPublished}
                  onChange={(e) => setForm({ ...form, isPublished: e.target.checked })}
                />
                Published
              </label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={closeDialog} disabled={saveMutation.isPending}>
              Cancel
            </Button>
            <Button
              onClick={() => saveMutation.mutate()}
              disabled={!form.title || !form.description || saveMutation.isPending}
            >
              {saveMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {editing ? "Save changes" : "Create project"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <ConfirmDialog
        open={!!toDelete}
        onOpenChange={(o) => !o && setToDelete(null)}
        title="Delete project"
        description={
          <>
            This will permanently delete{" "}
            <span className="font-semibold">{toDelete?.title}</span> and all of its
            images. This action cannot be undone.
          </>
        }
        confirmText="Delete project"
        loading={deleteMutation.isPending}
        onConfirm={() => toDelete && deleteMutation.mutate(toDelete._id)}
      />
    </div>
  );
}
