"use client"
import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search, Check } from 'lucide-react';

interface Option {
    id: string;
    label: string;
}

interface SearchableDropdownProps {
    options: Option[];
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
    icon?: React.ReactNode;
    label?: string;
}

export default function SearchableDropdown({
    options,
    value,
    onChange,
    placeholder,
    icon,
    label,
}: SearchableDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const dropdownRef = useRef<HTMLDivElement>(null);

    const selectedOption = options.find((opt) => opt.id === value);

    const filteredOptions = options.filter((opt) =>
        opt.label.toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                setSearchTerm('');
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="space-y-1.5" ref={dropdownRef}>
            {label && (
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">
                    {label}
                </label>
            )}
            <div className="relative">
                {icon && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none z-10">
                        {icon}
                    </div>
                )}
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className={`w-full h-11 ${icon ? 'pl-10' : 'pl-4'
                        } pr-10 rounded-xl border border-slate-200 bg-slate-50/30 text-slate-900 text-sm focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 focus:outline-none transition-all hover:bg-white text-left flex items-center`}
                >
                    <span className={selectedOption ? 'text-slate-900' : 'text-slate-400'}>
                        {selectedOption ? selectedOption.label : placeholder}
                    </span>
                </button>
                <ChevronDown
                    className={`absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none transition-transform ${isOpen ? 'rotate-180' : ''
                        }`}
                />

                {isOpen && (
                    <div className="absolute z-50 w-full mt-2 bg-white rounded-xl border border-slate-200 shadow-xl">
                        <div className="p-2 border-b border-slate-100">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Search..."
                                    className="w-full h-9 pl-10 pr-4 rounded-lg border border-slate-200 bg-slate-50/50 text-sm focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 focus:outline-none"
                                    autoFocus
                                />
                            </div>
                        </div>
                        <div className="max-h-60 overflow-y-auto p-1" style={{ WebkitOverflowScrolling: 'touch' }}>
                            {filteredOptions.length === 0 ? (
                                <div className="px-3 py-6 text-center text-sm text-slate-400">
                                    No results found
                                </div>
                            ) : (
                                filteredOptions.map((option) => (
                                    <button
                                        key={option.id}
                                        type="button"
                                        onClick={() => {
                                            onChange(option.id);
                                            setIsOpen(false);
                                            setSearchTerm('');
                                        }}
                                        className={`w-full px-3 py-2 rounded-lg text-left text-sm transition-colors flex items-center justify-between ${option.id === value
                                                ? 'bg-cyan-50 text-cyan-700 font-medium'
                                                : 'text-slate-700 hover:bg-slate-50'
                                            }`}
                                    >
                                        {option.label}
                                        {option.id === value && <Check className="h-4 w-4" />}
                                    </button>
                                ))
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
