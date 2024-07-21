"use client";
import React from "react";
import SideBarHeaderLayout from "../_components/SidebarHeaderLayout";
import EditableTable from "../_components/editableTable";
import { Button, GetProps, Input, Segmented } from "antd";
import {
  SearchOutlined,
  FilterOutlined,
  PlusOutlined,
  BarsOutlined,
  CalendarOutlined,
} from "@ant-design/icons";

export default function Page() {
  type SearchProps = GetProps<typeof Input.Search>;
  const onSearch: SearchProps["onSearch"] = (value, _e, info) =>
    console.log(info?.source, value);

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
          <Button icon={<PlusOutlined />}>Add Transactions </Button>
        </div>
        <div className="row-span-5 my-4 flex w-4/12 justify-end">
          <Segmented
            options={[
              { value: "list", icon: <BarsOutlined /> },
              { value: "calendar", icon: <CalendarOutlined /> },
            ]}
          />
        </div>
      </div>
      <EditableTable />
    </SideBarHeaderLayout>
  );
}
