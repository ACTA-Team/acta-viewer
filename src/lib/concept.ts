import "server-only";

/*
 * CONCEPT ONLY.
 *
 * The viewer password is real: the issuer sets it per credential in the ACTA
 * back office and `@/lib/access-codes` checks it. What it unlocks is not yet:
 * this sample stands in for the decrypted payload until acta-api returns it.
 */

export interface RevealedField {
  label: string;
  value: string;
}

export interface RevealedContent {
  title: string;
  fields: RevealedField[];
  /** True while the content is sample data rather than the decrypted payload. */
  isSample: boolean;
}

/** Sample payload shown on unlock, until acta-api returns the real one. */
export const CONCEPT_CONTENT: RevealedContent = {
  title: "Certificate of Completion",
  isSample: true,
  fields: [
    { label: "Holder", value: "María Fernández Rojas" },
    { label: "Program", value: "Stellar Builders Bootcamp" },
    { label: "Institution", value: "ACTA" },
    { label: "Duration", value: "40 hours" },
    { label: "Issued on", value: "September 10, 2026" },
    { label: "Grade", value: "Passed with distinction" },
  ],
};
