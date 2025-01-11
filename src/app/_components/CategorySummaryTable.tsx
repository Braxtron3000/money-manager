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

  return (
    <>
      <DatePicker
        onChange={onChangeMonth}
        picker="month"
        defaultValue={dayjs()}
      />
      <CreateNewBudgetView />
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

  const [budgetTree, setBudgetTree] = useState<
    (CategoryNode & { amount: number })[]
  >(
    categoryTree.map((node) => ({
      ...node,
      amount: 0,
      children: node.children?.map((child) => ({ ...child, amount: 0 })), //! this assumes theres only one layer of children
    })),
  );

  const budgetMap = new Map<string, number>([]);

  function da(
    categoryTree: typeof budgetTree,
    setNewTree: (node: (typeof budgetTree)[number]) => void,
  ) {
    categoryTree;
  }

  //! this assumes theres only one layer of children
  // function updateBudgetTree(category: string, amount: number) {
  //   let runningBudget: typeof budgetTree = {...budgetTree};

  //   runningBudget.forEach((node) => {
  //     if (node.label === category) {
  //       const newBudget = budgetTree
  //         .filter((searchNode) => searchNode !== node)
  //         .concat({ ...node, amount });

  //       setBudgetTree(newBudget);
  //       return;

  //     } else if (node.children) {
  //       node.children.forEach(childNode => {
  //         if(childNode.label===category){
  //           const newBudget = budgetTree
  //           .filter((searchNode) => searchNode !== node)
  //           .concat({ ...node, amount: 100, children: node.children?.filter() });
  //         }
  //       })
  //     }
  //   });
  // }

  // type FieldType = {
  //   [category: string]: number;
  // };

  // const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
  //   console.log("Success:", values);
  // };

  // const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (
  //   errorInfo,
  // ) => {
  //   console.log("Failed:", errorInfo);
  // };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    // form.submit();

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
      startDate: new Date(Date.now()),
    }).then(() =>
      console.log("created new budget! ", {
        categories,
        current: false,
        startDate: new Date(Date.now()),
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

  // useResetFormOnCloseModal({
  //   form,
  //   open: isModalOpen,
  // });

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
          <p>This will start next month if this isnt your first one</p>
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
                  branch.label.charAt(0).toUpperCase() + branch.label.slice(1),
                )}
              >
                <h2>{branch.label}</h2>
              </Tag>
              {/* <Tag color={categoryColors(branch.label)}>{branch.label}</Tag> */}
              {branch.children ? (
                branch.children.map((child) => (
                  // <Form.Item label={child.label} name={child.label}>
                  <div>
                    <h2>{child.label}</h2>
                    <InputNumber
                      addonBefore={child.label === "Income" ? "+" : "-"}
                      addonAfter="$"
                      onChange={(text) => onChangeText(child.label, text)}
                    />
                  </div>
                  // </Form.Item>
                ))
              ) : (
                // <Form.Item label={branch.label} name={branch.label}>
                <InputNumber
                  addonBefore={branch.label === "Income" ? "+" : "-"}
                  addonAfter="$"
                  onChange={(text) => onChangeText(branch.label, text)}
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
