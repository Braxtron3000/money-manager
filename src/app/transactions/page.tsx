import React from "react";
import SideBarHeaderLayout from "../_components/SidebarHeaderLayout";
import { Table } from "antd";

export default function Page() {
  type transaction = {
    description: string;
    category: string;
    pricing: number;
    date: Date;
  };

  const dataSource = [
    {
      key: "1",
      name: "Mike",
      age: 32,
      address: "10 Downing Street",
    },
    {
      key: "2",
      name: "John",
      age: 42,
      address: "10 Downing Street",
    },
  ];

  const columns = [
    {
      title: "Description",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Category",
      dataIndex: "age",
      key: "age",
    },
    {
      title: "Pricing",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Date",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Action",
      dataIndex: "address",
      key: "address",
    },
  ];

  return (
    <SideBarHeaderLayout title="Transactions">
      <Table dataSource={dataSource} columns={columns} />
    </SideBarHeaderLayout>
  );
}
