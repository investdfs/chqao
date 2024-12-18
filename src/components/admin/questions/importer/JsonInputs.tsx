import { JsonQuestionInput } from "../JsonQuestionInput";
import { JsonImageQuestionInput } from "../JsonImageQuestionInput";
import { InsertPreviousExamQuestionsButton } from "../InsertPreviousExamQuestionsButton";

export const JsonInputs = () => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <JsonQuestionInput />
        <JsonImageQuestionInput />
      </div>
      <div className="flex gap-4">
        <InsertPreviousExamQuestionsButton />
      </div>
    </div>
  );
};