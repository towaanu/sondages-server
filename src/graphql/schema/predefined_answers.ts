import { objectType, nonNull, extendType, arg, list } from "nexus";
import { DateTimeScalar } from "./scalars";
import { Question } from "./questions";
import { Vote } from "./votes";

const PredefinedAnswer = objectType({
  name: "PredefinedAnswer",
  description: "Predefined answer links to a question",
  definition(t) {
    t.nonNull.id("id");
    t.nonNull.string("label");
    t.field("createdAt", { type: nonNull(DateTimeScalar) });
    t.field("updatedAt", { type: nonNull(DateTimeScalar) });
    t.field("question", {
      type: nonNull(Question),
      resolve: ({ id: predefinedAnswerId }, _args, { knex }) =>
        knex("predefinedAnswers")
          .select(
            "questions.id",
            "questions.label",
            "questions.createdAt",
            "questions.updatedAt"
          )
          .join("questions", "questions.id", "predefinedAnswers.questionId")
          .where("predefinedAnswers.id", predefinedAnswerId)
          .first(),
    });

    t.field("votes", {
      type: list(Vote),
      resolve: ({ id: predefinedAnswerId }, _args, { knex }) =>
        knex("votes")
          .where("predefinedAnswerId", predefinedAnswerId)
          .then((votes) =>
            votes.map((v) => ({
              ...v,
              id: v.id.toString(),
            }))
          ),
    });

    t.field("votesCount", {
      type: nonNull("Int"),
      resolve: ({ id: predefinedAnswerId }, _args, { knex }) =>
        knex("votes")
          .count("id", { as: "votesCount" })
          .where("predefinedAnswerId", predefinedAnswerId)
          .first()
          .then((res) => (res ? res["votesCount"] : 0)),
    });
  },
});

const PredefinedAnswersMutation = extendType({
  type: "Mutation",
  definition: (t) => {
    t.field("createPredefinedAnswer", {
      type: nonNull(PredefinedAnswer),
      description: "Create a new predefined answer for a question",
      args: {
        questionId: arg({ type: nonNull("ID"), description: "Question id" }),
        label: arg({ type: nonNull("String"), description: "Answer label" }),
      },
      resolve: (_parent, { label, questionId }, { knex }) =>
        knex("predefinedAnswers")
          .insert({ label, questionId })
          .returning("id")
          .then((id) => knex("predefinedAnswers").where("id", id).first())
          .then((pa) => {
            if (!pa) {
              throw new Error("Unable to fetch new created answer");
            }
            return pa;
          })
          .then((pa) => ({
            ...pa,
            id: pa.id.toString(),
          })),
    });
  },
});

export { PredefinedAnswer, PredefinedAnswersMutation };
