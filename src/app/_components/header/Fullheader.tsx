import { Header } from "antd/es/layout/layout";
import SimpleNavMenu from "./SimpleNavMenu";
import Link from "next/link";
import { getServerAuthSession } from "~/server/auth";
import { LogoutOutlined } from "@ant-design/icons";

const FullHeader = async () => {
  const session = await getServerAuthSession();

  return <SimpleNavMenu session={!!session} />;
};

export default FullHeader;
