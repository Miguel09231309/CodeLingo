import React from 'react';
import { Users, Swords, Trophy, Clock, Brain, User, RefreshCw, ChevronRight, Zap, CheckCircle, XCircle } from 'lucide-react';
import { Language, UserProgress } from '../types';
import { sfx } from '../utils/audio';

interface DuelingProps {
  lang: Language;
  progress: UserProgress;
  onWinDuel: (xpReward: number) => void;
}

interface Rival {
  id: string;
  name: string;
  avatar: string;
  status: 'online' | 'offline' | 'busy';
  level: number;
}

export default function Dueling({ lang, progress, onWinDuel }: DuelingProps) {
  const [matchState, setMatchState] = React.useState<'lobby' | 'searching' | 'playing' | 'ended'>('lobby');
  const [selectedRival, setSelectedRival] = React.useState<Rival | null>(null);
  const [currentQuestionIdx, setCurrentQuestionIdx] = React.useState(0);
  const [userScore, setUserScore] = React.useState(0);
  const [rivalProgress, setRivalProgress] = React.useState(0); // 0 to 100%
  const [selectedAnswer, setSelectedAnswer] = React.useState<string | null>(null);
  const [timer, setTimer] = React.useState(15);
  const [duelSubject, setDuelSubject] = React.useState<'html' | 'python' | 'javascript'>('javascript');

  const friends: Rival[] = [
    { id: 'f-1', name: 'Gabs_Dev', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop', status: 'online', level: 4 },
    { id: 'f-2', name: 'Hugo_Vader', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop', status: 'online', level: 3 },
    { id: 'f-3', name: 'Clara_Codes', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop', status: 'offline', level: 5 }
  ];

  const duelQuestions = {
    html: [
      { q: 'Qual tag cria uma caixa de texto para entrada?', o: ['<input type="text">', '<textbox>', '<textarea>', '<input text>'], a: '<input type="text">' },
      { q: 'O que o atributo target="_blank" faz?', o: ['Abre link em nova aba', 'Abre link na mesma aba', 'Deixa o link em branco', 'Faz download do link'], a: 'Abre link em nova aba' },
      { q: 'Qual tag representa o rodapé da página?', o: ['<footer>', '<bottom>', '<end>', '<aside>'], a: '<footer>' }
    ],
    python: [
      { q: 'Qual o resultado de 2 ** 3 em Python?', o: ['8', '6', '9', '5'], a: '8' },
      { q: 'Qual destas estruturas é mutável?', o: ['Lista', 'Tupla', 'String', 'Inteiro'], a: 'Lista' },
      { q: 'Como definimos uma função em Python?', o: ['def minha_funcao():', 'function minha_funcao()', 'func minha_funcao()', 'def minha_funcao{}'], a: 'def minha_funcao():' }
    ],
    javascript: [
      { q: 'Qual é o resultado de typeof NaN?', o: ['number', 'undefined', 'object', 'string'], a: 'number' },
      { q: 'Qual operador compara valor e tipo?', o: ['===', '==', '=', '!='], a: '===' },
      { q: 'Qual método remove o último item de um array?', o: ['pop()', 'push()', 'shift()', 'remove()'], a: 'pop()' }
    ]
  };

  const currentQuestions = duelQuestions[duelSubject];
  const currentQ = currentQuestions[currentQuestionIdx];

  const t = {
    quickTitle: lang === 'pt' ? 'Desafios 1v1 Rápidos' : 'Quick 1v1 Duels',
    chooseFriend: lang === 'pt' ? 'Desafie um Amigo Online' : 'Challenge an Online Friend',
    searchMatch: lang === 'pt' ? 'Fila de Partida Rápida' : 'Quick Matchmaking Queue',
    subject: lang === 'pt' ? 'Matéria do Duelo' : 'Duel Subject',
    finding: lang === 'pt' ? 'Encontrando rival adequado...' : 'Finding suitable rival...',
    victory: lang === 'pt' ? 'Vitória Fantástica!' : 'Fantastic Victory!',
    defeat: lang === 'pt' ? 'Não foi dessa vez!' : 'Better luck next time!',
    vs: lang === 'pt' ? 'CONTRA' : 'VS',
    solved: lang === 'pt' ? 'resolvido' : 'solved',
    points: lang === 'pt' ? 'acertos' : 'correct',
    quit: lang === 'pt' ? 'Sair do Duelo' : 'Exit Duel',
    searchingSub: lang === 'pt' ? 'Aguardando oponente aceitar o convite...' : 'Awaiting opponent to accept invitation...'
  };

  // Timer countdown hook during duel play
  React.useEffect(() => {
    if (matchState !== 'playing') return;
    if (timer <= 0) {
      handleAnswer(''); // Treat timeout as wrong answer
      return;
    }
    const id = setInterval(() => setTimer(prev => prev - 1), 1000);
    return () => clearInterval(id);
  }, [timer, matchState]);

  // Simulate rival typing progress incrementally
  React.useEffect(() => {
    if (matchState !== 'playing') return;
    const interval = setInterval(() => {
      setRivalProgress(prev => {
        const next = prev + Math.floor(Math.random() * 8) + 2;
        return next >= 100 ? 100 : next;
      });
    }, 1200);
    return () => clearInterval(interval);
  }, [matchState]);

  const startQueue = (rival: Rival) => {
    setSelectedRival(rival);
    setMatchState('searching');
    setTimeout(() => {
      setMatchState('playing');
      setCurrentQuestionIdx(0);
      setUserScore(0);
      setRivalProgress(0);
      setTimer(15);
      setSelectedAnswer(null);
    }, 2000);
  };

  const handleAnswer = (ans: string) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(ans);
    const isCorrect = ans === currentQ.a;
    if (isCorrect) {
      setUserScore(prev => prev + 1);
      sfx.playSuccess();
    } else {
      sfx.playFailure();
    }

    // Delay and advance
    setTimeout(() => {
      if (currentQuestionIdx + 1 < currentQuestions.length) {
        setCurrentQuestionIdx(prev => prev + 1);
        setTimer(15);
        setSelectedAnswer(null);
      } else {
        setMatchState('ended');
        // Handle XP reward if victorious
        const isWin = userScore + (isCorrect ? 1 : 0) >= 2;
        if (isWin) {
          sfx.playLevelUp();
          onWinDuel(100); // 100 XP bonus
        }
      }
    }, 1500);
  };

  return (
    <div className="space-y-6 pb-10">
      
      {matchState === 'lobby' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main matchmaking selection column */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-[#58CC02] text-white rounded-3xl p-6 relative overflow-hidden border-2 border-slate-200 dark:border-slate-800 border-b-8 shadow-md">
              <div className="absolute right-[-10px] bottom-[-10px] opacity-10">
                <Swords className="w-40 h-40" />
              </div>
              <div className="relative z-10 space-y-3">
                <span className="bg-white/20 text-3xs font-black px-2.5 py-1 rounded-full uppercase tracking-widest font-mono">
                  Arena de Desafios
                </span>
                <h2 className="text-2xl font-black uppercase tracking-tight">
                  {t.quickTitle}
                </h2>
                <p className="text-white/90 text-xs font-bold leading-relaxed max-w-md">
                  Duele com amigos ou programadores em tempo real para ver quem resolve os códigos mais rápido! Ganhe +100 XP por vitória.
                </p>
              </div>
            </div>

            {/* Duel Subject Selector */}
            <div className="bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-4 border-b-4">
              <h3 className="font-black text-xs text-slate-800 dark:text-white flex items-center gap-2 uppercase tracking-wider">
                <Brain className="w-4.5 h-4.5 text-[#58CC02] stroke-[2.5]" />
                <span>{t.subject}</span>
              </h3>
              
              <div className="flex gap-2">
                {(['html', 'python', 'javascript'] as const).map((subject) => {
                  const isActive = duelSubject === subject;
                  return (
                    <button
                      id={`duel-subj-${subject}`}
                      key={subject}
                      onClick={() => setDuelSubject(subject)}
                      className={`flex-1 py-3 text-center text-xs font-black rounded-xl border-2 border-b-4 active:translate-y-[2px] active:border-b-2 transition-all uppercase tracking-wider cursor-pointer ${
                        isActive
                          ? 'border-[#58CC02] bg-[#58CC02]/10 text-[#58CC02]'
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {subject}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Friend Challenge Directory */}
            <div className="bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-4 border-b-4">
              <h3 className="font-black text-xs text-slate-800 dark:text-white flex items-center gap-2 uppercase tracking-wider">
                <Users className="w-4.5 h-4.5 text-[#58CC02] stroke-[2.5]" />
                <span>{t.chooseFriend}</span>
              </h3>

              <div className="divide-y-2 divide-slate-100 dark:divide-slate-800/80">
                {friends.map((friend) => {
                  const isOnline = friend.status === 'online';
                  return (
                    <div key={friend.id} className="flex items-center justify-between py-3.5 first:pt-0 last:pb-0">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <img src={friend.avatar} alt={friend.name} className="w-10 h-10 rounded-full object-cover border-2 border-slate-200 dark:border-slate-800" />
                          <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white dark:border-slate-900 ${
                            isOnline ? 'bg-[#58CC02]' : 'bg-slate-400'
                          }`} />
                        </div>
                        <div>
                          <p className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-tight">@{friend.name}</p>
                          <p className="text-3xs font-mono font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Nível {friend.level}</p>
                        </div>
                      </div>

                      <button
                        id={`btn-challenge-${friend.id}`}
                        disabled={!isOnline}
                        onClick={() => startQueue(friend)}
                        className={`px-4 py-2 text-3xs font-black rounded-xl flex items-center gap-1.5 transition-all uppercase tracking-wider cursor-pointer border-b-4 ${
                          isOnline
                            ? 'bg-[#58CC02] text-white hover:bg-emerald-500 border-emerald-700 active:border-b-0 active:translate-y-[4px]'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-750 cursor-not-allowed'
                        }`}
                      >
                        <Swords className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span>Desafiar</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Leaderboard stats summary widget column */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-4 border-b-4">
              <div className="flex items-center gap-2.5 text-slate-800 dark:text-white font-black text-sm uppercase tracking-wider">
                <Trophy className="w-5 h-5 text-amber-500 stroke-[2.5]" />
                <h3>Estatísticas</h3>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 text-center space-y-1.5 border-2 border-slate-200 dark:border-slate-800">
                <span className="text-3xs text-slate-400 dark:text-slate-500 font-mono uppercase tracking-widest font-black">Histórico de vitórias</span>
                <p className="text-3xl font-black text-slate-800 dark:text-white uppercase tracking-tight">
                  {progress.unlockedAchievements.includes('ach-5') ? '1' : '0'} <span className="text-xs font-black text-slate-400 uppercase">Vitórias</span>
                </p>
                <div className="pt-2 border-t-2 border-slate-200/50 dark:border-slate-800 text-3xs text-slate-400 dark:text-slate-500 font-black uppercase tracking-wider leading-relaxed">
                  Pratique diariamente para dominar os duelos de velocidade!
                </div>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* Matchmaking/Searching Loading Panel */}
      {matchState === 'searching' && (
        <div className="max-w-md mx-auto bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-3xl p-8 text-center space-y-6 shadow-xl border-b-8">
          <div className="w-20 h-20 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-[#58CC02] flex items-center justify-center mx-auto shadow-md border-2 border-[#58CC02]/20">
            <RefreshCw className="w-10 h-10 animate-spin stroke-[3]" />
          </div>
          <div className="space-y-2">
            <h3 className="font-black text-lg text-slate-800 dark:text-white uppercase tracking-tight">{t.finding}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">{t.searchingSub}</p>
          </div>
          {selectedRival && (
            <div className="flex items-center justify-center gap-4 pt-4 border-t-2 border-slate-100 dark:border-slate-800">
              <div className="text-center">
                <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop" alt="User" className="w-12 h-12 rounded-full border-2 border-slate-200 dark:border-slate-800" />
                <p className="text-3xs font-black text-slate-500 mt-1 uppercase tracking-widest">Você</p>
              </div>
              <span className="font-mono text-xs text-slate-300 font-black">VS</span>
              <div className="text-center">
                <img src={selectedRival.avatar} alt={selectedRival.name} className="w-12 h-12 rounded-full border border-slate-200" />
                <p className="text-3xs font-black text-[#58CC02] mt-1 uppercase tracking-widest">@{selectedRival.name}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Active gameplay arena */}
      {matchState === 'playing' && selectedRival && (
        <div className="max-w-2xl mx-auto bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-2xl border-b-8">
          
          {/* Match header dashboard */}
          <div className="bg-slate-50 dark:bg-slate-800/60 p-4 border-b-2 border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4">
            
            {/* User score / lives indicator */}
            <div className="flex items-center gap-2.5">
              <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop" alt="Me" className="w-8 h-8 rounded-full border-2 border-slate-200" />
              <div className="text-left">
                <span className="text-3xs font-mono text-slate-400 dark:text-slate-500 font-black uppercase tracking-wider">Você</span>
                <p className="text-xs font-black text-[#58CC02] uppercase tracking-tight">{userScore} {t.points}</p>
              </div>
            </div>

            {/* Countdown circular stopwatch */}
            <div className="flex items-center gap-1.5 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 px-3.5 py-1.5 rounded-full text-xs font-mono font-black text-slate-700 dark:text-slate-300">
              <Clock className={`w-4.5 h-4.5 stroke-[2.5] ${timer < 5 ? 'text-rose-500 animate-pulse' : 'text-slate-400'}`} />
              <span className={timer < 5 ? 'text-rose-500' : ''}>{timer}s</span>
            </div>

            {/* Opponent live progress bar simulation */}
            <div className="flex items-center gap-2.5 text-right">
              <div className="text-right">
                <span className="text-3xs font-mono text-[#58CC02] font-black uppercase tracking-wider">@{selectedRival.name}</span>
                <p className="text-xs font-black text-slate-400 dark:text-slate-500 font-mono">
                  {rivalProgress === 100 ? 'Pronto' : `${rivalProgress}%`}
                </p>
              </div>
              <img src={selectedRival.avatar} alt="Rival" className="w-8 h-8 rounded-full border-2 border-[#58CC02]" />
            </div>

          </div>

          {/* Opponent's relative progress row indicator */}
          <div className="w-full bg-slate-200 dark:bg-slate-800 h-2.5 overflow-hidden border-b border-slate-250 dark:border-slate-800">
            <div className="bg-amber-400 h-full transition-all duration-300" style={{ width: `${rivalProgress}%` }} />
          </div>

          {/* Active duel questions panel */}
          <div className="p-6 md:p-8 space-y-6">
            <div className="space-y-1">
              <span className="text-3xs font-mono font-black text-[#58CC02] uppercase tracking-widest">Questão {currentQuestionIdx + 1}/3</span>
              <h3 className="text-base md:text-lg font-black text-slate-800 dark:text-white leading-relaxed uppercase tracking-tight">
                {currentQ.q}
              </h3>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {currentQ.o.map((opt, idx) => {
                const isSelected = selectedAnswer === opt;
                const isCorrectAns = opt === currentQ.a;
                const showSuccess = selectedAnswer !== null && isCorrectAns;
                const showFail = selectedAnswer === opt && !isCorrectAns;

                return (
                  <button
                    id={`duel-ans-${idx}`}
                    key={opt}
                    disabled={selectedAnswer !== null}
                    onClick={() => handleAnswer(opt)}
                    className={`w-full text-left p-4 rounded-2xl border-2 border-b-4 active:translate-y-[2px] active:border-b-2 text-xs md:text-sm font-black uppercase tracking-tight flex items-center justify-between transition-all cursor-pointer ${
                      showSuccess
                        ? 'border-[#58CC02] bg-[#58CC02]/10 text-[#58CC02]'
                        : showFail
                          ? 'border-rose-500 bg-rose-500/10 text-rose-600 dark:text-rose-400'
                          : isSelected
                            ? 'border-emerald-500 bg-[#58CC02]/5 text-[#58CC02]'
                            : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <span>{opt}</span>
                    {selectedAnswer !== null && isCorrectAns && <CheckCircle className="w-5 h-5 text-[#58CC02] stroke-[2.5]" />}
                    {selectedAnswer !== null && !isCorrectAns && isSelected && <XCircle className="w-5 h-5 text-rose-500 stroke-[2.5]" />}
                  </button>
                );
              })}
            </div>
          </div>

        </div>
      )}

      {/* Duel Completed / Score Summary Panel */}
      {matchState === 'ended' && selectedRival && (
        <div className="max-w-md mx-auto bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-3xl p-8 text-center space-y-6 shadow-xl border-b-8">
          {userScore >= 2 ? (
            <div className="w-24 h-24 rounded-full bg-[#58CC02] text-white flex items-center justify-center mx-auto shadow-xl border-2 border-white dark:border-slate-950 animate-bounce">
              <Trophy className="w-12 h-12 stroke-[2.5]" />
            </div>
          ) : (
            <div className="w-24 h-24 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 flex items-center justify-center mx-auto border-2 border-slate-200">
              <Swords className="w-10 h-10 stroke-[2.5]" />
            </div>
          )}

          <div className="space-y-1">
            <h2 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight">
              {userScore >= 2 ? t.victory : t.defeat}
            </h2>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">
              Duelo disputado em {duelSubject.toUpperCase()} contra @{selectedRival.name}
            </p>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/40 rounded-2xl p-4 flex justify-around items-center border-2 border-slate-200 dark:border-slate-800">
            <div className="text-center">
              <span className="text-3xs font-mono text-slate-400 uppercase tracking-wider font-black">Seu Placar</span>
              <p className="text-lg font-black text-slate-800 dark:text-white">{userScore} / 3</p>
            </div>
            <div className="w-1 bg-slate-200 dark:bg-slate-800 h-8 rounded-full" />
            <div className="text-center">
              <span className="text-3xs font-mono text-slate-400 uppercase tracking-wider font-black">Rival</span>
              <p className="text-lg font-black text-slate-800 dark:text-white">
                {rivalProgress >= 90 ? '2' : '1'} / 3
              </p>
            </div>
          </div>

          {userScore >= 2 && (
            <div className="bg-[#58CC02]/10 border-2 border-[#58CC02]/25 text-[#58CC02] p-3 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 uppercase tracking-wide">
              <Zap className="w-4 h-4 text-amber-500 fill-current" />
              <span>BÔNUS CONQUISTADO: +100 XP adicionados!</span>
            </div>
          )}

          <button
            id="exit-duel-btn"
            onClick={() => setMatchState('lobby')}
            className="w-full py-4 bg-[#58CC02] hover:bg-emerald-500 text-white font-black rounded-2xl border-b-4 border-emerald-700 active:border-b-0 active:translate-y-[4px] uppercase tracking-widest shadow-lg transition-all cursor-pointer"
          >
            {t.quit}
          </button>
        </div>
      )}

    </div>
  );
}
