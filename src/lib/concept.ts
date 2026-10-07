import "server-only";

/*
 * CONCEPT ONLY.
 *
 * Stands in for what acta-api will provide: a random access code generated per
 * credential at issuance, and the decrypted payload it unlocks. Kept in a
 * server-only module so neither ever reaches the browser bundle.
 */

/** The single access code accepted by this concept, for every credential. */
export const CONCEPT_SECRET_CODE = "ACTA-7Q2K-9XPM";

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
