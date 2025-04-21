'use server';

/**
 * @fileOverview A translation AI agent.
 *
 * - translate - A function that handles the translation process.
 * - TranslateInput - The input type for the translate function.
 * - TranslateOutput - The return type for the translate function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const TranslateInputSchema = z.object({
  text: z.string().describe('The text to translate.'),
});
export type TranslateInput = z.infer<typeof TranslateInputSchema>;

const TranslateOutputSchema = z.object({
  translatedText: z.string().describe('The translated text in Vietnamese.'),
});
export type TranslateOutput = z.infer<typeof TranslateOutputSchema>;

export async function translate(input: TranslateInput): Promise<TranslateOutput> {
  return translateFlow(input);
}

const prompt = ai.definePrompt({
  name: 'translatePrompt',
  input: {
    schema: z.object({
      text: z.string().describe('The text to translate.'),
    }),
  },
  output: {
    schema: z.object({
      translatedText: z.string().describe('The translated text in Vietnamese.'),
    }),
  },
  prompt: `You are a translation expert. Translate the following text to Vietnamese:

Text: {{{text}}}`,
});

const translateFlow = ai.defineFlow<
  typeof TranslateInputSchema,
  typeof TranslateOutputSchema
>(
  {
    name: 'translateFlow',
    inputSchema: TranslateInputSchema,
    outputSchema: TranslateOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
