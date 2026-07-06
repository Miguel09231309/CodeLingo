import React from 'react';
import { 
  ShieldCheck, 
  Eye, 
  Smartphone, 
  DownloadCloud, 
  Globe2, 
  BellRing, 
  Trash2, 
  WifiOff, 
  Fingerprint, 
  Lock,
  Sun,
  Moon
} from 'lucide-react';
import { Language, UserProgress } from '../types';

interface ProfileSettingsProps {
  lang: Language;
  setLang: (lang: Language) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  progress: UserProgress;
  onUpdateProgress: (update: Partial<UserProgress>) => void;
  onResetProgress: () => void;
}

export default function ProfileSettings({
  lang,
  setLang,
  theme,
  toggleTheme,
  progress,
  onUpdateProgress,
  onResetProgress
}: ProfileSettingsProps) {

  const t = {
    title: lang === 'pt' ? 'Configurações do Sistema' : 'System Configuration',
    subtitle: lang === 'pt' ? 'Controle sua segurança, privacidade, idiomas e sincronização na nuvem.' : 'Manage your security, privacy, languages, and cloud backups.',
    general: lang === 'pt' ? 'Ajustes Gerais' : 'General Adjustments',
    langLabel: lang === 'pt' ? 'Idioma de Preferência' : 'Preferred Language',
    themeLabel: lang === 'pt' ? 'Tema Visual' : 'Visual Theme',
    themeSub: lang === 'pt' ? 'Alternar entre tema claro e escuro' : 'Switch between light and dark theme',
    lightTheme: lang === 'pt' ? 'Claro' : 'Light',
    darkTheme: lang === 'pt' ? 'Escuro' : 'Dark',
    push: lang === 'pt' ? 'Notificações Push' : 'Push Notifications',
    pushSub: lang === 'pt' ? 'Lembretes inteligentes contextuais de metas' : 'Smart contextual target reminders',
    offline: lang === 'pt' ? 'Modo Offline Ativo' : 'Simulated Offline Mode',
    offlineSub: lang === 'pt' ? 'Acesse lições baixadas localmente sem internet' : 'Access cached files without active internet connections',
    security: lang === 'pt' ? 'Segurança e Autenticação' : 'Security & Credentials',
    biometric: lang === 'pt' ? 'Autenticação Biométrica' : 'Biometric Security',
    biometricSub: lang === 'pt' ? 'Permitir login via impressão digital ou FaceID' : 'Log in using fingerprints or FaceID recognition',
    twoFactor: lang === 'pt' ? 'Autenticação de Dois Fatores (2FA)' : 'Two-Factor Authentication (2FA)',
    twoFactorSub: lang === 'pt' ? 'Reforçar proteção ao acessar múltiplos dispositivos' : 'Enforce extra protection during multi-device synchronization',
    cloudBackup: lang === 'pt' ? 'Backup na Nuvem Automático' : 'Automated Cloud Backups',
    backupBtn: lang === 'pt' ? 'Fazer Backup Agora' : 'Backup State Now',
    dangerZone: lang === 'pt' ? 'Zona de Perigo' : 'Danger Zone',
    resetProgress: lang === 'pt' ? 'Zerar meu progresso' : 'Reset my progress data',
    resetSub: lang === 'pt' ? 'Atenção: isto apagará todo seu XP, conquistas e níveis conquistados!' : 'Warning: this will erase all earned XP, levels, and achievements!',
    resetSuccess: lang === 'pt' ? 'Seu progresso foi totalmente resetado!' : 'Your learning statistics have been reset!'
  };

  const handleToggleOffline = () => {
    const isOff = !progress.isOffline;
    onUpdateProgress({ 
      isOffline: isOff,
      syncStatus: isOff ? 'offline' : 'synced'
    });
  };

  const handleToggleBiometrics = () => {
    onUpdateProgress({ biometricsEnabled: !progress.biometricsEnabled });
  };

  const handleToggle2FA = () => {
    onUpdateProgress({ twoFactorEnabled: !progress.twoFactorEnabled });
  };

  const handleBackupNow = () => {
    alert(lang === 'pt' ? 'Backup automático enviado para a nuvem CodeLingo!' : 'Automatic state backup synchronized successfully!');
  };

  const handleResetClick = () => {
    const confirmed = window.confirm(lang === 'pt' ? 'Tem certeza absoluta?' : 'Are you sure you want to delete all data?');
    if (confirmed) {
      onResetProgress();
      alert(t.resetSuccess);
    }
  };

  return (
    <div className="space-y-6 pb-10 max-w-2xl mx-auto">
      
      {/* Subject Header */}
      <div>
        <h2 className="text-xl md:text-2xl font-extrabold text-slate-800 dark:text-white tracking-tight flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-emerald-500" />
          <span>{t.title}</span>
        </h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">
          {t.subtitle}
        </p>
      </div>

      {/* General config section */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 md:p-6 shadow-sm space-y-4">
        <h3 className="text-xs font-black uppercase text-slate-400 dark:text-slate-500 tracking-wider">
          {t.general}
        </h3>

        <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
          
          {/* Language selector row */}
          <div className="flex items-center justify-between py-3.5 first:pt-0">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{t.langLabel}</span>
              <p className="text-3xs text-slate-400 dark:text-slate-500">Mudar para Português ou Inglês</p>
            </div>
            
            <div className="flex gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
              <button
                id="lang-pt-btn"
                onClick={() => setLang('pt')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  lang === 'pt' ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-sm' : 'text-slate-500'
                }`}
              >
                Português
              </button>
              <button
                id="lang-en-btn"
                onClick={() => setLang('en')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  lang === 'en' ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-sm' : 'text-slate-500'
                }`}
              >
                English
              </button>
            </div>
          </div>

          {/* Theme selector row */}
          <div className="flex items-center justify-between py-3.5">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                {theme === 'light' ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-indigo-400" />}
                <span>{t.themeLabel}</span>
              </span>
              <p className="text-3xs text-slate-400 dark:text-slate-500">{t.themeSub}</p>
            </div>
            
            <div className="flex gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
              <button
                id="theme-light-btn"
                onClick={() => theme !== 'light' && toggleTheme()}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
                  theme === 'light' ? 'bg-white text-slate-800 shadow-sm border border-slate-200/55' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                <Sun className="w-3.5 h-3.5" />
                <span>{t.lightTheme}</span>
              </button>
              <button
                id="theme-dark-btn"
                onClick={() => theme !== 'dark' && toggleTheme()}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
                  theme === 'dark' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                <Moon className="w-3.5 h-3.5" />
                <span>{t.darkTheme}</span>
              </button>
            </div>
          </div>

          {/* Simulated Offline Mode row */}
          <div className="flex items-center justify-between py-3.5">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <WifiOff className="w-4 h-4 text-amber-500" />
                <span>{t.offline}</span>
              </span>
              <p className="text-3xs text-slate-400 dark:text-slate-500">{t.offlineSub}</p>
            </div>
            
            <button
              id="btn-toggle-offline"
              onClick={handleToggleOffline}
              className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${
                progress.isOffline ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-800'
              }`}
            >
              <div className={`bg-white w-4 h-4 rounded-full shadow transition-transform duration-300 ${
                progress.isOffline ? 'translate-x-6' : 'translate-x-0'
              }`} />
            </button>
          </div>

        </div>
      </div>

      {/* Security credentials section */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 md:p-6 shadow-sm space-y-4">
        <h3 className="text-xs font-black uppercase text-slate-400 dark:text-slate-500 tracking-wider">
          {t.security}
        </h3>

        <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
          
          {/* Biometrics */}
          <div className="flex items-center justify-between py-3.5 first:pt-0">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Fingerprint className="w-4 h-4 text-emerald-500" />
                <span>{t.biometric}</span>
              </span>
              <p className="text-3xs text-slate-400 dark:text-slate-500">{t.biometricSub}</p>
            </div>

            <button
              id="btn-toggle-biometrics"
              onClick={handleToggleBiometrics}
              className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${
                progress.biometricsEnabled ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-800'
              }`}
            >
              <div className={`bg-white w-4 h-4 rounded-full shadow transition-transform duration-300 ${
                progress.biometricsEnabled ? 'translate-x-6' : 'translate-x-0'
              }`} />
            </button>
          </div>

          {/* 2FA */}
          <div className="flex items-center justify-between py-3.5">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-indigo-500" />
                <span>{t.twoFactor}</span>
              </span>
              <p className="text-3xs text-slate-400 dark:text-slate-500">{t.twoFactorSub}</p>
            </div>

            <button
              id="btn-toggle-2fa"
              onClick={handleToggle2FA}
              className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${
                progress.twoFactorEnabled ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-800'
              }`}
            >
              <div className={`bg-white w-4 h-4 rounded-full shadow transition-transform duration-300 ${
                progress.twoFactorEnabled ? 'translate-x-6' : 'translate-x-0'
              }`} />
            </button>
          </div>

          {/* Automatic Backups cloud */}
          <div className="flex items-center justify-between py-3.5 last:pb-0">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
                <DownloadCloud className="w-4 h-4 text-blue-500" />
                <span>{t.cloudBackup}</span>
              </span>
              <p className="text-3xs text-slate-400 dark:text-slate-500">Último envio: Hoje às {new Date().toTimeString().substring(0, 5)}</p>
            </div>

            <button
              id="backup-state-btn"
              onClick={handleBackupNow}
              className="px-3.5 py-1.5 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-3xs font-bold rounded-xl transition-all"
            >
              {t.backupBtn}
            </button>
          </div>

        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-rose-500/5 border border-rose-500/10 dark:border-rose-500/5 rounded-3xl p-5 md:p-6 shadow-sm space-y-4">
        <h3 className="text-xs font-black uppercase text-rose-500 tracking-wider">
          {t.dangerZone}
        </h3>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-0.5">
            <span className="text-xs font-bold text-slate-800 dark:text-white">{t.resetProgress}</span>
            <p className="text-3xs text-slate-400 dark:text-slate-500 max-w-md">{t.resetSub}</p>
          </div>

          <button
            id="reset-progress-btn"
            onClick={handleResetClick}
            className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-md shadow-rose-500/10 self-start sm:self-auto"
          >
            <Trash2 className="w-4 h-4" />
            <span>{t.resetProgress}</span>
          </button>
        </div>
      </div>

    </div>
  );
}
