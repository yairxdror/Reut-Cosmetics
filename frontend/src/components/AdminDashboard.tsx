"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { isAdminLoggedIn, getAdminToken } from "@/lib/adminAuth";
import { fetchHealthDeclarations, UnauthorizedError, type HealthDeclarationSubmission } from "@/lib/api";
import { QUESTIONS } from "@/components/HealthDeclarationForm";
import Spinner from "@/components/Spinner";
import Editable from "@/components/Editable";

const PAGE_SIZE = 20;
const SEARCH_DEBOUNCE_MS = 300;

const CONSENTS = [
  { field: "healthDeclarationConfirmed", textKey: "hdConfirmationText" },
  { field: "agreementAccepted", textKey: "hdAgreementCheckboxText" },
  { field: "privacyConsentAccepted", textKey: "hdPrivacyConsentText" },
] as const;

type LoadState = "checking" | "loading" | "loadingMore" | "loaded" | "error";

// Only a stored literal true counts as checked, so a record with a false,
// missing or malformed flag can never be displayed as a confirmation.
function consentBadge(value: unknown) {
  if (value === true) return { className: "admin-consent-checked", labelKey: "adminConsentChecked" } as const;
  if (value === false) return { className: "admin-consent-unchecked", labelKey: "adminConsentNotChecked" } as const;
  return { className: "admin-consent-unchecked", labelKey: "adminConsentNotRecorded" } as const;
}

// Anything other than an explicit "yes"/"no" is unanswered — it must never
// fall through to "no", which would read as a real answer from the customer.
function answerBadge(answer: unknown) {
  if (answer === "yes") return { className: "admin-answer-yes", labelKey: "adminAnswerYes" } as const;
  if (answer === "no") return { className: "admin-answer-no", labelKey: "adminAnswerNo" } as const;
  return { className: "admin-answer-missing", labelKey: "adminAnswerMissing" } as const;
}

function hasDeclarationIssue(submission: HealthDeclarationSubmission) {
  return (
    CONSENTS.some(({ field }) => submission[field] !== true) ||
    QUESTIONS.some(({ id }) => answerBadge(submission.answers?.[id]).labelKey === "adminAnswerMissing")
  );
}

export default function AdminDashboard() {
  const { t, language } = useLanguage();
  const router = useRouter();
  const [submissions, setSubmissions] = useState<HealthDeclarationSubmission[]>([]);
  const [loadState, setLoadState] = useState<LoadState>("checking");
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [committedSearch, setCommittedSearch] = useState("");
  const [hasMore, setHasMore] = useState(false);
  const isFirstSearchRun = useRef(true);

  const loadPage = useCallback(
    (search: string, offset: number, append: boolean) => {
      if (!isAdminLoggedIn()) {
        router.replace("/login");
        return;
      }
      const token = getAdminToken();
      if (!token) {
        router.replace("/login");
        return;
      }

      setLoadState(append ? "loadingMore" : "loading");
      fetchHealthDeclarations(token, { search, offset, limit: PAGE_SIZE })
        .then((page) => {
          setSubmissions((prev) => (append ? [...prev, ...page.items] : page.items));
          setHasMore(page.hasMore);
          setLoadState("loaded");
          setHasLoadedOnce(true);
        })
        .catch((err) => {
          if (err instanceof UnauthorizedError) {
            router.replace("/login");
          } else {
            setLoadState("error");
          }
        });
    },
    [router]
  );

  useEffect(() => {
    loadPage("", 0, false);
  }, [loadPage]);

  useEffect(() => {
    if (isFirstSearchRun.current) {
      isFirstSearchRun.current = false;
      return;
    }
    const handle = setTimeout(() => {
      const term = searchInput.trim();
      setCommittedSearch(term);
      loadPage(term, 0, false);
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(handle);
  }, [searchInput, loadPage]);

  function handleLoadMore() {
    loadPage(committedSearch, submissions.length, true);
  }

  // Only replace the whole page with a bare status message before anything
  // has ever loaded. Once the search box has mounted once, it needs to stay
  // mounted across later searches — otherwise every debounced re-fetch
  // unmounts and remounts the <input>, dropping focus after every keystroke.
  if (!hasLoadedOnce && (loadState === "checking" || loadState === "loading")) {
    return (
      <div className="admin-status">
        <Spinner />
      </div>
    );
  }

  if (!hasLoadedOnce && loadState === "error") {
    return <p className="admin-status">{t("adminHealthDeclarationsError")}</p>;
  }

  return (
    <section>
      <h1 className="text-gold" style={{ textAlign: "center" }}>
        {t("adminDashboardTitle")}
      </h1>

      <h2 className="form-section-title text-gold admin-section-title">{t("adminHealthDeclarationsTitle")}</h2>

      <div className="admin-search-row">
        <div className="admin-search-wrap">
          <input
            type="text"
            className="form-input admin-search-input"
            placeholder={t("adminSearchPlaceholder")}
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          {searchInput && (
            <button
              type="button"
              className="admin-search-clear"
              onClick={() => setSearchInput("")}
              aria-label={t("adminClearSearch")}
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {loadState === "loading" && (
        <div className="admin-status">
          <Spinner />
        </div>
      )}

      {loadState === "error" && <p className="admin-status">{t("adminHealthDeclarationsError")}</p>}

      {loadState !== "loading" && loadState !== "error" && submissions.length === 0 && (
        <p className="admin-status">
          {committedSearch ? t("adminNoSearchResults") : t("adminHealthDeclarationsEmpty")}
        </p>
      )}

      {loadState !== "loading" && loadState !== "error" && submissions.length > 0 && (
        <div className="admin-submission-list">
          {submissions.map((submission) => (
            <details className="admin-submission" key={submission.id}>
              <summary className="admin-submission-summary">
                <span className="admin-submission-name">
                  {submission.fullName}
                  {hasDeclarationIssue(submission) && (
                    <span className="admin-consent-alert">{t("adminDeclarationIssue")}</span>
                  )}
                </span>
                <span className="admin-submission-date">
                  {new Date(submission.submittedAt).toLocaleDateString(language === "he" ? "he-IL" : "en-US")}
                </span>
              </summary>
              <div className="admin-submission-body">
                <p className="admin-submission-field">
                  <strong>{t("hdIdNumberLabel")}:</strong> {submission.idNumber}
                </p>
                <p className="admin-submission-field">
                  <strong>{t("hdPhoneLabel")}:</strong> {submission.phone}
                </p>
                <ul className="admin-answer-list">
                  {QUESTIONS.map((question) => {
                    const answer = submission.answers?.[question.id];
                    const detail = submission.details?.[question.id];
                    const badge = answerBadge(answer);
                    return (
                      <li className="admin-answer-item" key={question.id}>
                        <span className="admin-answer-question">{t(question.textKey)}</span>
                        <span className={`admin-answer-value ${badge.className}`}>{t(badge.labelKey)}</span>
                        {answer === "yes" && detail && (
                          <span className="admin-answer-detail">
                            {t("adminDetailLabel")}: {detail}
                          </span>
                        )}
                      </li>
                    );
                  })}
                </ul>
                <h3 className="admin-consents-title text-gold">{t("adminConsentsTitle")}</h3>
                <ul className="admin-answer-list admin-consents-list">
                  {CONSENTS.map(({ field, textKey }) => {
                    const badge = consentBadge(submission[field]);
                    return (
                      <li className="admin-answer-item" key={field}>
                        <span className="admin-answer-question">{t(textKey)}</span>
                        <span className={`admin-answer-value ${badge.className}`}>{t(badge.labelKey)}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </details>
          ))}
        </div>
      )}

      {hasMore && (loadState === "loaded" || loadState === "loadingMore") && (
        <div className="admin-load-more-row">
          <button type="button" className="btn btn-black" onClick={handleLoadMore} disabled={loadState === "loadingMore"}>
            {loadState === "loadingMore" ? t("adminLoadingMore") : <Editable contentKey="adminLoadMore">{t("adminLoadMore")}</Editable>}
          </button>
        </div>
      )}
    </section>
  );
}
