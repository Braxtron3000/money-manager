"use client";
import React, { useState } from "react";
import {
  AreaChartOutlined,
  TableOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
} from "@ant-design/icons";
import { Button, Layout, Menu, MenuProps, theme } from "antd";
import { useRouter } from "next/navigation";

const { Header, Sider, Content } = Layout;

function SideBarHeaderLayout({
  children,
  title,
}: {
  children: React.ReactNode;
  title?: string;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const router = useRouter();

  const onMenuClick: MenuProps["onClick"] = (e) => {
    console.log("click ", e);
  };

  return (
    <body className="flex min-h-screen flex-row">
      <Layout>
        <Sider trigger={null} collapsible collapsed={collapsed} theme="light">
          <div className="demo-logo-vertical" />
          <Menu
            mode="inline"
            theme="light"
            defaultSelectedKeys={["1"]}
            items={[
              {
                key: "1",
                icon: <AreaChartOutlined />,
                label: "Dashboard",
                onClick: () => router.replace("/"),
              },
              {
                key: "2",
                icon: <TableOutlined />,
                label: "Transactions",
                onClick: () => router.replace("/transactions"),
              },
            ]}
          />
        </Sider>
        <Layout>
          <Header
            style={{
              padding: 0,
              background: colorBgContainer,
            }}
          >
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: "16px",
                width: 64,
                height: 64,
              }}
            />
            {title}
          </Header>
          <Content
            style={{
              margin: "24px 16px",
              padding: 24,
              minHeight: 280,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            {children}
          </Content>
        </Layout>
      </Layout>
    </body>
  );
}

export default SideBarHeaderLayout;
