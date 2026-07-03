import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as ChartTooltip, 
  ResponsiveContainer 
} from 'recharts';
import { 
  Clock, 
  Calendar, 
  Target, 
  Download, 
  CheckSquare, 
  Sparkles, 
  FileSpreadsheet, 
  FileText,
  CalendarDays,
  Plus
} from 'lucide-react';
import { Language, UserProgress, CalendarEvent } from '../types';

interface StatsProps {
  lang: Language;
  progress: UserProgress;
  onChangeGoal: (goal: number) => void;
}

export default function Stats({ lang, progress, onChangeGoal }: StatsProps) {
  const [activeTab, setActiveTab] = React.useState<'overview' | 'calendar'>('overview');
  const [newEventTitle, setNewEventTitle] = React.useState('');
  const [newEventDate, setNewEventDate] = React.useState('');
  const [newEventTime, setNewEventTime] = React.useState('09:00');
  const [newEventSubject, setNewEventSubject] = React.useState<'html' | 'python' | 'javascript' | 'review'>('review');

  const [events, setEvents] = React.useState<CalendarEvent[]>([
    { id: 'ev-1', title: 'Revisar Tags HTML5', date: '2026-07-04', time: '14:00', subject: 'html' },
    { id: 'ev-2', title: 'Duelo com Hugo_Vader', date: '2026-07-05', time: '10:30', subject: 'review' },
    { id: 'ev-3', title: 'Dominar Arrays em JS', date: '2026-07-07', time: '18:00', subject: 'javascript' },
  ]);

  const t = {
    title: lang === 'pt' ? 'Painel de Desempenho' : 'Performance Dashboard',
    subtitle: lang === 'pt' ? 'Acompanhe seu progresso de estudo diário, ajuste metas e sincronize calendários.' : 'Track your daily study progress, adjust targets, and sync with external calendars.',
    studyTime: lang === 'pt' ? 'Tempo de Estudo Diário' : 'Daily Study Minutes',
    weeklyAvg: lang === 'pt' ? 'Média Semanal' : 'Weekly Average',
    minutes: lang === 'pt' ? 'minutos' : 'minutes',
    goals: lang === 'pt' ? 'Minhas Metas' : 'My Custom Targets',
    currentGoal: lang === 'pt' ? 'Meta Ativa' : 'Active Target',
    adjustGoal: lang === 'pt' ? 'Ajustar Meta Diária' : 'Adjust Daily Goal',
    export: lang === 'pt' ? 'Exportar Relatório' : 'Export Reports',
    exportCsv: lang === 'pt' ? 'Baixar Planilha CSV' : 'Download CSV Sheet',
    exportPdf: lang === 'pt' ? 'Baixar Relatório PDF' : 'Download PDF Report',
    calendarTitle: lang === 'pt' ? 'Organizador de Estudos' : 'Study Schedule Calendar',
    addEvent: lang === 'pt' ? 'Agendar Prática' : 'Schedule Practice Block',
    syncThirdParty: lang === 'pt' ? 'Sincronizar com Outros Calendários' : 'Sync with Productivity Calendars',
    googleCalendar: lang === 'pt' ? 'Sincronizar Google Calendar' : 'Sync Google Calendar',
    outlookCalendar: lang === 'pt' ? 'Sincronizar Outlook / Office 365' : 'Sync Microsoft Outlook',
    successMsg: lang === 'pt' ? 'Relatório exportado com sucesso!' : 'Report downloaded successfully!',
    syncMsg: lang === 'pt' ? 'Sincronização em tempo real ativada com sucesso!' : 'Live calendar integration sync enabled!',
    subject: lang === 'pt' ? 'Assunto' : 'Subject',
    time: lang === 'pt' ? 'Horário' : 'Time',
    titleLabel: lang === 'pt' ? 'Título do lembrete' : 'Reminder Title'
  };

  const chartData = progress.weeklyStudyTime.map(d => ({
    name: d.day,
    [lang === 'pt' ? 'Minutos' : 'Minutes']: d.minutes,
  }));

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventTitle.trim() || !newEventDate) return;

    const newEv: CalendarEvent = {
      id: `ev-${events.length + 1}`,
      title: newEventTitle,
      date: newEventDate,
      time: newEventTime,
      subject: newEventSubject
    };

    setEvents([...events, newEv].sort((a, b) => a.date.localeCompare(b.date)));
    setNewEventTitle('');
    setNewEventDate('');
  };

  const simulateExport = (type: 'csv' | 'pdf') => {
    alert(t.successMsg);
  };

  const simulateCalendarSync = (service: string) => {
    alert(`${t.syncMsg} (${service})`);
  };

  return (
    <div className="space-y-6 pb-10">
      
      {/* Title & Tab Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-slate-800 dark:text-white tracking-tight flex items-center gap-2.5 uppercase">
            <Clock className="w-6 h-6 text-[#58CC02] stroke-[2.5]" />
            <span>{t.title}</span>
          </h2>
          <p className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wide">
            {t.subtitle}
          </p>
        </div>

        {/* Tab triggers */}
        <div className="flex gap-1.5 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl self-start sm:self-auto border-2 border-slate-200 dark:border-slate-850 shadow-sm">
          <button
            id="tab-stats-overview"
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 text-xs font-black rounded-xl transition-all uppercase tracking-wider border-2 ${
              activeTab === 'overview'
                ? 'bg-white dark:bg-slate-750 border-[#58CC02] text-[#58CC02] shadow-sm'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Métricas
          </button>
          <button
            id="tab-stats-calendar"
            onClick={() => setActiveTab('calendar')}
            className={`px-4 py-2 text-xs font-black rounded-xl transition-all uppercase tracking-wider border-2 ${
              activeTab === 'calendar'
                ? 'bg-white dark:bg-slate-750 border-[#58CC02] text-[#58CC02] shadow-sm'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Calendário
          </button>
        </div>
      </div>

      {activeTab === 'overview' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Chart Card */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl p-5 md:p-6 space-y-4 tactile-card text-slate-800 dark:text-slate-100">
            <h3 className="font-black text-sm text-slate-800 dark:text-white uppercase tracking-tight flex items-center gap-2">
              <Calendar className="w-4.5 h-4.5 text-[#58CC02]" />
              <span>{t.studyTime}</span>
            </h3>

            {/* Recharts BarChart container */}
            <div className="h-64 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} tickLine={false} style={{ fontWeight: 'bold' }} />
                  <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} style={{ fontWeight: 'bold' }} />
                  <ChartTooltip 
                    contentStyle={{ 
                      borderRadius: '16px', 
                      backgroundColor: '#1E293B', 
                      color: '#FFF', 
                      border: '2px solid #58CC02',
                      fontSize: '11px',
                      fontWeight: 'bold'
                    }} 
                  />
                  <Bar 
                    dataKey={lang === 'pt' ? 'Minutos' : 'Minutes'} 
                    fill="#58CC02" 
                    radius={[6, 6, 0, 0]} 
                    maxBarSize={32}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border-2 border-slate-200 dark:border-slate-800/85">
              <div className="text-left">
                <span className="text-3xs font-mono text-slate-400 dark:text-slate-500 uppercase font-black tracking-wider">{t.weeklyAvg}</span>
                <p className="text-xl font-black text-slate-800 dark:text-white">
                  {Math.round(progress.weeklyStudyTime.reduce((sum, d) => sum + d.minutes, 0) / 7)} min / dia
                </p>
              </div>
              <div className="text-right">
                <span className="text-3xs font-mono text-slate-400 dark:text-slate-500 uppercase font-black tracking-wider">Estudado Hoje</span>
                <p className="text-xl font-black text-[#58CC02]">{progress.studyTimeTodayMinutes} min</p>
              </div>
            </div>
          </div>

          {/* Goal & Exports Column */}
          <div className="space-y-6">
            
            {/* Target Settings Box */}
            <div className="bg-white dark:bg-slate-900 p-5 space-y-4 tactile-card text-slate-800 dark:text-slate-100">
              <h3 className="font-black text-sm text-slate-800 dark:text-white uppercase tracking-tight flex items-center gap-2">
                <Target className="w-4.5 h-4.5 text-[#58CC02]" />
                <span>{t.goals}</span>
              </h3>

              <div className="space-y-3">
                <p className="text-2xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider leading-relaxed">
                  {t.currentGoal}: <b className="text-[#58CC02] font-black">{progress.dailyGoalMinutes} {t.minutes} / dia</b>
                </p>

                <div className="grid grid-cols-3 gap-2">
                  {[15, 30, 60].map((goal) => (
                    <button
                      id={`goal-opt-${goal}`}
                      key={goal}
                      onClick={() => onChangeGoal(goal)}
                      className={`py-2.5 px-3 text-xs font-black rounded-xl border-2 text-center transition-all border-b-4 active:translate-y-[2px] active:border-b-2 ${
                        progress.dailyGoalMinutes === goal
                          ? 'border-[#58CC02] bg-[#58CC02]/5 text-[#58CC02]'
                          : 'border-slate-200 dark:border-slate-800 border-b-slate-300 dark:border-b-slate-950 text-slate-500 dark:text-slate-400 hover:border-slate-300'
                      }`}
                    >
                      {goal} min
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Document Exporting Card */}
            <div className="bg-white dark:bg-slate-900 p-5 space-y-4 tactile-card text-slate-800 dark:text-slate-100">
              <h3 className="font-black text-sm text-slate-800 dark:text-white uppercase tracking-tight flex items-center gap-2">
                <Download className="w-4.5 h-4.5 text-[#58CC02]" />
                <span>{t.export}</span>
              </h3>

              <div className="space-y-2.5">
                <button
                  id="btn-export-csv"
                  onClick={() => simulateExport('csv')}
                  className="w-full flex items-center justify-between p-3 rounded-2xl border-2 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/55 transition-all text-left group border-b-4 active:translate-y-[2px] active:border-b-2 cursor-pointer"
                >
                  <div className="flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-300 font-black uppercase tracking-wider">
                    <FileSpreadsheet className="w-4.5 h-4.5 text-[#58CC02]" />
                    <span>{t.exportCsv}</span>
                  </div>
                  <Download className="w-4 h-4 text-slate-400 group-hover:translate-y-0.5 transition-all" />
                </button>

                <button
                  id="btn-export-pdf"
                  onClick={() => simulateExport('pdf')}
                  className="w-full flex items-center justify-between p-3 rounded-2xl border-2 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/55 transition-all text-left group border-b-4 active:translate-y-[2px] active:border-b-2 cursor-pointer"
                >
                  <div className="flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-300 font-black uppercase tracking-wider">
                    <FileText className="w-4.5 h-4.5 text-red-500" />
                    <span>{t.exportPdf}</span>
                  </div>
                  <Download className="w-4 h-4 text-slate-400 group-hover:translate-y-0.5 transition-all" />
                </button>
              </div>
            </div>

          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Calendar List Panel */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-5 md:p-6 space-y-4 tactile-card text-slate-800 dark:text-slate-100">
            <h3 className="font-black text-sm text-slate-800 dark:text-white uppercase tracking-tight flex items-center gap-2">
              <CalendarDays className="w-4.5 h-4.5 text-[#58CC02]" />
              <span>{t.calendarTitle}</span>
            </h3>

            <div className="space-y-3.5 max-h-96 overflow-y-auto pr-1">
              {events.map((ev) => (
                <div 
                  id={`calendar-item-${ev.id}`}
                  key={ev.id} 
                  className="flex items-center justify-between p-3.5 rounded-2xl border-2 border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 border-b-4"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs border-b-2 ${
                      ev.subject === 'html' ? 'bg-orange-500/10 text-orange-500 border-orange-300' :
                      ev.subject === 'python' ? 'bg-blue-500/10 text-blue-500 border-blue-300' :
                      ev.subject === 'javascript' ? 'bg-yellow-500/15 text-yellow-600 dark:text-yellow-400 border-yellow-300' : 'bg-slate-500/10 text-slate-500 border-slate-350'
                    }`}>
                      {ev.subject.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-xs font-black text-slate-800 dark:text-white leading-tight uppercase tracking-tight">{ev.title}</p>
                      <p className="text-3xs font-mono font-black text-slate-400 dark:text-slate-500 tracking-wider mt-0.5">{ev.date} @ {ev.time}</p>
                    </div>
                  </div>
                  <span className="text-3xs font-mono font-black uppercase tracking-widest text-[#58CC02] bg-[#58CC02]/10 px-2.5 py-1 rounded-full border border-[#58CC02]/15">Notificar</span>
                </div>
              ))}
            </div>
          </div>

          {/* Add Reminder Event Form */}
          <div className="space-y-6">
            
            <div className="bg-white dark:bg-slate-900 p-5 space-y-4 tactile-card text-slate-800 dark:text-slate-100">
              <h3 className="font-black text-sm text-slate-800 dark:text-white uppercase tracking-tight flex items-center gap-2">
                <Plus className="w-4.5 h-4.5 text-[#58CC02] stroke-[2.5]" />
                <span>{t.addEvent}</span>
              </h3>

              <form onSubmit={handleAddEvent} className="space-y-3.5">
                <div className="space-y-1">
                  <label className="text-3xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{t.titleLabel}</label>
                  <input
                    id="new-event-title"
                    type="text"
                    required
                    value={newEventTitle}
                    onChange={(e) => setNewEventTitle(e.target.value)}
                    placeholder="Estudar loops ou similar..."
                    className="w-full bg-slate-50 dark:bg-slate-800/60 border-2 border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-xs font-bold text-slate-800 dark:text-white focus:outline-none focus:border-[#58CC02]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-3xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Data</label>
                    <input
                      id="new-event-date"
                      type="date"
                      required
                      value={newEventDate}
                      onChange={(e) => setNewEventDate(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800/60 border-2 border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-300"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-3xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{t.time}</label>
                    <input
                      id="new-event-time"
                      type="time"
                      required
                      value={newEventTime}
                      onChange={(e) => setNewEventTime(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800/60 border-2 border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-300"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-3xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{t.subject}</label>
                  <select
                    id="new-event-subj"
                    value={newEventSubject}
                    onChange={(e: any) => setNewEventSubject(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800/60 border-2 border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 focus:outline-none"
                  >
                    <option value="review">Revisão Geral</option>
                    <option value="html">HTML5</option>
                    <option value="python">Python</option>
                    <option value="javascript">JavaScript</option>
                  </select>
                </div>

                <button
                  id="submit-calendar-event"
                  type="submit"
                  className="w-full py-2.5 bg-[#58CC02] hover:bg-emerald-500 text-white text-xs font-black rounded-xl transition-all border-b-4 border-emerald-700 active:border-b-0 active:translate-y-[4px] uppercase tracking-wider shadow-md"
                >
                  {t.addEvent}
                </button>
              </form>
            </div>

            {/* Sync Third-party productivity calendars */}
            <div className="bg-white dark:bg-slate-900 p-5 space-y-4 tactile-card text-slate-800 dark:text-slate-100">
              <h3 className="font-black text-sm text-slate-800 dark:text-white uppercase tracking-tight flex items-center gap-2">
                <CalendarDays className="w-4.5 h-4.5 text-[#58CC02] stroke-[2.5]" />
                <span>{t.syncThirdParty}</span>
              </h3>

              <div className="space-y-2.5">
                <button
                  id="sync-google-cal"
                  onClick={() => simulateCalendarSync('Google Calendar')}
                  className="w-full py-2.5 px-3 text-2xs font-black rounded-xl border-2 border-slate-200 dark:border-slate-800 border-b-4 active:translate-y-[2px] active:border-b-2 hover:bg-slate-50 dark:hover:bg-slate-800/40 text-slate-700 dark:text-slate-300 text-center flex justify-center items-center gap-2 transition-all uppercase tracking-wider"
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                  <span>{t.googleCalendar}</span>
                </button>

                <button
                  id="sync-outlook-cal"
                  onClick={() => simulateCalendarSync('Outlook')}
                  className="w-full py-2.5 px-3 text-2xs font-black rounded-xl border-2 border-slate-200 dark:border-slate-800 border-b-4 active:translate-y-[2px] active:border-b-2 hover:bg-slate-50 dark:hover:bg-slate-800/40 text-slate-700 dark:text-slate-300 text-center flex justify-center items-center gap-2 transition-all uppercase tracking-wider"
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
                  <span>{t.outlookCalendar}</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
