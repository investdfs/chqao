import React from 'react';
import { StudyTimeCard } from '../StudyTimeCard';
import { PerformanceCard } from '../PerformanceCard';
import { StudyStreak } from '../StudyStreak';
import { StudyCalendar } from '../StudyCalendar';
import { DifficultyTags } from '../DifficultyTags';
import { PerformanceEvolutionCard } from '../PerformanceEvolutionCard';
import { RecommendedTopics } from '../RecommendedTopics';
import { WeeklyGoals } from '../WeeklyGoals';
import { ProductiveHours } from '../ProductiveHours';

interface DashboardContentProps {
  userId?: string;
  studyStats: any;
  weeklyStudyData: any;
}

export const DashboardContent: React.FC<DashboardContentProps> = ({
  userId,
  studyStats,
  weeklyStudyData
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <StudyTimeCard totalTime={studyStats?.total_study_time || "0h"} />
        <PerformanceCard />
        <StudyStreak />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <StudyCalendar userId={userId} />
        <DifficultyTags userId={userId} />
      </div>

      <PerformanceEvolutionCard userId={userId} />

      <RecommendedTopics userId={userId} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-8">
          <WeeklyGoals
            studyHours={{
              current: Number(studyStats?.weekly_study_hours || 0),
              target: 35,
              percentage: (Number(studyStats?.weekly_study_hours || 0) / 35) * 100,
            }}
            questions={{
              completed: studyStats?.weekly_questions_completed || 0,
              target: studyStats?.weekly_questions_target || 250,
              percentage: ((studyStats?.weekly_questions_completed || 0) / (studyStats?.weekly_questions_target || 250)) * 100,
            }}
          />
        </div>
        <ProductiveHours />
      </div>
    </div>
  );
};