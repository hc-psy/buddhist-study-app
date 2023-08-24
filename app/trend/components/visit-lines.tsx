import ReactEcharts from "echarts-for-react";

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

export default function VisitLines() {
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
    },
    legend: {},
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
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
      {
        type: "value",
      },
    ],
    series: [
      {
        name: "First-Time Visits",
        type: "line",
        connectNulls: true,
        smooth: true,
        areaStyle: {
          opacity: 0.2,
        },
        emphasis: {
          focus: "series",
        },
        data: data?.v1,
      },
      {
        name: "Revisits",
        type: "line",

        yAxisIndex: 1,
        connectNulls: true,
        smooth: true,
        areaStyle: {
          opacity: 0.2,
        },
        emphasis: {
          focus: "series",
        },
        data: data?.v3,
      },
      {
        name: "Final Visits",
        type: "line",
        connectNulls: true,
        smooth: true,
        areaStyle: {
          opacity: 0.2,
        },
        emphasis: {
          focus: "series",
        },
        data: data?.v2,
      },
      {
        name: "One-Time Only Visits",
        type: "line",
        connectNulls: true,
        smooth: true,
        areaStyle: {
          opacity: 0.2,
        },
        emphasis: {
          focus: "series",
        },
        data: data?.v4,
      },
    ],
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Four Types of Website Visits</CardTitle>
        <CardDescription>
          The right Y-axis represents revisits, while the left Y-axis represents
          other types of visits
        </CardDescription>
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
