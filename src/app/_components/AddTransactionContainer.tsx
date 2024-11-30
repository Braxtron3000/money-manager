"use server";
import { api } from "~/trpc/server";
import { getServerAuthSession } from "~/server/auth";
import InputNewTransaction from "./AddTransactionComponent";
import { randomUUID } from "crypto";
import { isCategory, transaction } from "~/types";
import dayjs from "dayjs";

export default async function AddTransactionContainer(
  transactions: transaction[],
) {
  const session = await getServerAuthSession();

  const allstuff = await api.transactions.getTransactions({
    userId: session?.user.id ?? "",
  });

  const yash = api.transactions.createTransactions;

  const dostuff = () => {
    console.log("im doing it");
    yash(
      transactions.map((transaction) => ({
        ...transaction,
        createdById: session?.user.id ?? "",
        date: new Date(transaction.date.valueOf()),
      })),
    );

    console.log("i did it");
  };

  const som = dostuff();

  return som;
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
