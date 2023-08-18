import ReactEcharts from "echarts-for-react";
import { useGetUuserUclickGeoQuery } from "@/features/services/geo";
import { useAppSelector } from "@/features/hooks";
import { selectGeoFilter } from "@/features/filter/filterSlice";
import type { GeoFilterInfo } from "@/types/filter";
import _ from "lodash";

type Metrics = {
  labels: string[];
  total_click: {
    name: string;
    value: number;
  }[];
  total_user: {
    name: string;
    value: number;
  }[];
  total_book: {
    name: string;
    value: number;
  }[];
};

function sortMetrics(metrics: Metrics, inspect: keyof Metrics) {
  // Check if inspect is a valid key and is an array
  if (metrics === undefined) {
    return undefined;
  }

  const sortedArray = _.orderBy(metrics[inspect], ["value"], ["desc"]);
  const sortedLabels = _.map(sortedArray, "name");

  return {
    sortedArray,
    sortedLabels,
  };
}

export default function PiePattern({ inspect = "total_user" }) {
  const geoFilter = useAppSelector(selectGeoFilter);
  const { currentData, isLoading } = useGetUuserUclickGeoQuery(
    geoFilter as GeoFilterInfo
  );
  const { pie_metrics_formatted } = currentData || {};

  const data = sortMetrics(
    pie_metrics_formatted as Metrics,
    inspect as keyof Metrics
  );

  const name =
    geoFilter?.continent === "All Continents"
      ? "World"
      : geoFilter?.country === "All Countries"
      ? geoFilter?.continent
      : geoFilter?.country;

  const options = {
    tooltip: {
      trigger: "item",
      formatter: "{a} <br/>{b} : {c} ({d}%)",
    },
    legend: {
      type: "scroll",
      orient: "horizontal",
      right: 0,
      top: 0,
      data: data?.sortedLabels,
    },
    series: [
      {
        name: name,
        type: "pie",
        radius: ["20%", "80%"],
        center: ["50%", "50%"],
        roseType: "radius",
        itemStyle: {
          borderRadius: 5,
        },
        label: {
          show: false,
        },
        data: data?.sortedArray,
        emphasis: {
          focus: "self",
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
        },
      },
    ],
  };

  return <ReactEcharts option={options} style={{ height: "100%" }} />;
}
