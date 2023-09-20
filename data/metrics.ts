type METRICSTYPE = {
  user: {
    title: string;
    description: string;
  }[];
  visit: {
    title: string;
    description: string;
  }[];
  book: {
    title: string;
    description: string;
  }[];
};

type METRICSTOTALTYPE = {
  user: number;
  visit: number;
  book: number;
};

export const METRICSTOTAL: METRICSTOTALTYPE = {
  user: 191451,
  visit: 8944385,
  book: 3270777,
};

export const METRICS: METRICSTYPE = {
  user: [
    {
      title: "Total Unique IPs",
      description: "The count of unique IP addresses",
    },
    {
      title: "IP Percentage",
      description:
        "The proportion of IP addresses in this region compared to the total worldwide IP addresses",
    },
    {
      title: "IP Mean",
      description: "Average unique IP addresses per coordinate",
    },
    {
      title: "IP Median",
      description: "Median number of unique IP addresses in the region",
    },
  ],
  visit: [
    {
      title: "Total Site Visits",
      description: "Total site visits in the region",
    },
    {
      title: "Visit Percentage",
      description:
        "The proportion of visit base in this region compared to the total worldwide visits",
    },
    {
      title: "Visit Mean",
      description: "Average visits per coordinate",
    },
    {
      title: "Visit Median",
      description: "Median number of visits in the region",
    },
  ],
  book: [
    {
      title: "Reading Activity",
      description:
        "Total unique records read (duplicates counted among different IPs).",
    },
    {
      title: "Relative Reading Activity",
      description:
        "Proportion of local reading activity compared to worldwide activity.",
    },
    {
      title: "Average Reading",
      description: "Average unique records read per IP.",
    },
    {
      title: "Median Reading",
      description: "Median number of unique records read per IP.",
    },
  ],
};
