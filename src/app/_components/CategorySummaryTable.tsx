"use client";
import { Button, DatePicker, InputNumber, Modal, Table, Tag, Card } from "antd";
import type { TableColumnsType } from "antd";
import type { DatePickerProps } from "antd";
import React, { useEffect, useState } from "react";
import { categoryTree } from "~/types";
import { categoryColors } from "../util/parsingUtil";
import dayjs from "dayjs";
import type { api } from "~/trpc/server";
import * as TransactionActions from "../actions/transactionActions";
import * as BudgetActions from "../actions/budgetActions";

const CategorySummaryTable = ({
  dataProp,
  budgetProp,
}: {
  dataProp: Awaited<
    ReturnType<typeof TransactionActions.getMonthCategorySummary>
  >;
  budgetProp: Awaited<ReturnType<typeof api.budgets.getLatest>> | undefined;
}) => {
  const [expandedRowKeys, setExpandedRowsKeys] = useState<React.Key[]>([]);
  const [data, setData] = useState(dataProp);

  const [budget, setBudget] = useState(budgetProp);

  interface DataType {
    key: React.Key;
    name: string;
    total: number | null | undefined;
    budgeted: number | null | undefined;
  }

  const dataSource: DataType[] = categoryTree.map((branch, index) => {
    const childrenTotals = branch.children?.map((childbranch, index) => ({
      key: index + childbranch.value + index,
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

  const [date, setDate] = useState(dayjs());

  const onChangeMonth: DatePickerProps["onChange"] = (
    dateParam,
    dateString,
  ) => {
    const newDateParams = {
      month: dateParam.month() + 1,
      year: dateParam.year(),
    };
    console.log("onchangemonth ", newDateParams);

    TransactionActions.getMonthCategorySummary(newDateParams)
      .then(setData)
      .catch((e) =>
        console.error(
          "there was an issue setting the month category summary ",
          e,
        ),
      );

    BudgetActions.getLatest(newDateParams)
      .then(setBudget)
      .catch((e) => console.error("there was an issue setting the budget ", e));

    setDate(dateParam);
  };

  return (
    <>
      <DatePicker
        onChange={onChangeMonth}
        picker="month"
        value={date}
        allowClear={false}
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

const CreateNewBudgetView = () => {
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

    const createButdgetParams = {
      categories,
      current: false,
      startDate: new Date(startDate.valueOf()),
    };

    BudgetActions.createBudget(createButdgetParams)
      .then(() => console.log("created new budget! ", createButdgetParams))
      .catch((e) => console.error("creating budget error: ", e));
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-redundant-type-constituents
  function onChangeText(label: string, text: any) {
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
            allowClear={false}
          />

          {categoryTree.map((branch, index) => (
            <Card
              key={index}
              style={{ marginBottom: "1rem", marginTop: "1rem" }}
            >
              <Tag
                key={"tag" + index}
                color={categoryColors(
                  branch.value.charAt(0).toUpperCase() + branch.value.slice(1),
                )}
              >
                <h2>{branch.value}</h2>
              </Tag>
              {branch.children ? (
                branch.children.map((child, index) => (
                  <div key={index}>
                    <h2>{child.value}</h2>
                    <InputNumber
                      addonBefore={child.value === "Income" ? "+" : "-"}
                      addonAfter="$"
                      onChange={(text) => onChangeText(child.value, text)}
                    />
                  </div>
                ))
              ) : (
                <InputNumber
                  addonBefore={branch.value === "Income" ? "+" : "-"}
                  addonAfter="$"
                  onChange={(text) => onChangeText(branch.value, text)}
                />
              )}
            </Card>
          ))}
        </Modal>
      )}
    </>
  );
};
