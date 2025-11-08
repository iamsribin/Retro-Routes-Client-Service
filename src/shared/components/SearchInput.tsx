import React from 'react';
import { Input } from '@/shared/components/ui/input';
import { Loader2, Search, X } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  showClearButton?: boolean;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  placeholder = 'Search...',
  loading = false,
  disabled = false,
  className = '',
  showClearButton = true,
}) => {
  const handleClear = () => {
    onChange('');
  };

  return (
    <div className={`relative ${className}`}>
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
        <Search className="h-4 w-4 text-gray-400" />
      </div>
      
      <Input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="pl-10 pr-20"
      />

      <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
        {loading && <Loader2 className="h-4 w-4 animate-spin text-gray-400" />}
        
        {showClearButton && value && !loading && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="h-6 w-6 p-0 hover:bg-gray-100"
            type="button"
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>
    </div>
  );
};