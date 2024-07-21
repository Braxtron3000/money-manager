"use client";
import React, { useState } from "react";
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

export default function Page() {
  type SearchProps = GetProps<typeof Input.Search>;
  const onSearch: SearchProps["onSearch"] = (value, _e, info) =>
    console.log(info?.source, value);

  const [tableFormat, setTableFormat] = useState<"list" | "calendar">("list");

  const props: UploadProps = {
    onChange(info) {
      if (info.file.status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === "done") {
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    showUploadList: false,
  };

  return (
    <SideBarHeaderLayout title="Transactions">
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
          <Segmented
            onChange={setTableFormat}
            options={[
              { value: "list", icon: <BarsOutlined /> },
              { value: "calendar", icon: <CalendarOutlined /> },
            ]}
          />
        </div>
      </div>
      {tableFormat === "list" ? <EditableTable /> : <Calendar />}{" "}
    </SideBarHeaderLayout>
  );
}
