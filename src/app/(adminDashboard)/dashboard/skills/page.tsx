"use client";

import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import toast from "react-hot-toast";
import { getMyProfile, type Skill } from "@/actions/profile/profile";
import { saveSkills } from "@/actions/skills/skills";
import GlobalLoading from "@/app/loading";

export default function SkillsPage() {
  const queryClient = useQueryClient();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<Skill>({ name: "", category: "Frontend", level: 70 });

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
    },
    onError: () => toast.error("Failed to save skills"),
  });

  const addSkill = () => {
    if (!draft.name.trim()) return;
    const next = [...skills, { ...draft, name: draft.name.trim() }];
    persist.mutate(next);
    setOpen(false);
    setDraft({ name: "", category: "Frontend", level: 70 });
  };

  const removeSkill = (idx: number) => {
    const next = skills.filter((_, i) => i !== idx);
    persist.mutate(next);
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
        <Button className="flex gap-2" onClick={() => setOpen(true)}>
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
                <div key={idx} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{skill.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">{skill.level ?? 0}%</span>
                      <button
                        onClick={() => removeSkill(idx)}
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

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Add Skill</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <Input
              placeholder="Skill name (e.g. React)"
              value={draft.name}
              onChange={(e) => setDraft({ ...draft, name: e.target.value })}
            />
            <Input
              placeholder="Category (e.g. Frontend)"
              value={draft.category}
              onChange={(e) => setDraft({ ...draft, category: e.target.value })}
            />
            <div className="space-y-1">
              <label className="text-sm">Proficiency: {draft.level}%</label>
              <input
                type="range"
                min={0}
                max={100}
                value={draft.level}
                onChange={(e) => setDraft({ ...draft, level: Number(e.target.value) })}
                className="w-full"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={addSkill} disabled={!draft.name.trim() || persist.isPending}>
              Add
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
