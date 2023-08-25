import { api } from "./api";
import type { GeoFilterInfo } from "@/types/filter";

type GeoMetricsElementType = {
  lon: number;
  lat: number;
  lan: string;
  total_user: number;
  total_click: number;
  total_book: number;
};

type GeoMetricsType = GeoMetricsElementType[];

type PieMetricsType = {
  labels: string[];
  total_click: number[];
  total_user: number[];
  total_book: number[];
};

function aggregateData(data: GeoMetricsType): GeoMetricsType {
  const result: { [key: string]: GeoMetricsElementType } = data.reduce(
    (acc: { [key: string]: GeoMetricsElementType }, cur) => {
      const key = `${cur.lon},${cur.lat}`; // Unique key for each lon, lat pair

      // If the key exists, sum up the total_click, total_user and total_book
      if (acc[key]) {
        acc[key].total_click += cur.total_click;
        acc[key].total_user += cur.total_user;
        acc[key].total_book += cur.total_book;
      } else {
        // If it does not exist, add the current object to the accumulator
        acc[key] = { ...cur };
      }

      return acc;
    },
    {}
  );

  return Object.values(result);
}

export const geoApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (build) => ({
    getUuserUclickGeo: build.query({
      query: (obj: GeoFilterInfo) =>
        `/getUuserUclickGeo/?reqContinent=${obj.continent}&reqCountry=${obj.country}&reqCity=${obj.city}`,
      transformResponse: (responseData) => {
        const { geo_metrics, pie_metrics } = responseData as {
          geo_metrics: GeoMetricsType;
          pie_metrics: PieMetricsType;
        };

        console.time("data processing");
        const jp_data = geo_metrics.filter((d) => d.lan === "jp");
        const en_data = geo_metrics.filter((d) => d.lan === "en");
        const tw_data = geo_metrics.filter((d) => d.lan === "tw");
        const agg_data = aggregateData(geo_metrics);
        console.timeEnd("data processing");

        const pie_metrics_formatted = {
          labels: pie_metrics.labels,
          total_click: pie_metrics.total_click.map(
            (el: number, idx: number) => {
              return {
                name: pie_metrics.labels[idx],
                value: el,
              };
            }
          ),
          total_user: pie_metrics.total_user.map((el: number, idx: number) => {
            return {
              name: pie_metrics.labels[idx],
              value: el,
            };
          }),
          total_book: pie_metrics.total_book.map((el: number, idx: number) => {
            return {
              name: pie_metrics.labels[idx],
              value: el,
            };
          }),
        };

        return { jp_data, en_data, tw_data, agg_data, pie_metrics_formatted };
      },
      providesTags: ["Geo"],
    }),
    getWeeklyGeo: build.query({
      query: (obj: GeoFilterInfo) =>
        `/getWeeklyGeo/?reqContinent=${obj.continent}&reqCountry=${obj.country}`,
      providesTags: ["Geo"],
    }),
  }),
});

export const { useGetUuserUclickGeoQuery, useGetWeeklyGeoQuery } = geoApi;
