import { getServerAuthSession } from "~/server/auth";
import SideBarHeaderLayout from "../_components/SidebarHeaderLayout";
import { api } from "~/trpc/server";
import AddTransactionContainer from "../actions/transactionActions";
import InputNewTransaction from "../_components/AddTransactionComponent";

export default async function TestingAPI() {
  const session = await getServerAuthSession();
  const hello = api.post.hello({ text: "from tRPC" });

  const transactions = await api.transactions.getTransactions({
    userId: session?.user.id ?? "",
  });

  return (
    <SideBarHeaderLayout title="Dashboard">
      <h1>hello ther </h1>

      {transactions.map((tr) => (
        <h1>{tr.description}</h1>
      ))}

      <InputNewTransaction />
    </SideBarHeaderLayout>
  );
}
