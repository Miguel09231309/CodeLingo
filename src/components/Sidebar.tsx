import React from 'react';
import { 
  Compass, 
  Award, 
  Users, 
  BarChart3, 
  Settings, 
  Flame, 
  Heart, 
  Github,
  Moon,
  Sun,
  Globe2,
  Lock
} from 'lucide-react';
import { Language, UserProgress } from '../types';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  lang: Language;
  setLang: (lang: Language) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  progress: UserProgress;
  onRestoreHearts: () => void;
}

export default function Sidebar({
  currentTab,
  setCurrentTab,
  lang,
  setLang,
  theme,
  toggleTheme,
  progress,
  onRestoreHearts
}: SidebarProps) {
  
  const menuItems = [
    { id: 'lessons', icon: Compass, pt: 'Aprender', en: 'Learn' },
    { id: 'ranking', icon: Award, pt: 'Ranking', en: 'Leaderboard' },
    { id: 'duels', icon: Users, pt: 'Duelos 1v1', en: '1v1 Duels' },
    { id: 'forum', icon: Users, pt: 'Fórum', en: 'Forum' },
    { id: 'stats', icon: BarChart3, pt: 'Estatísticas', en: 'Statistics' },
    { id: 'settings', icon: Settings, pt: 'Configurações', en: 'Settings' },
  ];

  const t = {
    restore: lang === 'pt' ? 'Recarregar Vidas' : 'Restore Lives',
    streak: lang === 'pt' ? 'dias de ofensiva' : 'day streak',
    sync: lang === 'pt' ? 'Nuvem sincronizada' : 'Cloud synchronized',
    dark: lang === 'pt' ? 'Escuro' : 'Dark',
    light: lang === 'pt' ? 'Claro' : 'Light'
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 h-screen sticky top-0 p-4 justify-between transition-colors duration-300">
        <div className="space-y-6">
          {/* Brand Logo */}
          <div className="flex items-center gap-3 px-2 py-1 select-none">
            <div className="w-10 h-10 rounded-xl bg-[#58CC02] flex items-center justify-center shadow-lg shadow-[#58CC02]/20 border-b-4 border-emerald-700">
              <span className="font-black text-white text-2xl">C</span>
            </div>
            <div>
              <h1 className="font-black text-2xl tracking-tighter text-slate-800 dark:text-white">
                Code<span className="text-[#58CC02]">Lingo</span>
              </h1>
            </div>
          </div>

          {/* Quick Stats Banner */}
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-3 border border-slate-100 dark:border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-amber-500 font-bold text-sm">
                <Flame className="w-5 h-5 fill-current" />
                <span>{progress.streak} {t.streak}</span>
              </div>
              <div className="flex items-center gap-1.5 text-rose-500 font-bold text-sm">
                <Heart className="w-4 h-4 fill-current animate-pulse" />
                <span>{progress.hearts}/5</span>
              </div>
            </div>

            {progress.hearts < 5 && (
              <button 
                id="restore-hearts-btn"
                onClick={onRestoreHearts}
                className="w-full py-1 text-center text-xs font-semibold bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 rounded-lg hover:bg-rose-100 dark:hover:bg-rose-950/80 transition-all border border-rose-100 dark:border-rose-900/40"
              >
                {t.restore} (+100 XP)
              </button>
            )}

            <div className="flex items-center justify-between text-2xs text-slate-400 dark:text-slate-500 font-mono pt-1 border-t border-slate-100 dark:border-slate-800/80">
              <span>XP Total: <b className="text-slate-600 dark:text-slate-300 font-sans">{progress.xp}</b></span>
              <span className="flex items-center gap-1">
                <span className={`w-1.5 h-1.5 rounded-full ${progress.isOffline ? 'bg-amber-400' : 'bg-emerald-500'}`} />
                {progress.isOffline ? 'Offline' : 'Online'}
              </span>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  id={`nav-${item.id}`}
                  key={item.id}
                  onClick={() => setCurrentTab(item.id)}
                  className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl font-black text-sm tracking-wider uppercase transition-all border-2 ${
                    isActive
                      ? 'bg-slate-800/40 dark:bg-slate-800/80 border-[#58CC02] text-[#58CC02] shadow-md shadow-[#58CC02]/5'
                      : 'border-transparent text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
                  <span>{lang === 'pt' ? item.pt : item.en}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer Controls */}
        <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          {/* Quick Profile Widget */}
          {progress.githubSynced && (
            <div className="flex items-center gap-2.5 px-2 py-1">
              <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-slate-200 dark:border-slate-700">
                <Github className="w-4 h-4 text-slate-700 dark:text-slate-300" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">@{progress.githubUsername}</p>
                <p className="text-2xs text-emerald-500 dark:text-emerald-400 font-mono truncate">GitHub Synced</p>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between gap-2">
            {/* Theme Toggle */}
            <button
              id="theme-toggle-btn"
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all flex-1 flex justify-center items-center gap-1.5 text-xs font-medium"
            >
              {theme === 'light' ? (
                <>
                  <Moon className="w-4 h-4" />
                  <span>{t.dark}</span>
                </>
              ) : (
                <>
                  <Sun className="w-4 h-4" />
                  <span>{t.light}</span>
                </>
              )}
            </button>

            {/* Language Toggle */}
            <button
              id="language-toggle-btn"
              onClick={() => setLang(lang === 'pt' ? 'en' : 'pt')}
              className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all flex-1 flex justify-center items-center gap-1.5 text-xs font-medium"
            >
              <Globe2 className="w-4 h-4 text-emerald-500" />
              <span className="uppercase">{lang}</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Top & Bottom Navigation Bar */}
      <div className="md:hidden flex flex-col bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-3 select-none transition-colors duration-300">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#58CC02] flex items-center justify-center border-b-2 border-emerald-700">
              <span className="font-black text-white text-base">C</span>
            </div>
            <h1 className="font-black text-lg text-slate-800 dark:text-white tracking-tighter">
              Code<span className="text-[#58CC02]">Lingo</span>
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-amber-500 font-black text-xs">
              <Flame className="w-4 h-4 fill-current" />
              <span>{progress.streak}</span>
            </div>
            <div className="flex items-center gap-1 text-rose-500 font-black text-xs">
              <Heart className="w-4 h-4 fill-current" />
              <span>{progress.hearts}</span>
            </div>
            <button 
              id="mobile-lang-btn"
              onClick={() => setLang(lang === 'pt' ? 'en' : 'pt')}
              className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-black uppercase flex items-center justify-center text-slate-700 dark:text-slate-300"
            >
              {lang}
            </button>
            <button 
              id="mobile-theme-btn"
              onClick={toggleTheme}
              className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
            >
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 flex justify-around p-2.5 transition-colors duration-300">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              id={`mobile-nav-${item.id}`}
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              className={`flex flex-col items-center gap-0.5 text-slate-500 dark:text-slate-400 ${
                isActive ? 'text-[#58CC02] dark:text-[#58CC02] font-black' : 'font-bold'
              }`}
            >
              <Icon className="w-5 h-5 stroke-[2]" />
              <span className="text-[10px] tracking-tight">{lang === 'pt' ? item.pt : item.en}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
}
