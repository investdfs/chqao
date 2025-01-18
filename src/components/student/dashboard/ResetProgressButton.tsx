import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { ResetProgressDialog } from "./ResetProgressDialog";

export const ResetProgressButton = () => {
  const [showDialog, setShowDialog] = useState(false);

  return (
    <>
      <Button
        variant="destructive"
        size="sm"
        className="ml-auto flex items-center gap-2 bg-red-500 hover:bg-red-600"
        onClick={() => setShowDialog(true)}
      >
        <Trash2 className="h-4 w-4" />
        Resetar Progresso
      </Button>

      <ResetProgressDialog open={showDialog} onOpenChange={setShowDialog} />
    </>
  );
};