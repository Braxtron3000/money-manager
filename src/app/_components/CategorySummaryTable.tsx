"use client";
import { Prisma } from "@prisma/client";
import { Button, DatePicker, InputNumber, Modal, Table, Tag, Card } from "antd";
import type { FormInstance, TableColumnsType } from "antd";
import type { DatePickerProps } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { CategoryNode, categoryTree } from "~/types";
import { categoryColors } from "../util/parsingUtil";
import * as BudgetActions from "../actions/budgetActions";
import dayjs from "dayjs";
import { api } from "~/trpc/server";

const CategorySummaryTable = ({
  data,
  budget,
}: {
  data: Awaited<ReturnType<typeof api.transactions.getMonthCategorySummary>>;
  budget: Awaited<ReturnType<typeof api.budgets.getLatest>>;
}) => {
  const [expandedRowKeys, setExpandedRowsKeys] = useState<React.Key[]>([]);

  interface DataType {
    key: React.Key;
    name: string;
    total: number | null | undefined;
    budgeted: number | null | undefined;
  }

  const dataSource: DataType[] = categoryTree.map((branch, index) => {
    const childrenTotals = branch.children?.map((childbranch, index) => ({
      key: index + " " + index,
      name: childbranch.value,
      total: data?.find((row) => row.category === childbranch.value)?._sum
        .pricing,
      budgeted: budget?.categories.find(
        (row) => row.category == childbranch.value,
      )?.amount,
    }));

    const parentCategoryTotal = childrenTotals
      ? childrenTotals
          ?.map(({ total }) => total)
          .reduce(
            (accumulator, currentVal) =>
              (Number(accumulator) || 0) + (Number(currentVal) || 0),
          )
      : data?.find((row) => row.category === branch.value)?._sum.pricing;

    const budgeted = childrenTotals
      ? childrenTotals
          ?.map(({ budgeted }) => budgeted)
          .reduce(
            (accumulator, currentVal) =>
              (Number(accumulator) || 0) + (Number(currentVal) || 0),
          )
      : budget?.categories.find((row) => row.category === branch.value)?.amount;

    return {
      key: index,
      name: branch.value,
      total: parentCategoryTotal || null,
      children: childrenTotals,
      budgeted: budgeted || null,
    };
  });

  const columns: TableColumnsType<DataType> = [
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

  return (
    <>
      <DatePicker
        onChange={onChangeMonth}
        picker="month"
        // maxDate={dayjs()}
        defaultValue={dayjs()}
      />
      <CreateNewBudgetView />
      <Table
        dataSource={dataSource}
        columns={columns}
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

const useResetFormOnCloseModal = ({
  form,
  open,
}: {
  form: FormInstance;
  open: boolean;
}) => {
  const prevOpenRef = useRef<boolean>(null);

  const prevOpen = prevOpenRef.current;

  useEffect(() => {
    if (!open && prevOpen) {
      form.resetFields();
    }
  }, [form, prevOpen, open]);
};

const CreateNewBudgetView = () => {
  // const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [startDate, setStartDate] = useState(dayjs().add(1, "month").date(1));

  const budgetMap = new Map<string, number>([]);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    const categories: {
      category: string;
      amount: number;
    }[] = [];

    budgetMap.forEach((amount, category) =>
      categories.push({ category, amount }),
    );

    BudgetActions.createBudget({
      categories,
      current: false,
      startDate: new Date(startDate.valueOf()),
    }).then(() =>
      console.log("created new budget! ", {
        categories,
        current: false,
        startDate: new Date(startDate.valueOf()),
      }),
    );
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  function onChangeText(label: string, text: any | null) {
    if (Number(text)) {
      budgetMap.set(label, Number(text));
    } else if (!text) {
      budgetMap.delete(label);
    } else console.log("skipping update", text);

    console.log("new budget map ", budgetMap);
  }

  useEffect(() => {
    console.log("startdate changed: ", startDate.format("MM/YYYY"));
  }, [startDate]);

  return (
    <>
      <Button type="primary" onClick={showModal}>
        create new budget
      </Button>
      {/* //! if its the first budget say create a new budget! */}
      {isModalOpen && ( //this is literally here to clear the fields.
        <Modal
          title="Create New Budget"
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
        >
          <DatePicker
            picker="month"
            placeholder="Start month"
            onChange={setStartDate}
            value={startDate}
          />
          {/* <Form
          form={form}
          labelAlign="left"
          onFinish={onFinish}
          preserve={false}
          onFinishFailed={onFinishFailed}
        > */}
          {/* <Carousel
          style={{ backgroundColor: "slategrey", borderRadius: 4 }}
          infinite={false}
          arrows
        > */}
          {categoryTree.map((branch, index) => (
            <Card
              key={index}
              style={{ marginBottom: "1rem", marginTop: "1rem" }}
            >
              <Tag
                color={categoryColors(
                  branch.value.charAt(0).toUpperCase() + branch.value.slice(1),
                )}
              >
                <h2>{branch.value}</h2>
              </Tag>
              {/* <Tag color={categoryColors(branch.label)}>{branch.label}</Tag> */}
              {branch.children ? (
                branch.children.map((child) => (
                  // <Form.Item label={child.label} name={child.label}>
                  <div>
                    <h2>{child.value}</h2>
                    <InputNumber
                      addonBefore={child.value === "Income" ? "+" : "-"}
                      addonAfter="$"
                      onChange={(text) => onChangeText(child.value, text)}
                    />
                  </div>
                  // </Form.Item>
                ))
              ) : (
                // <Form.Item label={branch.label} name={branch.label}>
                <InputNumber
                  addonBefore={branch.value === "Income" ? "+" : "-"}
                  addonAfter="$"
                  onChange={(text) => onChangeText(branch.value, text)}
                />
                // </Form.Item>
              )}
            </Card>
          ))}

          {/* </Carousel> */}
          {/* </Form> */}
        </Modal>
      )}
    </>
  );
};
