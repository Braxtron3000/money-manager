import "~/styles/globals.css";

//never used

import { GeistSans } from "geist/font/sans";

import { TRPCReactProvider } from "~/trpc/react";

import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ConfigProvider, theme } from "antd";

export const metadata = {
  title: "MoneyManager",
  description: "Show stats and see history better than pnc",
  icons: [{ rel: "icon", url: "/money.svg" }],
};

function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <TRPCReactProvider>
        <AntdRegistry>{children}</AntdRegistry>
      </TRPCReactProvider>
    </html>
  );
}

export default RootLayout;
