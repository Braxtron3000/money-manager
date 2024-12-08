import SideBarHeaderLayout from "../_components/SidebarHeaderLayout";
import { GetProps, Input } from "antd";
import EditableTable from "../_components/editableTable";
import Calendar from "../_components/Calendar";
import { getTransactions } from "../actions/transactionActions";
import SearchInputs from "./components/TransactionsHeaderInputs";

export default async function Page() {
  const tableFormat = "list";

  const transactions = await getTransactions();

  return (
    <SideBarHeaderLayout title="Transactions">
      <SearchInputs />
      {tableFormat === "list" ? (
        <EditableTable transactionsList={transactions} />
      ) : (
        <Calendar />
      )}
    </SideBarHeaderLayout>
  );
}
