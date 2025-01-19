import dayjs from "dayjs";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const budgetsRouter = createTRPCRouter({
  // createBudget: publicProcedure
  //   .input(z.object({ text: z.string() }))
  //   .query(({ input }) => {
  //     return {
  //       greeting: `Hello ${input.text}`,
  //     };
  //   }),

  createBudget: protectedProcedure
    .input(
      z.object({
        current: z.boolean(),
        startDate: z.date(),
        categories: z
          .object({
            category: z.string(),
            amount: z.number(),
          })
          .array(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // simulate a slow db call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      console.log("input startdate ", input.startDate);
      input.startDate.setUTCHours(0, 0, 0, 0);
      console.log("input startdate ", input.startDate);
      // ctx.db.budget
      //   .deleteMany({
      //     where: {
      //       startDate: {
      //         gte: new Date(dayjs(input.startDate).startOf("day").valueOf()),
      //         lt: new Date(dayjs(input.startDate).endOf("day").valueOf()),
      //       },
      //     },
      //   })
      //   .then((ra) => console.log("rarara: ", ra));

      return ctx.db.budget.upsert({
        where: {
          startDate: input.startDate,
        },
        create: {
          current: input.current,
          startDate: input.startDate,
          createdBy: { connect: { id: ctx.session.user.id } },
          categories: { create: input.categories },
        },
        update: {},
        include: {
          categories: true,
        },
      });

      // return ctx.db.budget.create({
      //   data: {
      //     current: input.current,
      //     startDate: input.startDate,
      //     createdBy: { connect: { id: ctx.session.user.id } },
      //     categories: { create: input.categories },
      //   },
      //   include: {
      //     categories: true,
      //   },
      // });
    }),

  getLatest: protectedProcedure
    .input(z.object({ month: z.number(), year: z.number() }).nullable())
    .query(({ ctx, input }) => {
      const lessthanDateString = input
        ? `${input.year}-${input.month >= 10 ? input.month : "0" + input.month}-01T00:00:00Z`
        : undefined;

      console.log("getting latest ", {
        month: input?.month,
        year: input?.year,
        lessthanDateString,
      });

      return ctx.db.budget.findFirst({
        where: {
          startDate: {
            lt: lessthanDateString ? new Date(lessthanDateString) : new Date(),
          },
        },
        orderBy: {
          startDate: "desc",
        },
        include: {
          categories: true,
        },
      });
    }),
  // getLatest: protectedProcedure.query(({ ctx }) => {
  //   return ctx.db.post.findFirst({
  //     orderBy: { createdAt: "desc" },
  //     where: { createdBy: { id: ctx.session.user.id } },
  //   });
  // }),

  // getSecretMessage: protectedProcedure.query(() => {
  //   return "you can now see this secret message!";
  // }),
});
