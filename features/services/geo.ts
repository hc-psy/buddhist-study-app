import { api } from "./api";
import type { GeoFilterInfo } from "@/types/filter";

type SingleGeo = {
  lon: number;
  lat: number;
  lan: string;
  total_click: number;
  total_user: number;
  total_book: number;
};

type PieMetrics = {
  labels: string[];
  total_click: number[];
  total_user: number[];
  total_book: number[];
};

type GeoResponse = SingleGeo[];

export const geoApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (build) => ({
    getUuserUclickGeo: build.query({
      query: (obj: GeoFilterInfo) =>
        `/getUuserUclickGeo/?reqContinent=${obj.continent}&reqCountry=${obj.country}&reqCity=${obj.city}`,
      transformResponse: (responseData) => {
        const { geo_metrics, pie_metrics } = responseData as {
          geo_metrics: GeoResponse;
          pie_metrics: PieMetrics;
        };

        const geo_metrics_id = geo_metrics.map((el: SingleGeo, idx: number) => {
          return {
            id: idx,
            ...el,
          };
        });

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

        return { geo_metrics_id, pie_metrics_formatted };
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
