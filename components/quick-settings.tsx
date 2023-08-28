"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { ArrowRightIcon } from "@radix-ui/react-icons";

import React, { useEffect, useState } from "react";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";

import { cn } from "@/lib/utils";
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

import { CalendarDateRangePicker } from "@/components/date-range-picker";
import { LOCATIONS } from "@/data/locations";

import { useAppDispatch, useAppSelector } from "@/features/hooks";
import { selectGeoFilter, setGeoFilter } from "@/features/filter/filterSlice";

type geoFilterInput = string | undefined;

export function QuickSettingsDrawer() {
  const dispatch = useAppDispatch();
  const geoFilter = useAppSelector(selectGeoFilter);
  const [open, setOpen] = useState(false);

  const [openContinent, setOpenContinent] = useState(false);
  const [openCountry, setOpenCountry] = useState(false);
  const [openCity, setOpenCity] = useState(false);

  const [selectedContinent, setSelectedContitnent] =
    useState<geoFilterInput>("");
  const [selectedCountry, setSelectedCountry] = useState<geoFilterInput>("");
  const [selectedCity, setSelectedCity] = useState<geoFilterInput>("");

  useEffect(() => {
    setSelectedContitnent(geoFilter?.continent);
    setSelectedCountry(geoFilter?.country);
    setSelectedCity(geoFilter?.city);
  }, [geoFilter, open]);

  const canSave = selectedContinent && selectedCountry && selectedCity;

  const onFinish = () => {
    if (canSave) {
      dispatch(
        setGeoFilter({
          continent: selectedContinent,
          country: selectedCountry,
          city: selectedCity,
        })
      );
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <div className="absolute right-0 top-0 hidden items-center rounded-[0.5rem] text-sm font-medium md:flex">
          Quick Settings
          <ArrowRightIcon className="ml-1 h-4 w-4" />
        </div>
      </SheetTrigger>

      <SheetContent>
        <SheetHeader>
          <SheetTitle>Quick Settings</SheetTitle>
          <SheetDescription>
            Configure the location and time span here. Click apply when you are
            done.
          </SheetDescription>
        </SheetHeader>
        <div className="space-y-4 mt-6">
          <div className="flex flex-col items-center justify-between rounded-lg border p-4">
            <Label htmlFor="continent" className="text-left w-full">
              Continent
            </Label>
            <Popover open={openContinent} onOpenChange={setOpenContinent}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={openContinent}
                  aria-label="Select a continent"
                  className={"w-full mt-4 mb-6 justify-between"}
                >
                  {selectedContinent}
                  <CaretSortIcon className="ml-auto h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-0">
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
                              entry.countries[entry.countries.length - 1]
                                .country
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

            <Label htmlFor="country" className="text-left w-full">
              Country
            </Label>
            <Popover open={openCountry} onOpenChange={setOpenCountry}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={openCountry}
                  aria-label="Select a country"
                  className={"w-full mt-4 mb-6 justify-between"}
                >
                  {selectedCountry}
                  <CaretSortIcon className="ml-auto h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-0">
                <Command>
                  <CommandList>
                    <CommandInput placeholder="Search country..." />
                    <CommandEmpty>No country found.</CommandEmpty>
                    <CommandGroup>
                      {LOCATIONS.continents
                        .filter(
                          (entry) => entry.continent === selectedContinent
                        )[0]
                        ?.countries.map((entry) => (
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

            <Label htmlFor="city" className="text-left w-full">
              City
            </Label>
            <Popover open={openCity} onOpenChange={setOpenCity}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={openCity}
                  aria-label="Select a city"
                  className={"w-full mt-4 justify-between"}
                >
                  {selectedCity}
                  <CaretSortIcon className="ml-auto h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-0">
                <Command>
                  <CommandList>
                    <CommandInput placeholder="Search city..." />
                    <CommandEmpty>No city found.</CommandEmpty>
                    <CommandGroup>
                      {LOCATIONS.continents
                        .filter(
                          (entry) => entry.continent === selectedContinent
                        )[0]
                        ?.countries.filter(
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
          </div>

          <div className="flex flex-col items-center justify-between rounded-lg border p-4">
            <Label htmlFor="timespan" className="text-left w-full">
              Time Span
            </Label>
            <CalendarDateRangePicker />
          </div>
        </div>

        <SheetFooter>
          <SheetClose asChild>
            <Button type="submit" className="mt-6" onClick={onFinish}>
              Apply
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
