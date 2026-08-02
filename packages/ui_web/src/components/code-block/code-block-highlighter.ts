/**
 * The syntax highlighting contract for TRCodeBlock.
 *
 * This module intentionally has no imports and no runtime code. TRCodeBlock does
 * not name a highlighter; consumers inject one, so the set of supported
 * languages is a consumer decision rather than a Tinyrack decision.
 *
 * Token fields mirror Shiki's `ThemedToken` so the Shiki adapters in
 * `@tinyrack/ui/highlighters/*` stay near-identity functions.
 */

export type TRCodeToken = {
  bgColor?: string;
  color?: string;
  content: string;
  fontStyle?: number;
  htmlStyle?: Record<string, string>;
  offset: number;
};

export type TRCodeHighlightRequest = {
  code: string;
  language: string;
};

export type TRCodeHighlightResult = {
  backgroundColor?: string | undefined;
  color?: string | undefined;
  lines: readonly (readonly TRCodeToken[])[];
};

/**
 * Resolves `null` when the highlighter has no grammar for `request.language`.
 *
 * The `null` / `throw` distinction is load-bearing: an unsupported language is
 * an expected outcome whose correct rendering is plain text, while a thrown
 * error is a genuine fault. Both reach `onHighlightFailure`, separated by
 * `TRCodeHighlightFailure.reason`.
 */
export type TRCodeHighlighter = (
  request: TRCodeHighlightRequest,
) => Promise<TRCodeHighlightResult | null>;

export type TRCodeHighlightFailureReason =
  | 'highlight-failed'
  | 'no-highlighter'
  | 'unsupported-language';

export type TRCodeHighlightFailure = {
  code: string;
  error?: unknown;
  language: string;
  reason: TRCodeHighlightFailureReason;
};

/** Value of the `data-highlight` attribute rendered on the `pre` element. */
export type TRCodeHighlightState =
  | 'error'
  | 'highlighted'
  | 'no-highlighter'
  | 'pending'
  | 'plain'
  | 'unsupported';
