import { createTRPCRouter, protectedProcedure } from "../trpc";
import { z } from "zod";

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
    .input(z.object({ userId: z.string() }))
    .query(({ ctx, input }) =>
      ctx.db.transaction.findMany({
        where: {
          createdById: input.userId,
        },
      }),
    ),
});
