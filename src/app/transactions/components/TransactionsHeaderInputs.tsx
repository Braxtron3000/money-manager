"use client";
import React from "react";
import { Button, GetProps, Input, message, Upload, UploadProps } from "antd";
import { FilterOutlined, PlusOutlined } from "@ant-design/icons";
import Papa from "papaparse";
import { categories, transaction } from "~/types";
import dayjs from "dayjs";
import { addTransactions } from "~/app/actions/transactionActions";
import { processParsedCSVFile } from "~/app/util/parsingUtil";

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
  const category = isDebitCSVTransaction(csvTransaction)
    ? csvTransaction.Category
    : "credit cards/charge cards";

  const key = index.toString();

  if (isDebitCSVTransaction(csvTransaction)) {
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
    return {
      category,
      description,
      date,
      id: key, //Todo: this looks problamatic. address this.
      pricing: +csvTransaction.Amount.replaceAll("$", "").replaceAll(",", ""),
    };
  }
};

// const processParsedCSVFile = (
//   transactions: (DebitCSVTransaction | CreditCSVTransaction)[],
// ): transaction[] => {
//   if (transactions.at(0) && transactions[0]) {
//     return transactions.map(convertCSVTransaction);
//   } else return [];
// };

function SearchInputs() {
  const props: UploadProps = {
    beforeUpload(file) {
      // Papa.parse(file, {});

      const reader = new FileReader();
      reader.onload = (e) => {
        //! do not allow console printing here.
        if (e.target?.result?.toString) {
          console.log("parsing the baby");
          try {
            const som = Papa.parse<DebitCSVTransaction | CreditCSVTransaction>(
              //eslint-disable-next-line @typescript-eslint/no-base-to-string
              e.target?.result?.toString(),
              { header: true },
            );

            console.log("stringified transaction: ", som);

            if (som.data.length > 0) {
              //!Todo: add these back in
              // const processedCSVFiles = processParsedCSVFile(som.data);
              console.log("processing parsed files");
              const processedCSVFiles = processParsedCSVFile(som.data);
              addTransactions(processedCSVFiles).catch(console.error);
              //!   setTransactions(processedCSVFiles);
            }
          } catch (error) {
            console.error("lol psych \n", error);
          }
        }
      };

      reader.readAsText(file);

      // Papa.parse(reader.result?.toString());
    },
    onChange(info) {
      /*       const regex = new RegExp("(.*?).(csv)$");
          if (!regex.test(info.file.name)) {
            message.error(`${info.file.name} is not a csv file`);
          }
     */ if (info.file.status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === "done") {
        try {
          // eslint-disable-next-line @typescript-eslint/no-floating-promises
          message.success(`${info.file.name} file uploaded successfully`); //fine as long as catched
        } catch (error) {
          console.error(error);
        }
      } else if (info.file.status === "error") {
        try {
          // eslint-disable-next-line @typescript-eslint/no-floating-promises
          message.error(`${info.file.name} file upload failed.`);
        } catch (error) {
          console.error(error);
        }
      }
    },
    showUploadList: false,
    accept: ".csv",
  };

  type SearchProps = GetProps<typeof Input.Search>;
  const onSearch: SearchProps["onSearch"] = (value, _e, info) =>
    console.log(info?.source, value);

  return (
    <div className="row-span-5 flex justify-between">
      <div className="row-span-5 my-4 flex w-4/12 gap-4 ">
        {/* <Input.Search
          placeholder="input search text"
          onSearch={onSearch}
          className="w-80"
        />
        */}
        {/* <Button icon={<FilterOutlined />}>Filter</Button> */}
      </div>
      <div className="row-span-5 my-4 flex w-4/12 justify-center">
        <Upload {...props}>
          <Button icon={<PlusOutlined />}>Add Transactions </Button>
        </Upload>
      </div>
      <div className="row-span-5 my-4 flex w-4/12 justify-end">
        {/*  <Segmented
            onChange={setTableFormat}
            options={[
              { value: "list", icon: <BarsOutlined /> },
              { value: "calendar", icon: <CalendarOutlined /> },
            ]}
          /> */}
      </div>
    </div>
  );
}

export default SearchInputs;
