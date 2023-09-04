import { api } from "./api";

type NetworkQeuryType = {
  method: string;
  bookName: string[];
};

export const bookApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (build) => ({
    getSearch: build.query({
      query: (queryString: string) => `/search/?query=${queryString}`,
      providesTags: ["Book"],
    }),
    getNetwork: build.query({
      query: (obj: NetworkQeuryType) =>
        `/network/?method=${obj.method}&query=${obj.bookName}`,
      providesTags: ["Book"],
    }),
    getArcsPoints: build.query({
      query: () => `/arcs/points/`,
      providesTags: ["Book"],
    }),
    getArcsArcs: build.query({
      query: (lat_lon: string) => `/arcs/arcs/?lat_lon=${lat_lon}`,
      providesTags: ["Book"],
    }),
  }),
});

export const {
  useGetSearchQuery,
  useGetNetworkQuery,
  useGetArcsPointsQuery,
  useGetArcsArcsQuery,
} = bookApi;
