export type GeoFilterInfo = {
  continent: string;
  country: string;
  city: string;
  lat?: number;
  lng?: number;
};

export type DateFilterInfo = {
  start: string;
  end: string;
};
