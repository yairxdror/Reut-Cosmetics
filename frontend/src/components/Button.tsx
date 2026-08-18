import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "blue" | "red";
  children: ReactNode;
}

export default function Button({ variant = "blue", className = "", children, ...rest }: ButtonProps) {
  const variantClass = variant === "blue" ? "btn-blue" : "btn-red";
  return (
    <button className={`btn ${variantClass} ${className}`.trim()} {...rest}>
      {children}
    </button>
  );
}
