"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Mail, MailOpen, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
} from "@/components/ui/dialog";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import toast from "react-hot-toast";
import {
  getMessages,
  updateMessage,
  deleteMessage,
} from "@/actions/messages/messages";
import GlobalLoading from "@/app/loading";

type Message = {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  isRead: boolean;
  isReplied?: boolean;
  createdAt: string;
};

export default function MessagesPage() {
  const queryClient = useQueryClient();
  const [selected, setSelected] = useState<Message | null>(null);
  const [toDelete, setToDelete] = useState<Message | null>(null);

  const { data: res, isLoading } = useQuery({
    queryKey: ["messages"],
    queryFn: () => getMessages({ limit: 100 }),
  });
  const messages: Message[] = res?.payload ?? [];

  const readMutation = useMutation({
    mutationFn: (id: string) => updateMessage(id, { isRead: true }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["messages"] }),
  });

  const delMutation = useMutation({
    mutationFn: (id: string) => deleteMessage(id),
    onSuccess: () => {
      toast.success("Message deleted");
      queryClient.invalidateQueries({ queryKey: ["messages"] });
      setToDelete(null);
    },
    onError: () => toast.error("Failed to delete"),
  });

  const openMessage = (m: Message) => {
    setSelected(m);
    if (!m.isRead) readMutation.mutate(m._id);
  };

  if (isLoading) return <GlobalLoading />;

  const unread = messages.filter((m) => !m.isRead).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <h1 className="text-3xl font-bold">Messages</h1>
        {unread > 0 && <Badge className="bg-purple-100 text-purple-700">{unread} unread</Badge>}
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>From</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Message</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {messages.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  No messages yet.
                </TableCell>
              </TableRow>
            )}
            {messages.map((m) => (
              <TableRow key={m._id} className={!m.isRead ? "font-medium" : ""}>
                <TableCell>{m.name}</TableCell>
                <TableCell>{m.email}</TableCell>
                <TableCell className="max-w-xs truncate">
                  <button className="text-left hover:underline" onClick={() => openMessage(m)}>
                    {m.message}
                  </button>
                </TableCell>
                <TableCell>
                  {m.isRead ? (
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MailOpen className="h-3.5 w-3.5" /> Read
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-xs text-purple-600">
                      <Mail className="h-3.5 w-3.5" /> New
                    </span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    title="Delete"
                    className="text-red-500 hover:bg-red-50 hover:text-red-600"
                    onClick={() => setToDelete(m)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{selected?.name}</DialogTitle>
            {selected?.createdAt && (
              <DialogDescription>
                Received {new Date(selected.createdAt).toLocaleString()}
              </DialogDescription>
            )}
          </DialogHeader>
          <div className="space-y-2 text-sm">
            <p><span className="text-muted-foreground">Email:</span> {selected?.email}</p>
            {selected?.phone && <p><span className="text-muted-foreground">Phone:</span> {selected.phone}</p>}
            <p className="whitespace-pre-wrap pt-2">{selected?.message}</p>
            {selected?.email && (
              <a href={`mailto:${selected.email}`} className="inline-block pt-3 text-blue-600 underline">
                Reply via email
              </a>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <ConfirmDialog
        open={!!toDelete}
        onOpenChange={(o) => !o && setToDelete(null)}
        title="Delete message"
        description={
          <>
            Delete the message from{" "}
            <span className="font-semibold">{toDelete?.name}</span>? This action
            cannot be undone.
          </>
        }
        confirmText="Delete message"
        loading={delMutation.isPending}
        onConfirm={() => toDelete && delMutation.mutate(toDelete._id)}
      />
    </div>
  );
}
