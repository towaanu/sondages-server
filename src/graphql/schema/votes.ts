import { objectType, extendType, nonNull, arg } from "nexus";
import { DateTimeScalar } from "./scalars";
import { PredefinedAnswer } from "./predefined_answers";

const Vote = objectType({
  name: "Vote",
  description: "Vote linked to an answer",
  definition(t) {
    t.nonNull.id("id");
    t.field("createdAt", { type: nonNull(DateTimeScalar) });
    t.field("updatedAt", { type: nonNull(DateTimeScalar) });

    t.field("predefinedAnswer", {
      type: nonNull(PredefinedAnswer),
      resolve: ({ id: voteId }, _args, { prisma }) =>
        prisma.vote
          .findUnique({
            where: { id: parseInt(voteId) },
            select: { predefinedAnswer: true },
          })
          .then((res) => {
            if (res?.predefinedAnswer) {
              return {
                ...res.predefinedAnswer,
                id: res.predefinedAnswer.id.toString(),
              };
            } else {
              throw new Error("Predefined answer not found for vote");
            }
          }),
    });
  },
});

const VotesMutation = extendType({
  type: "Mutation",
  definition: (t) => {
    t.field("voteForAnswer", {
      type: nonNull(Vote),
      description: "Vote for an answer",
      args: {
        predefinedAnswerId: arg({
          type: nonNull("ID"),
          description: "Answer's id",
        }),
      },
      resolve: (_parent, { predefinedAnswerId }, { prisma }) => {
        return prisma.vote
          .create({
            data: { predefinedAnswerId: parseInt(predefinedAnswerId) },
          })
          .then((newVote) => ({
            ...newVote,
            id: newVote.id.toString(),
          }));
      },
    });
  },
});

export { Vote, VotesMutation };