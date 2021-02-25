-- CreateTable
CREATE TABLE "votes" (
    "id" SERIAL NOT NULL,
    "predefined_answer_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "votes" ADD FOREIGN KEY ("predefined_answer_id") REFERENCES "predefined_answers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
