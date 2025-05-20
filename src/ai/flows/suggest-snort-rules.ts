// 'use server';

/**
 * @fileOverview Provides AI-driven suggestions for optimizing Snort rules based on network traffic analysis.
 *
 * - suggestSnortRules - A function that handles the suggestion of Snort rules.
 * - SuggestSnortRulesInput - The input type for the suggestSnortRules function.
 * - SuggestSnortRulesOutput - The return type for the suggestSnortRules function.
 */

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestSnortRulesInputSchema = z.object({
  networkTrafficAnalysis: z.string().describe('The analysis of network traffic data.'),
  existingRules: z.string().optional().describe('The existing Snort rules, if any.'),
});
export type SuggestSnortRulesInput = z.infer<typeof SuggestSnortRulesInputSchema>;

const SuggestSnortRulesOutputSchema = z.object({
  suggestedRules: z.string().describe('The AI-driven suggestions for optimizing Snort rules.'),
  explanation: z.string().describe('Explanation of why the rule was suggested'),
});
export type SuggestSnortRulesOutput = z.infer<typeof SuggestSnortRulesOutputSchema>;

export async function suggestSnortRules(input: SuggestSnortRulesInput): Promise<SuggestSnortRulesOutput> {
  return suggestSnortRulesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestSnortRulesPrompt',
  input: {schema: SuggestSnortRulesInputSchema},
  output: {schema: SuggestSnortRulesOutputSchema},
  prompt: `You are an expert security analyst specializing in Snort intrusion detection systems. You will analyze network traffic data and provide suggestions for optimizing Snort rules.

  Network Traffic Analysis: {{{networkTrafficAnalysis}}}

  Existing Snort Rules (if any): {{{existingRules}}}

  Based on the network traffic analysis and existing rules, provide AI-driven suggestions for optimizing Snort rules to detect emerging threats. Explain why the rule is important to add or modify.
  `,
});

const suggestSnortRulesFlow = ai.defineFlow(
  {
    name: 'suggestSnortRulesFlow',
    inputSchema: SuggestSnortRulesInputSchema,
    outputSchema: SuggestSnortRulesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
