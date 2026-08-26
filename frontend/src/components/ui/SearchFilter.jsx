import React from 'react';
import { Search, X } from 'lucide-react';
import Input from './Input.jsx';
import Select from './Select.jsx';
import Button from './Button.jsx';

export default function SearchFilter({
  searchValue,
  onSearchChange,
  searchPlaceholder = 'Search...',
  filters = [],
  onClearFilters
}) {
  const hasActiveFilters = searchValue || filters.some(f => f.value);

  return (
    <div className="flex flex-col sm:flex-row items-end gap-3 bg-white p-4 rounded-lg border border-gray-200 shadow-sm mb-6">
      <div className="flex-1 w-full">
        <Input
          placeholder={searchPlaceholder}
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          icon={Search}
          className="w-full"
        />
      </div>
      
      {filters.map((filter, idx) => (
        <div key={idx} className="w-full sm:w-48">
          <Select
            options={filter.options}
            value={filter.value}
            onChange={(e) => filter.onChange(e.target.value)}
            placeholder={filter.label}
          />
        </div>
      ))}

      {hasActiveFilters && onClearFilters && (
        <Button 
          variant="ghost" 
          onClick={onClearFilters}
          icon={X}
          className="w-full sm:w-auto shrink-0"
        >
          Clear
        </Button>
      )}
    </div>
  );
}
