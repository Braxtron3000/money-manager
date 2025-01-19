import { deleteTransactions } from "~/app/actions/transactionActions";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { z } from "zod";
import { transaction } from "~/types";
import dayjs from "dayjs";

const returnIdlessTransactionBody = (transaction: transaction) => {
  const { id, ...rest } = transaction;
  return rest;
};

export const transactionsRouter = createTRPCRouter({
  createTransactions: protectedProcedure
    .input(
      z
        .object({
          id: z.string(),
          description: z.string(),
          category: z.string(),
          pricing: z.number(),
          date: z.date(),
          createdById: z.string(),
        })
        .array(),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.transaction.createMany({
        data: input,
      });
    }),

  getTransactions: protectedProcedure
    .input(z.object({ userId: z.string() }).nullish())
    .query(({ ctx, input }) =>
      ctx.db.transaction.findMany({
        where: {
          createdById: input?.userId,
        },
      }),
    ),
  deleteTransactions: protectedProcedure
    .input(
      z // .object({
        //   id: z.string(),
        // description: z.string(),
        // category: z.string(),
        // pricing: z.number(),
        // date: z.date(),
        // createdById: z.string(),
        // })
        .string()
        .array(),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.transaction.deleteMany({
        where: {
          // id: { in: input.map(({ id }) => id) },
          id: { in: input },
        },
      });
    }),
  editTransaction: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        description: z.string(),
        category: z.string(),
        pricing: z.number(),
        date: z.date(),
        createdById: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, createdById, ...rest } = input;

      return ctx.db.transaction.update({
        where: {
          id: input.id,
        },
        data: rest,
      });
    }),
  getMonthCategorySummary: protectedProcedure
    .input(
      z.object({
        month: z.number(),
        year: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      let nextMonthDisplay: string;
      let thisMonthDisplay: string;

      if (input.month == 12) {
        nextMonthDisplay = "01";
      } else {
        const nextmonthnumber = input.month + 1;
        nextMonthDisplay =
          nextmonthnumber >= 10
            ? nextmonthnumber.toString()
            : "0" + nextmonthnumber;
      }

      thisMonthDisplay =
        input.month >= 10 ? input.month.toString() : "0" + input.month;

      const greaterThanDateString = `${input.year}-${thisMonthDisplay}-01T00:00:00Z`;
      const lessThanDateString = `${nextMonthDisplay == "01" ? input.year + 1 : input.year}-${nextMonthDisplay}-01T00:00:00Z`;

      console.log("get month category summery ", {
        inputMonth: input.month,
        inputYear: input.year,
        nextMonthDisplay,
        greaterThanDateString,
        lessThanDateString,
      });

      /*${ nextMonthDisplay == "01" ? input.year + 1 :  input.year} */
      return ctx.db.transaction.groupBy({
        where: {
          date: {
            gte: new Date(greaterThanDateString),
            lt: new Date(lessThanDateString),
          },
        },
        by: ["category"],
        _sum: {
          pricing: true,
        },
      });
    }),
});
