import { deleteTransactions } from "~/app/actions/transactionActions";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { z } from "zod";
import { transaction } from "~/types";

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
});
