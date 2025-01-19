"use server";
import { Budget } from "@prisma/client";
import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";

export async function createBudget(
  budget: Parameters<typeof api.budgets.createBudget>[0],
) {
  const session = await getServerAuthSession();

  if (session) {
    try {
      console.log("create log");
      api.budgets.createBudget(budget);
    } catch (error) {
      console.error("error creating budget ", error);
    }
  } else console.warn("You must be signed in to perform this action");
}

export async function getLatest(
  budget: Parameters<typeof api.budgets.getLatest>[0],
) {
  const session = await getServerAuthSession();

  if (session) {
    try {
      console.log("create log");
      return api.budgets.getLatest(budget);
    } catch (error) {
      console.error("error creating budget ", error);
    }
  } else console.warn("You must be signed in to perform this action");
}
