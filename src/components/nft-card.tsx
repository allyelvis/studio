import type { NFT } from '@/lib/types';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

interface NftCardProps {
  nft: NFT;
}

export default function NftCard({ nft }: NftCardProps) {
  return (
    <Card className="flex flex-col overflow-hidden transition-all duration-300 ease-in-out hover:shadow-xl hover:scale-105">
      <CardHeader className="p-0">
        <Link href={`/nft/${nft.id}`} className="block">
          <div className="aspect-square w-full overflow-hidden">
            <Image
              src={nft.imageUrl}
              alt={nft.name}
              width={400}
              height={400}
              className="object-cover w-full h-full transition-transform duration-300 ease-in-out group-hover:scale-110"
              data-ai-hint={nft.metadata.ai_hint || "nft image"}
              priority={nft.id === "1" || nft.id === "2"} // Prioritize first few images
            />
          </div>
        </Link>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <CardTitle className="text-lg mb-1 truncate">
          <Link href={`/nft/${nft.id}`} className="hover:text-primary transition-colors">
            {nft.name}
          </Link>
        </CardTitle>
        <p className="text-sm text-muted-foreground truncate">
          Owner: {nft.owner}
        </p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button asChild variant="outline" className="w-full group">
          <Link href={`/nft/${nft.id}`}>
            View Details
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
