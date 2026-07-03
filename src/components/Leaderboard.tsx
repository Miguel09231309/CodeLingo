import React from 'react';
import { Award, Shield, Sparkles, TrendingUp, Zap, HelpCircle } from 'lucide-react';
import { RankingUser, Language, UserProgress } from '../types';

interface LeaderboardProps {
  lang: Language;
  progress: UserProgress;
}

export default function Leaderboard({ lang, progress }: LeaderboardProps) {
  const [leagueType, setLeagueType] = React.useState<'weekly' | 'monthly'>('weekly');

  const t = {
    weekly: lang === 'pt' ? 'Liga Semanal' : 'Weekly League',
    monthly: lang === 'pt' ? 'Campeonato Mensal' : 'Monthly Championship',
    topStudents: lang === 'pt' ? 'Melhores Estudantes' : 'Top Code Learners',
    infoText: lang === 'pt' 
      ? 'Os rankings são atualizados em tempo real. Os 3 primeiros ganham bônus de XP!' 
      : 'Leaderboards are updated in real-time. Top 3 spots earn XP bonuses!',
    yourRank: lang === 'pt' ? 'Seu Posicionamento' : 'Your Position',
    remainTime: lang === 'pt' ? 'Tempo restante' : 'Time remaining',
    daysLeft: lang === 'pt' ? '2 dias restantes' : '2 days left',
    monthsLeft: lang === 'pt' ? '18 dias restantes' : '18 days left'
  };

  // Static/Rival ranking list + injection of current user's actual XP!
  const competitors: RankingUser[] = [
    { id: 'rival-1', username: 'Ana_Coders', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop', xp: 550, rank: 1 },
    { id: 'rival-2', username: 'Lucas_Py', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop', xp: 480, rank: 2 },
    { id: 'rival-3', username: 'Sofia_JS', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop', xp: 410, rank: 3 },
    { id: 'rival-4', username: 'Dev_Guga', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop', xp: 320, rank: 4 },
    { id: 'rival-5', username: 'Bia_CSS', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop', xp: 290, rank: 5 },
    { id: 'rival-6', username: 'JohnDoe', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop', xp: 210, rank: 6 },
  ];

  // Insert the logged in user based on current XP
  const currentUserObj: RankingUser = {
    id: 'current-user',
    username: progress.githubUsername ? progress.githubUsername : 'Você (Estudante)',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
    xp: progress.xp,
    rank: 1, // Will be calculated
    isCurrentUser: true
  };

  const allCompetitors = [...competitors];
  
  // Calculate appropriate league values
  const multiplier = leagueType === 'monthly' ? 2.5 : 1;
  allCompetitors.forEach(c => c.xp = Math.round(c.xp * multiplier));
  currentUserObj.xp = progress.xp; // User XP stays constant

  // Insert current user and sort
  const fullList = [...allCompetitors, currentUserObj].sort((a, b) => b.xp - a.xp);
  
  // Recalculate ranks
  fullList.forEach((u, index) => {
    u.rank = index + 1;
  });

  const podium = fullList.slice(0, 3);
  const remainingList = fullList.slice(3, 10);

  return (
    <div className="space-y-6 pb-10">
      
      {/* Header Info Block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-slate-800 dark:text-white tracking-tight flex items-center gap-2.5 uppercase">
            <Shield className="w-6 h-6 text-[#58CC02] fill-current" />
            <span>{t.topStudents}</span>
          </h2>
          <p className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">
            {t.infoText}
          </p>
        </div>

        {/* Weekly vs Monthly Toggle Button */}
        <div className="flex gap-1.5 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl border-2 border-slate-200 dark:border-slate-850 shadow-sm self-start sm:self-auto">
          <button
            id="league-weekly-btn"
            onClick={() => setLeagueType('weekly')}
            className={`px-4 py-2 text-xs font-black rounded-xl transition-all uppercase tracking-wider border-2 ${
              leagueType === 'weekly'
                ? 'bg-white dark:bg-slate-750 border-[#58CC02] text-[#58CC02] shadow-sm'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            {t.weekly}
          </button>
          <button
            id="league-monthly-btn"
            onClick={() => setLeagueType('monthly')}
            className={`px-4 py-2 text-xs font-black rounded-xl transition-all uppercase tracking-wider border-2 ${
              leagueType === 'monthly'
                ? 'bg-white dark:bg-slate-750 border-[#58CC02] text-[#58CC02] shadow-sm'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            {t.monthly}
          </button>
        </div>
      </div>

      {/* Podium Display (Rank 1, 2, 3) */}
      <div className="grid grid-cols-3 gap-3 md:gap-4 max-w-xl mx-auto pt-6 items-end">
        
        {/* Rank 2 (Left) */}
        {podium[1] && (
          <div className="flex flex-col items-center">
            <div className="relative group">
              <img 
                src={podium[1].avatar} 
                alt={podium[1].username}
                className="w-12 h-12 md:w-16 md:h-16 rounded-full object-cover border-4 border-slate-300 dark:border-slate-700 shadow-md"
              />
              <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 bg-slate-400 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-black border-2 border-white dark:border-slate-950 shadow">
                2
              </span>
            </div>
            <div className="text-center mt-3 w-full">
              <p className="text-xs font-black text-slate-700 dark:text-slate-300 truncate px-1 uppercase tracking-tight">
                {podium[1].username.split('_')[0]}
              </p>
              <span className="text-[10px] font-mono font-black text-slate-400 dark:text-slate-500 tracking-wider">
                {podium[1].xp} XP
              </span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-800 h-16 rounded-t-2xl mt-2 border-t-4 border-x-2 border-slate-300/60 dark:border-slate-700/60 shadow-inner" />
          </div>
        )}

        {/* Rank 1 (Center) */}
        {podium[0] && (
          <div className="flex flex-col items-center">
            <div className="relative group">
              <img 
                src={podium[0].avatar} 
                alt={podium[0].username}
                className="w-16 h-16 md:w-20 md:h-20 rounded-full object-cover border-4 border-amber-400 dark:border-amber-500 shadow-lg animate-pulse"
              />
              <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 bg-amber-400 text-slate-900 w-7 h-7 rounded-full flex items-center justify-center text-xs font-black border-2 border-white dark:border-slate-950 shadow">
                1
              </span>
              <span className="absolute -top-4.5 left-1/2 -translate-x-1/2 text-amber-500">
                <Sparkles className="w-5 h-5 fill-current animate-bounce text-amber-400" />
              </span>
            </div>
            <div className="text-center mt-3 w-full">
              <p className="text-xs md:text-sm font-black text-slate-800 dark:text-white truncate px-1 uppercase tracking-tight">
                {podium[0].username.split('_')[0]}
              </p>
              <span className="text-[10px] md:text-xs font-mono font-black text-amber-500 tracking-wider">
                {podium[0].xp} XP
              </span>
            </div>
            <div className="w-full bg-amber-500/10 dark:bg-amber-550/15 h-24 rounded-t-2xl mt-2 border-t-4 border-x-2 border-amber-400 shadow-inner" />
          </div>
        )}

        {/* Rank 3 (Right) */}
        {podium[2] && (
          <div className="flex flex-col items-center">
            <div className="relative group">
              <img 
                src={podium[2].avatar} 
                alt={podium[2].username}
                className="w-12 h-12 md:w-16 md:h-16 rounded-full object-cover border-4 border-amber-700/30 dark:border-amber-700/30 shadow-md"
              />
              <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 bg-amber-700 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-black border-2 border-white dark:border-slate-950 shadow">
                3
              </span>
            </div>
            <div className="text-center mt-3 w-full">
              <p className="text-xs font-black text-slate-700 dark:text-slate-300 truncate px-1 uppercase tracking-tight">
                {podium[2].username.split('_')[0]}
              </p>
              <span className="text-[10px] font-mono font-black text-slate-400 dark:text-slate-500 tracking-wider">
                {podium[2].xp} XP
              </span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-800 h-12 rounded-t-2xl mt-2 border-t-4 border-x-2 border-slate-300/60 dark:border-slate-700/60 shadow-inner" />
          </div>
        )}

      </div>

      {/* Ranks 4-10 Competitor List */}
      <div className="max-w-xl mx-auto space-y-3">
        
        {remainingList.map((user) => {
          const isMe = user.isCurrentUser;
          return (
            <div
              id={`rank-row-${user.id}`}
              key={user.id}
              className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all border-b-4 ${
                isMe
                  ? 'bg-[#58CC02]/5 border-[#58CC02] border-b-[#46a302] shadow-sm'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 border-b-slate-300 dark:border-b-slate-950'
              }`}
            >
              <div className="flex items-center gap-3.5">
                {/* Position Marker */}
                <span className={`w-6 text-center font-mono text-sm font-black ${
                  isMe ? 'text-[#58CC02]' : 'text-slate-400 dark:text-slate-600'
                }`}>
                  #{user.rank}
                </span>

                {/* Avatar Icon */}
                <img 
                  src={user.avatar} 
                  alt={user.username}
                  className="w-9 h-9 rounded-full object-cover border border-slate-200 dark:border-slate-850"
                />

                {/* Username label */}
                <div>
                  <p className={`text-xs font-black uppercase tracking-tight ${
                    isMe ? 'text-[#58CC02] dark:text-[#58CC02]' : 'text-slate-800 dark:text-slate-200'
                  }`}>
                    {user.username}
                  </p>
                  {isMe && (
                    <span className="text-3xs font-mono text-[#58CC02] uppercase tracking-widest font-black mt-0.5 block">
                      {t.yourRank}
                    </span>
                  )}
                </div>
              </div>

              {/* XP Stat detail */}
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-mono font-black text-slate-700 dark:text-slate-300">
                  {user.xp}
                </span>
                <span className="text-3xs text-[#58CC02] font-black uppercase tracking-widest">
                  XP
                </span>
              </div>
            </div>
          );
        })}

        {/* Interactive Competition countdown alert */}
        <div className="p-4 rounded-2xl bg-[#58CC02]/5 border-2 border-dashed border-[#58CC02]/30 flex items-center justify-between gap-4 mt-6">
          <div className="flex items-center gap-3.5">
            <Zap className="w-5 h-5 text-amber-500 animate-bounce stroke-[2.5]" />
            <div>
              <p className="text-xs font-black uppercase tracking-tight text-slate-800 dark:text-slate-200">
                {t.remainTime}: <span className="text-[#58CC02] font-mono">{leagueType === 'weekly' ? t.daysLeft : t.monthsLeft}</span>
              </p>
              <p className="text-3xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wide leading-relaxed mt-0.5">
                Estude diariamente para garantir sua posição na Liga de Bronze!
              </p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
