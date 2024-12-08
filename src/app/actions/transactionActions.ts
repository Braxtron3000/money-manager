"use server";
import { api } from "~/trpc/server";
import { getServerAuthSession } from "~/server/auth";
import { isCategory, transaction } from "~/types";
import dayjs from "dayjs";

export async function AddTransactionContainer(transactions: transaction[]) {
  "use server";
  try {
    console.log("adding transactions to db");
    const session = await getServerAuthSession(); //!Todo: whats going on here.

    api.transactions.createTransactions(
      transactions.map((transaction) => ({
        ...transaction,
        createdById: session?.user.id ?? "",
        date: new Date(transaction.date.valueOf()),
      })),
    );
  } catch (error) {
    console.error("problem adding Transactions to db ", error);
  }
}

export async function getTransactions(): Promise<transaction[]> {
  const session = await getServerAuthSession();
  const fetchedTransactions = api.transactions.getTransactions({
    userId: session?.user.id ?? "",
  });

  const transactions: transaction[] = (await fetchedTransactions).map(
    (item) => ({
      ...item,
      date: dayjs(item.date),
      category: isCategory(item.category) ? item.category : "Uncategorized",
    }),
  );

  return transactions;
}

export async function deleteTransactions(transactionIds: string[]) {
  "use server";

  try {
    api.transactions.deleteTransactions(transactionIds);
    console.log("deleting transactions ", transactionIds);
  } catch (error) {
    console.error("error deleting transactions: ", error);
  }
}
