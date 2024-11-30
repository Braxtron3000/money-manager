"use client";
import React, { useState } from "react";
import type { CascaderProps, NotificationArgsProps, TableProps } from "antd";
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
import { categories, categoryTree, transaction } from "~/types";
import dayjs from "dayjs";
import { ColumnsType } from "antd/es/table";
// import { getServerAuthSession } from "~/server/auth";
// import { api } from "~/trpc/server";

const originData: transaction[] = [];
for (let i = 0; i < 1; i++) {
  originData.push({
    id: i.toString(),
    description: `Edward ${i}`,
    pricing: 32,
    date: dayjs(),
    category: "Taxes / Federal",
  });
}
interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: any;
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
    label: string;
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
            options={categoryTree}
            // expandTrigger="hover"
            displayRender={(label) => label.join("    ")}
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
  setTransactionsList,
}: {
  transactionsList: transaction[];
  setTransactionsList: (transactions: transaction[]) => void;
}) {
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState("");

  // const hello = api.post.hello({ text: "from tRPC" });
  // const session = getServerAuthSession();

  const isEditing = (record: transaction) => record.id === editingKey;

  const edit = (record: Partial<transaction> & { key: React.Key }) => {
    form.setFieldsValue({ name: "", age: "", address: "", ...record });
    setEditingKey(record.id);
  };

  const cancel = () => {
    setEditingKey("");
  };

  const save = async (key: React.Key) => {
    try {
      const row = (await form.validateFields()) as transaction;

      const newData = [...transactionsList];
      const index = newData.findIndex((transaction) => key === transaction.id);
      if (index > -1) {
        const transaction = newData[index];
        newData.splice(index, 1, {
          ...transaction,
          ...row,
        });
        setTransactionsList(newData);
        setEditingKey("");
      } else {
        newData.push(row);
        setTransactionsList(newData);
        setEditingKey("");
      }
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };

  const categoryColors = (category: string) => {
    // type mainCategories = 'Taxes' | 'Housing'|'Food'|'Transportation''Debt repayments'

    if (category.includes("Taxes")) return "blue";
    else if (category.includes("Housing")) return "HotPink";
    else if (category.includes("Food")) return "purple";
    else if (category.includes("Transportation")) return "volcanoe";
    else if (category.includes("Debt repayments")) return "MediumAquamarine";
    else if (category.includes("Attire")) return "turquoise";
    else if (category.includes("Fun stuff")) return "pink";
    else if (category.includes("Personal")) return "DeepSkyBlue";
    else if (category.includes("Personal business")) return "teal";
    else if (category.includes("Health Care")) return "royalblue";
    else if (category.includes("Insurance")) return "darkorange";
    else if (category.includes("Education")) return "mediumaquamarine";
    else if (category.includes("Children")) return "lawngreen";
    else if (category.includes("Uncategorized")) return "maroon";
  };
  const [notiicationApi, contextHolder] = notification.useNotification();

  const handleDelete = (key: React.Key) => {
    const deletedItemDescription = transactionsList.find(
      (transaction) => transaction.id === key,
    )?.description;
    const newData = transactionsList.filter((item) => item.id !== key);
    setTransactionsList(newData);

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

  const columns: ColumnsType<transaction & { editable: boolean }> = [
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      width: "40%",
      editable: true,
      inputType: "text",
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      render: (_, record) => {
        const returnstr = `${record.category[0]} / ${record.category[1]}`;
        console.error("return str " + returnstr);
        return <Tag color={categoryColors(returnstr)}>{returnstr}</Tag>;
      },
      width: "25%",
      editable: true,
      inputType: "category",
    },
    {
      title: "Pricing",
      dataIndex: "pricing",
      key: "pricing",
      width: "7.5%",
      editable: true,
      inputType: "number",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      width: "11%",
      editable: true,
      inputType: "date",
      render: (_, record) => (
        <h1>{/* record.date.format("ddd MM/DD/YY") */ "yo mama"}</h1>
      ),
    },
    {
      title: "operation",
      dataIndex: "operation",
      width: "11%",
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
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
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
              onClick={() => edit(record)}
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
    return {
      ...col,
      onCell: (record: transaction) => ({
        record,
        inputType: col.inputType,
        dataIndex: col.dataIndex,
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
          dataSource={transactionsList}
          columns={mergedColumns}
          rowClassName="editable-row"
          pagination={{
            onChange: cancel,
          }}
        />
      </Form>
    </>
  );
}

export default EditableTable;
