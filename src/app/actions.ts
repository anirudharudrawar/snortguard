"use server";

import { suggestSnortRules as suggestSnortRulesFlow } from '@/ai/flows/suggest-snort-rules';
import type { SuggestSnortRulesInput, SuggestSnortRulesOutput } from '@/ai/flows/suggest-snort-rules';

export async function suggestSnortRulesAction(input: SuggestSnortRulesInput): Promise<SuggestSnortRulesOutput | { error: string }> {
  try {
    // Basic validation (more robust validation could be added)
    if (!input.networkTrafficAnalysis || input.networkTrafficAnalysis.trim().length < 10) {
      return { error: "Network traffic analysis data is too short or missing." };
    }
    if (input.existingRules && input.existingRules.trim().length === 0) {
      // Treat empty string as no existing rules
      input.existingRules = undefined;
    }

    const result = await suggestSnortRulesFlow(input);
    return result;
  } catch (e) {
    console.error("Error in suggestSnortRulesAction:", e);
    const errorMessage = e instanceof Error ? e.message : "An unknown error occurred while suggesting Snort rules.";
    return { error: errorMessage };
  }
}
