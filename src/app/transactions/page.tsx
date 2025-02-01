import { Layout } from "antd";
import EditableTable from "../_components/editableTable";
import Calendar from "../_components/Calendar";
import { getTransactions } from "../actions/transactionActions";
import SearchInputs from "./components/TransactionsHeaderInputs";
import FullHeader from "../_components/header/Fullheader";

export default async function Page() {
  const tableFormat = "list";

  const transactions = await getTransactions();

  // <SideBarHeaderLayout title="Transactions" showHeader>
  return (
    <body>
      <main className="flex min-h-screen flex-grow flex-col">
        <Layout>
          <FullHeader />

          <SearchInputs />
          {tableFormat === "list" ? (
            <EditableTable transactionsList={transactions} />
          ) : (
            <Calendar />
          )}
        </Layout>
      </main>
    </body>
  );
  // </SideBarHeaderLayout>
}
