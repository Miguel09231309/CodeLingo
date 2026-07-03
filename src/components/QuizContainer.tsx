import React from 'react';
import { 
  X, 
  Heart, 
  HelpCircle, 
  CheckCircle, 
  AlertTriangle, 
  Award, 
  Sparkles, 
  CornerDownRight, 
  ArrowRight,
  RefreshCw,
  Info
} from 'lucide-react';
import { Lesson, Exercise, Language } from '../types';
import { sfx } from '../utils/audio';

interface QuizContainerProps {
  lesson: Lesson;
  lang: Language;
  onClose: () => void;
  onFinish: (xpEarned: number, livesLost: number, didPass: boolean) => void;
}

export default function QuizContainer({
  lesson,
  lang,
  onClose,
  onFinish
}: QuizContainerProps) {
  const [currentIdx, setCurrentIdx] = React.useState(0);
  const [selectedOption, setSelectedOption] = React.useState<string | null>(null);
  const [orderedList, setOrderedList] = React.useState<string[]>([]);
  const [lives, setLives] = React.useState(5);
  const [hasChecked, setHasChecked] = React.useState(false);
  const [isCorrect, setIsCorrect] = React.useState(false);
  const [quizState, setQuizState] = React.useState<'playing' | 'completed' | 'failed'>('playing');
  const [xpEarned, setXpEarned] = React.useState(0);

  const exercises = lesson.exercises;
  const currentExercise = exercises[currentIdx];

  const t = {
    check: lang === 'pt' ? 'Verificar' : 'Verify',
    continue: lang === 'pt' ? 'Continuar' : 'Continue',
    wrongAnswer: lang === 'pt' ? 'Resposta incorreta' : 'Incorrect answer',
    correctAnswer: lang === 'pt' ? 'Excelente! Resposta Correta' : 'Excellent! Correct answer',
    solution: lang === 'pt' ? 'Solução' : 'Solution',
    hint: lang === 'pt' ? 'Dica de Ajuda' : 'Helpful Hint',
    failedTitle: lang === 'pt' ? 'Sem vidas restantes!' : 'No lives left!',
    failedSub: lang === 'pt' ? 'Não se preocupe! Recarregue suas energias ou compre vidas extras para tentar de novo.' : 'Don\'t worry! Recharge your hearts or buy extra lives to try again.',
    congrats: lang === 'pt' ? 'Parabéns!' : 'Congratulations!',
    lessonCompleted: lang === 'pt' ? 'Lição concluída com sucesso!' : 'Lesson successfully completed!',
    backToPath: lang === 'pt' ? 'Voltar à Jornada' : 'Back to Journey',
    tryAgain: lang === 'pt' ? 'Tentar Novamente' : 'Try Again',
    dragOrder: lang === 'pt' ? 'Clique nos blocos abaixo para ordená-los:' : 'Click the blocks below to order them:',
    yourCodeOrder: lang === 'pt' ? 'Sua sequência:' : 'Your sequence:',
    heartsLeft: lang === 'pt' ? 'vidas restantes' : 'lives remaining'
  };

  // Reset answer states when question changes
  React.useEffect(() => {
    setSelectedOption(null);
    setOrderedList([]);
    setHasChecked(false);
    setIsCorrect(false);
  }, [currentIdx]);

  if (!currentExercise) return null;

  const handleOptionSelect = (option: string) => {
    if (hasChecked) return;
    setSelectedOption(option);
  };

  const handleOrderToggle = (option: string) => {
    if (hasChecked) return;
    if (orderedList.includes(option)) {
      setOrderedList(orderedList.filter(o => o !== option));
    } else {
      setOrderedList([...orderedList, option]);
    }
  };

  const handleCheck = () => {
    if (hasChecked) return;

    let correct = false;
    if (currentExercise.type === 'multiple-choice' || currentExercise.type === 'fill-blank') {
      correct = selectedOption === currentExercise.correctAnswer;
    } else if (currentExercise.type === 'order-code') {
      const formattedAnswer = orderedList.join('|');
      correct = formattedAnswer === currentExercise.correctAnswer;
    }

    setIsCorrect(correct);
    setHasChecked(true);

    if (correct) {
      sfx.playSuccess();
      setXpEarned(prev => prev + 10);
    } else {
      sfx.playFailure();
      const nextLives = lives - 1;
      setLives(nextLives);
      if (nextLives <= 0) {
        setQuizState('failed');
      }
    }
  };

  const handleContinue = () => {
    if (currentIdx + 1 < exercises.length) {
      setCurrentIdx(currentIdx + 1);
    } else {
      sfx.playLevelUp();
      setQuizState('completed');
    }
  };

  const handleCloseQuiz = () => {
    if (quizState === 'completed') {
      onFinish(xpEarned + lesson.xpReward, 5 - lives, true);
    } else if (quizState === 'failed') {
      onFinish(Math.round(xpEarned / 2), 5, false);
    } else {
      // Exit early
      onClose();
    }
  };

  const progressPct = ((currentIdx) / exercises.length) * 100;

  return (
    <div className="fixed inset-0 bg-white dark:bg-slate-950 z-50 flex flex-col justify-between transition-colors duration-300">
      
      {/* Quiz Progress Header */}
      <header className="p-4 border-b border-slate-100 dark:border-slate-900 flex items-center justify-between max-w-4xl w-full mx-auto">
        <button 
          id="close-quiz-btn"
          onClick={handleCloseQuiz}
          className="text-slate-400 dark:text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 p-2 rounded-full transition-all hover:scale-110"
        >
          <X className="w-6 h-6 stroke-[2.5]" />
        </button>

        {/* Progress Bar Container */}
        <div className="flex-1 mx-4 max-w-lg bg-slate-100 dark:bg-slate-800 h-4 rounded-full overflow-hidden border border-slate-200/50 dark:border-slate-800">
          <div 
            className="bg-[#58CC02] h-full rounded-full transition-all duration-300"
            style={{ width: `${quizState === 'completed' ? 100 : progressPct}%` }}
          />
        </div>

        {/* Hearts and XP Trackers */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-rose-500 font-black">
            <Heart className="w-5 h-5 fill-current animate-pulse" />
            <span className="text-sm font-mono">{lives}</span>
          </div>
        </div>
      </header>

      {/* Main Gameplay Screen */}
      <main className="flex-1 overflow-y-auto px-4 py-8 flex flex-col items-center justify-center max-w-2xl w-full mx-auto">
        
        {quizState === 'playing' && (
          <div className="w-full space-y-6">
            
            {/* Question prompt header */}
            <div className="space-y-2">
              <span className="text-3xs font-mono font-extrabold uppercase bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 px-2.5 py-1 rounded-full">
                {currentExercise.type.replace('-', ' ')}
              </span>
              <h2 className="text-lg md:text-xl font-extrabold text-slate-800 dark:text-white leading-relaxed">
                {currentExercise.question[lang]}
              </h2>
            </div>

            {/* Code Snippet Box (if configured) */}
            {currentExercise.codeSnippet && (
              <div className="bg-slate-900 dark:bg-black rounded-2xl p-4 md:p-5 border border-slate-800 font-mono text-xs md:text-sm text-slate-200 shadow-lg relative overflow-hidden">
                <div className="flex items-center gap-1.5 border-b border-slate-800 pb-2 mb-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                </div>
                
                <pre className="whitespace-pre-wrap leading-relaxed select-all">
                  {currentExercise.codeSnippet.split('___1').map((part, index, arr) => (
                    <React.Fragment key={index}>
                      {part}
                      {index < arr.length - 1 && (
                        <span className={`inline-block mx-1 px-3 py-0.5 rounded border-2 font-bold font-sans ${
                          selectedOption 
                            ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' 
                            : 'bg-slate-800 border-dashed border-slate-500 text-slate-400 animate-pulse'
                        }`}>
                          {selectedOption || '___'}
                        </span>
                      )}
                    </React.Fragment>
                  ))}
                </pre>
              </div>
            )}

            {/* Multiple Choice Panel */}
            {currentExercise.type === 'multiple-choice' && (
              <div className="grid grid-cols-1 gap-3.5">
                {currentExercise.options.map((opt, i) => {
                  const isSelected = selectedOption === opt;
                  return (
                    <button
                      id={`quiz-opt-${i}`}
                      key={opt}
                      disabled={hasChecked}
                      onClick={() => handleOptionSelect(opt)}
                      className={`w-full text-left px-5 py-4 rounded-2xl border-2 font-black text-sm flex items-center justify-between transition-all border-b-4 active:translate-y-[2px] active:border-b-2 cursor-pointer ${
                        isSelected
                          ? 'border-[#58CC02] bg-[#58CC02]/5 text-[#58CC02] border-b-[#46a302]'
                          : 'border-slate-200 dark:border-slate-800 border-b-slate-300 dark:border-b-slate-950 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                      }`}
                    >
                      <span className="uppercase tracking-wide">{opt}</span>
                      <span className="text-2xs font-mono font-black px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-850 text-slate-400">
                        {i + 1}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Fill in the Blank Options Block */}
            {currentExercise.type === 'fill-blank' && (
              <div className="flex flex-wrap gap-3.5 justify-center pt-4">
                {currentExercise.options.map((opt, i) => {
                  const isSelected = selectedOption === opt;
                  return (
                    <button
                      id={`quiz-blank-${i}`}
                      key={opt}
                      disabled={hasChecked}
                      onClick={() => handleOptionSelect(opt)}
                      className={`px-6 py-3.5 rounded-2xl border-2 font-black text-sm transition-all border-b-4 active:translate-y-[2px] active:border-b-2 cursor-pointer ${
                        isSelected
                          ? 'border-[#58CC02] bg-[#58CC02]/10 text-[#58CC02] border-b-[#46a302]'
                          : 'border-slate-200 dark:border-slate-800 border-b-slate-300 dark:border-b-slate-950 bg-slate-50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Drag & Drop Code ordering selection */}
            {currentExercise.type === 'order-code' && (
              <div className="space-y-4">
                <p className="text-xs text-slate-400 dark:text-slate-500 font-bold">{t.dragOrder}</p>
                
                {/* Active selection sequence container */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 min-h-24 space-y-2">
                  <p className="text-3xs text-slate-400 font-mono uppercase tracking-wider">{t.yourCodeOrder}</p>
                  {orderedList.length === 0 ? (
                    <div className="text-xs text-slate-400 dark:text-slate-600 italic py-4">Nenhum bloco selecionado ainda...</div>
                  ) : (
                    <div className="flex flex-col gap-2">
                      {orderedList.map((item, idx) => (
                        <div key={item} className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-2.5 text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                          <CornerDownRight className="w-3.5 h-3.5" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Available word/block bank */}
                <div className="flex flex-wrap gap-2 pt-2">
                  {currentExercise.options.map((opt, i) => {
                    const isSelected = orderedList.includes(opt);
                    return (
                      <button
                        id={`quiz-order-${i}`}
                        key={opt}
                        disabled={hasChecked}
                        onClick={() => handleOrderToggle(opt)}
                        className={`px-4 py-2.5 rounded-xl border font-mono text-xs font-bold transition-all ${
                          isSelected
                            ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 border-dashed border-slate-300 scale-95 opacity-50'
                            : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:scale-102 hover:border-slate-300 active:scale-98'
                        }`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Interactive Hint Panel toggled via clickable label */}
            <div className="flex gap-2 p-3.5 rounded-2xl bg-amber-500/5 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs mt-4">
              <Info className="w-4 h-4 shrink-0" />
              <div className="space-y-0.5">
                <span className="font-extrabold uppercase tracking-wide text-3xs">{t.hint}</span>
                <p>{currentExercise.hint[lang]}</p>
              </div>
            </div>

          </div>
        )}

        {/* Failed Game Screen */}
        {quizState === 'failed' && (
          <div className="text-center space-y-6 max-w-md">
            <div className="w-24 h-24 rounded-full bg-rose-100 dark:bg-rose-950/40 text-rose-500 flex items-center justify-center mx-auto shadow-lg shadow-rose-500/10 animate-bounce">
              <AlertTriangle className="w-12 h-12" />
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-extrabold text-slate-800 dark:text-white">{t.failedTitle}</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{t.failedSub}</p>
            </div>
            <div className="pt-4 flex flex-col sm:flex-row gap-3">
              <button 
                id="retry-quiz-btn"
                onClick={() => {
                  setLives(5);
                  setCurrentIdx(0);
                  setQuizState('playing');
                }}
                className="flex-1 py-3 px-6 bg-rose-500 hover:bg-rose-600 text-white font-extrabold rounded-2xl shadow-lg shadow-rose-500/20 transition-all flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>{t.tryAgain}</span>
              </button>
              <button 
                id="quit-failed-quiz-btn"
                onClick={handleCloseQuiz}
                className="flex-1 py-3 px-6 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-extrabold rounded-2xl transition-all"
              >
                {t.backToPath}
              </button>
            </div>
          </div>
        )}

        {/* Completed Game Screen */}
        {quizState === 'completed' && (
          <div className="text-center space-y-6 max-w-md">
            <div className="w-24 h-24 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/30 relative">
              <Award className="w-12 h-12" />
              <span className="absolute -top-1 -right-1 bg-amber-400 text-slate-900 w-7 h-7 rounded-full flex items-center justify-center text-xs font-black border-2 border-white dark:border-slate-950">
                <Sparkles className="w-3.5 h-3.5 fill-current" />
              </span>
            </div>
            
            <div className="space-y-2">
              <span className="text-2xs font-mono font-extrabold tracking-widest text-emerald-500 uppercase">{t.congrats}</span>
              <h1 className="text-2xl font-extrabold text-slate-800 dark:text-white">{t.lessonCompleted}</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Você conquistou novas habilidades práticas em {lesson.subject.toUpperCase()}!
              </p>
            </div>

            {/* Scorecard Widget */}
            <div className="bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-4 flex justify-around gap-4 shadow-sm">
              <div className="text-center">
                <span className="text-2xs text-slate-400 dark:text-slate-500 font-mono uppercase">XP Ganho</span>
                <p className="text-xl font-extrabold text-emerald-500">+{xpEarned + lesson.xpReward}</p>
              </div>
              <div className="w-px bg-slate-200 dark:bg-slate-800 h-10 align-middle self-center" />
              <div className="text-center">
                <span className="text-2xs text-slate-400 dark:text-slate-500 font-mono uppercase">Vidas Salvas</span>
                <p className="text-xl font-extrabold text-rose-500">{lives}/5</p>
              </div>
              <div className="w-px bg-slate-200 dark:bg-slate-800 h-10 align-middle self-center" />
              <div className="text-center">
                <span className="text-2xs text-slate-400 dark:text-slate-500 font-mono uppercase">Ofensiva</span>
                <p className="text-xl font-extrabold text-amber-500">+1 Dia</p>
              </div>
            </div>

            <button 
              id="finish-quiz-btn"
              onClick={handleCloseQuiz}
              className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold rounded-2xl shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
            >
              <span>{t.backToPath}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </main>

      {/* Answer Verification Action Bar */}
      {quizState === 'playing' && (
        <footer className={`p-4 border-t-2 border-slate-200 dark:border-slate-850 transition-all ${
          hasChecked 
            ? isCorrect 
              ? 'bg-[#58CC02]/10 dark:bg-emerald-950/20 border-[#58CC02]/20' 
              : 'bg-rose-500/10 dark:bg-rose-950/20 border-rose-500/20'
            : 'bg-white dark:bg-slate-950'
        }`}>
          <div className="max-w-xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            
            {/* Feedback Message Info */}
            <div className="flex items-center gap-3 w-full sm:w-auto">
              {hasChecked && (
                <>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border-b-2 ${
                    isCorrect ? 'bg-[#58CC02] border-emerald-700 text-white' : 'bg-rose-500 border-rose-700 text-white'
                  }`}>
                    {isCorrect ? <CheckCircle className="w-5 h-5 stroke-[2.5]" /> : <AlertTriangle className="w-5 h-5 stroke-[2.5]" />}
                  </div>
                  <div className="min-w-0">
                    <p className={`font-black text-sm uppercase tracking-tight ${isCorrect ? 'text-[#58CC02] dark:text-[#58CC02]' : 'text-rose-700 dark:text-rose-400'}`}>
                      {isCorrect ? t.correctAnswer : t.wrongAnswer}
                    </p>
                    {!isCorrect && (
                      <p className="text-2xs text-rose-600 dark:text-rose-500 font-mono font-bold uppercase tracking-wider">
                        {t.solution}: <b className="font-sans normal-case text-xs font-black">{currentExercise.correctAnswer.replace(/\|/g, ' ')}</b>
                      </p>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Verification / Progression button */}
            <button
              id="quiz-action-btn"
              disabled={
                (!selectedOption && currentExercise.type !== 'order-code') || 
                (currentExercise.type === 'order-code' && orderedList.length === 0)
              }
              onClick={hasChecked ? handleContinue : handleCheck}
              className={`w-full sm:w-48 py-3.5 rounded-2xl font-black text-sm shadow-md transition-all flex items-center justify-center gap-2 border-b-4 uppercase tracking-wider active:translate-y-[3px] active:border-b-0 cursor-pointer ${
                hasChecked
                  ? isCorrect
                    ? 'bg-[#58CC02] hover:bg-emerald-500 text-white border-emerald-700 shadow-[#58CC02]/15'
                    : 'bg-rose-500 hover:bg-rose-400 text-white border-rose-700 shadow-rose-500/15'
                  : 'bg-slate-900 hover:bg-black border-slate-950 dark:bg-[#58CC02] dark:hover:bg-emerald-500 dark:border-emerald-700 text-white disabled:opacity-30 disabled:pointer-events-none'
              }`}
            >
              <span>{hasChecked ? t.continue : t.check}</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>

          </div>
        </footer>
      )}

    </div>
  );
}
