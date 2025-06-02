'use server';

import { generateNftDescription, type GenerateNftDescriptionInput } from '@/ai/flows/generate-nft-description';
import type { NFT } from '@/lib/types';

export async function generateDescriptionAction(nft: Pick<NFT, 'name' | 'description' | 'metadata'>): Promise<{ description?: string; error?: string }> {
  try {
    const input: GenerateNftDescriptionInput = {
      name: nft.name,
      description: nft.description,
      metadata: nft.metadata,
    };
    
    const result = await generateNftDescription(input);
    return { description: result.description };
  } catch (error) {
    console.error('Error generating NFT description:', error);
    return { error: error instanceof Error ? error.message : 'Failed to generate description.' };
  }
}
