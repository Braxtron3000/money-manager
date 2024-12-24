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

const screenNames = ["Dashboard", "Transactions"] as const;

function SideBarHeaderLayout({
  children,
  title,
  showHeader = false,
}: {
  children: React.ReactNode;
  title?: (typeof screenNames)[number];
  showHeader?: boolean;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const router = useRouter();

  const navigationArrs = [
    {
      key: "0",
      icon: <AreaChartOutlined />,
      label: "Dashboard",
      onClick: () => router.replace("/"),
    },
    {
      key: "1",
      icon: <TableOutlined />,
      label: "Transactions",
      onClick: () => router.replace("/transactions"),
    },
  ];

  return (
    <body className="flex min-h-screen flex-row">
      <Layout>
        {!showHeader && (
          <Sider trigger={null} collapsible collapsed={collapsed} theme="light">
            <div className="demo-logo-vertical" />
            <Menu
              mode="inline"
              theme="light"
              defaultSelectedKeys={
                title ? [screenNames.indexOf(title) + ""] : undefined
              }
              items={navigationArrs}
            />
          </Sider>
        )}
        <Layout>
          {showHeader && (
            <Header
              style={{
                padding: 0,
                background: colorBgContainer,
              }}
            >
              {/* <Button
                type="text"
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => setCollapsed(!collapsed)}
                style={{
                  fontSize: "16px",
                  width: 64,
                  height: 64,
                }}
              /> */}

              {navigationArrs.map((props, index) => (
                <Button
                  {...props}
                  key={index}
                  type={props.label == title ? "primary" : "text"}
                >
                  {props.label}
                </Button>
              ))}

              {/* {title} */}
            </Header>
          )}
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
