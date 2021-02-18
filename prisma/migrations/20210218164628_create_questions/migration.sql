-- CreateTable
CREATE TABLE "questions" (
    "id" UUID NOT NULL,
    "label" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "predefined_answers" (
    "id" SERIAL NOT NULL,
    "label" TEXT NOT NULL,
    "question_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "predefined_answers.question_id_label_unique" ON "predefined_answers"("question_id", "label");

-- AddForeignKey
ALTER TABLE "predefined_answers" ADD FOREIGN KEY ("question_id") REFERENCES "questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
