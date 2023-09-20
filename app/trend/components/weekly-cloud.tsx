import { useState, useEffect, useMemo } from "react";

import { ScrollArea } from "@/components/ui/scroll-area";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useGetWeeklyGeoQuery } from "@/features/services/geo";
import { useAppSelector } from "@/features/hooks";
import { selectGeoFilter } from "@/features/filter/filterSlice";
import type { GeoFilterInfo } from "@/types/filter";
import ReactWordcloud from "react-wordcloud";

import "tippy.js/dist/tippy.css";
import "tippy.js/animations/scale.css";

export default function WeeklyCloud() {
  const geoFilter = useAppSelector(selectGeoFilter);
  const { currentData, isLoading } = useGetWeeklyGeoQuery(
    geoFilter as GeoFilterInfo
  );

  const week = currentData?.week || [];

  const data = useMemo(() => {
    if (currentData) {
      console.time("computed");
      const weekData = currentData.week.map((week: string, index: number) => {
        return currentData.book
          .filter((item: any) => item.value[index] > 0)
          .map((item: any) => {
            return {
              text: item.name,
              value: item.value[index],
            };
          });
      });

      const allData = currentData.book
        .map((item: any) => {
          return {
            text: item.name,
            value: item.value.reduce((a: number, b: number) => a + b, 0),
          };
        })
        .filter((item: any) => item.value > 0);

      console.timeEnd("computed");
      return [...weekData, allData];
    }
  }, [currentData]);

  const [words, setWords] = useState<any>(data?.[0]);

  const [val, setVal] = useState<any>(week?.[0]);

  useEffect(() => {
    const index = [...week, "All"].indexOf(val);
    setWords(data?.[index]);
  }, [val]);

  const onValueChange = (value: string) => {
    setVal(value);
  };

  const options = {
    deterministic: true,
    fontSizes: [12, 18] as [number, number],
    padding: 1,
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly Snapshot: Interactive Word Cloud</CardTitle>
        <CardDescription>
          The most commonly browsed bibliographic records for any given week
          with this interactive word cloud. Use the selector to choose a week
          and see the most prominent during that time. The size of each record
          indicates its frequency
        </CardDescription>
      </CardHeader>
      <CardContent>
        {data && (
          <>
            <Select onValueChange={onValueChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={week[0]} />
              </SelectTrigger>
              <SelectContent className="h-[300px]">
                <ScrollArea>
                  {[...week, "All"].map((item: string) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </ScrollArea>
              </SelectContent>
            </Select>
            <div
              className={val === "All" ? "h-[900px] my-2" : "h-[400px] my-2"}
            >
              <ReactWordcloud words={words} options={options} />
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
