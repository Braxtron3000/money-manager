"use client";
import { Prisma } from "@prisma/client";
import { Button, DatePicker, Modal, Table } from "antd";
import type { TableColumnsType } from "antd";
import type { DatePickerProps } from "antd";
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
    total: number | null | undefined;
  }

  const dataSource: DataType[] = categoryTree.map((branch, index) => {
    const childrenTotals = branch.children?.map((branch, index) => ({
      key: index + " " + index,
      name: branch.label,
      total: data?.find((row) => row.category === branch.label)?._sum.pricing,
    }));

    const parentCategoryTotal = childrenTotals
      ?.map(({ total }) => total)
      .reduce(
        (accumulator, currentVal) =>
          (Number(accumulator) || 0) + (Number(currentVal) || 0),
      );

    return {
      key: index,
      name: branch.label,
      total: parentCategoryTotal || null,
      children: childrenTotals,
    };
  });

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
    {
      title: "Budgeted",
      dataIndex: "budgeted",
      key: "budgeted",
    },
  ];

  const onChangeMonth: DatePickerProps["onChange"] = (date, dateString) => {
    console.log(date, dateString);
  };
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const createNewBudgetView = (
    <>
      <Button type="primary" onClick={showModal}>
        create new budget
      </Button>
      {/* //! if its the first budget say create a new budget! */}
      <Modal
        title="Create New Budget"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <p>This will start next month if this isnt your first one</p>
      </Modal>
    </>
  );

  return (
    <>
      <DatePicker onChange={onChangeMonth} picker="month" />
      {createNewBudgetView}
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
    </>
  );
};

export default CategorySummaryTable;
