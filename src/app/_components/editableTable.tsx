import React, { useState } from "react";
import type { NotificationArgsProps, TableProps } from "antd";
import {
  Form,
  Input,
  InputNumber,
  notification,
  Popconfirm,
  Table,
  Tag,
  Typography,
} from "antd";
import { categories, transaction } from "~/types";
import moment from "moment";

const originData: transaction[] = [];
for (let i = 0; i < 100; i++) {
  originData.push({
    key: i.toString(),
    description: `Edward ${i}`,
    pricing: 32,
    date: moment().subtract(6, "days").calendar(),
    category: "Taxes:Federal",
  });
}
interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: any;
  inputType: "number" | "text";
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
  const inputNode = inputType === "number" ? <InputNumber /> : <Input />;

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
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

const EditableTable: React.FC = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState(originData);
  const [editingKey, setEditingKey] = useState("");

  const isEditing = (record: transaction) => record.key === editingKey;

  const edit = (record: Partial<transaction> & { key: React.Key }) => {
    form.setFieldsValue({ name: "", age: "", address: "", ...record });
    setEditingKey(record.key);
  };

  const cancel = () => {
    setEditingKey("");
  };

  const save = async (key: React.Key) => {
    try {
      const row = (await form.validateFields()) as transaction;

      const newData = [...data];
      const index = newData.findIndex((transaction) => key === transaction.key);
      if (index > -1) {
        const transaction = newData[index];
        newData.splice(index, 1, {
          ...transaction,
          ...row,
        });
        setData(newData);
        setEditingKey("");
      } else {
        newData.push(row);
        setData(newData);
        setEditingKey("");
      }
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };

  const categoryColors = (category: categories) => {
    switch (category) {
      case "Attire:clothing":
        return "geekblue";
        break;
      case "Education:Tuition":
        return "volcano";

      default:
        "green";
    }
  };
  type NotificationPlacement = NotificationArgsProps["placement"];
  const [api, contextHolder] = notification.useNotification();

  const handleDelete = (key: React.Key) => {
    const deletedItemDescription = data.find(
      (transaction) => transaction.key === key,
    )?.description;
    const newData = data.filter((item) => item.key !== key);
    setData(newData);

    if (!deletedItemDescription) {
      console.error("couldnt find deletedItemDescription");
    } else {
      api.info({
        message: "deleted " + deletedItemDescription,
        placement: "bottom",
        duration: 2,
      });
    }
  };

  const columns = [
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      width: "40%",
      editable: true,
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      render: (_, record) => (
        <Tag color={categoryColors(record.category)}>{record.category}</Tag>
      ),
      width: "25%",
      editable: true,
    },
    {
      title: "Pricing",
      dataIndex: "pricing",
      key: "pricing",
      width: "7.5%",
      editable: true,
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      width: "11%",
      editable: true,
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
              onClick={() => save(record.key)}
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
              onConfirm={() => handleDelete(record.key)}
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
        inputType: col.dataIndex === "age" ? "number" : "text",
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
          dataSource={data}
          columns={mergedColumns}
          rowClassName="editable-row"
          pagination={{
            onChange: cancel,
          }}
        />
      </Form>
    </>
  );
};

export default EditableTable;
