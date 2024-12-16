import { Check, X, Users } from "lucide-react";
import { RadioGroupItem } from "@/components/ui/radio-group";

interface OptionItemProps {
  id: string;
  text: string;
  isSelected: boolean;
  isCorrect: boolean;
  hasAnswered: boolean;
  answerCount?: number;
}

export const OptionItem = ({
  id,
  text,
  isSelected,
  isCorrect,
  hasAnswered,
  answerCount,
}: OptionItemProps) => {
  return (
    <label
      htmlFor={id}
      className={`block cursor-pointer transition-all ${hasAnswered ? 'cursor-default' : ''}`}
    >
      <div
        className={`flex items-center space-x-2 p-4 rounded-lg border transition-colors ${
          !hasAnswered
            ? isSelected 
              ? "border-primary bg-primary/10 hover:bg-primary/20" 
              : "hover:border-primary hover:bg-primary-light dark:hover:bg-blue-900/30 dark:hover:border-blue-600 border-gray-200 dark:border-gray-700"
            : isCorrect
            ? "border-success bg-success-light dark:bg-blue-900/30 dark:border-blue-600"
            : isSelected
            ? "border-error bg-error-light dark:bg-red-900/30 dark:border-red-600"
            : "border-gray-200 dark:border-gray-700"
        }`}
      >
        <div className="relative flex items-center w-full">
          <RadioGroupItem value={id} id={id} className="absolute left-0" />
          <span className="flex-1 ml-6 text-sm dark:text-gray-200">
            {text}
          </span>
          {hasAnswered && (
            <div className="flex items-center space-x-2">
              {answerCount && answerCount > 0 && (
                <span className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <Users className="h-4 w-4 mr-1" />
                  {answerCount}
                </span>
              )}
              {isCorrect && (
                <Check className="h-5 w-5 text-success dark:text-blue-400" />
              )}
              {isSelected && !isCorrect && (
                <X className="h-5 w-5 text-error dark:text-red-400" />
              )}
            </div>
          )}
        </div>
      </div>
    </label>
  );
};