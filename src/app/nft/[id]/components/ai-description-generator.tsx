'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { useToast } from '@/hooks/use-toast';
import { generateDescriptionAction } from '@/actions/nft-actions';
import type { NFT } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface AiDescriptionGeneratorProps {
  nft: Pick<NFT, 'name' | 'description' | 'metadata'>;
  onDescriptionGenerated: (description: string) => void;
}

export default function AiDescriptionGenerator({ nft, onDescriptionGenerated }: AiDescriptionGeneratorProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleGenerateDescription = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await generateDescriptionAction(nft);
      if (result.error) {
        throw new Error(result.error);
      }
      if (result.description) {
        onDescriptionGenerated(result.description);
        toast({
          title: "AI Description Generated!",
          description: "The new description has been added.",
        });
      } else {
        throw new Error("AI did not return a description.");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
      setError(errorMessage);
      toast({
        title: "Error Generating Description",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="mt-6 bg-secondary/50">
      <CardHeader>
        <CardTitle className="text-xl flex items-center">
          <Icons.sparkles className="mr-2 h-5 w-5 text-accent" />
          AI-Powered Description
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          Enhance this NFT's story with an AI-generated description based on its metadata.
        </p>
        <Button onClick={handleGenerateDescription} disabled={isLoading}>
          {isLoading ? (
            <>
              <Icons.loader className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            'Generate with AI'
          )}
        </Button>
        {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
      </CardContent>
    </Card>
  );
}
