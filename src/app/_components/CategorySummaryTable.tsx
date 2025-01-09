"use client";
import { Prisma } from "@prisma/client";
import { Button, DatePicker, Input, Modal, Space, Table } from "antd";
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
    const childrenTotals = branch.children?.map((childbranch, index) => ({
      key: index + " " + index,
      name: childbranch.label,
      total: data?.find((row) => row.category === childbranch.label)?._sum
        .pricing,
    }));

    const parentCategoryTotal = childrenTotals
      ? childrenTotals
          ?.map(({ total }) => total)
          .reduce(
            (accumulator, currentVal) =>
              (Number(accumulator) || 0) + (Number(currentVal) || 0),
          )
      : data?.find((row) => row.category === branch.label)?._sum.pricing;

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
        <div className="h-72 overflow-y-scroll">
          {categoryTree.map((branch) => (
            <div className="grid-cols-3" key={branch.label}>
              <h1>{branch.label}</h1>
              {branch.children ? (
                branch.children?.map((child) => (
                  <div className="flex-row justify-between" key={child.value}>
                    <h3 className="inline-block w-1/2">{child.label}</h3>
                    <Input style={{ display: "inline-block", width: "25%" }} />
                    {/* <input style={{ flex: 1, display: "inline-block" }} /> */}
                  </div>
                ))
              ) : (
                <Input style={{ display: "inline-block", width: "25%" }} />
              )}
            </div>
          ))}
        </div>
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
