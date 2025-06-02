'use server';

/**
 * @fileOverview A flow to generate a short, engaging description for an NFT using AI, based on its metadata.
 *
 * - generateNftDescription - A function that handles the NFT description generation process.
 * - GenerateNftDescriptionInput - The input type for the generateNftDescription function.
 * - GenerateNftDescriptionOutput - The return type for the generateNftDescription function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const GenerateNftDescriptionInputSchema = z.object({
  name: z.string().describe('The name of the NFT.'),
  description: z.string().optional().describe('The existing description of the NFT, if available.'),
  metadata: z.record(z.any()).optional().describe('Additional metadata about the NFT.'),
});
export type GenerateNftDescriptionInput = z.infer<typeof GenerateNftDescriptionInputSchema>;

const GenerateNftDescriptionOutputSchema = z.object({
  description: z.string().describe('A short, engaging description of the NFT.'),
});
export type GenerateNftDescriptionOutput = z.infer<typeof GenerateNftDescriptionOutputSchema>;

export async function generateNftDescription(
  input: GenerateNftDescriptionInput
): Promise<GenerateNftDescriptionOutput> {
  return generateNftDescriptionFlow(input);
}

const generateNftDescriptionPrompt = ai.definePrompt({
  name: 'generateNftDescriptionPrompt',
  input: {schema: GenerateNftDescriptionInputSchema},
  output: {schema: GenerateNftDescriptionOutputSchema},
  prompt: `You are an AI that generates short, engaging descriptions for NFTs.

  Here is the NFT's name: {{name}}
  {{#if description}}
  Here is the existing description (use this to enhance the description if appropriate): {{description}}
  {{/if}}
  {{#if metadata}}
  Here is some metadata about the NFT:
  {{#each metadata}}
  - {{@key}}: {{this}}
  {{/each}}
  {{/if}}

  Generate a captivating description of the NFT in under 200 characters.
  Do not include any hashtags or mentions of marketplaces.
  `,
});

const generateNftDescriptionFlow = ai.defineFlow(
  {
    name: 'generateNftDescriptionFlow',
    inputSchema: GenerateNftDescriptionInputSchema,
    outputSchema: GenerateNftDescriptionOutputSchema,
  },
  async input => {
    const {output} = await generateNftDescriptionPrompt(input);
    return output!;
  }
);
