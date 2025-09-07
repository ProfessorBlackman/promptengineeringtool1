/**
 * GeminiAnalysisResponse represents the structured output from Gemini's analysis.
 * - score: Similarity/quality score (0-100)
 * - justification: Comprehensive explanation of the score, referencing both similarity to the golden answer and whether the user's intent in the prompt description was met.
 */
export interface GeminiAnalysisResponse {
  score: number;
  justification: string;
}
