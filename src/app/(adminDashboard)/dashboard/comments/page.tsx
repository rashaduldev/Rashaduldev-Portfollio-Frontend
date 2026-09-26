"use client";

import Link from "next/link";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ExternalLink, MessageCircle, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import GlobalLoading from "@/app/loading";
import { AdminComment, deleteAdminComment, getAdminComments } from "@/actions/engagement/engagement";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function CommentsPage() {
  const queryClient = useQueryClient();
  const [removing, setRemoving] = useState<AdminComment | null>(null);
  const { data, isLoading } = useQuery({
    queryKey: ["admin-comments"],
    queryFn: getAdminComments,
    staleTime: 0,
    refetchOnMount: "always",
  });
  const comments = data?.payload ?? [];

  const remove = useMutation({
    mutationFn: deleteAdminComment,
    onSuccess: (result) => {
      if (!result.success) return toast.error(result.message || "Could not delete comment");
      toast.success("Comment deleted");
      setRemoving(null);
      queryClient.invalidateQueries({ queryKey: ["admin-comments"] });
    },
    onError: () => toast.error("Could not delete comment"),
  });

  if (isLoading) return <GlobalLoading />;

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-3">
          <MessageCircle className="h-7 w-7 text-primary" />
          <h1 className="text-3xl font-bold">Comments</h1>
          <Badge variant="secondary">{comments.length}</Badge>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">Moderate public comments from articles and projects.</p>
      </div>

      <Card className="overflow-x-auto">
        <Table>
          <TableHeader><TableRow><TableHead>Visitor</TableHead><TableHead>Comment</TableHead><TableHead>Content</TableHead><TableHead>Date</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
          <TableBody>
            {comments.length === 0 && <TableRow><TableCell colSpan={5} className="py-12 text-center text-muted-foreground">No comments yet.</TableCell></TableRow>}
            {comments.map((comment) => (
              <TableRow key={`${comment.resourceType}-${comment.resourceId}-${comment._id}`}>
                <TableCell className="font-medium">{comment.name}</TableCell>
                <TableCell className="max-w-sm whitespace-pre-wrap break-words">{comment.content}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="mb-1 capitalize">{comment.resourceType}</Badge>
                  <p className="max-w-52 truncate text-xs text-muted-foreground">{comment.resourceTitle}</p>
                </TableCell>
                <TableCell className="whitespace-nowrap text-xs text-muted-foreground">{new Date(comment.createdAt).toLocaleString()}</TableCell>
                <TableCell className="text-right">
                  <Button asChild variant="ghost" size="icon" title="View public page"><Link href={`/${comment.resourceType === "article" ? "articles" : "projects"}/${comment.resourceId}`} target="_blank"><ExternalLink className="h-4 w-4" /></Link></Button>
                  <Button variant="ghost" size="icon" title="Delete comment" className="text-red-500 hover:bg-red-50 hover:text-red-600" onClick={() => setRemoving(comment)}><Trash2 className="h-4 w-4" /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <ConfirmDialog
        open={!!removing}
        onOpenChange={(open) => !open && setRemoving(null)}
        title="Delete comment"
        description={<>Delete <span className="font-semibold">{removing?.name}</span>&apos;s comment permanently? This cannot be undone.</>}
        confirmText="Delete comment"
        loading={remove.isPending}
        onConfirm={() => removing && remove.mutate(removing)}
      />
    </div>
  );
}
