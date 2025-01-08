import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MessageCircle } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface QuestionCommentsDialogProps {
  questionId: string;
}

export const QuestionCommentsDialog = ({ questionId }: QuestionCommentsDialogProps) => {
  console.log("Renderizando QuestionCommentsDialog para questão:", questionId);
  return null;
};