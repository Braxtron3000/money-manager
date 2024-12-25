import Link from "next/link";

import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";
import SideBarHeaderLayout from "./_components/SidebarHeaderLayout";
import { CreatePost } from "./_components/Create-post";
import FullHeader from "./_components/header/Fullheader";
import { Card, Layout, Space } from "antd";
import { Content } from "antd/es/layout/layout";
import CategorySummaryTable from "./_components/CategorySummaryTable";

export default async function Home() {
  const hello = await api.post.hello({ text: "from tRPC" });
  const session = await getServerAuthSession();

  //the gradients pretty cool im keeping this here for the time being
  {
    /* <main className="flex min-h-screen flex-grow flex-col items-center justify-center bg-gradient-to-b from-[#4FB0C6] to-[#4F86C6] text-white">
          
          </main> */
  }

  return (
    <body>
      <main className="flex min-h-screen flex-grow flex-col">
        <Layout>
          <FullHeader />
          <Content>
            <Space
              direction="vertical"
              size="middle"
              style={{ display: "flex" }}
            >
              <Card title="Category Summaries">
                <CategorySummaryTable />
              </Card>
            </Space>
          </Content>
        </Layout>
      </main>
    </body>
  );
}

async function CrudShowcase() {
  const session = await getServerAuthSession();
  if (!session?.user) return null;

  const latestPost = await api.post.getLatest();

  return (
    <div className="w-full max-w-xs">
      {latestPost ? (
        <p className="truncate">Your most recent post: {latestPost.name}</p>
      ) : (
        <p>You have no posts yet.</p>
      )}

      <CreatePost />
    </div>
  );
}
