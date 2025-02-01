import { getServerAuthSession } from "~/server/auth";
import FullHeader from "./_components/header/Fullheader";
import { Card, DatePicker, Layout, Space } from "antd";
import { Content } from "antd/es/layout/layout";
import CategorySummaryTable from "./_components/CategorySummaryTable";
import * as BudgetActions from "./actions/budgetActions";
import * as TransactionActions from "./actions/transactionActions";

export default async function Home() {
  const session = await getServerAuthSession();

  //the gradients pretty cool im keeping this here for the time being
  {
    /* <main className="flex min-h-screen flex-grow flex-col items-center justify-center bg-gradient-to-b from-[#4FB0C6] to-[#4F86C6] text-white">
          
          </main> */
  }
  const today = new Date();

  const categorieSummaries = await TransactionActions.getMonthCategorySummary({
    month: today.getMonth() + 1,
    year: today.getFullYear(),
  });

  const somethingElse = await BudgetActions.getLatest({
    month: today.getMonth() + 1,
    year: today.getFullYear(),
  });

  console.log("something else ", somethingElse);

  return (
    <body>
      <main className="flex min-h-screen flex-grow flex-col">
        <Layout>
          <FullHeader />
          {session ? (
            <Content>
              <Space
                direction="vertical"
                size="middle"
                style={{ display: "flex" }}
              >
                <Card title="Category Summaries">
                  <CategorySummaryTable
                    dataProp={categorieSummaries}
                    budgetProp={somethingElse}
                  />
                </Card>
              </Space>
            </Content>
          ) : (
            <h1>
              What is this website? Ill tell you later. For right now, click the
              sign in button in the top right
            </h1>
          )}
        </Layout>
      </main>
    </body>
  );
}

// async function CrudShowcase() {
//   const session = await getServerAuthSession();
//   if (!session?.user) return null;

//   const latestPost = await api.post.getLatest();

//   return (
//     <div className="w-full max-w-xs">
//       {latestPost ? (
//         <p className="truncate">Your most recent post: {latestPost.name}</p>
//       ) : (
//         <p>You have no posts yet.</p>
//       )}

//       <CreatePost />
//     </div>
//   );
// }
