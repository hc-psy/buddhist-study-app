import ReactEcharts from "echarts-for-react";

import { useState, useRef, useEffect } from "react";

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

import { ScrollArea } from "@/components/ui/scroll-area";

import { useGetNetworkQuery } from "@/features/services/book";
import { Skeleton } from "@/components/ui/skeleton";

type MethodType = {
  name: string;
  value: string;
};

export default function BookNetwork({ bookName = "" }) {
  const [moreBooks, setMoreBooks] = useState<string[]>([]);
  const [methods, setMethods] = useState<MethodType[]>([
    {
      name: "User-Book Interaction",
      value: "NMF",
    },
    {
      name: "Transformers",
      value: "Transformer",
    },
  ]);

  const [method, setMethod] = useState<string>("NMF");
  const allBooks = [bookName, ...moreBooks];
  const { currentData: data, isLoading } = useGetNetworkQuery({
    method: method,
    bookName: allBooks,
  });
  const eChartRef = useRef<any>(null);

  console.log(data);
  const options = {
    tooltip: {},
    legend: {
      data: data && allBooks,
    },
    series: [
      {
        type: "graph",
        layout: "force",
        animation: false,
        label: {
          position: "right",
          formatter: "{b}",
        },
        draggable: true,
        categories: allBooks.map((item: string) => ({ name: item })),
        data: data?.nodes,
        force: {
          edgeLength: [25, 100],
          repulsion: 100,
          gravity: 0.2,
        },
        links: data?.links,
      },
    ],
  };

  useEffect(() => {
    setMoreBooks([]);
  }, [bookName]);

  useEffect(() => {
    if (data && eChartRef.current) {
      const chart = eChartRef.current.getEchartsInstance();
      chart.on("dblclick", (params: any) => {
        if (
          params.data.name &&
          params.data.name != bookName &&
          !params.data.name.includes(",")
        ) {
          if (moreBooks.length < 5 && !moreBooks.includes(params.data.name)) {
            console.log(params.data.name);
            setMoreBooks((prev) => [...prev, params.data.name]);
          } else {
            alert("Too Many Network Nodes!");
          }
        } else {
          alert("Invalid Network Node!");
        }
      });
      return () => {
        chart.off("dblclick");
      };
    }
  }, [data, eChartRef.current]);

  const onValueChange = (value: string) => {
    console.log(value);
    setMethod(value);
  };

  return (
    <Card className="my-4">
      <CardHeader>
        <div className="flex flex-row justify-between items-center mb-2">
          <CardTitle>
            Explore Book Similarities: Interactive Network Graph
          </CardTitle>
          <Select onValueChange={onValueChange}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder={methods[0].name} />
            </SelectTrigger>
            <SelectContent>
              <ScrollArea>
                {methods.map((item: MethodType) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.name}
                  </SelectItem>
                ))}
              </ScrollArea>
            </SelectContent>
          </Select>
        </div>
        <CardDescription>
          Type a book title into the search box. Select your preferred method
          for measuring similarity—either through User-Book Interaction or
          Transformers. This will generate a network graph where the distance
          between book nodes indicates their level of similarity. Double-click a
          node (e.g. book) to add more similar books to your existing graph
        </CardDescription>
      </CardHeader>
      <CardContent>
        {bookName && data ? (
          <ReactEcharts
            option={options}
            style={{ height: "500px", width: "100%" }}
            ref={eChartRef}
          />
        ) : (
          <Skeleton className="h-[500px] w-full" />
        )}
      </CardContent>
    </Card>
  );
}
