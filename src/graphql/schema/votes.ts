import { objectType, extendType, nonNull, arg, subscriptionField } from "nexus";
import { DateTimeScalar } from "./scalars";
import { PredefinedAnswer } from "./predefined_answers";
import { withFilter } from "graphql-subscriptions";
import pubsub, { Topic } from "../pubsub";
import { Prisma } from "@prisma/client";

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
            include: { predefinedAnswer: true },
          })
          .then((newVote) => {
            pubsub.publish(Topic.NEW_VOTE, newVote);
            return {
              ...newVote,
              id: newVote.id.toString(),
            };
          });
      },
    });
  },
});

type NewVotePayload = Prisma.VoteGetPayload<{
  select: { predefinedAnswer: true };
}>;
const VotesSubscription = subscriptionField("newVote", {
  type: nonNull("ID"),
  args: {
    questionId: arg({
      type: nonNull("ID"),
      description: "Question to watch",
    }),
  },
  subscribe: withFilter(
    () => pubsub.asyncIterator(Topic.NEW_VOTE),
    (payload: NewVotePayload, variables: { questionId: string }) => {
      return payload.predefinedAnswer.questionId === variables.questionId;
    }
  ),
  resolve(newVote: any) {
    return newVote.predefinedAnswerId;
  },
});

export { Vote, VotesMutation, VotesSubscription };
