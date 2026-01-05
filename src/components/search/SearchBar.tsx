import React, { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { cn } from '../../lib/utils';

interface SearchBarProps {
    value: string;
    onChange: (value: string) => void;
    suggestions?: string[];
    placeholder?: string;
    className?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
    value,
    onChange,
    suggestions = [],
    placeholder = 'Search influencers...',
    className,
}) => {
    const [isFocused, setIsFocused] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        setShowSuggestions(isFocused && suggestions.length > 0);
    }, [isFocused, suggestions]);

    const handleClear = () => {
        onChange('');
        inputRef.current?.focus();
    };

    const handleSuggestionClick = (suggestion: string) => {
        onChange(suggestion);
        setShowSuggestions(false);
        inputRef.current?.blur();
    };

    return (
        <div ref={containerRef} className={cn('relative', className)}>
            <div
                className={cn(
                    'flex items-center gap-3 px-4 py-3 bg-white border rounded-xl transition-all',
                    isFocused
                        ? 'border-orange-500 ring-2 ring-orange-100'
                        : 'border-gray-200 hover:border-gray-300'
                )}
            >
                <Search className={cn(
                    'w-5 h-5 transition-colors',
                    isFocused ? 'text-orange-500' : 'text-gray-400'
                )} />
                <input
                    ref={inputRef}
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder={placeholder}
                    className="flex-1 text-gray-900 placeholder-gray-400 outline-none bg-transparent"
                />
                {value && (
                    <button
                        onClick={handleClear}
                        className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X className="w-4 h-4 text-gray-400" />
                    </button>
                )}
            </div>

            {/* Suggestions dropdown */}
            {showSuggestions && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden z-50">
                    {suggestions.map((suggestion, index) => (
                        <button
                            key={index}
                            onMouseDown={() => handleSuggestionClick(suggestion)}
                            className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-700 transition-colors flex items-center gap-2"
                        >
                            <Search className="w-4 h-4 text-gray-400" />
                            <span>{suggestion}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};
