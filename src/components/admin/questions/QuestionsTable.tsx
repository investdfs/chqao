import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Question } from "@/types/questions/common";
import { QuestionRow } from "./table/QuestionRow";

interface QuestionsTableProps {
  questions: Question[];
}

export const QuestionsTable = ({ questions }: QuestionsTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Tema</TableHead>
          <TableHead>Matéria</TableHead>
          <TableHead>Assunto</TableHead>
          <TableHead>Questão</TableHead>
          <TableHead>Resposta</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {questions.map((question) => (
          <QuestionRow key={question.id} question={question} />
        ))}
      </TableBody>
    </Table>
  );
};