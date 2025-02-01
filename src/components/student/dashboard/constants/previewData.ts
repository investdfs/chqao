export const PREVIEW_STUDY_DATA = {
  studyStats: {
    total_study_time: '10h',
    consecutive_study_days: 5,
    weekly_study_hours: 20,
    weekly_questions_target: 250,
    weekly_questions_completed: 150
  },
  weeklyStudyData: Array.from({ length: 7 }, (_, i) => ({
    study_day: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][i],
    question_count: Math.floor(Math.random() * 50),
    study_time: '2h'
  }))
};