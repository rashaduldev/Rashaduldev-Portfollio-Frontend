"use client";

import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2, Pencil, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { getMyProfile, type Skill } from "@/actions/profile/profile";
import { saveSkills } from "@/actions/skills/skills";
import GlobalLoading from "@/app/loading";

const emptyDraft: Skill = { name: "", category: "Frontend", level: 70 };

export default function SkillsPage() {
  const queryClient = useQueryClient();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [open, setOpen] = useState(false);
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [draft, setDraft] = useState<Skill>({ ...emptyDraft });
  const [toDelete, setToDelete] = useState<{ idx: number; name: string } | null>(null);

  const { data: res, isLoading } = useQuery({
    queryKey: ["my-profile"],
    queryFn: getMyProfile,
  });

  useEffect(() => {
    const p = res?.payload as any;
    if (p?.skills) setSkills(p.skills);
  }, [res]);

  const persist = useMutation({
    mutationFn: (next: Skill[]) => saveSkills(next),
    onSuccess: (r, next) => {
      if (!r.success) {
        toast.error(r.message || "Failed to save skills");
        return;
      }
      setSkills(next);
      toast.success("Skills updated");
      queryClient.invalidateQueries({ queryKey: ["my-profile"] });
      setOpen(false);
      setToDelete(null);
    },
    onError: () => toast.error("Failed to save skills"),
  });

  const openCreate = () => {
    setEditingIdx(null);
    setDraft({ ...emptyDraft });
    setOpen(true);
  };

  const openEdit = (idx: number) => {
    setEditingIdx(idx);
    setDraft({ ...skills[idx] });
    setOpen(true);
  };

  const saveSkill = () => {
    if (!draft.name.trim()) return;
    const clean = { ...draft, name: draft.name.trim(), category: draft.category?.trim() || "Other" };
    const next =
      editingIdx === null
        ? [...skills, clean]
        : skills.map((s, i) => (i === editingIdx ? clean : s));
    persist.mutate(next);
  };

  const confirmDelete = () => {
    if (!toDelete) return;
    persist.mutate(skills.filter((_, i) => i !== toDelete.idx));
  };

  if (isLoading) return <GlobalLoading />;

  // Group by category
  const grouped = skills.reduce<Record<string, { skill: Skill; idx: number }[]>>(
    (acc, skill, idx) => {
      const cat = skill.category || "Other";
      (acc[cat] ||= []).push({ skill, idx });
      return acc;
    },
    {},
  );
  const categories = Object.keys(grouped);

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Technical Skills</h1>
          <p className="text-muted-foreground">Manage your expertise and proficiency levels.</p>
        </div>
        <Button className="flex gap-2" onClick={openCreate}>
          <Plus className="h-4 w-4" /> Add New Skill
        </Button>
      </div>

      {categories.length === 0 && (
        <p className="text-sm text-muted-foreground">No skills yet. Add your first one.</p>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <Card key={category} className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-lg font-semibold">{category}</CardTitle>
              <Badge variant="secondary">{grouped[category].length}</Badge>
            </CardHeader>
            <CardContent className="space-y-6">
              {grouped[category].map(({ skill, idx }) => (
                <div key={idx} className="group space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{skill.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">{skill.level ?? 0}%</span>
                      <button
                        onClick={() => openEdit(idx)}
                        title="Edit"
                        className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => setToDelete({ idx, name: skill.name })}
                        title="Delete"
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                  <Progress value={skill.level ?? 0} />
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add / Edit modal */}
      <Dialog open={open} onOpenChange={(o) => (o ? setOpen(true) : !persist.isPending && setOpen(false))}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>{editingIdx === null ? "Add Skill" : "Edit Skill"}</DialogTitle>
            <DialogDescription>
              Set the name, category and proficiency level.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="skill-name">
                Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="skill-name"
                placeholder="e.g. React"
                value={draft.name}
                onChange={(e) => setDraft({ ...draft, name: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="skill-cat">Category</Label>
              <Input
                id="skill-cat"
                placeholder="e.g. Frontend"
                value={draft.category}
                onChange={(e) => setDraft({ ...draft, category: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Proficiency: {draft.level}%</Label>
              <input
                type="range"
                min={0}
                max={100}
                value={draft.level}
                onChange={(e) => setDraft({ ...draft, level: Number(e.target.value) })}
                className="w-full accent-primary"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)} disabled={persist.isPending}>
              Cancel
            </Button>
            <Button onClick={saveSkill} disabled={!draft.name.trim() || persist.isPending}>
              {persist.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {editingIdx === null ? "Add skill" : "Save changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <ConfirmDialog
        open={!!toDelete}
        onOpenChange={(o) => !o && setToDelete(null)}
        title="Delete skill"
        description={
          <>
            Remove <span className="font-semibold">{toDelete?.name}</span> from your
            skills?
          </>
        }
        confirmText="Delete skill"
        loading={persist.isPending}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
