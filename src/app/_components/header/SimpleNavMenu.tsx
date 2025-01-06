"use client";

import { Menu, MenuProps, theme } from "antd";
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
    <Menu
      mode="horizontal"
      // theme={theme.darkAlgorithm}
      // color={}
      theme="dark"
      items={items}
      style={{ flex: 1, minWidth: 0, backgroundColor: "transparent" }}
    />
  );
};

export default SimpleNavMenu;
