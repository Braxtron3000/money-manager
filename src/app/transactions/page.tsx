// "use client";
import React, { useEffect, useState } from "react";
import SideBarHeaderLayout from "../_components/SidebarHeaderLayout";
import {
  Button,
  GetProps,
  Input,
  message,
  Segmented,
  Upload,
  UploadProps,
} from "antd";
import {
  SearchOutlined,
  FilterOutlined,
  PlusOutlined,
  BarsOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import EditableTable from "../_components/editableTable";
import Calendar from "../_components/Calendar";
import Papa from "papaparse";
import { transaction } from "~/types";
import dayjs from "dayjs";
import { randomUUID } from "crypto";
import AddTransactionContainer, {
  getTransactions,
} from "../_components/AddTransactionContainer";
// import { getServerAuthSession } from "~/server/auth";
// import { api } from "~/trpc/server";

export default async function Page() {
  // const hello = api.post.hello({ text: "from tRPC" });
  // const session = getServerAuthSession();

  type SearchProps = GetProps<typeof Input.Search>;
  const onSearch: SearchProps["onSearch"] = (value, _e, info) =>
    console.log(info?.source, value);

  // const [tableFormat, setTableFormat] = useState<"list" | "calendar">("list");
  const tableFormat = "list";

  interface CSVTransaction {
    Date: string;
    Description: string;
  }

  interface DebitCSVTransaction extends CSVTransaction {
    Withdrawals: string;
    Deposits: string;
    Category: string;
    Balance: string;
  }

  // const som: DebitCSVTransaction = { Date: "02/15/2024" };

  const isDebitCSVTransaction = (
    transaction: CSVTransaction,
  ): transaction is DebitCSVTransaction => {
    return "Date" in transaction ||
      "Description" in transaction ||
      "Withdrawals" in transaction ||
      "Deposits" in transaction ||
      "Category" in transaction ||
      "Balance" in transaction
      ? true
      : false;
  };

  interface CreditCSVTransaction extends CSVTransaction {
    Amount: string;
  }

  const isCreditCSVTransaction = (
    transaction: CSVTransaction,
  ): transaction is CSVTransaction => {
    return "Amount" in transaction ? true : false;
  };

  const convertCSVTransaction = (
    csvTransaction: DebitCSVTransaction | CreditCSVTransaction,
    index: number,
  ): transaction => {
    const date = dayjs(csvTransaction.Date);
    const description = csvTransaction.Description;
    const key = index.toString();

    if (isDebitCSVTransaction(csvTransaction)) {
      const amount =
        +csvTransaction.Deposits.replaceAll("$", "").replaceAll(",", "") -
        +csvTransaction.Withdrawals.replaceAll("$", "").replaceAll(",", "");
      console.log("amount " + amount);

      return {
        date,
        category: "Food / restaurants",
        description,
        key,
        pricing: amount,
      };
    } else {
      return {
        category: "Food / restaurants",
        description,
        date,
        key,
        pricing: +csvTransaction.Amount.replaceAll("$", "").replaceAll(",", ""),
      };
    }
  };

  const processParsedCSVFile = (
    transactions: (DebitCSVTransaction | CreditCSVTransaction)[],
  ): transaction[] => {
    if (transactions.at(0) && transactions[0]) {
      return transactions.map(convertCSVTransaction);
    } else return [];
  };

  // const [transactions, setTransactions] = useState<transaction[]>([]);

  const transactions = await getTransactions();

  return (
    <SideBarHeaderLayout title="Transactions">
      {tableFormat === "list" ? (
        <EditableTable transactionsList={transactions} />
      ) : (
        <Calendar />
      )}
    </SideBarHeaderLayout>
  );
}
