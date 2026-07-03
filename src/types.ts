export type Language = 'pt' | 'en';

export interface UserProgress {
  xp: number;
  level: number;
  hearts: number;
  streak: number;
  lastStudyDate: string; // YYYY-MM-DD
  unlockedAchievements: string[];
  htmlLevel: number;
  pythonLevel: number;
  jsLevel: number;
  dailyGoalMinutes: number;
  studyTimeTodayMinutes: number;
  weeklyStudyTime: { day: string; minutes: number }[];
  githubUsername: string | null;
  githubSynced: boolean;
  isOffline: boolean;
  syncStatus: 'synced' | 'pending' | 'offline';
  twoFactorEnabled: boolean;
  biometricsEnabled: boolean;
}

export type ExerciseType = 'multiple-choice' | 'fill-blank' | 'drag-drop' | 'order-code';

export interface Exercise {
  id: string;
  type: ExerciseType;
  question: {
    pt: string;
    en: string;
  };
  codeSnippet?: string;
  options: string[]; // For multiple choice or drag & drop bank
  correctAnswer: string; // Or ordered values joined by '|' or specific text
  hint: {
    pt: string;
    en: string;
  };
}

export interface Lesson {
  id: string;
  title: {
    pt: string;
    en: string;
  };
  subject: 'html' | 'python' | 'javascript';
  levelRequired: number;
  xpReward: number;
  exercises: Exercise[];
}

export interface Achievement {
  id: string;
  title: {
    pt: string;
    en: string;
  };
  desc: {
    pt: string;
    en: string;
  };
  icon: string;
  xpBonus: number;
  conditionType: 'streak' | 'xp' | 'lesson' | 'github' | 'challenge';
  targetValue: number;
}

export interface RankingUser {
  id: string;
  username: string;
  avatar: string;
  xp: number;
  rank: number;
  isCurrentUser?: boolean;
}

export interface ForumPost {
  id: string;
  author: string;
  avatar: string;
  title: string;
  content: string;
  subject: 'html' | 'python' | 'javascript' | 'geral';
  likes: number;
  likedByCurrentUser?: boolean;
  replies: {
    id: string;
    author: string;
    avatar: string;
    content: string;
    date: string;
  }[];
  date: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  subject: 'html' | 'python' | 'javascript' | 'review';
}
