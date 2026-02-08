export type ShortenedUrl = {
  id: string;
  shortCode: string;
  originalUrl: string;
  userId: string;
  customAlias: string | null;
  description: string | null;
  clicks: number;
  isActive: boolean;
  expiresAt: string | null;
  createdAt: string;
  updatedAt: string;
};

type LinksResponse = {
  success: boolean;
  data: ShortenedUrl[];
  error?: string;
};

type CreateLinkResponse = {
  success: boolean;
  data: ShortenedUrl;
  shortUrl: string;
  error?: string;
};

async function parseJson<T>(response: Response): Promise<T> {
  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    const message = (payload as { error?: string } | null)?.error ||
      "Request failed";
    throw new Error(message);
  }
  return payload as T;
}

export async function fetchLinks(): Promise<ShortenedUrl[]> {
  const response = await fetch("/api/shorten", { cache: "no-store" });
  const payload = await parseJson<LinksResponse>(response);
  return payload.data ?? [];
}

export async function createShortLink(originalUrl: string): Promise<CreateLinkResponse> {
  const response = await fetch("/api/shorten", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ originalUrl }),
  });

  return parseJson<CreateLinkResponse>(response);
}
