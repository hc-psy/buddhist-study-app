"use client";

import * as React from "react";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { LOCATIONS } from "@/data/locations";

type PopoverTriggerProps = React.ComponentPropsWithoutRef<
  typeof PopoverTrigger
>;

interface LocationSwitcherProps extends PopoverTriggerProps {}

export default function LocationSwitcher({ className }: LocationSwitcherProps) {
  const [openContinent, setOpenContinent] = React.useState(false);
  const [openCountry, setOpenCountry] = React.useState(false);
  const [openCity, setOpenCity] = React.useState(false);

  const [selectedContinent, setSelectedContitnent] = React.useState<string>(
    LOCATIONS.continents[LOCATIONS.continents.length - 1].continent
  );
  const [selectedCountry, setSelectedCountry] = React.useState<string>(
    LOCATIONS.continents[0].countries[
      LOCATIONS.continents[0].countries.length - 1
    ].country
  );
  const [selectedCity, setSelectedCity] = React.useState<string>(
    LOCATIONS.continents[0].countries[0].cities[
      LOCATIONS.continents[0].countries[0].cities.length - 1
    ].city
  );

  return (
    <>
      <Popover open={openContinent} onOpenChange={setOpenContinent}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={openContinent}
            aria-label="Select a continent"
            className={cn("w-[200px] justify-between", className)}
          >
            {selectedContinent}
            <CaretSortIcon className="ml-auto h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandList>
              <CommandInput placeholder="Search continent..." />
              <CommandEmpty>No continent found.</CommandEmpty>
              <CommandGroup>
                {LOCATIONS.continents.map((entry) => (
                  <CommandItem
                    key={entry.continent}
                    onSelect={() => {
                      setSelectedContitnent(entry.continent);
                      setSelectedCountry(
                        entry.countries[entry.countries.length - 1].country
                      );
                      setSelectedCity(
                        entry.countries[0].cities[
                          entry.countries[0].cities.length - 1
                        ].city
                      );
                      setOpenContinent(false);
                    }}
                    className="text-sm"
                  >
                    {entry.continent}
                    <CheckIcon
                      className={cn(
                        "ml-auto h-4 w-4",
                        selectedContinent === entry.continent
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <Popover open={openCountry} onOpenChange={setOpenCountry}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={openCountry}
            aria-label="Select a country"
            className={cn("w-[200px] justify-between", className)}
          >
            {selectedCountry}
            <CaretSortIcon className="ml-auto h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandList>
              <CommandInput placeholder="Search country..." />
              <CommandEmpty>No country found.</CommandEmpty>
              <CommandGroup>
                {LOCATIONS.continents
                  .filter((entry) => entry.continent === selectedContinent)[0]
                  .countries.map((entry) => (
                    <CommandItem
                      key={entry.country}
                      onSelect={() => {
                        setSelectedCountry(entry.country);
                        setSelectedCity(
                          entry.cities[entry.cities.length - 1].city
                        );
                        setOpenCountry(false);
                      }}
                      className="text-sm"
                    >
                      {entry.country}
                      <CheckIcon
                        className={cn(
                          "ml-auto h-4 w-4",
                          selectedCountry === entry.country
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <Popover open={openCity} onOpenChange={setOpenCity}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={openCity}
            aria-label="Select a city"
            className={cn("w-[200px] justify-between", className)}
          >
            {selectedCity}
            <CaretSortIcon className="ml-auto h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandList>
              <CommandInput placeholder="Search city..." />
              <CommandEmpty>No city found.</CommandEmpty>
              <CommandGroup>
                {LOCATIONS.continents
                  .filter((entry) => entry.continent === selectedContinent)[0]
                  .countries.filter(
                    (entry) => entry.country == selectedCountry
                  )[0]
                  .cities.map((entry) => (
                    <CommandItem
                      key={entry.city}
                      onSelect={() => {
                        setSelectedCity(entry.city);
                        setOpenCity(false);
                      }}
                      className="text-sm"
                    >
                      {entry.city}
                      <CheckIcon
                        className={cn(
                          "ml-auto h-4 w-4",
                          selectedCity === entry.city
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </>
  );
}
