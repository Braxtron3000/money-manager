"use client";
import React, { useEffect, useState } from "react";
import type { CascaderProps } from "antd";
import {
  Cascader,
  DatePicker,
  Form,
  Input,
  InputNumber,
  notification,
  Popconfirm,
  Table,
  Tag,
  Typography,
} from "antd";
import { categoryTree, isCategory, transaction } from "~/types";
import dayjs from "dayjs";
import { ColumnsType } from "antd/es/table";
import * as transactionActions from "../actions/transactionActions";
import { api, RouterInputs, type ReactQueryOptions } from "~/trpc/react";
import { describe } from "node:test";
import { categoryColors } from "../util/parsingUtil";

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  title: any; //!Todo: type this.
  inputType: "number" | "text" | "date" | "category";
  record: transaction;
  index: number;
}

const EditableCell: React.FC<React.PropsWithChildren<EditableCellProps>> = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  // const displayRender = (labels: string[]) => labels[labels.length - 1];

  interface Option {
    value: string;
    // label: string;
    children?: Option[];
  }
  const onChange: CascaderProps<Option>["onChange"] = (value) => {
    console.log(value);
  };

  function getInputNode() {
    switch (inputType) {
      case "text":
        return <Input />;
      case "number":
        return <InputNumber />;
      case "date":
        return <DatePicker />;
      case "category":
        return (
          <Cascader
            options={categoryTree.map((node) => ({
              // this map is necessary. type wont show issue without label field but options will appear blank.
              value: node.value,
              children: node.children?.map((childNode) => ({
                value: childNode.value,
                label: childNode.value,
              })),
              label: node.value,
            }))}
            // expandTrigger="hover"
            displayRender={(value) => value.join("    ")}
            // displayRender={displayRender}
            onChange={onChange}
          />
        );

      default:
        return <Input />;
    }
  }

  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{ margin: 0 }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {getInputNode()}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

function EditableTable({
  transactionsList,
}: {
  transactionsList: transaction[];
}) {
  const [form] = Form.useForm<transaction>();

  // type inputs = RouterInputs["transactions"]["getTransactions"];
  // type options = ReactQueryOptions["transactions"]["getTransactions"];

  // const getAllthatGrub = (input: inputs) =>
  // api.transactions.getTransactions.useQuery(input);

  // const transactionsList = getAllthatGrub();

  const [transactionState, setTransactionState] =
    useState<transaction[]>(transactionsList);

  const [editingKey, setEditingKey] = useState("");

  const isEditing = (record: transaction) => record.id === editingKey;

  const edit = (record: Partial<transaction> & { key: React.Key }) => {
    try {
      form.setFieldsValue({ ...record });
      console.log("typeof date " + typeof record.date);
    } catch (error) {
      console.error("error editing ", error);
    }

    if (record.id) setEditingKey(record.id);
    else console.error("there is no record id");
  };

  const cancelEditingKey = () => {
    setEditingKey("");
  };

  const save = async (key: transaction["id"]) => {
    try {
      let row = await form.validateFields(); //! Todo: if you stringify print this it looks like it actually sends a partial transaction.

      row = { ...row, category: row.category.toString() };

      const newData = [...transactionState];
      const index = newData.findIndex((transaction) => key === transaction.id);
      if (index > -1) {
        const oldtransaction = newData[index];
        newData.splice(index, 1, {
          ...oldtransaction,
          ...row,
        });
        setEditingKey("");
      } else {
        console.error("no index was found when updating");
        newData.push(row);
        setEditingKey("");
      }

      transactionActions
        .editTransaction({ ...row, id: key })
        .catch(console.error);
      setTransactionState(newData);
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };

  const [notiicationApi, contextHolder] = notification.useNotification();

  const handleDelete = (key: React.Key) => {
    const deletedItemDescription = transactionState.find(
      (transaction) => transaction.id === key,
    )?.description;
    transactionActions
      .deleteTransactions([key.toString()])
      .catch(console.error);

    setTransactionState(
      transactionState.filter(
        (transaction) => transaction.id !== key.toString(),
      ),
    );

    if (!deletedItemDescription) {
      console.error("couldnt find deletedItemDescription");
    } else {
      notiicationApi.info({
        message: "deleted " + deletedItemDescription,
        placement: "bottom",
        duration: 2,
      });
    }
  };

  const columns: (ColumnsType<transaction>[number] & {
    editable?: boolean;
    inputType?: string;
  })[] = [
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      // width: "40%",
      editable: true,
      inputType: "text",
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      render: (_, record) => {
        return (
          <Tag color={categoryColors(record.category)}>{record.category}</Tag>
        );
      },
      // width: "25%",
      editable: true,
      inputType: "category",
    },
    {
      title: "Pricing",
      dataIndex: "pricing",
      key: "pricing",
      // width: "3%",
      editable: true,
      inputType: "number",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      // width: "11%",
      editable: true,
      inputType: "date",
      render: (_, record) => (
        <h1>{dayjs(record.date.toString()).format("MM/DD/YYYY")}</h1>
      ),
    },
    {
      title: " ",
      dataIndex: "operation",
      // width: "11%",
      render: (_: any, record: transaction) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Typography.Link
              onClick={() => save(record.id)}
              style={{ marginRight: 8 }}
            >
              Save
            </Typography.Link>
            <Popconfirm title="Sure to cancel?" onConfirm={cancelEditingKey}>
              <a>Cancel</a>
            </Popconfirm>
          </span>
        ) : (
          <span>
            <Popconfirm
              title="Sure to delete?"
              onConfirm={() => handleDelete(record.id)}
            >
              <Typography.Link disabled={editingKey !== ""}>
                Delete
              </Typography.Link>
            </Popconfirm>
            {"\t"}
            <Typography.Link
              disabled={editingKey !== ""}
              onClick={() => {
                console.log("type of " + record.date);

                edit({ ...record, key: record.id });
              }}
            >
              Edit
            </Typography.Link>
          </span>
        );
      },
    },
  ];

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }

    console.error("merged columns ", {
      dataIndex: "dataIndex" in col ? col.dataIndex : undefined,
      inputType: col.inputType,
    });

    return {
      ...col,
      onCell: (record: transaction) => ({
        record,
        inputType: col.inputType,
        dataIndex: "dataIndex" in col ? col.dataIndex : undefined,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  return (
    <>
      {contextHolder}
      <Form form={form} component={false}>
        <Table
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          bordered
          dataSource={transactionState.map((transaction) => ({
            ...transaction,
            date: dayjs(transaction.date), //! for some reason transaction.date is a string in runtime even though thats not its type.
          }))}
          //@ts-ignore idk theres some funkiness with typescript.
          columns={mergedColumns}
          fixedHeader
          pagination={{
            onChange: cancelEditingKey,
            pageSize: 50,
            // position: ["topCenter"],
          }}
        />
      </Form>
    </>
  );
}

export default EditableTable;
