const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4001";

export interface Product {
  id: number;
  name: string;
  price: number;
}

export async function fetchProducts(): Promise<Product[]> {
  const res = await fetch(`${API_BASE_URL}/api/products`);
  if (!res.ok) {
    throw new Error(`Failed to fetch products: ${res.status}`);
  }
  return res.json();
}

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
