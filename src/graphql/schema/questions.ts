import { objectType, extendType, list, nonNull, arg, idArg } from "nexus";
import { DateTimeScalar } from "./scalars";
import { PredefinedAnswer } from "./predefined_answers";
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
        predefinedAnswers: arg({
          type: list("String"),
          description: "Predefined answers to associate with answers",
        }),
      },
      resolve: (_parent, { label, predefinedAnswers }, { prisma }) => {
        let newQuestion: any = { label };
        if (predefinedAnswers) {
          newQuestion.predefinedAnswers = {
            create: predefinedAnswers.map((a) => ({ label: a })),
          };
        }

        return prisma.question.create({
          data: newQuestion,
        });
      },
    });
  },
});

export { Question, QuestionsQuery, QuestionsMutation };
