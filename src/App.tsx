import React from 'react';
import { UserProgress, Lesson, Language } from './types';
import { LESSONS } from './data/lessons';
import { sfx } from './utils/audio';

import Sidebar from './components/Sidebar';
import LessonsList from './components/LessonsList';
import QuizContainer from './components/QuizContainer';
import Leaderboard from './components/Leaderboard';
import Dueling from './components/Dueling';
import Forum from './components/Forum';
import Stats from './components/Stats';
import GitHubSync from './components/GitHubSync';
import ProfileSettings from './components/ProfileSettings';

import { motion, AnimatePresence } from 'motion/react';
import { Award, Zap, Bell, Check, CloudLightning } from 'lucide-react';

const LOCAL_STORAGE_KEY = 'codelingo_user_progress';

const DEFAULT_PROGRESS: UserProgress = {
  xp: 45, // Start with some initial XP so they aren't at absolute zero
  level: 1,
  hearts: 5,
  streak: 1,
  lastStudyDate: new Date().toISOString().split('T')[0],
  unlockedAchievements: [],
  htmlLevel: 1,
  pythonLevel: 1,
  jsLevel: 1,
  dailyGoalMinutes: 15,
  studyTimeTodayMinutes: 0,
  weeklyStudyTime: [
    { day: 'Seg', minutes: 12 },
    { day: 'Ter', minutes: 0 },
    { day: 'Qua', minutes: 15 },
    { day: 'Qui', minutes: 8 },
    { day: 'Sex', minutes: 0 },
    { day: 'Sáb', minutes: 10 },
    { day: 'Dom', minutes: 5 }
  ],
  githubUsername: null,
  githubSynced: false,
  isOffline: false,
  syncStatus: 'synced',
  twoFactorEnabled: false,
  biometricsEnabled: false
};

export default function App() {
  const [progress, setProgress] = React.useState<UserProgress>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Ensure all required fields exist
        return { ...DEFAULT_PROGRESS, ...parsed };
      }
    } catch (e) {
      console.warn('Failed to load progress from localStorage', e);
    }
    return DEFAULT_PROGRESS;
  });

  const [currentTab, setCurrentTab] = React.useState<string>('lessons');
  const [lang, setLang] = React.useState<Language>('pt');
  const [theme, setTheme] = React.useState<'light' | 'dark'>('dark'); // elegant default dark theme
  const [activeLesson, setActiveLesson] = React.useState<Lesson | null>(null);
  
  // Custom toast notifications for achievements and streaks!
  const [toast, setToast] = React.useState<{ id: string; title: string; desc: string; icon: any } | null>(null);

  // Sync state to localStorage on update
  React.useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(progress));
  }, [progress]);

  // Handle system level calculation dynamically based on XP
  const calculateLevelAndCheck = (newXp: number, currentLevel: number): number => {
    const calculatedLevel = Math.floor(newXp / 100) + 1;
    if (calculatedLevel > currentLevel) {
      // Trigger retro level-up sound and notification
      setTimeout(() => {
        sfx.playLevelUp();
        showToast(
          lang === 'pt' ? 'PROGRESSED!' : 'LEVEL UP!',
          lang === 'pt' 
            ? `Parabéns! Você alcançou o Nível de Programação ${calculatedLevel}!` 
            : `Congratulations! You reached Programming Level ${calculatedLevel}!`,
          'Zap'
        );
      }, 800);
    }
    return calculatedLevel;
  };

  const showToast = (title: string, desc: string, iconType: string) => {
    setToast({
      id: Math.random().toString(),
      title,
      desc,
      icon: iconType
    });
    setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  // Run audit checks on achievements
  const auditAchievements = (updatedProgress: UserProgress): string[] => {
    const unlocked = [...updatedProgress.unlockedAchievements];
    let changed = false;

    // ach-1: First Step (completed lesson)
    if (!unlocked.includes('ach-1') && (updatedProgress.htmlLevel > 1 || updatedProgress.pythonLevel > 1 || updatedProgress.jsLevel > 1)) {
      unlocked.push('ach-1');
      changed = true;
      showToast(
        lang === 'pt' ? 'Conquista Desbloqueada!' : 'Achievement Unlocked!',
        lang === 'pt' ? 'Primeiro Passo - Complete sua primeira lição' : 'First Step - Completed your first lesson',
        'Award'
      );
    }

    // ach-2: Focused (streak >= 3)
    if (!unlocked.includes('ach-2') && updatedProgress.streak >= 3) {
      unlocked.push('ach-2');
      changed = true;
      showToast(
        lang === 'pt' ? 'Conquista Desbloqueada!' : 'Achievement Unlocked!',
        lang === 'pt' ? 'Focado e Determinado - Ofensiva de 3 dias' : 'Focused & Committed - 3 day streak',
        'Flame'
      );
    }

    // ach-3: XP Master (XP >= 200)
    if (!unlocked.includes('ach-3') && updatedProgress.xp >= 200) {
      unlocked.push('ach-3');
      changed = true;
      showToast(
        lang === 'pt' ? 'Conquista Desbloqueada!' : 'Achievement Unlocked!',
        lang === 'pt' ? 'Mestre Acumulador - Acumulou 200 XP' : 'XP Accumulator - Reached 200 XP',
        'Award'
      );
    }

    // ach-4: GitHub Sync
    if (!unlocked.includes('ach-4') && updatedProgress.githubSynced) {
      unlocked.push('ach-4');
      changed = true;
      showToast(
        lang === 'pt' ? 'Conquista Desbloqueada!' : 'Achievement Unlocked!',
        lang === 'pt' ? 'Dev Conectado - Conta sincronizada com o GitHub' : 'Connected Dev - Synchronized with GitHub',
        'Github'
      );
    }

    return unlocked;
  };

  // Trigger when a lesson finishes successfully
  const handleFinishLesson = (xpEarned: number, livesLost: number, didPass: boolean) => {
    setActiveLesson(null);

    if (!didPass) return; // Didn't pass, handled in container

    // Add study minutes
    const addedStudyMinutes = 15;
    const todayStr = new Date().toISOString().split('T')[0];

    setProgress(prev => {
      // Advance course level depending on what subject was played
      let nextHtml = prev.htmlLevel;
      let nextPython = prev.pythonLevel;
      let nextJs = prev.jsLevel;

      if (activeLesson) {
        if (activeLesson.subject === 'html') nextHtml = prev.htmlLevel + 1;
        if (activeLesson.subject === 'python') nextPython = prev.pythonLevel + 1;
        if (activeLesson.subject === 'javascript') nextJs = prev.jsLevel + 1;
      }

      const nextXp = prev.xp + xpEarned;
      const nextLevel = calculateLevelAndCheck(nextXp, prev.level);
      const nextTodayStudyTime = prev.studyTimeTodayMinutes + addedStudyMinutes;

      // Update weekly array
      const nextWeekly = prev.weeklyStudyTime.map((d, index) => {
        // Today is Friday in 2026-07-03, let's map index appropriately or add to the last element
        if (index === 4) { // Friday / Sex
          return { ...d, minutes: d.minutes + addedStudyMinutes };
        }
        return d;
      });

      const updated: UserProgress = {
        ...prev,
        xp: nextXp,
        level: nextLevel,
        htmlLevel: nextHtml,
        pythonLevel: nextPython,
        jsLevel: nextJs,
        studyTimeTodayMinutes: nextTodayStudyTime,
        weeklyStudyTime: nextWeekly,
        lastStudyDate: todayStr,
        hearts: Math.min(5, prev.hearts + 1), // restore a life as reward
        syncStatus: prev.isOffline ? 'offline' : 'synced'
      };

      updated.unlockedAchievements = auditAchievements(updated);
      return updated;
    });

    showToast(
      lang === 'pt' ? 'Excelente progresso!' : 'Excellent progress!',
      lang === 'pt' ? `Você ganhou +${xpEarned} XP e estudou por mais 15 minutos!` : `You earned +${xpEarned} XP and studied for 15 minutes!`,
      'Check'
    );
  };

  // Restore hearts in exchange for some XP
  const handleRestoreHearts = () => {
    if (progress.hearts >= 5) return;
    if (progress.xp < 100) {
      alert(lang === 'pt' ? 'Você precisa de pelo menos 100 XP para recarregar!' : 'You need at least 100 XP to restore lives!');
      return;
    }

    setProgress(prev => ({
      ...prev,
      xp: prev.xp - 100,
      hearts: 5
    }));
    sfx.playSuccess();
    showToast(
      lang === 'pt' ? 'Vidas Carregadas' : 'Hearts Restored',
      lang === 'pt' ? 'Suas vidas foram completamente recarregadas!' : 'Your lives have been completely recharged!',
      'Heart'
    );
  };

  // GitHub account sync success handler
  const handleSyncGitHub = (username: string) => {
    setProgress(prev => {
      const updated: UserProgress = {
        ...prev,
        githubUsername: username,
        githubSynced: true,
        xp: prev.xp + 50 // bonus xp for linking
      };
      updated.unlockedAchievements = auditAchievements(updated);
      return updated;
    });

    sfx.playSuccess();
    showToast(
      lang === 'pt' ? 'Perfil GitHub Sincronizado' : 'GitHub Synced',
      lang === 'pt' ? `O usuário @${username} foi vinculado com sucesso! Bônus de +50 XP.` : `Linked user @${username}! Earned +50 XP.`,
      'Github'
    );
  };

  // Update specific values
  const handleUpdateProgress = (update: Partial<UserProgress>) => {
    setProgress(prev => ({ ...prev, ...update }));
  };

  // Reset progress entirely to default
  const handleResetProgress = () => {
    setProgress(DEFAULT_PROGRESS);
    setCurrentTab('lessons');
  };

  const handleGoalChange = (newGoal: number) => {
    setProgress(prev => ({ ...prev, dailyGoalMinutes: newGoal }));
    showToast(
      lang === 'pt' ? 'Meta Atualizada' : 'Goal Configured',
      lang === 'pt' ? `Sua nova meta diária é de ${newGoal} minutos!` : `Your daily target is now ${newGoal} minutes!`,
      'Zap'
    );
  };

  // Win a duel
  const handleWinDuel = (xpReward: number) => {
    setProgress(prev => {
      const updated: UserProgress = {
        ...prev,
        xp: prev.xp + xpReward
      };
      
      // Unlock Duel Champion ach-5 if not already unlocked
      if (!updated.unlockedAchievements.includes('ach-5')) {
        updated.unlockedAchievements.push('ach-5');
        showToast(
          lang === 'pt' ? 'Conquista Desbloqueada!' : 'Achievement Unlocked!',
          lang === 'pt' ? 'Campeão de Duelos - Venceu um duelo 1v1 rápido!' : 'Duel Champion - Won a rapid 1v1 duel!',
          'Zap'
        );
      }
      
      updated.level = calculateLevelAndCheck(updated.xp, prev.level);
      return updated;
    });
  };

  return (
    <div className={theme === 'dark' ? 'dark' : ''}>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col md:flex-row transition-colors duration-300">
        
        {/* Render Quiz Arena full screen or regular Dashboard */}
        {activeLesson ? (
          <QuizContainer
            lesson={activeLesson}
            lang={lang}
            onClose={() => setActiveLesson(null)}
            onFinish={handleFinishLesson}
          />
        ) : (
          <>
            {/* Left Desktop Sidebar / Mobile Navbar bottom */}
            <Sidebar
              currentTab={currentTab}
              setCurrentTab={setCurrentTab}
              lang={lang}
              setLang={setLang}
              theme={theme}
              toggleTheme={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              progress={progress}
              onRestoreHearts={handleRestoreHearts}
            />

            {/* Main scrollable tabs dashboard content */}
            <main className="flex-grow p-4 md:p-8 max-w-5xl mx-auto w-full pb-24 md:pb-8">
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentTab}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.25 }}
                >
                  {currentTab === 'lessons' && (
                    <div className="space-y-8">
                      <LessonsList
                        lessons={LESSONS}
                        progress={progress}
                        onSelectLesson={(lesson) => setActiveLesson(lesson)}
                        lang={lang}
                      />
                      
                      {/* Embed GitHubSync widget nicely under lessons to let developers visualize commits */}
                      <GitHubSync
                        lang={lang}
                        progress={progress}
                        onSync={handleSyncGitHub}
                      />
                    </div>
                  )}

                  {currentTab === 'ranking' && (
                    <Leaderboard
                      lang={lang}
                      progress={progress}
                    />
                  )}

                  {currentTab === 'duels' && (
                    <Dueling
                      lang={lang}
                      progress={progress}
                      onWinDuel={handleWinDuel}
                    />
                  )}

                  {currentTab === 'forum' && (
                    <Forum
                      lang={lang}
                    />
                  )}

                  {currentTab === 'stats' && (
                    <Stats
                      lang={lang}
                      progress={progress}
                      onChangeGoal={handleGoalChange}
                    />
                  )}

                  {currentTab === 'settings' && (
                    <ProfileSettings
                      lang={lang}
                      setLang={setLang}
                      progress={progress}
                      onUpdateProgress={handleUpdateProgress}
                      onResetProgress={handleResetProgress}
                    />
                  )}
                </motion.div>
              </AnimatePresence>

            </main>

            {/* Toast alerts element overlays */}
            <AnimatePresence>
              {toast && (
                <motion.div
                  key={toast.id}
                  initial={{ opacity: 0, x: 50, scale: 0.9 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="fixed bottom-20 md:bottom-6 right-6 z-50 bg-slate-900 text-white border border-slate-800 p-4 rounded-2xl flex items-start gap-3.5 shadow-2xl max-w-sm"
                >
                  <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
                    <Award className="w-5 h-5" />
                  </div>
                  <div className="space-y-0.5">
                    <h4 className="font-extrabold text-xs tracking-tight text-white">{toast.title}</h4>
                    <p className="text-3xs text-slate-300 leading-normal">{toast.desc}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}

      </div>
    </div>
  );
}
