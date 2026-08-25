"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { isAdminLoggedIn, getAdminToken } from "@/lib/adminAuth";
import { fetchHealthDeclarations, UnauthorizedError, type HealthDeclarationSubmission } from "@/lib/api";
import { QUESTIONS } from "@/components/HealthDeclarationForm";
import Spinner from "@/components/Spinner";

const PAGE_SIZE = 20;
const SEARCH_DEBOUNCE_MS = 300;

type LoadState = "checking" | "loading" | "loadingMore" | "loaded" | "error";

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
                <span className="admin-submission-name">{submission.fullName}</span>
                <span className="admin-submission-date">
                  {new Date(submission.submittedAt).toLocaleDateString(language === "he" ? "he-IL" : "en-US")}
                </span>
              </summary>
              <div className="admin-submission-body">
                <p className="admin-submission-field">
                  <strong>מספר תעודת זהות:</strong> {submission.idNumber}
                </p>
                <p className="admin-submission-field">
                  <strong>טלפון:</strong> {submission.phone}
                </p>
                <ul className="admin-answer-list">
                  {QUESTIONS.map((question) => {
                    const answer = submission.answers[question.id];
                    const detail = submission.details?.[question.id];
                    return (
                      <li className="admin-answer-item" key={question.id}>
                        <span className="admin-answer-question">{question.text}</span>
                        <span className={`admin-answer-value ${answer === "yes" ? "admin-answer-yes" : "admin-answer-no"}`}>
                          {answer === "yes" ? t("adminAnswerYes") : t("adminAnswerNo")}
                        </span>
                        {answer === "yes" && detail && (
                          <span className="admin-answer-detail">
                            {t("adminDetailLabel")}: {detail}
                          </span>
                        )}
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
            {loadState === "loadingMore" ? t("adminLoadingMore") : t("adminLoadMore")}
          </button>
        </div>
      )}
    </section>
  );
}
