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
        data: data?.xAxis,
      },
    ],
    yAxis: [
      {
        type: "log",
      },
    ],
    series: [
      {
        name: "v1",
        type: "line",
        smooth: true,
        areaStyle: {
          opacity: 0.2,
        },
        emphasis: {
          focus: "series",
        },
        data: data?.stacked_line_data.v1,
      },
      {
        name: "v2",
        type: "line",
        smooth: true,
        areaStyle: {
          opacity: 0.2,
        },
        emphasis: {
          focus: "series",
        },
        data: data?.stacked_line_data.v2,
      },
      {
        name: "v3",
        type: "line",
        smooth: true,
        areaStyle: {
          opacity: 0.2,
        },
        emphasis: {
          focus: "series",
        },
        data: data?.stacked_line_data.v3,
      },
      {
        name: "v4",
        type: "line",
        smooth: true,
        areaStyle: {
          opacity: 0.2,
        },
        emphasis: {
          focus: "series",
        },
        data: data?.stacked_line_data.v4,
      },
    ],
    animationEasing: "elasticOut",
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
