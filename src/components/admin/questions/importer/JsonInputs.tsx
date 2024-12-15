import { JsonQuestionInput } from "../JsonQuestionInput";
import { JsonImageQuestionInput } from "../JsonImageQuestionInput";

export const JsonInputs = () => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <JsonQuestionInput />
      <JsonImageQuestionInput />
    </div>
  );
};