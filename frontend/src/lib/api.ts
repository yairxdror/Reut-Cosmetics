const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4001";

export interface HealthDeclarationPayload {
  fullName: string;
  idNumber: string;
  phone: string;
  answers: Record<string, "yes" | "no">;
  details: Record<string, string>;
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

export async function submitReview(payload: { name: string; rating: number; text: string }): Promise<CreatedReview> {
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
