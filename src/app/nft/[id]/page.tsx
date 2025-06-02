'use client'; // Required because we're using useState for aiGeneratedDescription

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation'; // Correct hook for App Router
import Image from 'next/image';
import type { NFT, NFTAttribute } from '@/lib/types';
import AiDescriptionGenerator from './components/ai-description-generator';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Icons } from '@/components/icons';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

async function getNftById(id: string): Promise<NFT | null> {
  try {
    const response = await fetch('/data/nfts.json'); // Fetch from public folder
    if (!response.ok) {
      console.error('Failed to fetch NFT list');
      return null;
    }
    const nfts: NFT[] = await response.json();
    const nft = nfts.find(n => n.id === id);
    return nft || null;
  } catch (error) {
    console.error('Error fetching NFT by ID:', error);
    return null;
  }
}


export default function NftDetailPage() {
  const params = useParams();
  const id = typeof params.id === 'string' ? params.id : '';
  
  const [nft, setNft] = useState<NFT | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentAiDescription, setCurrentAiDescription] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (id) {
      setIsLoading(true);
      getNftById(id)
        .then(data => {
          if (data) {
            setNft(data);
            setCurrentAiDescription(data.aiGeneratedDescription); // Initialize with potentially existing
          } else {
            setError('NFT not found.');
          }
        })
        .catch(err => {
          console.error(err);
          setError('Failed to load NFT data.');
        })
        .finally(() => setIsLoading(false));
    } else {
      setError('No NFT ID provided.');
      setIsLoading(false);
    }
  }, [id]);

  const handleDescriptionGenerated = (description: string) => {
    setCurrentAiDescription(description);
    // Optionally, update the main NFT state if you want it to persist across re-renders of this component
    if (nft) {
      setNft(prevNft => prevNft ? { ...prevNft, aiGeneratedDescription: description } : null);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Skeleton className="h-10 w-3/4 mb-6" />
        <div className="grid md:grid-cols-2 gap-8">
          <Skeleton className="w-full aspect-square rounded-lg" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-1/2" />
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-10 w-1/3" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-2xl text-destructive mb-4">{error}</p>
        <Button asChild>
          <Link href="/">Go back to Gallery</Link>
        </Button>
      </div>
    );
  }

  if (!nft) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-2xl text-muted-foreground mb-4">NFT data could not be loaded.</p>
         <Button asChild>
          <Link href="/">Go back to Gallery</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
       <Button variant="outline" asChild className="mb-6">
        <Link href="/">
          <Icons.arrowRight className="mr-2 h-4 w-4 transform rotate-180" />
          Back to Gallery
        </Link>
      </Button>
      <Card className="overflow-hidden shadow-xl">
        <div className="grid md:grid-cols-2 gap-0">
          <div className="p-2 md:p-0">
            <Image
              src={nft.imageUrl}
              alt={nft.name}
              width={600}
              height={600}
              className="object-cover w-full h-full md:rounded-l-lg"
              data-ai-hint={nft.metadata.ai_hint || "nft image"}
              priority
            />
          </div>
          <div className="p-6 md:p-8 flex flex-col">
            <CardHeader className="p-0 mb-4">
              <CardTitle className="text-4xl font-bold text-primary">{nft.name}</CardTitle>
              <CardDescription className="text-lg text-muted-foreground">
                Owned by: <span className="font-medium text-foreground">{nft.owner}</span>
              </CardDescription>
            </CardHeader>

            <CardContent className="p-0 flex-grow space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Original Description</h3>
                <p className="text-foreground/80 leading-relaxed">
                  {nft.description || <span className="italic text-muted-foreground">No original description available.</span>}
                </p>
              </div>

              {currentAiDescription && (
                <div>
                  <h3 className="text-lg font-semibold mb-2 flex items-center">
                    <Icons.sparkles className="mr-2 h-5 w-5 text-accent" />
                    AI Generated Description
                  </h3>
                  <p className="text-foreground/80 leading-relaxed italic">
                    {currentAiDescription}
                  </p>
                </div>
              )}
              
              <Separator />

              {nft.attributes && nft.attributes.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Attributes</h3>
                  <div className="flex flex-wrap gap-2">
                    {nft.attributes.map((attr: NFTAttribute, index: number) => (
                      <Badge key={index} variant="secondary" className="px-3 py-1 text-sm">
                        <span className="font-medium">{attr.trait_type}:</span>&nbsp;{attr.value}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {nft.metadata && Object.keys(nft.metadata).filter(k => k !== 'ai_hint' && k !== 'attributes' && !nft.attributes?.find(attr => attr.trait_type.toLowerCase() === k.toLowerCase())).length > 0 && (
                 <div>
                  <h3 className="text-lg font-semibold mb-3">Additional Metadata</h3>
                  <div className="flex flex-wrap gap-2">
                  {Object.entries(nft.metadata)
                    .filter(([key]) => key !== 'ai_hint' && key !== 'attributes' && !nft.attributes?.find(attr => attr.trait_type.toLowerCase() === key.toLowerCase())) // Avoid duplicating attributes if they are also in metadata
                    .map(([key, value]) => (
                      <Badge key={key} variant="outline" className="px-3 py-1 text-sm">
                         <span className="font-medium capitalize">{key.replace(/_/g, ' ')}:</span>&nbsp;{typeof value === 'object' ? JSON.stringify(value) : String(value)}
                      </Badge>
                  ))}
                  </div>
                </div>
              )}
            </CardContent>
            
            <div className="mt-auto pt-6">
              <AiDescriptionGenerator 
                nft={{ name: nft.name, description: nft.description, metadata: nft.metadata }} 
                onDescriptionGenerated={handleDescriptionGenerated} 
              />
            </div>

          </div>
        </div>
      </Card>
    </div>
  );
}

// This function is needed for Next.js to know which dynamic routes to pre-render at build time.
// Since we are fetching data client-side, we can return an empty paths array
// or attempt to pre-render based on the JSON file if it's small and known at build time.
// For this exercise, assuming dynamic rendering is fine.
export async function generateStaticParams() {
  try {
    // This fetch needs to be adapted if run during build process, potentially reading from filesystem
    // For now, an example:
    const response = await fetch(new URL('/data/nfts.json', process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000').toString());
    if (!response.ok) {
      return [];
    }
    const nfts: NFT[] = await response.json();
    return nfts.map((nft) => ({
      id: nft.id,
    }));
  } catch (error) {
    console.warn("Could not fetch NFTs for static generation, dynamic routes will be generated on demand.", error);
    return [];
  }
}
