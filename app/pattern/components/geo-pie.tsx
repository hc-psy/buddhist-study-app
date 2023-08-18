import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import MyMap from "./my-map";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import PiePattern from "./pie-pattern";

type Switchers = {
  jp: boolean;
  en: boolean;
  tw: boolean;
  agg: boolean;
};

const initialSwitchers: Switchers = {
  jp: false,
  en: false,
  tw: false,
  agg: true,
};

export default function GeoPie({ inspect = "total_user" }) {
  const [switchers, setSwitchers] = useState<Switchers>(initialSwitchers);

  const onChangeSwitchers = (value: keyof Switchers) => {
    setSwitchers((prev) => ({
      jp: value === "jp",
      en: value === "en",
      tw: value === "tw",
      agg: value === "agg",
    }));
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
      <Card className="col-span-4">
        <CardHeader className="flex flex-row justify-between items-center">
          <CardTitle>Geographical Representation</CardTitle>
          <RadioGroup
            onValueChange={onChangeSwitchers}
            defaultValue="agg"
            className="flex flex-row"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="agg" id="r1" />
              <Label htmlFor="r1">All</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="tw" id="r1" />
              <Label htmlFor="r1">TW</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="en" id="r1" />
              <Label htmlFor="r1">EN</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="jp" id="r1" />
              <Label htmlFor="r1">JP</Label>
            </div>
          </RadioGroup>
        </CardHeader>
        <CardContent className="w-[95%] h-[700px] p-0 mx-auto mb-2 rounded-2xl overflow-clip">
          <MyMap inspect={inspect} switchers={switchers} />
        </CardContent>
      </Card>
      <Card className="col-span-3">
        <CardHeader>
          <CardTitle>Pattern Breakdown</CardTitle>
          <CardDescription>
            A proportional breakdown of metrics by geography based on filters.
          </CardDescription>
        </CardHeader>
        <CardContent className="h-[700px]">
          <PiePattern inspect={inspect} />
        </CardContent>
      </Card>
    </div>
  );
}
