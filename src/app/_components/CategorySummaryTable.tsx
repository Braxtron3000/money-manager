"use client";
import { Table } from "antd";
import type { TableColumnsType } from "antd";

import React, { useState } from "react";
import { categoryTree } from "~/types";

const CategorySummaryTable = () => {
  const [expandedRowKeys, setExpandedRowsKeys] = useState<React.Key[]>([]);

  interface DataType {
    key: React.Key;
    name: string;
    total: number;
  }

  const dataSource: DataType[] = categoryTree.map((branch, index) => ({
    key: index,
    name: branch.label,
    total: Math.random() * 100,
    children: branch.children?.map((branch, index) => ({
      key: index + " " + index,
      name: branch.label,
      total: Math.random() * 100,
    })),
  }));

  const columnsFromGuide: TableColumnsType<DataType> = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
    },
  ];

  return (
    <Table
      dataSource={dataSource}
      columns={columnsFromGuide}
      pagination={false}
      expandable={{
        expandedRowKeys,
        onExpand: (expanded, record) => {
          expanded
            ? setExpandedRowsKeys([...expandedRowKeys, record.key])
            : setExpandedRowsKeys(
                expandedRowKeys.filter((key) => key !== record.key),
              );
        },
      }}
    />
  );
};

export default CategorySummaryTable;
