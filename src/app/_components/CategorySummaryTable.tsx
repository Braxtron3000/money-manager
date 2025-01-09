"use client";
import { Prisma } from "@prisma/client";
import {
  Button,
  Carousel,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  theme,
  Space,
  Table,
  Tag,
} from "antd";
import type { FormInstance, TableColumnsType } from "antd";
import type { DatePickerProps } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { categoryTree } from "~/types";
import { categoryColors } from "../util/parsingUtil";
import type { GetRef } from "antd";
import {
  LeftOutlined,
  RightOutlined,
  RightCircleFilled,
} from "@ant-design/icons";

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
      <DatePicker onChange={onChangeMonth} picker="month" />
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
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    form.submit();
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  useResetFormOnCloseModal({
    form,
    open: isModalOpen,
  });

  const { token } = theme.useToken();
  return (
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
        <Form labelAlign="left">
          <Carousel
            style={{ backgroundColor: "slategrey", borderRadius: 4 }}
            infinite={false}
            arrows
          >
            {categoryTree.map((branch) => (
              <>
                <Tag
                  color={categoryColors(
                    branch.label.charAt(0).toUpperCase() +
                      branch.label.slice(1),
                  )}
                >
                  {branch.label}
                </Tag>
                {/* <Tag color={categoryColors(branch.label)}>{branch.label}</Tag> */}
                {branch.children ? (
                  branch.children.map((child) => (
                    <Form.Item label={child.label} name={child.label}>
                      <InputNumber
                        addonBefore={child.label === "Input" ? "+" : "-"}
                        addonAfter="$"
                      />
                    </Form.Item>
                  ))
                ) : (
                  <Form.Item label={branch.label} name={branch.label}>
                    <InputNumber
                      style={{ width: "40%" }}
                      addonBefore={branch.label === "Input" ? "+" : "-"}
                      addonAfter="$"
                    />
                  </Form.Item>
                )}
              </>
            ))}
          </Carousel>
        </Form>
      </Modal>
    </>
  );
};
