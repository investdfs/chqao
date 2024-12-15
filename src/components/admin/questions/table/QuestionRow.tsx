import { TableCell, TableRow } from "@/components/ui/table";
import { Question } from "@/types/questions/common";

interface QuestionRowProps {
  question: Question;
}

export const QuestionRow = ({ question }: QuestionRowProps) => {
  return (
    <TableRow>
      <TableCell>{question.theme}</TableCell>
      <TableCell>{question.subject}</TableCell>
      <TableCell>{question.topic}</TableCell>
      <TableCell>{question.text}</TableCell>
      <TableCell>{question.correct_answer}</TableCell>
    </TableRow>
  );
};