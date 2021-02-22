import { objectType, nonNull, extendType, arg } from "nexus";
import { DateTimeScalar } from "./scalars";
import { Question } from "./questions";

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
      resolve: (_parent, { label, questionId }, { prisma }) =>
        prisma.predefinedAnswer
          .create({
            data: { questionId, label },
          })
          .then((pa) => ({ ...pa, id: pa.id.toString() })),
    });
  },
});

export { PredefinedAnswer, PredefinedAnswersMutation };
