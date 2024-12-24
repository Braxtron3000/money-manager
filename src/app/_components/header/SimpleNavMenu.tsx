"use client";

import { Menu, MenuProps } from "antd";
import { AreaChartOutlined, TableOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";

const SimpleNavMenu = ({ disabled }: { disabled: boolean }) => {
  const router = useRouter();

  type MenuItem = Required<MenuProps>["items"][number];
  const items: MenuItem[] = [
    {
      label: "Dashboard",
      key: "Dashboard",
      icon: <AreaChartOutlined />,
      disabled,
      onClick: () => router.replace("/"),
    },
    {
      label: "Transactions",
      key: "transactions",
      icon: <TableOutlined />,
      disabled,
      onClick: () => router.replace("/transactions"),
    },
  ];

  return (
    <Menu mode="horizontal" items={items} style={{ flex: 1, minWidth: 0 }} />
  );
};

export default SimpleNavMenu;
