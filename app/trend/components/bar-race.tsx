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

function generateRandomColors(arr: Array<string>) {
  var generatedColors: { [key: string]: string } = {};
  for (var i = 0; i < arr.length; i++) {
    var randomColor = "#" + Math.floor(Math.random() * 16777215).toString(16);
    generatedColors[arr[i]] = randomColor;
  }
  return generatedColors;
}

export default function BarRace() {
  const geoFilter = useAppSelector(selectGeoFilter);
  const { currentData: data, isLoading } = useGetWeeklyGeoQuery(
    geoFilter as GeoFilterInfo
  );
  const eChartRef = useRef<any>(null);

  const MAX_LABEL_LENGTH = 8;
  const updateFrequency = 3000;
  const dimension = 1;

  const colorDict = generateRandomColors(
    data?.book.map((item: any) => item.name) || []
  );

  const options = {
    grid: {
      top: 10,
      bottom: 30,
      left: 150,
      right: 80,
    },
    xAxis: {
      max: "dataMax",
      axisLabel: {
        formatter: function (n: number) {
          return Math.round(n) + "";
        },
      },
    },
    dataset: {
      source: data?.book.map((item: any) => [
        item.name,
        item.value[0],
        data?.week[0],
      ]),
    },
    yAxis: {
      type: "category",
      inverse: true,
      max: 10,
      axisLabel: {
        show: true,
        fontSize: 14,
        formatter: function (label: string) {
          if (label.length > MAX_LABEL_LENGTH) {
            return label.slice(0, MAX_LABEL_LENGTH) + "...";
          }
          return label;
        },
      },
      animationDuration: 300,
      animationDurationUpdate: 300,
    },
    series: [
      {
        realtimeSort: true,
        seriesLayoutBy: "column",
        type: "bar",
        itemStyle: {
          color: function (param: any) {
            return colorDict[param.value[0]] || "#5470c6";
          },
        },
        encode: {
          x: dimension,
          y: 0,
        },
        label: {
          show: true,
          precision: 1,
          position: "right",
          valueAnimation: true,
          fontFamily: "monospace",
        },
      },
    ],
    // Disable init animation.
    animationDuration: 0,
    animationDurationUpdate: updateFrequency,
    animationEasing: "linear",
    animationEasingUpdate: "linear",
    graphic: {
      elements: [
        {
          type: "text",
          right: 160,
          bottom: 60,
          style: {
            text: data?.week[0] || "",
            font: "bolder 80px monospace",
            fill: "rgba(100, 100, 100, 0.25)",
          },
          z: 100,
        },
      ],
    },
  };

  //   Method I: Recursion
  //   useEffect(() => {
  //     if (data && eChartRef.current) {
  //       const chart = eChartRef.current.getEchartsInstance();
  //       const option = chart.getOption();
  //       console.log(option);
  //       const updateWeek = (week: string, index: number) => {
  //         console.log(index);
  //         let source = data?.book.map((item: any) => [
  //           item.name,
  //           item.value[index],
  //           data?.week[index],
  //         ]);
  //         option.series[0].data = source;
  //         option.graphic[0].elements[0].style.text = week;
  //         chart.setOption(option);
  //       };

  //       const runSequentially = (i: number) => {
  //         if (i >= data.week.length - 1) {
  //           return;
  //         }
  //         updateWeek(data.week[i + 1], i + 1);
  //         setTimeout(() => runSequentially(i + 1), updateFrequency);
  //       };

  //       runSequentially(0);
  //     }
  //   }, [data, eChartRef.current]);

  // Method II: async/await
  const sleep = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  useEffect(() => {
    let isCancelled = false; // 用來追踪組件是否已卸載
    const updateChart = async () => {
      if (data && eChartRef.current) {
        const chart = eChartRef.current.getEchartsInstance();
        const option = chart.getOption();

        const updateWeek = async (week: string, index: number) => {
          if (isCancelled) return; // 如果組件已卸載，則退出
          console.log("Bar Race: ", index);
          let source = data?.book.map((item: any) => [
            item.name,
            item.value[index],
            data?.week[index],
          ]);
          option.series[0].data = source;
          option.graphic[0].elements[0].style.text = week;
          chart.setOption(option);
          await sleep(updateFrequency);
        };

        for (let i = 0; i < data.week.length - 1; ++i) {
          await updateWeek(data.week[i + 1], i + 1);
        }
      }
    };

    updateChart();
    return () => {
      isCancelled = true; // 當組件卸載時設置為true
    };
  }, [data, eChartRef.current]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Card className="my-4">
      <CardHeader>
        <CardTitle>Weekly Top 10 Bibliographies: A Racing View</CardTitle>
        <CardDescription>
          This graph dynamically shows the top 10 most-referenced bibliographies
          week-by-week. Watch as different titles compete for the top spot,
          giving you real-time insight into shifting trends in bibliographies
          browsed counts
        </CardDescription>
      </CardHeader>
      <CardContent>
        {data != undefined && (
          <ReactEcharts
            option={options}
            style={{ height: "300px", width: "100%" }}
            ref={eChartRef}
          />
        )}
      </CardContent>
    </Card>
  );
}
