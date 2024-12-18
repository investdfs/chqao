import { JsonQuestionInput } from "../JsonQuestionInput";
import { JsonImageQuestionInput } from "../JsonImageQuestionInput";
import { InsertPreviousExamQuestionsButton } from "../InsertPreviousExamQuestionsButton";

export const JsonInputs = () => {
  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <JsonQuestionInput />
        </div>
        <div className="flex-1">
          <JsonImageQuestionInput />
        </div>
        <div className="flex items-end">
          <InsertPreviousExamQuestionsButton />
        </div>
      </div>
    </div>
  );
};