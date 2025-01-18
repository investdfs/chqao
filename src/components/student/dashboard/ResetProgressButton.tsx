import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ResetProgressDialog } from "./ResetProgressDialog";
import { showWarning } from "@/components/ui/notification";

export const ResetProgressButton = () => {
  const [showDialog, setShowDialog] = useState(false);

  const handleClick = () => {
    showWarning(
      "Atenção! Esta ação é irreversível!",
      "Você está prestes a apagar todo seu progresso de estudos."
    );
    setShowDialog(true);
  };

  return (
    <>
      <Button
        variant="destructive"
        onClick={handleClick}
        className="w-full"
      >
        Resetar Todo Progresso
      </Button>

      <ResetProgressDialog
        open={showDialog}
        onOpenChange={setShowDialog}
      />
    </>
  );
};