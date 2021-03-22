export interface DbQuestion {
  id: string;
  label: string;

  createdAt: Date;
  updatedAt: Date;
}

export interface DbPredefinedAnswer {
  id: number;
  label: string;
  questionId: string;

  createdAt: Date;
  updatedAt: Date;
}

export interface DbVote {
  id: number;
  predefinedAnswerId: number;

  createdAt: Date;
  updatedAt: Date;
}
