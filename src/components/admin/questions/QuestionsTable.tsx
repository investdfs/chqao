import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface Question {
  id: string;
  theme: string;
  subject: string;
  topic: string;
  text: string;
  correct_answer: string;
}

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
          <TableRow key={question.id}>
            <TableCell>{question.theme}</TableCell>
            <TableCell>{question.subject}</TableCell>
            <TableCell>{question.topic}</TableCell>
            <TableCell>{question.text}</TableCell>
            <TableCell>{question.correct_answer}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};