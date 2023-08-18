import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/features/store";
import type { GeoFilterInfo, DateFilterInfo } from "@/types/filter";

type FilterState = {
  geofilter: GeoFilterInfo | null;
  datefilter: DateFilterInfo | null;
};

const initialState: FilterState = {
  geofilter: {
    continent: "All Continents",
    country: "All Countries",
    city: "All Cities",
  },
  datefilter: {
    start: "2021-01-01",
    end: "2021-12-31",
  },
};

const filterSlice = createSlice({
  name: "filter",
  initialState: initialState as FilterState,
  reducers: {
    setGeoFilter: (
      state,
      {
        payload: { continent, country, city },
      }: PayloadAction<{ continent: string; country: string; city: string }>
    ) => {
      state.geofilter = { continent, country, city };
    },
    setDateFilter: (
      state,
      { payload: { datefilter } }: PayloadAction<{ datefilter: DateFilterInfo }>
    ) => {
      state.datefilter = datefilter;
    },
  },
});

export const { setGeoFilter, setDateFilter } = filterSlice.actions;

export default filterSlice.reducer;

export const selectGeoFilter = (state: RootState) => state.filter.geofilter;
export const selectDateFilter = (state: RootState) => state.filter.datefilter;
