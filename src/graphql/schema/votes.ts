import { objectType, extendType, nonNull, arg, subscriptionField } from "nexus";
import { DateTimeScalar } from "./scalars";
import { PredefinedAnswer } from "./predefined_answers";
import { withFilter } from "graphql-subscriptions";
import pubsub, { Topic } from "../pubsub";

const Vote = objectType({
  name: "Vote",
  description: "Vote linked to an answer",
  definition(t) {
    t.nonNull.id("id");
    t.field("createdAt", { type: nonNull(DateTimeScalar) });
    t.field("updatedAt", { type: nonNull(DateTimeScalar) });

    t.field("predefinedAnswer", {
      type: nonNull(PredefinedAnswer),
      resolve: ({ id: voteId }, _args, { knex }) => {
        return knex("predefinedAnswers")
          .select()
          .join("votes", "votes.predefinedAnswerId", "predefinedAnswers.id")
          .where("votes.id", voteId)
          .first()
          .then((pa) => {
            if (!pa) {
              throw new Error("No new predefined answer");
            }
            return {
              ...pa,
              id: pa.id.toString(),
            };
          });
      },
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
      resolve: (_parent, { predefinedAnswerId }, { knex }) => {
        return knex("votes")
          .insert({ predefinedAnswerId: parseInt(predefinedAnswerId) })
          .returning("id")
          .then(([id]) =>
            knex("votes")
              .select(
                "votes.id",
                "votes.predefinedAnswerId",
                "votes.createdAt",
                "votes.updatedAt",
                "predefinedAnswers.questionId"
              )
              .where("votes.id", id)
              .join(
                "predefinedAnswers",
                "predefinedAnswers.id",
                "votes.predefinedAnswerId"
              )
              .first()
          )
          .then((newVote) => {
            pubsub.publish(Topic.NEW_VOTE, newVote);
            return newVote;
          });
      },
    });
  },
});

type NewVotePayload = { predfinedAnswerId: number; questionId: string };

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
      return payload.questionId === variables.questionId;
    }
  ),
  resolve(newVote: any) {
    return newVote.predefinedAnswerId;
  },
});

export { Vote, VotesMutation, VotesSubscription };
