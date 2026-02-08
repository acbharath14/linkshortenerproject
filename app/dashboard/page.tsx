"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { createShortLink, fetchLinks, ShortenedUrl } from "@/data/links";
import { deleteLinkAction } from "./actions";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";

export default function Dashboard() {
  const [createError, setCreateError] = useState<string | null>(null);
  const [originalUrl, setOriginalUrl] = useState("");
  const [shortUrl, setShortUrl] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const baseUrl = useMemo(() => {
    if (typeof window === "undefined") return "";
    return window.location.origin;
  }, []);

  const { data: links = [], isLoading, isError, error } = useQuery({
    queryKey: ["links"],
    queryFn: fetchLinks,
    refetchInterval: 5000, // Refetch every 5 seconds
  });

  const createMutation = useMutation({
    mutationFn: createShortLink,
    onMutate: async (url) => {
      setCreateError(null);
      setShortUrl(null);
      await queryClient.cancelQueries({ queryKey: ["links"] });

      const previous = queryClient.getQueryData<ShortenedUrl[]>(["links"]) ?? [];
      const optimisticLink: ShortenedUrl = {
        id: `temp-${Date.now()}`,
        shortCode: "pending",
        originalUrl: url,
        userId: "pending",
        customAlias: null,
        description: null,
        clicks: 0,
        isActive: true,
        expiresAt: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      queryClient.setQueryData(["links"], [optimisticLink, ...previous]);
      return { previous, tempId: optimisticLink.id };
    },
    onError: (err, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["links"], context.previous);
      }
      setCreateError(err instanceof Error ? err.message : "Failed to shorten link");
    },
    onSuccess: (payload, _variables, context) => {
      setShortUrl(payload.shortUrl);
      setOriginalUrl("");
      queryClient.setQueryData<ShortenedUrl[]>(["links"], (current) => {
        const existing = current ?? [];
        const withoutTemp = context?.tempId
          ? existing.filter((item) => item.id !== context.tempId)
          : existing;
        return [payload.data, ...withoutTemp];
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["links"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteLinkAction,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["links"] });
      const previous = queryClient.getQueryData<ShortenedUrl[]>(["links"]) ?? [];
      queryClient.setQueryData(["links"], previous.filter((link) => link.id !== id));
      return { previous };
    },
    onError: (_err, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["links"], context.previous);
      }
    },
    onSuccess: (result) => {
      if (!result.success) {
        console.error("Delete failed:", result.error);
      }
    },
    onSettled: () => {
      setDeleteConfirmId(null);
      queryClient.invalidateQueries({ queryKey: ["links"] });
    },
  });

  const handleDeleteConfirm = () => {
    if (deleteConfirmId) {
      deleteMutation.mutate(deleteConfirmId);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmId(null);
  };

  const errorMessage = isError
    ? error instanceof Error
      ? error.message
      : "Failed to load links"
    : null;

  function handleCreate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = originalUrl.trim();
    if (!value) return;
    createMutation.mutate(value);
  }

  return (
    <main className="p-6 space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Manage your shortened links and track engagement.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Create a new short link</CardTitle>
          <CardDescription>
            Paste a long URL and instantly get a short link for sharing.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form className="flex flex-col gap-3 sm:flex-row sm:items-end" onSubmit={handleCreate}>
            <div className="flex-1 space-y-2">
              <label className="text-xs font-medium text-muted-foreground" htmlFor="url-input">
                Long URL
              </label>
              <Input
                id="url-input"
                type="url"
                required
                placeholder="https://example.com/your/long/url"
                value={originalUrl}
                onChange={(event) => setOriginalUrl(event.target.value)}
                disabled={createMutation.isPending}
              />
            </div>
            <Button type="submit" size="lg" disabled={createMutation.isPending}>
              {createMutation.isPending ? "Shortening..." : "Shorten URL"}
            </Button>
          </form>

          {createError && (
            <p className="text-sm text-red-600">{createError}</p>
          )}

          {shortUrl && (
            <div className="rounded-md border bg-muted/70 px-3 py-2 text-sm">
              <span className="text-muted-foreground">Short link:</span>{" "}
              <a
                className="text-primary hover:underline"
                href={shortUrl}
                target="_blank"
                rel="noreferrer"
              >
                {shortUrl}
              </a>
            </div>
          )}
        </CardContent>
      </Card>

      {isLoading ? (
        <Card>
          <CardContent className="py-6 text-sm text-muted-foreground">
            Loading links…
          </CardContent>
        </Card>
      ) : errorMessage ? (
        <Card>
          <CardContent className="py-6 text-sm text-red-600">
            {errorMessage}
          </CardContent>
        </Card>
      ) : links.length === 0 ? (
        <Card>
          <CardContent className="py-6 text-sm text-muted-foreground">
            No links yet. Create your first shortened URL to see it here.
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Your links</CardTitle>
            <CardDescription>
              All active links for your account.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Short link</TableHead>
                  <TableHead>Original URL</TableHead>
                  <TableHead>Clicks</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {links.map((link) => {
                  const isPending = link.shortCode === "pending";
                  const shortLinkLabel = baseUrl
                    ? `${baseUrl}/l/${link.shortCode}`
                    : `/l/${link.shortCode}`;

                  return (
                    <TableRow key={link.id}>
                      <TableCell className="font-medium">
                        {isPending ? (
                          <span className="text-muted-foreground">Generating…</span>
                        ) : (
                          <a
                            className="text-primary hover:underline"
                            href={shortLinkLabel}
                            target="_blank"
                            rel="noreferrer"
                          >
                            {shortLinkLabel}
                          </a>
                        )}
                        {link.customAlias && !isPending && (
                          <div className="text-xs text-muted-foreground">
                            Alias: {link.customAlias}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <a
                          className="text-muted-foreground hover:underline"
                          href={link.originalUrl}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {link.originalUrl}
                        </a>
                      </TableCell>
                      <TableCell>{link.clicks}</TableCell>
                      <TableCell>
                        {new Date(link.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {link.isActive ? (
                          <Badge className="bg-emerald-100 text-emerald-700">
                            Active
                          </Badge>
                        ) : (
                          <Badge variant="secondary">Disabled</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="default"
                          size="sm"
                          className="bg-red-600 hover:bg-red-700"
                          onClick={() => setDeleteConfirmId(link.id)}
                          disabled={deleteMutation.isPending || isPending}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {deleteConfirmId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-96 shadow-lg">
            <CardHeader>
              <CardTitle>Delete Link?</CardTitle>
              <CardDescription>
                This action cannot be undone. The link will be permanently disabled.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={handleDeleteCancel}
                disabled={deleteMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                variant="default"
                className="bg-red-600 hover:bg-red-700"
                onClick={handleDeleteConfirm}
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? "Deleting..." : "Delete"}
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </main>
  );
}
