'use client';

import { useEffect, useState, useMemo } from 'react';
import type { NFT } from '@/lib/types';
import NftCard from '@/components/nft-card';
import NftGalleryControls from '@/components/nft-gallery-controls';
import { Skeleton } from '@/components/ui/skeleton';

export default function GalleryPage() {
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('name-asc');

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch('/data/nfts.json');
        if (!response.ok) {
          throw new Error(`Failed to fetch NFTs: ${response.statusText}`);
        }
        const data = await response.json();
        setNfts(data as NFT[]);
      } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  const filteredAndSortedNfts = useMemo(() => {
    let processedNfts = [...nfts];

    if (searchTerm) {
      processedNfts = processedNfts.filter(nft =>
        nft.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (nft.description && nft.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        nft.owner.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    processedNfts.sort((a, b) => {
      switch (sortOption) {
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'id-asc':
          return parseInt(a.id) - parseInt(b.id);
        case 'id-desc':
          return parseInt(b.id) - parseInt(a.id);
        default:
          return 0;
      }
    });

    return processedNfts;
  }, [nfts, searchTerm, sortOption]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center text-primary">Explore Our NFT Collection</h1>
      
      <NftGalleryControls
        searchTerm={searchTerm}
        onSearchTermChange={setSearchTerm}
        sortOption={sortOption}
        onSortOptionChange={setSortOption}
      />

      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="flex flex-col space-y-3">
              <Skeleton className="h-[300px] w-full rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[200px]" />
                <Skeleton className="h-4 w-[150px]" />
              </div>
            </div>
          ))}
        </div>
      )}

      {!isLoading && error && (
        <div className="text-center py-10">
          <p className="text-destructive text-lg">{error}</p>
          <p className="text-muted-foreground">Please try refreshing the page.</p>
        </div>
      )}

      {!isLoading && !error && filteredAndSortedNfts.length === 0 && (
        <div className="text-center py-10">
          <p className="text-xl text-muted-foreground">No NFTs found matching your criteria.</p>
        </div>
      )}

      {!isLoading && !error && filteredAndSortedNfts.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredAndSortedNfts.map(nft => (
            <NftCard key={nft.id} nft={nft} />
          ))}
        </div>
      )}
    </div>
  );
}
