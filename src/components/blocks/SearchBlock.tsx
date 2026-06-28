'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Search } from 'lucide-react';

const MOCK_PRODUCTS = [
  { id: '1', title: 'Minimalist Leather Backpack', price: '$185.00', image: 'https://images.unsplash.com/photo-1547949003-9792a18a2601?w=120&auto=format&fit=crop&q=60' },
  { id: '2', title: 'Premium Wireless Headphones', price: '$299.00', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=120&auto=format&fit=crop&q=60' },
  { id: '3', title: 'Waterproof Sports Smartwatch', price: '$149.00', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=120&auto=format&fit=crop&q=60' },
  { id: '4', title: 'Classic Leather Wallet', price: '$49.00', image: 'https://images.unsplash.com/photo-1627124712831-f51b7bbd2407?w=120&auto=format&fit=crop&q=60' },
  { id: '5', title: 'Ergonomic Office Chair', price: '$349.00', image: 'https://images.unsplash.com/photo-1505797149-43b0069ec26b?w=120&auto=format&fit=crop&q=60' },
];

interface SearchBlockProps {
  settings: {
    placeholder?: string;
  };
}

export const SearchBlock: React.FC<SearchBlockProps> = ({ settings }) => {
  const { placeholder = 'Search products...' } = settings;
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<typeof MOCK_PRODUCTS>([]);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (val: string) => {
    setQuery(val);
    if (!val.trim()) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const filtered = MOCK_PRODUCTS.filter((p) =>
      p.title.toLowerCase().includes(val.toLowerCase())
    );
    setResults(filtered);
    setIsOpen(true);
  };

  return (
    <div ref={containerRef} className="w-full relative p-2">
      <div className="relative flex items-center">
        <input
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => query.trim() && setIsOpen(true)}
          placeholder={placeholder}
          className="w-full bg-slate-50 border border-slate-200/80 rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/25 focus:border-blue-500 transition-all text-slate-800"
        />
        <Search className="absolute left-3.5 text-slate-400" size={16} />
      </div>

      {/* Predictive Dropdown Results */}
      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-2 right-2 mt-2 bg-white border border-slate-100 rounded-xl shadow-lg overflow-hidden z-[999] max-h-64 overflow-y-auto animate-in fade-in slide-in-from-top-1 duration-100">
          <div className="p-2 text-[10px] uppercase font-bold tracking-wider text-slate-400 bg-slate-50 border-b border-slate-100">
            Products ({results.length})
          </div>
          <div className="divide-y divide-slate-50">
            {results.map((product) => (
              <div
                key={product.id}
                onClick={() => {
                  alert(`Navigating to ${product.title}`);
                  setIsOpen(false);
                  setQuery('');
                }}
                className="p-3 hover:bg-blue-50/20 flex items-center space-x-3 cursor-pointer transition-colors"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-10 h-10 object-cover rounded bg-slate-100"
                />
                <div className="flex-grow">
                  <h4 className="text-xs font-semibold text-slate-800 line-clamp-1">{product.title}</h4>
                  <p className="text-[10px] text-slate-500 mt-0.5">{product.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {isOpen && results.length === 0 && (
        <div className="absolute top-full left-2 right-2 mt-2 bg-white border border-slate-100 rounded-xl shadow-lg p-4 text-center text-xs text-slate-400 z-[999]">
          No products found for "{query}"
        </div>
      )}
    </div>
  );
};

export default SearchBlock;
