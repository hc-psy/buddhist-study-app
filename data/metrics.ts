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
      title: "Total Unique Users",
      description:
        "The count of unique users, identified by distinct IP addresses",
    },
    {
      title: "User Percentage",
      description:
        "The proportion of user base in this region compared to the total worldwide users",
    },
    {
      title: "User Mean",
      description: "Average unique users per coordinate",
    },
    {
      title: "User Median",
      description: "Median number of unique users in the region",
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
        "Total unique books read (duplicates counted among different readers).",
    },
    {
      title: "Relative Reading Activity",
      description:
        "Proportion of local reading activity compared to worldwide activity.",
    },
    {
      title: "Average Reading",
      description: "Average unique books read per reader.",
    },
    {
      title: "Median Reading",
      description: "Median number of unique books read per reader.",
    },
  ],
};
