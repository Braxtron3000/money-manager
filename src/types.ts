import dayjs, { Dayjs } from "dayjs";

//Todo: theres probably a better way of doing this so the category tree can work.
export type categories =
  | "FICA (social security & medicare)"
  | "Federal"
  | "State & local"
  | "rent"
  | "mortgage"
  | "property taxes"
  | "gas/electric/oil"
  | "water/garbage"
  | "phones"
  | "tv"
  | "internet"
  | "furniture/appliances"
  | "housekeeper"
  | "maintenance/repairs"
  | "groceries"
  | "restaurants"
  | "gasoline"
  | "maintenance/repairs"
  | "state registration fees"
  | "tolls/parking"
  | "public transportation/taxis"
  | "credit cards/charge cards"
  | "auto loans"
  | "student loans"
  | "other"
  | "clothing"
  | "shoes"
  | "jewelry"
  | "dry cleaning"
  | "Entertainment (movies, concerts)"
  | "Vacation & travel"
  | "Gifts"
  | "Hobbies"
  | "Subscription/memberships"
  | "Pets"
  | "Other"
  | "Haircuts"
  | "makeup"
  | "other"
  | "Accountant/attorney/financial advisor"
  | "other"
  | "physicians and hospitals"
  | "drugs"
  | "dental and visions"
  | "therapy"
  | "Health club or gym"
  | "Homeowners/renter’s"
  | "auto"
  | "health"
  | "life"
  | "disability"
  | "Long-term care"
  | "umbrella liability"
  | "Tuition"
  | "books"
  | "supplies"
  | "room&board"
  | "day care"
  | "toys"
  | "activities"
  | "child support"
  | "charitable donations"
  | "Uncategorized"
  | "Income"; //Todo: income needs sub incomes such as from investments and gifts.
//Todo: also add in investment expenses

export const categoriesList: categories[] = [
  "FICA (social security & medicare)",
  "Federal",
  "State & local",
  "rent",
  "mortgage",
  "property taxes",
  "gas/electric/oil",
  "water/garbage",
  "phones",
  "tv",
  "internet",
  "furniture/appliances",
  "housekeeper",
  "maintenance/repairs",
  "groceries",
  "restaurants",
  "gasoline",
  "maintenance/repairs",
  "state registration fees",
  "tolls/parking",
  "public transportation/taxis",
  "credit cards/charge cards",
  "auto loans",
  "student loans",
  "other",
  "clothing",
  "shoes",
  "jewelry",
  "dry cleaning",
  "Entertainment (movies, concerts)",
  "Vacation & travel",
  "Gifts",
  "Hobbies",
  "Subscription/memberships",
  "Pets",
  "Other",
  "Haircuts",
  "makeup",
  "other",
  "Accountant/attorney/financial advisor",
  "other",
  "physicians and hospitals",
  "drugs",
  "dental and visions",
  "therapy",
  "Health club or gym",
  "Homeowners/renter’s",
  "auto",
  "health",
  "life",
  "disability",
  "Long-term care",
  "umbrella liability",
  "Tuition",
  "books",
  "supplies",
  "room&board",
  "day care",
  "toys",
  "activities",
  "child support",
  "charitable donations",
  "Uncategorized",
  "Income",
] as const;

export function isCategory(string: string): string is categories {
  return categoriesList.findIndex((category) => category === string) > -1;
}

export interface CategoryNode {
  value: string; // value and label should be typed to correlate with category type.
  label: string;
  children?: CategoryNode[];
}

export const categoryTree: CategoryNode[] = [
  {
    value: "Taxes",
    label: "Taxes",
    children: [
      {
        value: "FICA (social security & medicare)",
        label: "FICA (social security & medicare)",
      },
      { value: "Federal", label: "Federal" },
      { value: "State & local", label: "State & local" },
    ],
  },
  {
    value: "Housing",
    label: "Housing",
    children: [
      { value: "rent", label: "rent" },
      { value: "mortgage", label: "mortgage" },
      { value: "property taxes", label: "property taxes" },
      { value: "gas/electric/oil", label: "gas/electric/oil" },
      { value: "water/garbage", label: "water/garbage" },
      { value: "phones", label: "phones" },
      { value: "tv", label: "tv" },
      { value: "internet", label: "internet" },
      { value: "furniture/appliances", label: "furniture/appliances" },
      { value: "housekeeper", label: "housekeeper" },
      { value: "maintenance/repairs", label: "maintenance/repairs" },
    ],
  },
  {
    value: "Food",
    label: "Food",
    children: [
      { value: "groceries", label: "groceries" },
      { value: "restaurants", label: "restaurants" },
    ],
  },
  {
    value: "Transportation",
    label: "Transportation",
    children: [
      { value: "gasoline", label: "gasoline" },
      { value: "maintenance/repairs", label: "maintenance/repairs" },
      { value: "state registration fees", label: "state registration fees" },
      { value: "tolls/parking", label: "tolls/parking" },
      {
        value: "public transportation/taxis",
        label: "public transportation/taxis",
      },
    ],
  },
  {
    value: "Debt repayments",
    label: "Debt repayments",
    children: [
      {
        value: "credit cards/charge cards",
        label: "credit cards/charge cards",
      },
      {
        value: "auto loans",
        label: "auto loans",
      },
      { value: "student loans", label: "student loans" },
      { value: "other", label: "other" },
    ],
  },
  {
    value: "Attire",
    label: "Attire",
    children: [
      { value: "clothing", label: "clothing" },
      { value: "shoes", label: "shoes" },
      { value: "jewelry", label: "jewelry" },
      { value: "dry cleaning", label: "dry cleaning" },
    ],
  },
  {
    value: "Fun stuff",
    label: "Fun stuff",
    children: [
      {
        value: "Entertainment (movies, concerts)",
        label: "Entertainment (movies, concerts)",
      },
      { value: "Vacation & travel", label: "Vacation & travel" },
      { value: "Gifts", label: "Gifts" },
      { value: "Hobbies", label: "Hobbies" },
      { value: "Subscription/memberships", label: "Subscription/memberships" },
      { value: "Pets", label: "Pets" },
      { value: "Other", label: "Other" },
    ],
  },
  {
    value: "Personal care",
    label: "Personal care",
    children: [
      { value: "Haircuts", label: "Haircuts" },
      { value: "makeup", label: "makeup" },
      { value: "other", label: "other" },
    ],
  },
  {
    value: "Personal business",
    label: "Personal business",
    children: [
      {
        value: "Accountant/attorney/financial advisor",
        label: "Accountant/attorney/financial advisor",
      },
      { value: "other", label: "other" },
    ],
  },
  {
    value: "Health Care",
    label: "Health Care",
    children: [
      { value: "physicians and hospitals", label: "physicians and hospitals" },
      { value: "drugs", label: "drugs" },
      { value: "dental and visions", label: "dental and visions" },
      { value: "therapy", label: "therapy" },
      { value: "Health club or gym", label: "Health club or gym" },
    ],
  },
  {
    value: "Insurance",
    label: "Insurance",
    children: [
      { value: "Homeowners/renter’s", label: "Homeowners/renter’s" },
      { value: "auto", label: "auto" },
      { value: "health", label: "health" },
      { value: "life", label: "life" },
      { value: "disability", label: "disability" },
      { value: "Long-term care", label: "Long-term care" },
      { value: "umbrella liability", label: "umbrella liability" },
    ],
  },
  {
    value: "Education",
    label: "Education",
    children: [
      { value: "Tuition", label: "Tuition" },
      { value: "books", label: "books" },
      { value: "supplies", label: "supplies" },
      { value: "room&board", label: "room&board" },
    ],
  },
  {
    value: "Children",
    label: "Children",
    children: [
      { value: "day care", label: "day care" },
      { value: "toys", label: "toys" },
      { value: "activities", label: "activities" },
      { value: "child support", label: "child support" },
      { value: "charitable donations", label: "charitable donations" },
    ],
  },
  { value: "Uncategorized", label: "Uncategorized" },
  { value: "Income", label: "Income" }, //Todo: Income should have children.
];

export type transaction = {
  id: string; //id
  description: string;
  category: string; //categories;
  pricing: number;
  date: Dayjs;
  createdById?: string;
};

export interface CSVTransaction {
  Date: string;
  Description: string;
}

export interface DebitCSVTransaction extends CSVTransaction {
  Withdrawals: string;
  Deposits: string;
  Category: string;
  Balance: string;
}

export interface CreditCSVTransaction extends CSVTransaction {
  Amount: string;
}
