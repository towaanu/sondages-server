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
      resolve: ({ id: questionId }, _args, {knex}) => knex("predefinedAnswers")
	    .where("questionId", questionId)
	    .then(answers => answers.map(a => ({
		...a,
		id: a.id.toString()
	    })))
    });
  },
});

const QuestionsQuery = extendType({
  type: "Query",
  definition: (t) => {
    t.field("questions", {
      type: nonNull(list(Question)),
      description: "List all questions",
      resolve: (_parent, _args, {knex}) => knex("questions").select()
    });
    t.field("question", {
      type: Question,
      description: "Question by id",
      args: {
        id: nonNull(idArg()),
      },
      resolve: (_parent, { id }, { knex }) => knex("questions").where("id", id).first().then(q => q ?? null)

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
      resolve: (_parent, { label, predefinedAnswers }, { knex }) => {
        let newQuestion: any = { label };

	let answers = predefinedAnswers ?? [];

	return knex.transaction(trx => trx() 
	        .insert(newQuestion, "id")
		.into("questions")
		.then((newQuestionIds: Array<string>) => {
		    const questionId = newQuestionIds[0];
		    const newAnswers = answers.map(label => ({
			label,
			questionId,
		    }))
		    return trx("predefined_answers")
			.insert(newAnswers)
			.then(() => questionId)
		})
	)
	.then(questionId => knex("questions").where("id", questionId).first())
	.then(question => {
	    if(!question) { throw new Error("Unable to fetch new questions") }
	    return question
	})
      },
    });
  },
});

export { Question, QuestionsQuery, QuestionsMutation };
