"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Mail, Trash2, Loader2, Send } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import toast from "react-hot-toast";
import {
  deleteSubscriber,
  getAllSubscribers,
  sendNewsletter,
} from "@/actions/subscribers/subscribers";
import GlobalLoading from "@/app/loading";

type Subscriber = {
  id: string;
  email: string;
  isActive: boolean;
};

export default function SubscribersPage() {
  const queryClient = useQueryClient();

  const [newsletterOpen, setNewsletterOpen] = useState(false);
  const [newsletterContent, setNewsletterContent] = useState({ subject: "", content: "" });
  const [toDelete, setToDelete] = useState<Subscriber | null>(null);

  const { data: subscribersResponse, isLoading } = useQuery({
    queryKey: ["subscribers"] as const,
    queryFn: () => getAllSubscribers({}),
  });
  const subscribers: Subscriber[] = subscribersResponse?.payload || [];

  const deleteMutation = useMutation({
    mutationFn: ({ id }: { id: string }) => deleteSubscriber({ id }),
    onSuccess: () => {
      toast.success("Subscriber deleted");
      queryClient.invalidateQueries({ queryKey: ["subscribers"] });
      setToDelete(null);
    },
    onError: () => toast.error("Failed to delete subscriber"),
  });

  const sendMutation = useMutation({
    mutationFn: (payload: { subject: string; content: string }) => sendNewsletter(payload),
    onSuccess: (r) => {
      if (r && (r as any).success === false) {
        toast.error((r as any).message || "Failed to send newsletter");
        return;
      }
      toast.success("Newsletter sent");
      setNewsletterContent({ subject: "", content: "" });
      setNewsletterOpen(false);
    },
    onError: () => toast.error("Failed to send newsletter"),
  });

  if (isLoading) return <GlobalLoading />;

  const active = subscribers.filter((s) => s.isActive).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Subscribers</h1>
          <p className="text-sm text-muted-foreground">
            {subscribers.length} total · {active} active
          </p>
        </div>
        <Button onClick={() => setNewsletterOpen(true)}>
          <Send className="mr-2 h-4 w-4" /> Send Newsletter
        </Button>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {subscribers.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} className="py-10 text-center text-muted-foreground">
                  No subscribers yet.
                </TableCell>
              </TableRow>
            )}
            {subscribers.map((subscriber) => (
              <TableRow key={subscriber.id}>
                <TableCell className="font-medium">
                  <span className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    {subscriber.email}
                  </span>
                </TableCell>
                <TableCell>
                  <Badge
                    className={
                      subscriber.isActive
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-600"
                    }
                  >
                    {subscriber.isActive ? "Active" : "Unsubscribed"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    title="Delete"
                    className="text-red-500 hover:bg-red-50 hover:text-red-600"
                    onClick={() => setToDelete(subscriber)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Send Newsletter modal */}
      <Dialog open={newsletterOpen} onOpenChange={(o) => !sendMutation.isPending && setNewsletterOpen(o)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Send Newsletter</DialogTitle>
            <DialogDescription>
              This email will be sent to all {active} active subscriber{active === 1 ? "" : "s"}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="subject">
                Subject <span className="text-red-500">*</span>
              </Label>
              <Input
                id="subject"
                placeholder="Newsletter subject"
                value={newsletterContent.subject}
                onChange={(e) =>
                  setNewsletterContent((p) => ({ ...p, subject: e.target.value }))
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="content">
                Content <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="content"
                rows={6}
                placeholder="Write your newsletter…"
                value={newsletterContent.content}
                onChange={(e) =>
                  setNewsletterContent((p) => ({ ...p, content: e.target.value }))
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setNewsletterOpen(false)}
              disabled={sendMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              onClick={() => sendMutation.mutate({ ...newsletterContent })}
              disabled={
                !newsletterContent.subject ||
                !newsletterContent.content ||
                sendMutation.isPending
              }
            >
              {sendMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Send newsletter
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <ConfirmDialog
        open={!!toDelete}
        onOpenChange={(o) => !o && setToDelete(null)}
        title="Delete subscriber"
        description={
          <>
            Remove <span className="font-semibold">{toDelete?.email}</span> from your
            subscriber list? This action cannot be undone.
          </>
        }
        confirmText="Delete subscriber"
        loading={deleteMutation.isPending}
        onConfirm={() => toDelete && deleteMutation.mutate({ id: toDelete.id })}
      />
    </div>
  );
}
