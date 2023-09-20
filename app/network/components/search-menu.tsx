"use client";

import { Command } from "cmdk";

import {
  useState,
  useEffect,
  useCallback,
  Dispatch,
  SetStateAction,
} from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useGetSearchQuery } from "@/features/services/book";
import { BookType } from "@/types/book";

type props = {
  setBook: Dispatch<SetStateAction<BookType>>;
};

export function SearchMenu({ setBook }: props) {
  const [open, setOpen] = useState(false);
  const [searchString, setSearchString] = useState<string>("");
  const { currentData: data, isLoading } = useGetSearchQuery(searchString);

  const runCommand = useCallback((command: () => unknown) => {
    setOpen(false);
    setSearchString("");
    command();
  }, []);

  useEffect(() => {
    setSearchString("");
  }, [open]);

  const handleKeyDown = (event: any) => {
    if (event.key === "Enter") {
      setSearchString(event.target.value);
    }
  };

  return (
    <>
      <Button
        variant="outline"
        className={cn(
          "relative w-full justify-start text-sm text-muted-foreground sm:pr-12 md:w-40 lg:w-[20rem]"
        )}
        onClick={() => setOpen(true)}
      >
        <span className="hidden lg:inline-flex">
          Search Bibliographic Record...
        </span>
        <span className="inline-flex lg:hidden">Search...</span>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder="Search and Press Enter"
          // onValueChange={onChange}
          onKeyDown={handleKeyDown}
        />
        <CommandList>
          {isLoading ? (
            <Command.Loading>
              <div className="block py-2 text-center">Hang on…</div>
            </Command.Loading>
          ) : (
            <CommandEmpty>No results found.</CommandEmpty>
          )}
          {data && data.length > 0 && searchString != "" && (
            <CommandGroup>
              {data.map((navItem: any) => (
                <CommandItem
                  key={navItem.book_id}
                  value={navItem.original_topic}
                  onSelect={() => {
                    runCommand(() =>
                      setBook({
                        original_topic: navItem.original_topic,
                      })
                    );
                  }}
                  className="flex flex-row justify-between items-center"
                >
                  <div className="text-sm font-medium text-gray-900">
                    {navItem.original_topic}
                  </div>
                  <div className="text-sm text-gray-500">
                    {/* {navItem.bfulltext === "0.0" ? "No" : "Yes"} */}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
}
