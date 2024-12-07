"use client";
import React from "react";
import { Button, GetProps, Input, message, Upload, UploadProps } from "antd";
import { FilterOutlined, PlusOutlined } from "@ant-design/icons";
import Papa from "papaparse";

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
              e.target?.result?.toString(),
              { header: true },
            );

            console.log("da babay is here: ", som);

            if (som.data.length > 0) {
              //!Todo: add these back in
              //    const processedCSVFiles = processParsedCSVFile(som.data);
              //!   AddTransactionContainer(processedCSVFiles);
              //!   setTransactions(processedCSVFiles);
            }
          } catch (error) {
            console.error("lol psych \n" + error);
          }
        }
      };

      reader.readAsText(file);

      //  reader.onlo

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
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === "error") {
        message.error(`${info.file.name} file upload failed.`);
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
        <Input.Search
          placeholder="input search text"
          onSearch={onSearch}
          className="w-80"
        />
        <Button icon={<FilterOutlined />}>Filter</Button>
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
