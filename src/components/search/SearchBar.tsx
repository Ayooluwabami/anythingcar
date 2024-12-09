import { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useMediaQuery } from '@/hooks/useMediaQuery';

interface SearchBarProps {
  onSearch: (filters: SearchFilters) => void;
}

export interface SearchFilters {
  query: string;
  carModel?: string;
  priceRange?: string;
  availability?: boolean;
  sortBy?: string;
}

export function SearchBar({ onSearch }: SearchBarProps) {
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    carModel: '',
    priceRange: 'all',
    availability: true,
    sortBy: 'price_asc'
  });

  const [showFilters, setShowFilters] = useState(false);
  const isMobile = useMediaQuery('(max-width: 768px)');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(filters);
  };

  const clearFilters = () => {
    setFilters({
      query: '',
      carModel: '',
      priceRange: 'all',
      availability: true,
      sortBy: 'price_asc'
    });
    onSearch({
      query: '',
      carModel: '',
      priceRange: 'all',
      availability: true,
      sortBy: 'price_asc'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <form onSubmit={handleSearch} className="space-y-4">
        <div className="flex flex-col md:flex-row gap-2">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search by location, car model..."
              value={filters.query}
              onChange={(e) => setFilters({ ...filters, query: e.target.value })}
              className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <Filter className="h-5 w-5" />
              {!isMobile && 'Filters'}
            </Button>
            <Button type="submit" className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              {!isMobile && 'Search'}
            </Button>
          </div>
        </div>

        {showFilters && (
          <div className="space-y-4 md:space-y-0 md:grid md:grid-cols-4 gap-4 pt-4 border-t">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Car Model
              </label>
              <input
                type="text"
                value={filters.carModel}
                onChange={(e) => setFilters({ ...filters, carModel: e.target.value })}
                className="w-full rounded-md border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="Enter car model"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price Range
              </label>
              <select
                value={filters.priceRange}
                onChange={(e) => setFilters({ ...filters, priceRange: e.target.value })}
                className="w-full rounded-md border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                <option value="all">All Prices</option>
                <option value="0-50000">Under ₦50,000</option>
                <option value="50000-100000">₦50,000 - ₦100,000</option>
                <option value="100000+">Above ₦100,000</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sort By
              </label>
              <select
                value={filters.sortBy}
                onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                className="w-full rounded-md border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating">Rating</option>
                <option value="newest">Newest First</option>
              </select>
            </div>

            <div className="flex items-end">
              <Button
                type="button"
                variant="outline"
                onClick={clearFilters}
                className="w-full flex items-center justify-center gap-2"
              >
                <X className="h-4 w-4" />
                Clear Filters
              </Button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}