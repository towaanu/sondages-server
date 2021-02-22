import { objectType, extendType, list, nonNull, arg, idArg } from "nexus";
import { DateTimeScalar } from "./scalars";

const Question = objectType({
  name: "Question",
  description: "Question related to a poll",
  definition(t) {
    t.nonNull.id("id");
    t.nonNull.string("label");
    t.field("createdAt", { type: nonNull(DateTimeScalar) });
    t.field("updatedAt", { type: nonNull(DateTimeScalar) });

    t.field("predefinedAnswers", {
      type: nonNull(list(PredefinedAnswer)),
      resolve: ({ id: questionId }, _args, { prisma }) =>
        prisma.predefinedAnswer
          .findMany({ where: { questionId } })
          .then((answers) =>
            answers.map((a) => ({ ...a, id: a.id.toString() }))
          ),
    });
  },
});

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
      resolve: ({ id: predefinedAnswerId }, _args, { prisma }) =>
        prisma.predefinedAnswer
          .findUnique({
            where: { id: parseInt(predefinedAnswerId) },
            select: { question: true },
          })
          .then((res) => {
            if (res?.question) {
              return res.question;
            } else {
              throw new Error("Question not found for answer");
            }
          }),
    });
  },
});

const QuestionsQuery = extendType({
  type: "Query",
  definition: (t) => {
    t.field("questions", {
      type: nonNull(list(Question)),
      description: "List all questions",
      resolve: (_parent, _args, { prisma }) => prisma.question.findMany(),
    });
    t.field("question", {
      type: Question,
      description: "Question by id",
      args: {
        id: nonNull(idArg()),
      },
      resolve: (_parent, { id }, { prisma }) =>
        prisma.question.findUnique({
          where: { id },
        }),
    });
  },
});

const QuestionsMutation = extendType({
  type: "Mutation",
  definition: (t) => {
    t.field("createQuestion", {
      type: nonNull(Question),
      description: "Create a new question",
      args: {
        label: arg({
          type: nonNull("String"),
          description: "Question's label",
        }),
      },
      resolve: (_parent, { label }, { prisma }) => {
        return prisma.question.create({
          data: { label },
        });
      },
    });

    t.field("createPredefinedAnswer", {
      type: nonNull(PredefinedAnswer),
      description: "Create a new predefined answer for a question",
      args: {
        questionId: arg({ type: nonNull("ID"), description: "Question id" }),
        label: arg({ type: nonNull("String"), description: "Answer label" }),
      },
      resolve: (_parent, { label, questionId }, { prisma }) =>
        prisma.predefinedAnswer
          .create({
            data: { questionId, label },
          })
          .then((pa) => ({ ...pa, id: pa.id.toString() })),
    });
  },
});

export { Question, PredefinedAnswer, QuestionsQuery, QuestionsMutation };
