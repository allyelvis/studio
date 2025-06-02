export interface NFTAttribute {
  trait_type: string;
  value: string | number;
}

export interface NFTMetadata {
  ai_hint?: string;
  [key: string]: any;
}

export interface NFT {
  id: string;
  name: string;
  description?: string;
  aiGeneratedDescription?: string;
  imageUrl: string;
  owner: string;
  attributes?: NFTAttribute[]; // This can be part of metadata if preferred by AI. For display, it's fine here.
  metadata: NFTMetadata; // Specifically for AI and other structured data.
}
