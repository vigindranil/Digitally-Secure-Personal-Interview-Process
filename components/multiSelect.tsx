"use client";

import React, { useRef, useState, useEffect } from "react";
import { X, ChevronDown } from "lucide-react";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";

type Key = string | number;

export interface MultiSelectProps<T> {
  options: T[];
  selected: T[];
  onChange: (value: T[]) => void;
  placeholder?: string;
  getOptionKey?: (option: T) => Key;
  getOptionLabel?: (option: T) => string;
}

export function MultiSelect<T>({
  options = [],
  selected = [],
  onChange,
  placeholder = "Select options...",
  getOptionKey = (option: any) =>
    typeof option === "object" && option !== null
      ? (option as any).value
      : option,
  getOptionLabel = (option: any) =>
    typeof option === "object" && option !== null
      ? (option as any).label
      : String(option),
}: MultiSelectProps<T>) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");

  const handleUnselect = (option: T) => {
    onChange(
      selected.filter(
        (s) => getOptionKey(s) !== getOptionKey(option)
      )
    );
  };

  const selectables = options.filter(
    (option) =>
      !selected.some(
        (s) => getOptionKey(s) === getOptionKey(option)
      )
  );

  const filteredOptions = selectables.filter((option) =>
    getOptionLabel(option)
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <Command
      ref={containerRef}
      className="overflow-visible bg-transparent relative"
      onClick={() => setOpen((prev) => !prev)}
    >
      <div className="flex items-center justify-between h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm cursor-pointer hover:border-slate-300 focus-within:ring-2 focus-within:ring-indigo-500">
        <div className="flex gap-1 flex-wrap overflow-hidden">
          {selected.length > 0 ? (
            selected.map((option) => (
              <Badge
                key={String(getOptionKey(option))}
                variant="secondary"
                className="px-2 py-0.5"
              >
                {getOptionLabel(option)}
                <button
                  type="button"
                  className="ml-1 rounded-full outline-none focus:ring-2 focus:ring-indigo-500"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onClick={() => handleUnselect(option)}
                >
                  <X className="h-3 w-3 text-slate-500 hover:text-slate-700" />
                </button>
              </Badge>
            ))
          ) : (
            <span className="text-slate-400">
              {placeholder}
            </span>
          )}
        </div>
        <ChevronDown className={open ? "h-4 w-4 text-slate-400 transform rotate-180 transition-transform" : "h-4 w-4 text-slate-400 transition-transform"} />
      </div>

      {open && (
        <div className="relative mt-2">
          <div className="absolute w-full z-50 rounded-lg border border-slate-200 bg-white text-slate-900 shadow-lg">
            <div className="p-2 border-b border-slate-200">
              <input
                type="text"
                autoFocus
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search interviewers"
                className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm"
              />
            </div>

            <CommandList>
              <CommandGroup className="max-h-48 overflow-y-auto">
                {filteredOptions.length ? (
                  filteredOptions.map((option) => (
                    <CommandItem
                      key={String(getOptionKey(option))}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      onSelect={() => {
                        onChange([...selected, option]);
                        setSearch("");
                      }}
                      className="cursor-pointer px-3 py-2 hover:bg-slate-50"
                    >
                      {getOptionLabel(option)}
                    </CommandItem>
                  ))
                ) : (
                  <CommandItem disabled className="px-3 py-2 text-slate-400">
                    No options found
                  </CommandItem>
                )}
              </CommandGroup>
            </CommandList>
          </div>
        </div>
      )}
    </Command>
  );
}
