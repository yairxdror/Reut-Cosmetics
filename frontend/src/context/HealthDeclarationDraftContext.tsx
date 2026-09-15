"use client";

import { createContext, useContext, useState, type Dispatch, type ReactNode, type SetStateAction } from "react";

export type YesNo = "yes" | "no";

export interface HealthDeclarationDraft {
  fullName: string;
  idNumber: string;
  phone: string;
  answers: Record<string, YesNo | undefined>;
  details: Record<string, string>;
  healthDeclarationConfirmed: boolean;
  agreementAccepted: boolean;
  privacyConsentAccepted: boolean;
}

export const EMPTY_HEALTH_DECLARATION: HealthDeclarationDraft = {
  fullName: "",
  idNumber: "",
  phone: "",
  answers: {},
  details: {},
  healthDeclarationConfirmed: false,
  agreementAccepted: false,
  privacyConsentAccepted: false,
};

const DraftContext = createContext<
  [HealthDeclarationDraft, Dispatch<SetStateAction<HealthDeclarationDraft>>] | null
>(null);

// The shared layout survives client navigation to the privacy policy and back.
// Keep the draft only in memory; a reload/tab close discards it.
export function HealthDeclarationDraftProvider({ children }: { children: ReactNode }) {
  const draft = useState(EMPTY_HEALTH_DECLARATION);
  return <DraftContext.Provider value={draft}>{children}</DraftContext.Provider>;
}

export function useHealthDeclarationDraft() {
  const draft = useContext(DraftContext);
  if (!draft) throw new Error("Health declaration requires its draft provider");
  return draft;
}
