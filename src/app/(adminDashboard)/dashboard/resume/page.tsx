"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import toast from "react-hot-toast";
import {
  getExperience,
  createExperience,
  updateExperience,
  deleteExperience,
  getEducation,
  createEducation,
  updateEducation,
  deleteEducation,
} from "@/actions/resume/resume";
import GlobalLoading from "@/app/loading";

type Kind = "experience" | "education";

type Entry = {
  _id: string;
  role?: string;
  company?: string;
  degree?: string;
  institution?: string;
  field?: string;
  location?: string;
  startDate?: string;
  endDate?: string | null;
  current?: boolean;
  description?: string;
};

const toDateInput = (d?: string | null) => (d ? d.slice(0, 10) : "");

export default function ResumePage() {
  const queryClient = useQueryClient();

  const expQuery = useQuery({ queryKey: ["experience"], queryFn: getExperience });
  const eduQuery = useQuery({ queryKey: ["education"], queryFn: getEducation });

  const [open, setOpen] = useState(false);
  const [kind, setKind] = useState<Kind>("experience");
  const [editing, setEditing] = useState<Entry | null>(null);
  const [form, setForm] = useState<Record<string, any>>({});

  const invalidate = (k: Kind) =>
    queryClient.invalidateQueries({ queryKey: [k === "experience" ? "experience" : "education"] });

  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload = { ...form };
      if (!payload.endDate || payload.current) delete payload.endDate;
      if (kind === "experience") {
        return editing
          ? updateExperience(editing._id, payload)
          : createExperience(payload as any);
      }
      return editing
        ? updateEducation(editing._id, payload)
        : createEducation(payload as any);
    },
    onSuccess: (r) => {
      if (!r.success) {
        toast.error(r.message || "Failed to save");
        return;
      }
      toast.success("Saved");
      invalidate(kind);
      setOpen(false);
      setEditing(null);
    },
    onError: () => toast.error("Failed to save"),
  });

  const delMutation = useMutation({
    mutationFn: ({ k, id }: { k: Kind; id: string }) =>
      k === "experience" ? deleteExperience(id) : deleteEducation(id),
    onSuccess: (_r, { k }) => {
      toast.success("Deleted");
      invalidate(k);
    },
    onError: () => toast.error("Failed to delete"),
  });

  const openCreate = (k: Kind) => {
    setKind(k);
    setEditing(null);
    setForm({ current: false });
    setOpen(true);
  };

  const openEdit = (k: Kind, e: Entry) => {
    setKind(k);
    setEditing(e);
    setForm({
      role: e.role ?? "",
      company: e.company ?? "",
      degree: e.degree ?? "",
      institution: e.institution ?? "",
      field: e.field ?? "",
      location: e.location ?? "",
      startDate: toDateInput(e.startDate),
      endDate: toDateInput(e.endDate),
      current: !!e.current,
      description: e.description ?? "",
    });
    setOpen(true);
  };

  if (expQuery.isLoading || eduQuery.isLoading) return <GlobalLoading />;

  const experience: Entry[] = expQuery.data?.payload ?? [];
  const education: Entry[] = eduQuery.data?.payload ?? [];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Experience &amp; Education</h1>

      {/* Experience */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Work Experience</CardTitle>
          <Button size="sm" onClick={() => openCreate("experience")}>
            <Plus className="mr-2 h-4 w-4" /> Add
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {experience.length === 0 && (
            <p className="text-sm text-muted-foreground">No experience entries yet.</p>
          )}
          {experience.map((e) => (
            <Row
              key={e._id}
              title={`${e.role} @ ${e.company}`}
              subtitle={`${toDateInput(e.startDate)} — ${e.current ? "Present" : toDateInput(e.endDate) || "—"}`}
              onEdit={() => openEdit("experience", e)}
              onDelete={() => confirm("Delete this entry?") && delMutation.mutate({ k: "experience", id: e._id })}
            />
          ))}
        </CardContent>
      </Card>

      {/* Education */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Education</CardTitle>
          <Button size="sm" onClick={() => openCreate("education")}>
            <Plus className="mr-2 h-4 w-4" /> Add
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {education.length === 0 && (
            <p className="text-sm text-muted-foreground">No education entries yet.</p>
          )}
          {education.map((e) => (
            <Row
              key={e._id}
              title={`${e.degree} — ${e.institution}`}
              subtitle={`${toDateInput(e.startDate)} — ${e.current ? "Present" : toDateInput(e.endDate) || "—"}`}
              onEdit={() => openEdit("education", e)}
              onDelete={() => confirm("Delete this entry?") && delMutation.mutate({ k: "education", id: e._id })}
            />
          ))}
        </CardContent>
      </Card>

      {/* Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editing ? "Edit" : "Add"} {kind === "experience" ? "Experience" : "Education"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            {kind === "experience" ? (
              <>
                <Input placeholder="Role *" value={form.role ?? ""} onChange={(e) => setForm({ ...form, role: e.target.value })} />
                <Input placeholder="Company *" value={form.company ?? ""} onChange={(e) => setForm({ ...form, company: e.target.value })} />
                <Input placeholder="Location" value={form.location ?? ""} onChange={(e) => setForm({ ...form, location: e.target.value })} />
              </>
            ) : (
              <>
                <Input placeholder="Degree *" value={form.degree ?? ""} onChange={(e) => setForm({ ...form, degree: e.target.value })} />
                <Input placeholder="Institution *" value={form.institution ?? ""} onChange={(e) => setForm({ ...form, institution: e.target.value })} />
                <Input placeholder="Field of study" value={form.field ?? ""} onChange={(e) => setForm({ ...form, field: e.target.value })} />
              </>
            )}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Start date *</label>
                <Input type="date" value={form.startDate ?? ""} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">End date</label>
                <Input type="date" disabled={form.current} value={form.endDate ?? ""} onChange={(e) => setForm({ ...form, endDate: e.target.value })} />
              </div>
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={!!form.current} onChange={(e) => setForm({ ...form, current: e.target.checked })} />
              Currently ongoing
            </label>
            <Textarea placeholder="Description" value={form.description ?? ""} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button
              onClick={() => saveMutation.mutate()}
              disabled={
                saveMutation.isPending ||
                !form.startDate ||
                (kind === "experience" ? !form.role || !form.company : !form.degree || !form.institution)
              }
            >
              {saveMutation.isPending ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Row({
  title,
  subtitle,
  onEdit,
  onDelete,
}: {
  title: string;
  subtitle: string;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="flex items-center justify-between rounded-lg border p-4">
      <div>
        <h2 className="font-bold">{title}</h2>
        <p className="text-sm text-slate-500">{subtitle}</p>
      </div>
      <div className="flex gap-2">
        <Button variant="ghost" size="icon" onClick={onEdit}>
          <Pencil className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="text-red-500" onClick={onDelete}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
