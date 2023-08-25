"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetUuserUclickGeoQuery } from "@/features/services/geo";
import { useAppSelector } from "@/features/hooks";
import { selectGeoFilter } from "@/features/filter/filterSlice";
import type { GeoFilterInfo } from "@/types/filter";
import { METRICS, METRICSTOTAL } from "@/data/metrics";
import { Skeleton } from "@/components/ui/skeleton";
import _ from "lodash";
import { useState, useEffect } from "react";

interface IData {
  lon: number;
  lat: number;
  lan: string;
  total_click: number;
  total_user: number;
  total_book: number;
}

const median = (array: number[]) => {
  array.sort((a, b) => b - a);
  const length = array.length;

  if (length % 2 == 0) {
    return (array[length / 2] + array[length / 2 - 1]) / 2;
  } else {
    return array[Math.floor(length / 2)];
  }
};

function formatPercentage(numerator: number, denominator: number) {
  const percentage = (numerator / denominator) * 100;

  if (percentage < 0.1) {
    return "<0.1%";
  } else {
    return percentage.toFixed(2) + "%";
  }
}

export default function FourMetrics({
  metrics_idx = "user",
  inspect = "total_user",
}) {
  const list = METRICS[metrics_idx as keyof typeof METRICS];
  const total = METRICSTOTAL[metrics_idx as keyof typeof METRICSTOTAL];

  const [isRecalculating, setRecalculating] = useState(false);
  const [sum, setSum] = useState(0);
  const [percentage, setPercentage] = useState("0%");
  const [meanResult, setMeanResult] = useState("0");
  const [medianResult, setMedianResult] = useState("0");

  const geoFilter = useAppSelector(selectGeoFilter);
  const { currentData, isLoading } = useGetUuserUclickGeoQuery(
    geoFilter as GeoFilterInfo
  );
  const { agg_data: data } = currentData || {};
  const filteredData = _.map(data, inspect as keyof IData);

  useEffect(() => {
    setRecalculating(true); // Set flag to indicate recalculation

    const newSum = _.sum(filteredData);
    setSum(newSum); // Update state

    const newPercentage = formatPercentage(newSum, total);
    setPercentage(newPercentage); // Update state

    const newMeanResult = _.mean(filteredData).toFixed(2).toLocaleString();
    setMeanResult(newMeanResult); // Update state

    const newMedianResult = median(filteredData as number[])
      .toFixed(0)
      .toLocaleString();
    setMedianResult(newMedianResult); // Update state

    setRecalculating(false); // Reset flag
  }, [data, metrics_idx, inspect, geoFilter]);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{list[0].title}</CardTitle>
          <svg
            width="15"
            height="15"
            viewBox="0 0 15 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7.5 0.75L9.75 3H5.25L7.5 0.75ZM7.5 14.25L9.75 12H5.25L7.5 14.25ZM3 5.25L0.75 7.5L3 9.75V5.25ZM14.25 7.5L12 5.25V9.75L14.25 7.5Z"
              fill="currentColor"
              fillRule="evenodd"
              clipRule="evenodd"
            ></path>
          </svg>
        </CardHeader>
        <CardContent>
          {!isLoading && data && !isRecalculating ? (
            <div className="text-2xl font-bold">{sum.toLocaleString()}</div>
          ) : (
            <Skeleton className="w-2/3 h-8" />
          )}
          <p className="text-xs text-muted-foreground">{list[0].description}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{list[1].title}</CardTitle>
          <svg
            width="15"
            height="15"
            viewBox="0 0 15 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1.85001 7.50043C1.85001 4.37975 4.37963 1.85001 7.50001 1.85001C10.6204 1.85001 13.15 4.37975 13.15 7.50043C13.15 10.6211 10.6204 13.1509 7.50001 13.1509C4.37963 13.1509 1.85001 10.6211 1.85001 7.50043ZM7.50001 0.850006C3.82728 0.850006 0.850006 3.82753 0.850006 7.50043C0.850006 11.1733 3.82728 14.1509 7.50001 14.1509C11.1727 14.1509 14.15 11.1733 14.15 7.50043C14.15 3.82753 11.1727 0.850006 7.50001 0.850006ZM7.00001 8.00001V3.12811C7.16411 3.10954 7.33094 3.10001 7.50001 3.10001C9.93006 3.10001 11.9 5.07014 11.9 7.50043C11.9 7.66935 11.8905 7.83604 11.872 8.00001H7.00001Z"
              fill="currentColor"
              fillRule="evenodd"
              clipRule="evenodd"
            ></path>
          </svg>
        </CardHeader>
        <CardContent>
          {!isLoading && data && !isRecalculating ? (
            <div className="text-2xl font-bold">{percentage}</div>
          ) : (
            <Skeleton className="w-2/3 h-8" />
          )}
          <p className="text-xs text-muted-foreground">{list[1].description}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{list[2].title}</CardTitle>
          <svg
            width="15"
            height="15"
            viewBox="0 0 15 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7.85367 1.48956C7.65841 1.29429 7.34182 1.29429 7.14656 1.48956L1.48971 7.14641C1.29445 7.34167 1.29445 7.65825 1.48971 7.85352L7.14656 13.5104C7.34182 13.7056 7.65841 13.7056 7.85367 13.5104L13.5105 7.85352C13.7058 7.65825 13.7058 7.34167 13.5105 7.14641L7.85367 1.48956ZM7.5 2.55033L2.55037 7.49996L7.5 12.4496V2.55033Z"
              fill="currentColor"
              fillRule="evenodd"
              clipRule="evenodd"
            ></path>
          </svg>
        </CardHeader>
        <CardContent>
          {!isLoading && data && !isRecalculating ? (
            <div className="text-2xl font-bold">{meanResult}</div>
          ) : (
            <Skeleton className="w-2/3 h-8" />
          )}
          <p className="text-xs text-muted-foreground">{list[2].description}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{list[3].title}</CardTitle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-4 w-4 text-muted-foreground"
          >
            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
          </svg>
        </CardHeader>
        <CardContent>
          {!isLoading && data && !isRecalculating ? (
            <div className="text-2xl font-bold">{medianResult}</div>
          ) : (
            <Skeleton className="w-2/3 h-8" />
          )}
          <p className="text-xs text-muted-foreground">{list[3].description}</p>
        </CardContent>
      </Card>
    </div>
  );
}
