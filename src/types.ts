import dayjs, { Dayjs } from "dayjs";

//Todo: theres probably a better way of doing this so the category tree can work.
export type categories =
  | "FICA (social security & medicare)"
  | "Federal"
  | "State & local"
  | "Rent"
  | "Mortgage"
  | "Property taxes"
  | "Gas/electric/oil"
  | "Water/garbage"
  | "Phones"
  | "Tv"
  | "Internet"
  | "Furniture/appliances"
  | "Housekeeper"
  | "Maintenance/repairs"
  | "Groceries"
  | "Restaurants"
  | "Gasoline"
  | "State registration fees"
  | "Tolls/parking"
  | "Public transportation/taxis"
  | "Credit cards/charge cards"
  | "Auto loans"
  | "Student loans"
  | "Other"
  | "Clothing"
  | "Shoes"
  | "Jewelry"
  | "Dry cleaning"
  | "Entertainment (movies, concerts)"
  | "Vacation & travel"
  | "Gifts"
  | "Hobbies"
  | "Subscription/memberships"
  | "Pets"
  | "Haircuts"
  | "Makeup"
  | "Accountant/attorney/financial advisor"
  | "Physicians and hospitals"
  | "Drugs"
  | "Dental and visions"
  | "Therapy"
  | "Health club or gym"
  | "Homeowners/renter’s"
  | "Auto"
  | "Health"
  | "Life"
  | "Disability"
  | "Long-term care"
  | "Umbrella liability"
  | "Tuition"
  | "Books"
  | "Supplies"
  | "Room&board"
  | "Day care"
  | "Toys"
  | "Activities"
  | "Child support"
  | "Charitable donations"
  | "Uncategorized"
  | "Income"; //Todo: income needs sub incomes such as from investments and gifts.
//Todo: also add in investment expenses

export const categoriesList: categories[] = [
  "FICA (social security & medicare)",
  "Federal",
  "State & local",
  "Rent",
  "Mortgage",
  "Property taxes",
  "Gas/electric/oil",
  "Water/garbage",
  "Phones",
  "Tv",
  "Internet",
  "Furniture/appliances",
  "Housekeeper",
  "Maintenance/repairs",
  "Groceries",
  "Restaurants",
  "Gasoline",
  "Maintenance/repairs",
  "State registration fees",
  "Tolls/parking",
  "Public transportation/taxis",
  "Credit cards/charge cards",
  "Auto loans",
  "Student loans",
  "Other",
  "Clothing",
  "Shoes",
  "Jewelry",
  "Dry cleaning",
  "Entertainment (movies, concerts)",
  "Vacation & travel",
  "Gifts",
  "Hobbies",
  "Subscription/memberships",
  "Pets",
  "Other",
  "Haircuts",
  "Makeup",
  "Other",
  "Accountant/attorney/financial advisor",
  "Physicians and hospitals",
  "Drugs",
  "Dental and visions",
  "Therapy",
  "Health club or gym",
  "Homeowners/renter’s",
  "Auto",
  "Health",
  "Life",
  "Disability",
  "Long-term care",
  "Umbrella liability",
  "Tuition",
  "Books",
  "Supplies",
  "Room&board",
  "Day care",
  "Toys",
  "Activities",
  "Child support",
  "Charitable donations",
  "Uncategorized",
  "Income",
] as const;

export function isCategory(string: string): string is categories {
  return categoriesList.findIndex((category) => category === string) > -1;
}

export interface CategoryNode {
  value: Capitalize<string>; // value and label should be typed to correlate with category type.
  children?: CategoryNode[];
}

export const categoryTree: CategoryNode[] = [
  {
    value: "Taxes",
    children: [
      {
        value: "FICA (social security & medicare)",
      },
      { value: "Federal" },
    ],
  },
  {
    value: "Housing",
    children: [
      { value: "Rent" },
      { value: "Mortgage" },
      { value: "Property taxes" },
      { value: "Gas/electric/oil" },
      { value: "Water/garbage" },
      { value: "Phones" },
      { value: "Tv" },
      { value: "Internet" },
      { value: "Furniture/appliances" },
      { value: "Housekeeper" },
      { value: "Maintenance/repairs" },
    ],
  },
  {
    value: "Food",
    children: [{ value: "Groceries" }, { value: "Restaurants" }],
  },
  {
    value: "Transportation",
    children: [
      { value: "Gasoline" },
      { value: "Maintenance/repairs" },
      { value: "State registration fees" },
      { value: "Tolls/parking" },
      {
        value: "Public transportation/taxis",
      },
    ],
  },
  {
    value: "Debt repayments",
    children: [
      {
        value: "Credit cards/charge cards",
      },
      {
        value: "Auto loans",
      },
      { value: "Student loans" },
      { value: "Other" },
    ],
  },
  {
    value: "Attire",
    children: [
      { value: "Clothing" },
      { value: "Shoes" },
      { value: "Jewelry" },
      { value: "Dry cleaning" },
    ],
  },
  {
    value: "Fun stuff",
    children: [
      {
        value: "Entertainment (movies, concerts)",
      },
      { value: "Vacation & travel" },
      { value: "Gifts" },
      { value: "Hobbies" },
      { value: "Subscription/memberships" },
      { value: "Pets" },
      { value: "Other" },
    ],
  },
  {
    value: "Personal care",

    children: [{ value: "Haircuts" }, { value: "Makeup" }, { value: "Other" }],
  },
  {
    value: "Personal business",

    children: [
      {
        value: "Accountant/attorney/financial advisor",
      },
      { value: "Other" },
    ],
  },
  {
    value: "Health Care",

    children: [
      { value: "Physicians and hospitals" },
      { value: "Drugs" },
      { value: "Dental and visions" },
      { value: "Therapy" },
      { value: "Health club or gym" },
    ],
  },
  {
    value: "Insurance",

    children: [
      { value: "Homeowners/renter’s" },
      { value: "Auto" },
      { value: "Health" },
      { value: "Life" },
      { value: "Disability" },
      { value: "Long-term care" },
      { value: "Umbrella liability" },
    ],
  },
  {
    value: "Education",

    children: [
      { value: "Tuition" },
      { value: "Books" },
      { value: "Supplies" },
      { value: "Room&board" },
    ],
  },
  {
    value: "Children",

    children: [
      { value: "Day care" },
      { value: "Toys" },
      { value: "Activities" },
      { value: "Child support" },
      { value: "Charitable donations" },
    ],
  },
  { value: "Uncategorized" },
  { value: "Income" }, //Todo: Income should have children.
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
