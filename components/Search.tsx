"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";
import { useState } from "react";

export function Search({ placeholder }: { placeholder: string }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const [isSearching, setIsSearching] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleSearch = useDebouncedCallback((term) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", "1");
    if (term) {
      params.set("query", term);
    } else {
      params.delete("query");
    }
    replace(`${pathname}?${params.toString()}`);
    setIsSearching(false);
  }, 300);

  return (
    <div className="relative flex flex-1 flex-shrink-0">
      <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-stone-500" />
      <Input
        className="pl-9"
        placeholder={placeholder}
        onChange={(e) => {
            setIsSearching(true);
            handleSearch(e.target.value);
        }}
        defaultValue={searchParams.get("query")?.toString()}
      />
      {isSearching && (
          <div className="absolute right-3 top-2.5">
               <div className="h-4 w-4 animate-spin rounded-full border-2 border-stone-300 border-t-stone-600"></div>
          </div>
      )}
    </div>
  );
}
