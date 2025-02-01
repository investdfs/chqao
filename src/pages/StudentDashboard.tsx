import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { DashboardHeader } from "@/components/student/dashboard/DashboardHeader";
import { StudyModeSelector } from "@/components/student/dashboard/StudyModeSelector";
import { SubjectSelectionDialog } from "@/components/student/dialogs/SubjectSelectionDialog";
import { ExamSelectionDialog } from "@/components/student/dialogs/ExamSelectionDialog";
import { useStudentStats } from "@/components/student/dashboard/hooks/useStudentStats";
import { DashboardContent } from "@/components/student/dashboard/components/DashboardContent";
import { PREVIEW_STUDY_DATA } from "@/components/student/dashboard/constants/previewData";

interface PreviewUser {
  id: string;
  email: string;
  name: string;
  status: string;
}

interface StudentDashboardProps {
  previewUser?: PreviewUser;
}

const StudentDashboard: React.FC<StudentDashboardProps> = ({ previewUser }) => {
  const navigate = useNavigate();
  const [subjectDialogOpen, setSubjectDialogOpen] = useState(false);
  const [examDialogOpen, setExamDialogOpen] = useState(false);

  const { data: session } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      if (previewUser) {
        console.log("Usando dados de preview para sessão");
        return { user: previewUser };
      }
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error || !session) {
        navigate('/login');
        return null;
      }
      return session;
    },
  });

  const userId = session?.user?.id;
  const isPreviewMode = !!previewUser;

  const { 
    studyStats = isPreviewMode ? PREVIEW_STUDY_DATA.studyStats : undefined, 
    weeklyStudyData = isPreviewMode ? PREVIEW_STUDY_DATA.weeklyStudyData : undefined 
  } = useStudentStats(isPreviewMode ? undefined : userId);

  const handleSubjectSelect = (subject: string) => {
    setSubjectDialogOpen(false);
    console.log("Selected subject:", subject);
    navigate("/question-practice?subject=" + encodeURIComponent(subject));
  };

  const handleExamSelect = (year: number) => {
    setExamDialogOpen(false);
    console.log("Selected exam year:", year);
    navigate("/previous-exams", { state: { selectedYear: year } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-light via-white to-white">
      <DashboardHeader />

      <StudyModeSelector 
        onPracticeClick={() => setSubjectDialogOpen(true)}
        onExamClick={() => setExamDialogOpen(true)}
      />

      <DashboardContent 
        userId={userId}
        studyStats={studyStats}
        weeklyStudyData={weeklyStudyData}
      />

      <SubjectSelectionDialog
        open={subjectDialogOpen}
        onOpenChange={setSubjectDialogOpen}
        onSubjectSelect={handleSubjectSelect}
      />

      <ExamSelectionDialog
        open={examDialogOpen}
        onOpenChange={setExamDialogOpen}
        onExamSelect={handleExamSelect}
      />
    </div>
  );
};

export default StudentDashboard;