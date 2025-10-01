export const MONTHS: string[] = [
  "january",
  "february",
  "march",
  "april",
  "may",
  "june",
  "july",
  "august",
  "september",
  "october",
  "november",
  "december",
];

type TSocialNetworkName = "github" | "linkedin";

export interface ISocialNetwork {
  name: TSocialNetworkName;
  link: string;
}

export const SOCIAL_NETWORKS: ISocialNetwork[] = [
  { name: "github", link: process.env.REACT_APP_GITHUB_LINK as string },
  { name: "linkedin", link: process.env.REACT_APP_LINKEDIN_LINK as string },
];
