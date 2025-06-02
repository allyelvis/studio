'use client';

import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Icons } from '@/components/icons';

interface NftGalleryControlsProps {
  searchTerm: string;
  onSearchTermChange: (term: string) => void;
  sortOption: string;
  onSortOptionChange: (option: string) => void;
}

export default function NftGalleryControls({
  searchTerm,
  onSearchTermChange,
  sortOption,
  onSortOptionChange,
}: NftGalleryControlsProps) {
  return (
    <div className="mb-8 flex flex-col sm:flex-row gap-4 items-center">
      <div className="relative w-full sm:max-w-xs">
        <Icons.search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Filter NFTs..."
          value={searchTerm}
          onChange={(e) => onSearchTermChange(e.target.value)}
          className="pl-10"
        />
      </div>
      <div className="w-full sm:w-auto">
        <Select value={sortOption} onValueChange={onSortOptionChange}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <Icons.chevronDown className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Sort by..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name-asc">Name (A-Z)</SelectItem>
            <SelectItem value="name-desc">Name (Z-A)</SelectItem>
            <SelectItem value="id-asc">ID (Asc)</SelectItem>
            <SelectItem value="id-desc">ID (Desc)</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
