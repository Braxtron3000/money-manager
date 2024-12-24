import { Header } from "antd/es/layout/layout";
import SimpleNavMenu from "./SimpleNavMenu";
import Link from "next/link";
import { getServerAuthSession } from "~/server/auth";
import { LogoutOutlined } from "@ant-design/icons";

const FullHeader = async () => {
  const session = await getServerAuthSession();

  return (
    <Header style={{ display: "flex", alignItems: "stretch" }}>
      <SimpleNavMenu disabled={!session} />
      <div>
        <Link
          href={session ? "/api/auth/signout" : "/api/auth/signin"}
          className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20"
        >
          {session ? (
            <LogoutOutlined label={session.user?.name ?? undefined} />
          ) : (
            "Sign in"
          )}
        </Link>
      </div>
    </Header>
  );
};

export default FullHeader;
