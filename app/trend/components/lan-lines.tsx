import ReactEcharts from "echarts-for-react";

import { useEffect, useRef } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { useGetWeeklyGeoQuery } from "@/features/services/geo";
import { useAppSelector } from "@/features/hooks";
import { selectGeoFilter } from "@/features/filter/filterSlice";
import type { GeoFilterInfo } from "@/types/filter";
import _ from "lodash";

export default function LanLines() {
  const geoFilter = useAppSelector(selectGeoFilter);
  const { currentData: data, isLoading } = useGetWeeklyGeoQuery(
    geoFilter as GeoFilterInfo
  );

  const options = {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "cross",
        label: {
          backgroundColor: "#6a7985",
        },
      },
      formatter: (params: any) => {
        let tooltipStr = "";
        let total = 0;

        // Title
        tooltipStr += params[0].axisValueLabel + "<br/>";

        // Loop through each series to display value and add to total
        for (let i = 0; i < params.length; i++) {
          tooltipStr +=
            params[i].marker +
            " " +
            params[i].seriesName +
            ": " +
            params[i].data +
            "<br/>";
          total += params[i].data;
        }

        // Display total
        tooltipStr += "Total: " + total;

        return tooltipStr;
      },
    },
    legend: {},
    grid: {
      left: "3%",
      right: "4%",
      bottom: "20%",
      containLabel: true,
    },
    xAxis: [
      {
        type: "category",
        boundaryGap: false,
        data: data?.week,
      },
    ],
    yAxis: [
      {
        type: "value",
      },
    ],
    dataZoom: [
      {
        type: "inside",
      },
      {},
    ],
    series: Object.keys(data?.lan || {}).map((key) => ({
      name: key,
      connectNulls: true,
      type: "line",
      stack: "total",
      smooth: true,
      areaStyle: {
        opacity: 0.2,
      },
      emphasis: {
        focus: "series",
      },
      data: data?.lan[key].map((value: number) => (value === 0 ? 0 : value)),
    })),
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly Visits</CardTitle>
      </CardHeader>
      <CardContent>
        <ReactEcharts
          option={options}
          style={{ height: "300px", width: "100%" }}
        />
      </CardContent>
    </Card>
  );
}
