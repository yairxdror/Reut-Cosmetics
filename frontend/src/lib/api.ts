export const API_BASE_URL =
  process.env.NEXT_PUBLIC_DEPLOY_TARGET === "firebase"
    ? ""
    : process.env.NEXT_PUBLIC_API_BASE_URL ||
      (process.env.NODE_ENV === "production" ? "" : "http://localhost:4001");

export interface HealthDeclarationPayload {
  fullName: string;
  idNumber: string;
  phone: string;
  answers: Record<string, "yes" | "no">;
  details: Record<string, string>;
  healthDeclarationConfirmed: boolean;
  agreementAccepted: boolean;
}

export async function submitHealthDeclaration(payload: HealthDeclarationPayload): Promise<{ id: number; submittedAt: string }> {
  const res = await fetch(`${API_BASE_URL}/api/health-declarations`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    throw new Error(`Failed to submit health declaration: ${res.status}`);
  }
  return res.json();
}

export interface HealthDeclarationSubmission extends HealthDeclarationPayload {
  id: number;
  submittedAt: string;
}

export class UnauthorizedError extends Error {}

export interface HealthDeclarationsPage {
  items: HealthDeclarationSubmission[];
  total: number;
  hasMore: boolean;
}

export async function fetchHealthDeclarations(
  token: string,
  options: { search?: string; offset?: number; limit?: number } = {}
): Promise<HealthDeclarationsPage> {
  const params = new URLSearchParams();
  if (options.search) params.set("search", options.search);
  if (options.offset) params.set("offset", String(options.offset));
  if (options.limit) params.set("limit", String(options.limit));
  const query = params.toString();

  const res = await fetch(`${API_BASE_URL}/api/health-declarations${query ? `?${query}` : ""}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (res.status === 401 || res.status === 403) {
    throw new UnauthorizedError("Not authorized");
  }
  if (!res.ok) {
    throw new Error(`Failed to load health declarations: ${res.status}`);
  }
  return res.json();
}

export interface Review {
  id: number;
  name: string;
  rating: number;
  text: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CreatedReview extends Review {
  editToken: string;
}

export async function fetchReviews(): Promise<Review[]> {
  const res = await fetch(`${API_BASE_URL}/api/reviews`);
  if (!res.ok) {
    throw new Error(`Failed to load reviews: ${res.status}`);
  }
  return res.json();
}

export class RateLimitError extends Error {}
export class EditNotAllowedError extends Error {}

export async function submitReview(
  payload: { name: string; rating: number; text: string; website?: string }
): Promise<CreatedReview> {
  const res = await fetch(`${API_BASE_URL}/api/reviews`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (res.status === 429) {
    throw new RateLimitError("Too many reviews submitted");
  }
  if (!res.ok) {
    throw new Error(`Failed to submit review: ${res.status}`);
  }
  return res.json();
}

export async function updateReview(
  id: number,
  editToken: string,
  payload: { name: string; rating: number; text: string }
): Promise<Review> {
  const res = await fetch(`${API_BASE_URL}/api/reviews/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...payload, editToken }),
  });
  if (res.status === 429) {
    throw new RateLimitError("Too many edit attempts");
  }
  if (res.status === 403 || res.status === 404) {
    throw new EditNotAllowedError("Edit not allowed");
  }
  if (!res.ok) {
    throw new Error(`Failed to update review: ${res.status}`);
  }
  return res.json();
}

export interface SiteContent {
  text: Record<string, { he: string; en: string }>;
  images: Record<string, string>;
}

export async function fetchSiteContent(): Promise<SiteContent> {
  const res = await fetch(`${API_BASE_URL}/api/content`);
  if (!res.ok) {
    throw new Error(`Failed to load site content: ${res.status}`);
  }
  return res.json();
}

export async function updateContentText(
  token: string,
  key: string,
  payload: { he: string; en: string }
): Promise<{ key: string; he: string; en: string }> {
  const res = await fetch(`${API_BASE_URL}/api/content/text/${key}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
  if (res.status === 401 || res.status === 403) {
    throw new UnauthorizedError("Not authorized");
  }
  if (!res.ok) {
    throw new Error(`Failed to update content: ${res.status}`);
  }
  return res.json();
}

export async function uploadContentImage(
  token: string,
  key: string,
  file: File
): Promise<{ key: string; url: string }> {
  const formData = new FormData();
  formData.append("image", file);

  // No Content-Type header here — the browser sets the multipart boundary
  // itself. Setting it manually (like every JSON call above does) strips
  // that boundary and breaks the upload.
  const res = await fetch(`${API_BASE_URL}/api/content/images/${key}`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  if (res.status === 401 || res.status === 403) {
    throw new UnauthorizedError("Not authorized");
  }
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.error || `Failed to upload image: ${res.status}`);
  }
  return res.json();
}

export interface FaqItem {
  id: number;
  heQuestion: string;
  enQuestion: string;
  heAnswer: string;
  enAnswer: string;
}

export type FaqFields = Omit<FaqItem, "id">;

export async function fetchFaqs(): Promise<FaqItem[]> {
  const res = await fetch(`${API_BASE_URL}/api/faq`);
  if (!res.ok) {
    throw new Error(`Failed to load FAQ: ${res.status}`);
  }
  return res.json();
}

export async function createFaq(token: string, fields: FaqFields): Promise<FaqItem> {
  const res = await fetch(`${API_BASE_URL}/api/faq`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(fields),
  });
  if (res.status === 401 || res.status === 403) {
    throw new UnauthorizedError("Not authorized");
  }
  if (!res.ok) {
    throw new Error(`Failed to add question: ${res.status}`);
  }
  return res.json();
}

export async function updateFaq(token: string, id: number, fields: FaqFields): Promise<FaqItem> {
  const res = await fetch(`${API_BASE_URL}/api/faq/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(fields),
  });
  if (res.status === 401 || res.status === 403) {
    throw new UnauthorizedError("Not authorized");
  }
  if (!res.ok) {
    throw new Error(`Failed to update question: ${res.status}`);
  }
  return res.json();
}

export async function deleteFaq(token: string, id: number): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/api/faq/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (res.status === 401 || res.status === 403) {
    throw new UnauthorizedError("Not authorized");
  }
  if (!res.ok) {
    throw new Error(`Failed to delete question: ${res.status}`);
  }
}

export class InvalidCredentialsError extends Error {}

export async function loginAdmin(email: string, password: string): Promise<{ token: string }> {
  const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (res.status === 401) {
    throw new InvalidCredentialsError("Invalid email or password");
  }
  if (!res.ok) {
    throw new Error(`Login failed: ${res.status}`);
  }
  return res.json();
}
