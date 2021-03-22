import { Knex } from 'knex';
import {DbQuestion, DbPredefinedAnswer, DbVote} from "./types";

declare module 'knex/types/result' {
    interface Registry {
        Count: number;
    }
}

declare module 'knex/types/tables' {
  interface Tables {
    questions: DbQuestion;

    questions_composite: Knex.CompositeTableType<
      DbQuestion,
      Pick<DbQuestion, 'label'> & Partial<Pick<DbQuestion, 'createdAt' | 'updatedAt'>>,
      Partial<Omit<DbQuestion, 'id'>>
    >;


    predefinedAnswers: DbPredefinedAnswer;

    predefinedAnswers_composite: Knex.CompositeTableType<
      DbPredefinedAnswer,
      Pick<DbPredefinedAnswer, 'label'> & Partial<Pick<DbQuestion, 'createdAt' | 'updatedAt'>>,
      Partial<Omit<DbPredefinedAnswer, 'id'>>
    >;

    votes: DbVote;

    votes_composite: Knex.CompositeTableType<
      DbVote,
      Pick<DbVote, 'predefinedAnswerId'> & Partial<Pick<DbQuestion, 'createdAt' | 'updatedAt'>>,
      Partial<Omit<DbVote, 'id'>>
    >;

  }
}
