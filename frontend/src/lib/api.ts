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
