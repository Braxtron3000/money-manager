"use client";

import { Menu, MenuProps, theme } from "antd";
import { AreaChartOutlined, TableOutlined } from "@ant-design/icons";
import { usePathname, useRouter } from "next/navigation";

const SimpleNavMenu = ({ disabled }: { disabled: boolean }) => {
  const router = useRouter();
  const pathname = usePathname();

  type MenuItem = Required<MenuProps>["items"][number];
  const items: MenuItem[] = [
    {
      label: "Dashboard",
      key: "/",
      icon: <AreaChartOutlined />,
      disabled,
      onClick: function () {
        router.replace("/");
      },
    },
    {
      label: "Transactions",
      key: "/transactions",
      icon: <TableOutlined />,
      disabled,
      onClick: function () {
        router.replace("/transactions");
      },
    },
  ];

  return (
    <Menu
      mode="horizontal"
      selectedKeys={[pathname]}
      theme="dark"
      items={items}
      style={{ flex: 1, minWidth: 0, backgroundColor: "transparent" }}
    />
  );
};

export default SimpleNavMenu;
