"use client";
import { Prisma } from "@prisma/client";
import { Table } from "antd";
import type { TableColumnsType } from "antd";

import React, { useState } from "react";
import { categoryTree } from "~/types";

const CategorySummaryTable = ({
  data,
}: {
  data:
    | (Prisma.PickEnumerable<
        Prisma.TransactionGroupByOutputType,
        "category"[]
      > & {
        _sum: {
          pricing: number | null;
        };
      })[]
    | undefined;
}) => {
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

  const dataSource2: DataType[] =
    data?.map((bah, index) => ({
      key: index,
      name: bah.category,
      total: bah._sum.pricing ?? 0,
    })) ?? [];

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
      dataSource={dataSource2}
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
