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

  const sizeFunction = function (x: number) {
    if (x === 0) {
      return 0;
    }
    return Math.sqrt(Math.log(x) * 1000);
  };

  // Schema:
  const schema = [
    { name: "Income", index: 0, text: "人均收入", unit: "美元" },
    { name: "LifeExpectancy", index: 1, text: "人均寿命", unit: "岁" },
    { name: "Population", index: 2, text: "总人口", unit: "" },
    { name: "Country", index: 3, text: "国家", unit: "" },
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
          text: data.week[0],
          textAlign: "center",
          right: "10%",
          top: "50%",
          textStyle: {
            fontSize: 20,
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
                        + schema[1].text + '：' + value[1] + schema[1].unit + '<br>'
                        + schema[0].text + '：' + value[0] + schema[0].unit + '<br>'
                        + schema[2].text + '：' + value[2] + '<br>';
        },
      },
      grid: {
        top: 20,
        containLabel: true,
        left: 30,
        right: "110",
      },
      xAxis: {
        type: "log",
        name: "人均收入",
        max: Math.max(...[].concat(...data.sib.map((d: any) => d.v1))),
        min: 1,
        nameGap: 25,
        nameLocation: "middle",
        nameTextStyle: {
          fontSize: 18,
        },
        splitLine: {
          show: false,
        },
        axisLabel: {
          formatter: "{value} $",
        },
      },
      yAxis: {
        type: "log",
        name: "平均寿命",
        max: Math.max(...[].concat(...data.sib.map((d: any) => d.v2))),
        min: 1,
        nameTextStyle: {
          fontSize: 18,
        },
        splitLine: {
          show: false,
        },
        axisLabel: {
          formatter: "{value} 岁",
        },
      },
      visualMap: [
        {
          show: false,
          dimension: 3,
          categories: [...data.sib.map((d: any) => d.place), "place"],
          inRange: {
            color: (function () {
              // prettier-ignore
              const colors = generateRandomColors(data.sib.length + 1);
              return colors.concat(colors);
            })(),
          },
        },
      ],
      series: [
        {
          type: "scatter",
          itemStyle: itemStyle,
          data: [data.v1[0], data.v2[0], data.v3[0], "place", data.week[0]],
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
        text: dtime + "",
      },
      series: {
        name: dtime,
        type: "scatter",
        itemStyle: itemStyle,
        data: (function () {
          console.log([
            ...data.sib.map((d: any) => [
              d.v1[index],
              d.v2[index],
              d.v3[index],
              d.place,
              dtime,
            ]),
            [data.v1[index], data.v3[index], data.v2[index], "place", dtime],
          ]);

          return [
            ...data.sib.map((d: any) => [
              d.v1[index],
              d.v2[index],
              d.v3[index],
              d.place,
              dtime,
            ]),
            [data.v1[index], data.v3[index], data.v2[index], "place", dtime],
          ];
        })(),
        symbolSize: function (val: Array<any>) {
          return sizeFunction(val[2]);
        },
      },
    })),
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
        {data && (
          <ReactEcharts
            option={options}
            style={{ height: "300px", width: "100%" }}
          />
        )}
      </CardContent>
    </Card>
  );
}
