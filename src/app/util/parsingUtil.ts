import dayjs from "dayjs";
import {
  categories,
  categoryTree,
  CreditCSVTransaction,
  CSVTransaction,
  DebitCSVTransaction,
  transaction,
} from "~/types";
import * as parsingUtil from "../util/parsingUtil";

export const isDebitCSVTransaction = (
  transaction: CSVTransaction,
): transaction is DebitCSVTransaction => {
  return (
    "Date" in transaction &&
    "Description" in transaction &&
    "Withdrawals" in transaction &&
    "Deposits" in transaction &&
    "Category" in transaction &&
    "Balance" in transaction
  );
};

export const isCreditCSVTransaction = (
  transaction: CSVTransaction,
): transaction is CSVTransaction => {
  return "Amount" in transaction ? true : false;
};

export const convertCSVTransaction = (
  csvTransaction: DebitCSVTransaction | CreditCSVTransaction,
  index: number,
): transaction => {
  console.log("row ", index);
  const date = dayjs(csvTransaction.Date);
  const description = parsingUtil.purifyDescriptionString(
    csvTransaction.Description,
  );
  const category = isDebitCSVTransaction(csvTransaction)
    ? pncCategoryToThisCategory(csvTransaction.Category)
    : "credit cards/charge cards";

  const key = index.toString();

  if (isDebitCSVTransaction(csvTransaction)) {
    console.log("it is debitcsvtransaction");
    const amount =
      +csvTransaction.Deposits.replaceAll("$", "").replaceAll(",", "") -
      +csvTransaction.Withdrawals.replaceAll("$", "").replaceAll(",", "");
    console.log("amount " + amount);

    return {
      date,
      category,
      description,
      id: key,
      pricing: amount,
    };
  } else {
    console.log("it is CreditCSVTransaction");
    return {
      category,
      description,
      date,
      id: key,
      pricing: +csvTransaction.Amount.replaceAll("$", "").replaceAll(",", ""),
    };
  }
};

export const processParsedCSVFile = (
  transactions: (DebitCSVTransaction | CreditCSVTransaction)[],
): transaction[] => {
  if (transactions.at(0) && transactions[0]) {
    return transactions.map(convertCSVTransaction);
  } else return [];
};

//POS PURCHASE          POS99999999  2499861 WALGREENS STOR           CLAYTON      NC
//POS PURCHASE          POS14631901  2058823 HH 95                    RALEIGH      NC
//POS PURCHASE          POS102       6998092 CIRCLE K # 231           CLAYTON      NC

// DEBIT CARD PURCHASE   XXXXX9816 SQ *SOUTHERN CRAFT SAN    Raleigh     NC
// DEBIT CARD PURCHASE   XXXXX9816 ROMEOS PIZZA CLAYTON      CLAYTON     NC

export const purifyDescriptionString = (rawDescription: string) => {
  const DEBIT_CARD_PURCHASE = "DEBIT CARD PURCHASE   XXXXX";
  const POS_PURCHASE_POS = "POS PURCHASE          POS";
  const ACH_CREDIT = "ACH CREDIT XXXXX";

  if (rawDescription.includes(DEBIT_CARD_PURCHASE)) {
    return rawDescription.replace(DEBIT_CARD_PURCHASE, "").replace(/\d+/, "");
  } else if (rawDescription.includes(POS_PURCHASE_POS)) {
    return rawDescription
      .replaceAll(POS_PURCHASE_POS, "")
      .replace(/\d+/, "")
      .replace(/\d+/, "");
  } else if (rawDescription.includes(ACH_CREDIT)) {
    return rawDescription
      .replaceAll(ACH_CREDIT, "")
      .replace(/\b\w*\d\w*\b/, ""); //the replace here is not global and gets rid of the first word with numbers in it.
  } else console.error("displaying rawDescription");

  return rawDescription;
};

//switch is here to show all pnc categories are correctly categorized.
export const pncCategoryToThisCategory = (pncCategory: string): categories => {
  switch (pncCategory) {
    case "Auto + Gas":
      return "gasoline";
    case "Checks Written":
      return "Uncategorized"; //! checks are by default not actually associated with a category and should be manually changed.
    case "Credit Card Payments":
      return "credit cards/charge cards";
    case "Deposits":
      return "Income";
    case "Electronics + Merchandise":
      return "Uncategorized"; //again, this is too general and should have been categorized at this point.
    case "Groceries":
      return "groceries";
    case "Healthcare":
      return "Uncategorized"; //too general. should have been categorized at this point.
    case "Paychecks":
      return "Income";
    case "Restaurants":
      return "restaurants";
    case "Securities Trades":
      return "Uncategorized";
    case "Transfers":
      return "Uncategorized";
    default:
      return "Uncategorized";
  }
};

export const categoryToTreeValue = (category: string): string => {
  return category
    .substring(category.lastIndexOf("/") + 1)
    .trim()
    .replace(/^./, (char) => char.toUpperCase());
};

export const categoryColors = (category: string) => {
  const majorCategory = categoryTree.find((branch) => {
    return branch.children?.some((e) => e.value === category);
  }); //!this assumes that the tree is only one level deep which is fine for now.

  // console.error("majorCategory ", majorCategory, "cateogry " + category);

  if (majorCategory?.value == "Taxes" || category == "Taxes") return "blue";
  else if (majorCategory?.value == "Housing" || category == "Housing")
    return "HotPink";
  else if (majorCategory?.value == "Food" || category == "Food")
    return "purple";
  else if (
    majorCategory?.value == "Transportation" ||
    category == "Transportation"
  )
    return "red";
  else if (
    majorCategory?.value == "Debt repayments" ||
    category === "Debt repayments"
  )
    return "MediumAquamarine";
  else if (majorCategory?.value == "Attire" || category === "Attire")
    return "turquoise";
  else if (majorCategory?.value == "Fun stuff" || category === "Fun stuff")
    return "pink";
  else if (majorCategory?.value == "Personal" || category === "Fun stuff")
    return "DeepSkyBlue";
  else if (
    majorCategory?.value == "Personal business" ||
    category === "Fun stuff"
  )
    return "teal";
  else if (majorCategory?.value == "Health Care" || category === "Health Care")
    return "royalblue";
  else if (majorCategory?.value == "Insurance" || category === "Insurance")
    return "darkorange";
  else if (majorCategory?.value == "Education" || category === "Education")
    return "mediumaquamarine";
  else if (majorCategory?.value == "Children" || category === "Children")
    return "lawngreen";
  else if (
    majorCategory?.value == "Uncategorized" ||
    category === "Uncategorized"
  )
    return "maroon";
};
