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

export default function UserLine() {
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
    ],
    series: [
      {
        name: "IPs",
        type: "line",
        connectNulls: true,
        smooth: true,
        areaStyle: {
          opacity: 0.2,
        },
        emphasis: {
          focus: "series",
        },
        data: data?.total_users,
      },
    ],
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Weekly Unique IP</CardTitle>
        <CardDescription>
          This graph shows weekly unique IPs in the selected region. The X-axis
          represents the week, and the Y-axis counts unique IPs
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
