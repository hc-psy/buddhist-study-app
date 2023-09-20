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

function generateRandomColors(dataLength: number) {
  var generatedColors = [];
  for (var i = 0; i < dataLength; i++) {
    var randomColor = "#" + Math.floor(Math.random() * 16777215).toString(16);
    generatedColors.push(randomColor);
  }
  return generatedColors;
}

export default function VisitBubble() {
  const geoFilter = useAppSelector(selectGeoFilter);
  const { currentData: data, isLoading } = useGetWeeklyGeoQuery(
    geoFilter as GeoFilterInfo
  );

  const itemStyle = {
    opacity: 0.8,
  };

  const PLACE =
    geoFilter?.country !== "All Countries"
      ? geoFilter?.country
      : geoFilter?.continent !== "All Continents"
      ? geoFilter?.continent
      : "Worldwide";

  const sizeFunction = function (x: number) {
    if (x === 0) {
      return 0;
    }
    return Math.sqrt(Math.log(x) * 800);
  };

  // Schema:
  const schema = [
    {
      name: "First-Time Visits",
      index: 0,
      text: "First-Time Visits",
      unit: "美元",
    },
    { name: "Final Visits", index: 1, text: "Final Visits", unit: "岁" },
    { name: "Revisits", index: 2, text: "Revisit", unit: "" },
    { name: "Country", index: 3, text: "Region", unit: "" },
  ];

  const options = data && {
    baseOption: {
      timeline: {
        axisType: "category",
        orient: "vertical",
        autoPlay: true,
        inverse: true,
        playInterval: 1000,
        left: null,
        right: 0,
        top: 10,
        bottom: 20,
        width: 55,
        height: null,
        symbol: "none",
        checkpointStyle: {
          borderWidth: 2,
        },
        controlStyle: {
          showNextBtn: false,
          showPrevBtn: false,
        },
        data: data.week,
      },
      title: [
        {
          text: "2022-" + data.week[0],
          textAlign: "center",
          right: "1%",
          top: "70%",
          textStyle: {
            fontSize: 40,
            fontFamily: "monospace",
            fontWeight: "bolder",
          },
        },
      ],
      tooltip: {
        padding: 5,
        borderWidth: 1,
        formatter: function (obj: any) {
          var value = obj.value;
          // prettier-ignore
          return schema[3].text + '：' + value[3] + '<br>'
                        + schema[0].text + '：' + value[0] + '<br>'
                        + schema[1].text + '：' + value[1] + '<br>'
                        + schema[2].text + '：' + value[2] + '<br>';
        },
      },
      grid: {
        top: 30,
        containLabel: true,
        left: 20,
        right: "110",
      },
      xAxis: {
        type: "log",
        name: "First-Time Visits",
        max: Math.max(
          ...[].concat(...data.sib.map((d: any) => d.v1)),
          ...data.v1
        ),
        min: 1,
        nameGap: 40,
        nameLocation: "middle",
        nameTextStyle: {
          fontSize: 15,
        },
        splitLine: {
          show: false,
        },
      },
      yAxis: {
        type: "log",
        name: "Final Visits",
        nameRotate: 90,
        nameGap: 40,
        nameLocation: "middle",
        max: Math.max(
          ...[].concat(...data.sib.map((d: any) => d.v2)),
          ...data.v2
        ),
        min: 1,
        nameTextStyle: {
          fontSize: 15,
          align: "center",
        },
        splitLine: {
          show: false,
        },
      },
      visualMap: [
        {
          show: false,
          dimension: 3,
          categories: [...data.sib.map((d: any) => d.place), PLACE],
          inRange: {
            color: (function () {
              // prettier-ignore
              const colors = generateRandomColors(data.sib.length);
              colors.push("#ff0000");
              return colors.concat(colors);
            })(),
          },
        },
      ],
      series: [
        {
          type: "scatter",
          itemStyle: itemStyle,
          data: [
            ...data.sib.map((d: any) => [
              d.v1[0],
              d.v2[0],
              d.v3[0],
              d.place,
              data.week[0],
            ]),
            [data.v1[0], data.v2[0], data.v3[0], "place", data.week[0]],
          ],
          symbolSize: function (val: Array<any>) {
            return sizeFunction(val[2]);
          },
        },
      ],
      animationDurationUpdate: 1000,
      animationEasingUpdate: "quinticInOut",
    },
    options: data.week.map((dtime: string, index: number) => ({
      title: {
        show: true,
        text: "2022-" + dtime + "",
      },
      series: {
        name: dtime,
        type: "scatter",
        itemStyle: itemStyle,
        data: [
          ...data.sib.map((d: any) => [
            d.v1[index],
            d.v2[index],
            d.v3[index],
            d.place,
            dtime,
          ]),
          [data.v1[index], data.v2[index], data.v3[index], PLACE, dtime],
        ],
        symbolSize: function (val: Array<any>) {
          return sizeFunction(val[2]);
        },
      },
    })),
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Visit Types Across Regions: A Comparative View</CardTitle>
        <CardDescription>
          The dynamics of first-time visits, final visits, and revisits across
          different regions. The X-axis represents first-time visits, the Y-axis
          shows final visits, and the size of each bubble indicates the volume
          of revisits. Use the week control bar on the right to see changes over
          time. Hover over bubbles to reveal detailed data for each region
        </CardDescription>
      </CardHeader>
      <CardContent>
        {data && (
          <ReactEcharts
            option={options}
            style={{ height: "600px", width: "100%" }}
          />
        )}
      </CardContent>
    </Card>
  );
}
