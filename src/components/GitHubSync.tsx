import React from 'react';
import { Github, CheckCircle, ExternalLink, Activity, Award, RefreshCw } from 'lucide-react';
import { Language, UserProgress } from '../types';

interface GitHubSyncProps {
  lang: Language;
  progress: UserProgress;
  onSync: (username: string) => void;
}

export default function GitHubSync({ lang, progress, onSync }: GitHubSyncProps) {
  const [username, setUsername] = React.useState('');
  const [isSyncing, setIsSyncing] = React.useState(false);

  const t = {
    title: lang === 'pt' ? 'Sincronização com GitHub' : 'GitHub Progress Integration',
    subtitle: lang === 'pt' ? 'Conecte seu perfil para converter seus commits em bônus diários de XP!' : 'Link your profile to convert your commits into daily XP bonuses!',
    placeholder: lang === 'pt' ? 'Nome de usuário do GitHub' : 'GitHub username',
    syncBtn: lang === 'pt' ? 'Sincronizar Perfil' : 'Sync Profile',
    activeSync: lang === 'pt' ? 'Perfil Ativo' : 'Active Profile',
    totalCommits: lang === 'pt' ? 'Commits Sincronizados' : 'Synced Commits',
    streak: lang === 'pt' ? 'Ofensiva no GitHub' : 'GitHub Streak',
    gridTitle: lang === 'pt' ? 'Gráfico de Atividade de Código (Últimas Semanas)' : 'Code Contribution Graph (Recent Weeks)',
    syncedLabel: lang === 'pt' ? 'Sincronizado' : 'Synced',
    stats: lang === 'pt' ? 'Estatísticas de Desenvolvimento' : 'Developer Statistics',
  };

  // Generate 5 rows of 16 boxes each for a beautiful mock contribution matrix
  const gridRows = 5;
  const gridCols = 15;
  const matrixValues = [
    [0, 1, 2, 0, 3, 4, 1, 0, 2, 3, 0, 1, 2, 3, 4],
    [1, 0, 3, 2, 0, 1, 4, 2, 0, 1, 3, 4, 0, 2, 1],
    [2, 3, 0, 4, 1, 0, 2, 3, 4, 1, 0, 2, 3, 0, 4],
    [0, 1, 4, 3, 2, 1, 0, 2, 3, 4, 1, 0, 2, 3, 1],
    [3, 4, 1, 0, 2, 3, 4, 1, 0, 2, 3, 4, 1, 0, 2],
  ];

  const getGlowColor = (val: number) => {
    switch (val) {
      case 0: return 'bg-slate-100 dark:bg-slate-800/60';
      case 1: return 'bg-emerald-200 dark:bg-emerald-950/40';
      case 2: return 'bg-emerald-400 dark:bg-emerald-800/60';
      case 3: return 'bg-emerald-500 dark:bg-emerald-600';
      case 4: return 'bg-emerald-600 dark:bg-emerald-500';
      default: return 'bg-slate-100';
    }
  };

  const handleSyncSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;

    setIsSyncing(true);
    setTimeout(() => {
      onSync(username);
      setIsSyncing(false);
    }, 1500);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 md:p-6 space-y-6 tactile-card text-slate-800 dark:text-slate-100">
      
      {/* Title block */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h3 className="font-black text-lg text-slate-800 dark:text-white flex items-center gap-2.5 uppercase tracking-tight">
            <Github className="w-5 h-5 text-slate-850 dark:text-slate-200 stroke-[2.5]" />
            <span>{t.title}</span>
          </h3>
          <p className="text-2xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wide">
            {t.subtitle}
          </p>
        </div>
        
        {progress.githubSynced && (
          <span className="flex items-center gap-1 bg-[#58CC02]/10 text-[#58CC02] text-3xs font-black px-3 py-1 rounded-full uppercase font-mono tracking-widest border border-[#58CC02]/20">
            <CheckCircle className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>{t.syncedLabel}</span>
          </span>
        )}
      </div>

      {!progress.githubSynced ? (
        /* Sync form prompt */
        <form onSubmit={handleSyncSubmit} className="flex gap-2.5 max-w-md">
          <div className="relative flex-1">
            <Github className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-slate-400" />
            <input
              id="github-username-input"
              type="text"
              required
              placeholder={t.placeholder}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800/60 border-2 border-slate-200 dark:border-slate-800 rounded-2xl pl-11 pr-4 py-3 text-xs font-bold text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#58CC02] dark:focus:border-[#58CC02] transition-all"
            />
          </div>

          <button
            id="github-sync-btn"
            type="submit"
            disabled={isSyncing}
            className="px-6 py-3 bg-[#58CC02] hover:bg-emerald-500 text-white text-xs font-black rounded-2xl transition-all flex items-center gap-1.5 border-b-4 border-emerald-700 active:border-b-0 active:translate-y-[4px] uppercase tracking-wider disabled:opacity-50 shadow-md"
          >
            {isSyncing ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Github className="w-4 h-4 stroke-[2.5]" />
                <span>{t.syncBtn}</span>
              </>
            )}
          </button>
        </form>
      ) : (
        /* Succeeded Integration view grid */
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border-2 border-slate-200 dark:border-slate-800/80 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center border-2 border-slate-300 dark:border-slate-600">
                <Github className="w-5 h-5 text-slate-700 dark:text-slate-300" />
              </div>
              <div>
                <p className="text-xs font-black text-slate-800 dark:text-white">@{progress.githubUsername}</p>
                <a 
                  href={`https://github.com/${progress.githubUsername}`} 
                  target="_blank" 
                  rel="noreferrer"
                  className="text-3xs text-[#58CC02] font-black uppercase tracking-wider flex items-center gap-0.5 hover:underline"
                >
                  <span>Ver perfil público</span>
                  <ExternalLink className="w-2.5 h-2.5 stroke-[2.5]" />
                </a>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="text-left sm:text-right">
                <span className="text-3xs font-mono text-slate-400 dark:text-slate-500 uppercase font-black tracking-widest">{t.totalCommits}</span>
                <p className="text-base font-black text-slate-800 dark:text-white">142 commits</p>
              </div>
              <div className="w-px bg-slate-200 dark:bg-slate-800 h-8 self-center" />
              <div className="text-left sm:text-right">
                <span className="text-3xs font-mono text-slate-400 dark:text-slate-500 uppercase font-black tracking-widest">{t.streak}</span>
                <p className="text-base font-black text-amber-500">12 dias ativos</p>
              </div>
            </div>
          </div>

          {/* Activity Matrix Grid */}
          <div className="space-y-3.5">
            <p className="text-3xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-[#58CC02] stroke-[2.5]" />
              <span>{t.gridTitle}</span>
            </p>

            <div className="flex gap-1.5 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/30 border-2 border-slate-200 dark:border-slate-800 justify-center overflow-x-auto">
              <div className="grid grid-rows-5 gap-1.5">
                {matrixValues.map((row, rIdx) => (
                  <div key={rIdx} className="flex gap-1.5">
                    {row.map((val, cIdx) => (
                      <div
                        id={`git-cell-${rIdx}-${cIdx}`}
                        key={cIdx}
                        className={`w-3.5 h-3.5 rounded-sm ${getGlowColor(val)} hover:scale-110 hover:shadow-sm transition-all cursor-pointer`}
                        title={`${val * 3} commits`}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* Contribution legend */}
            <div className="flex justify-end gap-1.5 text-[9px] font-mono font-black text-slate-400 uppercase tracking-wider items-center">
              <span>Menos</span>
              <div className="w-3 h-3 rounded-sm bg-slate-150 dark:bg-slate-800" />
              <div className="w-3 h-3 rounded-sm bg-[#58CC02]/20" />
              <div className="w-3 h-3 rounded-sm bg-[#58CC02]/50" />
              <div className="w-3 h-3 rounded-sm bg-[#58CC02]" />
              <div className="w-3 h-3 rounded-sm bg-emerald-600" />
              <span>Mais</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
