"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import {
  deleteSubscriber,
  getAllSubscribers,
  sendNewsletter,
} from "@/actions/subscribers/subscribers";
import GlobalLoading from "@/app/loading";

// Type for a subscriber
type Subscriber = {
  id: string;
  email: string;
  isActive: boolean;
};

export default function SubscribersPage() {
  const queryClient = useQueryClient();

  // Newsletter form state
  const [newsletterContent, setNewsletterContent] = useState({
    subject: "",
    content: "",
  });

  // Fetch subscribers
  const { data: subscribersResponse, isLoading } = useQuery({
    queryKey: ["subscribers"] as const,
    queryFn: () => getAllSubscribers({}),
  });

  // Extract the array of subscribers safely
  const subscribers: Subscriber[] = subscribersResponse?.payload || [];

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: ({ id }: { id: string }) => deleteSubscriber({ id }),
    onSuccess: () => {
      toast.success("Subscriber deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["subscribers"] });
    },
    onError: () => {
      toast.error("Failed to delete subscriber");
    },
  });

  // Send newsletter mutation
  const sendMutation = useMutation({
    mutationFn: (payload: { subject: string; content: string }) =>
      sendNewsletter(payload),
    onSuccess: () => {
      toast.success("Newsletter sent successfully");
      setNewsletterContent({ subject: "", content: "" });
    },
    onError: () => {
      toast.error("Failed to send newsletter");
    },
  });

  if (isLoading) return <GlobalLoading/>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Subscribers</h1>

      {/* Send Newsletter Dialog */}
      <Dialog>
        <DialogTrigger asChild>
          <Button className="mb-4">Send Newsletter</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Send Newsletter</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Subject"
              value={newsletterContent.subject}
              onChange={(e) =>
                setNewsletterContent((prev) => ({
                  ...prev,
                  subject: e.target.value,
                }))
              }
            />
            <Input
              placeholder="Content"
              value={newsletterContent.content}
              onChange={(e) =>
                setNewsletterContent((prev) => ({
                  ...prev,
                  content: e.target.value,
                }))
              }
            />
          </div>
          <DialogFooter>
            <Button
              onClick={() => sendMutation.mutate({ ...newsletterContent })}
              disabled={
                !newsletterContent.subject || !newsletterContent.content
              }
            >
              Send
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Subscribers Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Email</TableHead>
            <TableHead>Active</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {subscribers.map((subscriber) => (
            <TableRow key={subscriber.id}>
              <TableCell>{subscriber.email}</TableCell>
              <TableCell>{subscriber.isActive ? "Yes" : "No"}</TableCell>
              <TableCell className="flex gap-2">
                {/* Delete Subscriber Dialog */}
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="destructive" size="sm">
                      Delete
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-sm">
                    <DialogHeader>
                      <DialogTitle>Confirm Delete</DialogTitle>
                    </DialogHeader>
                    <div>
                      Are you sure you want to delete {subscriber.email}?
                    </div>
                    <DialogFooter>
                      <Button
                        variant="destructive"
                        onClick={() =>
                          deleteMutation.mutate({ id: subscriber.id })
                        }
                      >
                        Delete
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
