"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { loginAdmin, InvalidCredentialsError } from "@/lib/api";
import { useLanguage } from "@/context/LanguageContext";
import { setAdminToken } from "@/lib/adminAuth";
import { EyeIcon, EyeOffIcon } from "@/components/icons";
import Editable from "@/components/Editable";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 6;

export default function LoginForm() {
  const { t } = useLanguage();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; form?: string }>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const nextErrors: typeof errors = {};
    if (!email.trim()) {
      nextErrors.email = t("loginEmailRequired");
    } else if (!EMAIL_PATTERN.test(email.trim())) {
      nextErrors.email = t("loginEmailInvalid");
    }
    if (!password) {
      nextErrors.password = t("loginPasswordRequired");
    } else if (password.length < MIN_PASSWORD_LENGTH) {
      nextErrors.password = t("loginPasswordTooShort");
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setStatus("submitting");
    try {
      const { token } = await loginAdmin(email.trim(), password);
      setAdminToken(token);
      setStatus("success");
      router.push("/");
    } catch (err) {
      setStatus("idle");
      const message = err instanceof InvalidCredentialsError ? t("loginInvalidCredentials") : t("loginGenericError");
      setErrors({ form: message });
    }
  }

  if (status === "success") {
    return (
      <div className="form-success-banner">
        <h3 className="text-gold">{t("loginSuccessTitle")}</h3>
        <p>{t("loginSuccessText")}</p>
      </div>
    );
  }

  return (
    <form className="health-form login-form" onSubmit={handleSubmit} noValidate>
      <section className="form-section">
        <div className="form-field">
          <label className="form-label" htmlFor="email">
            {t("loginEmailLabel")}
          </label>
          <input
            id="email"
            className="form-input"
            type="email"
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {errors.email && <span className="form-error">{errors.email}</span>}
        </div>

        <div className="form-field">
          <label className="form-label" htmlFor="password">
            {t("loginPasswordLabel")}
          </label>
          <div className="password-field-wrap">
            <input
              id="password"
              className="form-input"
              type={isPasswordVisible ? "text" : "password"}
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setIsPasswordVisible((prev) => !prev)}
              aria-label={isPasswordVisible ? "Hide password" : "Show password"}
            >
              {isPasswordVisible ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
            </button>
          </div>
          {errors.password && <span className="form-error">{errors.password}</span>}
        </div>

        <div className="form-submit-row">
          <button className="btn btn-black" type="submit" disabled={status === "submitting"}>
            {status === "submitting" ? t("loginSubmitting") : <Editable contentKey="loginSubmit">{t("loginSubmit")}</Editable>}
          </button>
          {errors.form && <span className="form-error">{errors.form}</span>}
        </div>
      </section>
    </form>
  );
}
