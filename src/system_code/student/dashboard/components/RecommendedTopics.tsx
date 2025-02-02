import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { TopicCard } from "./recommendations/TopicCard";
import { useTopicRecommendations } from "./recommendations/useTopicRecommendations";

export const RecommendedTopics = ({ userId }: { userId?: string }) => {
  const navigate = useNavigate();
  const { data: recommendations = [] } = useTopicRecommendations(userId);

  const handleTopicSelect = (subject: string) => {
    navigate("/question-practice", { 
      state: { 
        selectedSubject: subject,
        prioritizeErrors: true 
      } 
    });
  };

  if (!recommendations.length) {
    return null;
  }

  return (
    <Card className="bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" />
          Tópicos Recomendados
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recommendations.map((rec) => (
            <TopicCard
              key={rec.topic}
              topic={rec.topic}
              subject={rec.subject}
              correctPercentage={rec.correct_percentage}
              totalQuestions={rec.total_questions}
              onPractice={handleTopicSelect}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};