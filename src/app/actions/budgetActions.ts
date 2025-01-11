"use server";
import { Budget } from "@prisma/client";
import { api } from "~/trpc/server";

export async function createBudget(
  budget: Parameters<typeof api.budgets.createBudget>[0],
) {
  try {
    console.log("create log");
    api.budgets.createBudget(budget);
  } catch (error) {
    console.error("error creating budget ", error);
  }
}
