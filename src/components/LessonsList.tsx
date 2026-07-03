import React from 'react';
import { BookOpen, CheckCircle, Lock, Trophy, Award, Sparkles, Code, Play } from 'lucide-react';
import { Lesson, Achievement, Language, UserProgress } from '../types';
import { ACHIEVEMENTS } from '../data/lessons';
import { motion } from 'motion/react';

interface LessonsListProps {
  lessons: Lesson[];
  progress: UserProgress;
  onSelectLesson: (lesson: Lesson) => void;
  lang: Language;
}

export default function LessonsList({
  lessons,
  progress,
  onSelectLesson,
  lang
}: LessonsListProps) {
  const [selectedSubject, setSelectedSubject] = React.useState<'html' | 'python' | 'javascript'>('html');

  const filteredLessons = lessons.filter(l => l.subject === selectedSubject);

  const t = {
    dailyQuests: lang === 'pt' ? 'Missões Diárias' : 'Daily Quests',
    achievements: lang === 'pt' ? 'Conquistas' : 'Achievements',
    locked: lang === 'pt' ? 'Bloqueado' : 'Locked',
    reqLevel: lang === 'pt' ? 'Nível Mínimo' : 'Req. Level',
    start: lang === 'pt' ? 'Praticar' : 'Practice',
    unlocked: lang === 'pt' ? 'Desbloqueado' : 'Unlocked',
    subjectIntro: {
      html: {
        pt: 'Crie estruturas de páginas web modernas com tags semânticas e atributos.',
        en: 'Build modern webpage structures using semantic tags and attributes.'
      },
      python: {
        pt: 'Aprenda lógica de programação com variáveis, listas e estruturas de controle.',
        en: 'Learn programming logic with variables, lists, and control flows.'
      },
      javascript: {
        pt: 'Adicione interatividade dinâmica às suas páginas manipulando o DOM.',
        en: 'Bring webpages to life with dynamic interaction by manipulating the DOM.'
      }
    },
    completed: lang === 'pt' ? 'Concluído' : 'Completed',
    lockedMsg: lang === 'pt' ? 'Alcance nível mais alto para desbloquear!' : 'Reach a higher level to unlock!'
  };

  const getSubjectColor = (subject: string) => {
    switch(subject) {
      case 'html': return {
        bg: 'bg-orange-500',
        text: 'text-orange-500',
        border: 'border-orange-500',
        hover: 'hover:bg-orange-500/10',
        lightBg: 'bg-orange-50 dark:bg-orange-950/20',
        banner: 'bg-gradient-to-r from-orange-500 to-amber-500'
      };
      case 'python': return {
        bg: 'bg-blue-500',
        text: 'text-blue-500',
        border: 'border-blue-500',
        hover: 'hover:bg-blue-500/10',
        lightBg: 'bg-blue-50 dark:bg-blue-950/20',
        banner: 'bg-gradient-to-r from-blue-500 to-indigo-500'
      };
      case 'javascript': return {
        bg: 'bg-amber-500',
        text: 'text-amber-500',
        border: 'border-amber-500',
        hover: 'hover:bg-amber-500/10',
        lightBg: 'bg-amber-50 dark:bg-amber-950/20',
        banner: 'bg-gradient-to-r from-amber-500 to-yellow-500'
      };
      default: return {
        bg: 'bg-emerald-500',
        text: 'text-emerald-500',
        border: 'border-emerald-500',
        hover: 'hover:bg-emerald-500/10',
        lightBg: 'bg-emerald-50 dark:bg-emerald-950/20',
        banner: 'bg-gradient-to-r from-emerald-500 to-teal-500'
      };
    }
  };

  const getSubjectUserLevel = (subj: 'html' | 'python' | 'javascript') => {
    if (subj === 'html') return progress.htmlLevel;
    if (subj === 'python') return progress.pythonLevel;
    return progress.jsLevel;
  };

  const currentSubjectLevel = getSubjectUserLevel(selectedSubject);
  const colorScheme = getSubjectColor(selectedSubject);

  // Simple daily quests list (mocked/derived from daily variables)
  const dailyQuests = [
    {
      id: 'dq-1',
      pt: 'Praticar hoje',
      en: 'Practice today',
      target: 1,
      current: progress.studyTimeTodayMinutes > 0 ? 1 : 0,
      xp: 25
    },
    {
      id: 'dq-2',
      pt: 'Acumular 50 XP',
      en: 'Accumulate 50 XP',
      target: 50,
      current: Math.min(50, progress.xp % 100),
      xp: 40
    }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-10">
      {/* Path / Curriculum Column */}
      <div className="lg:col-span-2 space-y-6">
        
        {/* Subject Tab Selectors */}
        <div className="flex gap-2.5 p-1.5 bg-slate-150 dark:bg-slate-800 rounded-2xl border-2 border-slate-200 dark:border-slate-800 shadow-sm">
          {(['html', 'python', 'javascript'] as const).map((subj) => {
            const isActive = selectedSubject === subj;
            const details = getSubjectColor(subj);
            return (
              <button
                id={`subj-tab-${subj}`}
                key={subj}
                onClick={() => setSelectedSubject(subj)}
                className={`flex-1 py-3 text-center text-xs font-black rounded-xl uppercase transition-all flex items-center justify-center gap-1.5 border-b-4 active:translate-y-[2px] active:border-b-2 ${
                  isActive
                    ? `${details.bg} border-${subj === 'html' ? 'orange-700' : subj === 'python' ? 'blue-700' : 'yellow-600'} text-white shadow-md`
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 border-transparent bg-transparent'
                }`}
              >
                <Code className="w-4 h-4" />
                <span>{subj === 'javascript' ? 'JS' : subj}</span>
              </button>
            );
          })}
        </div>

        {/* Subject Banner Overview */}
        <div className={`${colorScheme.banner} text-white rounded-3xl p-6 shadow-xl relative overflow-hidden`}>
          <div className="absolute right-[-20px] bottom-[-20px] opacity-10 pointer-events-none">
            <Code className="w-48 h-48" />
          </div>
          <div className="relative z-10 space-y-3">
            <div className="flex items-center gap-2">
              <span className="bg-white/20 text-xs font-mono px-2.5 py-1 rounded-full backdrop-blur-md uppercase font-bold tracking-wider">
                {selectedSubject.toUpperCase()}
              </span>
              <span className="bg-white/20 text-xs font-mono px-2.5 py-1 rounded-full backdrop-blur-md font-bold">
                Level {currentSubjectLevel}
              </span>
            </div>
            <h2 className="text-2xl font-extrabold tracking-tight">
              {selectedSubject === 'html' ? 'HTML5 & CSS3 Structure' : selectedSubject === 'python' ? 'Python Fundamentals' : 'ES6+ JavaScript'}
            </h2>
            <p className="text-white/80 text-sm max-w-md leading-relaxed">
              {t.subjectIntro[selectedSubject][lang]}
            </p>
          </div>
        </div>

        {/* Pathway Tree Checkpoints */}
        <div className="flex flex-col items-center py-6 space-y-12 relative">
          <div className="absolute w-1 bg-slate-200 dark:bg-slate-800 top-10 bottom-10 left-1/2 -translate-x-1/2 pointer-events-none" />

          {filteredLessons.map((lesson, idx) => {
            const isCompleted = idx < currentSubjectLevel - 1;
            const isUnlocked = idx <= currentSubjectLevel - 1;
            
            // Align staggered positions left/right/center like Duolingo!
            const xOffset = idx % 3 === 0 ? 'translate-x-0' : idx % 3 === 1 ? 'translate-x-8 md:translate-x-12' : '-translate-x-8 md:-translate-x-12';

            return (
              <motion.div
                key={lesson.id}
                className={`relative flex flex-col items-center ${xOffset}`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
              >
                {/* Connector Badge details */}
                <div className="relative group">
                  <button
                    id={`lesson-btn-${lesson.id}`}
                    disabled={!isUnlocked}
                    onClick={() => onSelectLesson(lesson)}
                    className={`w-24 h-20 rounded-[42%] flex items-center justify-center border-b-8 relative transition-all active:border-b-2 active:translate-y-[6px] duration-100 ${
                      isCompleted 
                        ? `${colorScheme.bg} border-${selectedSubject === 'html' ? 'orange-700' : selectedSubject === 'python' ? 'blue-700' : 'yellow-600'} text-white shadow-xl cursor-pointer`
                        : isUnlocked
                          ? `${selectedSubject === 'html' ? 'bg-orange-500 border-orange-700 hover:bg-orange-400 text-white' : selectedSubject === 'python' ? 'bg-blue-500 border-blue-700 hover:bg-blue-400 text-white' : 'bg-yellow-400 border-yellow-600 hover:bg-yellow-300 text-slate-900'} shadow-xl cursor-pointer`
                          : 'bg-slate-700/60 dark:bg-slate-800 border-slate-800 dark:border-slate-950 text-slate-400 dark:text-slate-600 cursor-not-allowed'
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle className="w-8 h-8 stroke-[3]" />
                    ) : !isUnlocked ? (
                      <Lock className="w-6 h-6 stroke-[3]" />
                    ) : (
                      <Play className="w-8 h-8 fill-current stroke-[2.5] ml-1" />
                    )}

                    {/* Pulse glow for current lesson */}
                    {isUnlocked && !isCompleted && (
                      <span className="absolute -inset-1.5 rounded-[42%] border-2 border-emerald-500/40 animate-ping pointer-events-none" />
                    )}
                  </button>

                  {/* Tooltip Card hover info */}
                  <div className="absolute top-24 left-1/2 -translate-x-1/2 w-48 text-center bg-white dark:bg-slate-800 p-3 rounded-2xl shadow-2xl border-2 border-slate-200 dark:border-slate-700 opacity-0 group-hover:opacity-100 pointer-events-none transition-all scale-95 group-hover:scale-100 z-20">
                    <h4 className="font-black text-xs text-slate-800 dark:text-white uppercase tracking-tight">
                      {lesson.title[lang]}
                    </h4>
                    <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 mt-1 uppercase">
                      {isCompleted ? t.completed : isUnlocked ? `${t.start} (+${lesson.xpReward} XP)` : t.lockedMsg}
                    </p>
                  </div>
                </div>

                {/* Subtitle Node Label */}
                <div className="mt-4 text-center">
                  <span className="text-3xs font-mono text-slate-400 dark:text-slate-500 uppercase tracking-widest block font-black">
                    Lição {idx + 1}
                  </span>
                  <span className="font-black text-xs text-slate-800 dark:text-slate-200 tracking-wide uppercase">
                    {lesson.title[lang]}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Side Column (Quests / Achievements Dashboard) */}
      <div className="space-y-6">
        
        {/* Daily Quests Board */}
        <div className="bg-white dark:bg-slate-900 p-5 space-y-4 tactile-card text-slate-800 dark:text-slate-100">
          <div className="flex items-center gap-2.5 text-slate-800 dark:text-white font-black text-base uppercase tracking-tight">
            <Trophy className="w-5 h-5 text-amber-500 fill-amber-500/10" />
            <h3>{t.dailyQuests}</h3>
          </div>

          <div className="space-y-3.5">
            {dailyQuests.map((quest) => {
              const pct = (quest.current / quest.target) * 100;
              return (
                <div key={quest.id} className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs font-black uppercase tracking-wider">
                    <span className="text-slate-700 dark:text-slate-300">
                      {quest[lang]}
                    </span>
                    <span className="font-mono text-[#58CC02] dark:text-[#58CC02]">
                      {quest.current}/{quest.target}
                    </span>
                  </div>
                  
                  {/* Custom progress bar */}
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden border border-slate-200/40 dark:border-slate-800">
                    <div 
                      className="bg-[#58CC02] h-full rounded-full transition-all duration-300"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <div className="flex justify-end text-3xs font-mono text-[#58CC02] font-black tracking-wider uppercase">
                    +{quest.xp} XP BONUS
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Achievements Card */}
        <div className="bg-white dark:bg-slate-900 p-5 space-y-4 tactile-card text-slate-800 dark:text-slate-100">
          <div className="flex items-center gap-2.5 text-slate-800 dark:text-white font-black text-base uppercase tracking-tight">
            <Award className="w-5 h-5 text-[#58CC02]" />
            <h3>{t.achievements}</h3>
          </div>

          <div className="space-y-3.5 max-h-64 overflow-y-auto pr-1">
            {ACHIEVEMENTS.map((ach) => {
              const isUnlocked = progress.unlockedAchievements.includes(ach.id);
              return (
                <div 
                  key={ach.id} 
                  className={`flex items-center gap-3 p-2.5 rounded-2xl border-2 transition-all ${
                    isUnlocked 
                      ? 'bg-[#58CC02]/5 border-[#58CC02]/20' 
                      : 'bg-slate-50/50 dark:bg-slate-800/30 border-transparent'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center border-b-4 ${
                    isUnlocked ? 'bg-[#58CC02] border-emerald-700 text-white' : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400'
                  }`}>
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h5 className={`text-xs font-black uppercase tracking-tight truncate ${isUnlocked ? 'text-slate-800 dark:text-slate-200' : 'text-slate-500 dark:text-slate-400'}`}>
                      {ach.title[lang]}
                    </h5>
                    <p className="text-3xs text-slate-400 dark:text-slate-500 font-bold leading-snug">
                      {ach.desc[lang]}
                    </p>
                  </div>
                  {isUnlocked && (
                    <span className="text-3xs font-black text-[#58CC02] bg-[#58CC02]/10 px-2 py-1 rounded-full uppercase tracking-wider font-mono">
                      +{ach.xpBonus} XP
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
