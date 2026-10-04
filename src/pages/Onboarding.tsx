import { useState } from 'react';
import { Activity, ArrowRight, ArrowLeft, Check, Shield, Clock, Layers, Bell, TrendingUp, Brain, Sparkles } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { SECTORS } from '@/lib/mockData';
import type { RiskTolerance, ExperienceLevel } from '@/types';

const STEPS = [
  { title: 'What type of investor are you?', icon: Shield, subtitle: 'This helps us personalize your dashboard and risk warnings' },
  { title: 'What is your experience level?', icon: Brain, subtitle: 'We adjust the depth of technical detail shown' },
  { title: 'What is your preferred risk level?', icon: TrendingUp, subtitle: 'Risk information is always shown, but emphasis varies' },
  { title: 'Which sectors are you interested in?', icon: Layers, subtitle: 'We prioritize these in AI signals and recommendations' },
  { title: 'How would you like to receive alerts?', icon: Bell, subtitle: 'You can change these anytime in Settings' },
];

export function Onboarding() {
  const { completeOnboarding, user } = useApp();
  const [step, setStep] = useState(0);
  const [riskTolerance, setRiskTolerance] = useState<RiskTolerance | null>(null);
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel | null>(null);
  const [riskLevel, setRiskLevel] = useState<RiskTolerance | null>(null);
  const [sectors, setSectors] = useState<string[]>([]);
  const [emailNotif, setEmailNotif] = useState(true);
  const [browserNotif, setBrowserNotif] = useState(true);
  const [frequency, setFrequency] = useState<'Instant' | 'Hourly' | 'Daily'>('Instant');

  const canProceed = () => {
    if (step === 0) return riskTolerance !== null;
    if (step === 1) return experienceLevel !== null;
    if (step === 2) return riskLevel !== null;
    if (step === 3) return sectors.length > 0;
    return true;
  };

  const handleNext = () => {
    if (step < STEPS.length - 1) {
      setStep(step + 1);
    } else {
      completeOnboarding({
        riskTolerance: riskLevel ?? riskTolerance ?? 'Moderate',
        experienceLevel: experienceLevel ?? 'Intermediate',
        preferredSectors: sectors,
        emailNotifications: emailNotif,
        browserNotifications: browserNotif,
        alertFrequency: frequency,
      });
    }
  };

  const toggleSector = (s: string) => {
    setSectors((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-ink-50 px-4 dark:bg-ink-950">
      {/* Background */}
      <div className="absolute inset-0 bg-grid-pattern" />
      <div className="absolute left-1/2 top-0 h-[300px] w-[500px] -translate-x-1/2 rounded-full bg-brand-500/10 blur-[80px]" />

      <div className="relative w-full max-w-lg animate-slide-up">
        {/* Logo */}
        <div className="mb-6 text-center">
          <div className="relative mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-glow animate-glow-pulse">
            <Activity className="h-6 w-6" />
          </div>
          <h1 className="text-lg font-bold text-ink-900 dark:text-ink-100">
            Welcome{user ? `, ${user.fullName.split(' ')[0]}` : ''}!
          </h1>
          <p className="mt-1 text-xs text-ink-500">Let's personalize your experience</p>
        </div>

        {/* Progress */}
        <div className="mb-6 flex items-center gap-1.5">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                i <= step
                  ? 'bg-gradient-to-r from-brand-500 to-brand-600 shadow-glow'
                  : 'bg-ink-200 dark:bg-ink-700'
              }`}
            />
          ))}
        </div>

        <div className="card-glow p-6">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-950/30 dark:text-brand-400">
              {(() => {
                const Icon = STEPS[step].icon;
                return <Icon className="h-5 w-5" />;
              })()}
            </div>
            <div>
              <h2 className="text-base font-bold text-ink-900 dark:text-ink-100">{STEPS[step].title}</h2>
              <p className="text-xs text-ink-500">{STEPS[step].subtitle}</p>
            </div>
          </div>

          {/* Step 0: Investor type */}
          {step === 0 && (
            <div className="space-y-2 animate-fade-in">
              {(['Conservative', 'Moderate', 'Aggressive'] as RiskTolerance[]).map((r) => (
                <button
                  key={r}
                  onClick={() => setRiskTolerance(r)}
                  className={`flex w-full items-center gap-3 rounded-lg border p-3.5 text-left transition-all ${
                    riskTolerance === r
                      ? 'border-brand-500 bg-brand-50 shadow-glow dark:bg-brand-950/20'
                      : 'border-ink-200 hover:border-brand-300 dark:border-ink-700 dark:hover:border-brand-700'
                  }`}
                >
                  <div className={`flex h-5 w-5 items-center justify-center rounded-full border-2 transition-colors ${riskTolerance === r ? 'border-brand-500 bg-brand-500' : 'border-ink-300 dark:border-ink-600'}`}>
                    {riskTolerance === r && <Check className="h-3 w-3 text-white" />}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-ink-900 dark:text-ink-100">{r}</p>
                    <p className="text-xs text-ink-500">{r === 'Conservative' ? 'Prioritize capital preservation' : r === 'Moderate' ? 'Balanced risk and growth' : 'Maximize returns, accept high volatility'}</p>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Step 1: Experience */}
          {step === 1 && (
            <div className="space-y-2 animate-fade-in">
              {(['Beginner', 'Intermediate', 'Advanced'] as ExperienceLevel[]).map((e) => (
                <button
                  key={e}
                  onClick={() => setExperienceLevel(e)}
                  className={`flex w-full items-center gap-3 rounded-lg border p-3.5 text-left transition-all ${
                    experienceLevel === e
                      ? 'border-brand-500 bg-brand-50 shadow-glow dark:bg-brand-950/20'
                      : 'border-ink-200 hover:border-brand-300 dark:border-ink-700 dark:hover:border-brand-700'
                  }`}
                >
                  <div className={`flex h-5 w-5 items-center justify-center rounded-full border-2 transition-colors ${experienceLevel === e ? 'border-brand-500 bg-brand-500' : 'border-ink-300 dark:border-ink-600'}`}>
                    {experienceLevel === e && <Check className="h-3 w-3 text-white" />}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-ink-900 dark:text-ink-100">{e}</p>
                    <p className="text-xs text-ink-500">{e === 'Beginner' ? 'New to investing, need simple explanations' : e === 'Intermediate' ? 'Some experience with stock analysis' : 'Experienced, want detailed technical data'}</p>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Step 2: Risk level */}
          {step === 2 && (
            <div className="space-y-2 animate-fade-in">
              {(['Low', 'Medium', 'High'] as const).map((r) => {
                const mapped = r === 'Low' ? 'Conservative' : r === 'Medium' ? 'Moderate' : 'Aggressive';
                return (
                  <button
                    key={r}
                    onClick={() => setRiskLevel(mapped)}
                    className={`flex w-full items-center gap-3 rounded-lg border p-3.5 text-left transition-all ${
                      riskLevel === mapped
                        ? 'border-brand-500 bg-brand-50 shadow-glow dark:bg-brand-950/20'
                        : 'border-ink-200 hover:border-brand-300 dark:border-ink-700 dark:hover:border-brand-700'
                    }`}
                  >
                    <div className={`flex h-5 w-5 items-center justify-center rounded-full border-2 transition-colors ${riskLevel === mapped ? 'border-brand-500 bg-brand-500' : 'border-ink-300 dark:border-ink-600'}`}>
                      {riskLevel === mapped && <Check className="h-3 w-3 text-white" />}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-ink-900 dark:text-ink-100">{r} Risk</p>
                      <p className="text-xs text-ink-500">{r === 'Low' ? 'Minimize losses, stable stocks only' : r === 'Medium' ? 'Accept some volatility for growth' : 'High volatility acceptable for potential returns'}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* Step 3: Sectors */}
          {step === 3 && (
            <div className="flex flex-wrap gap-2 animate-fade-in">
              {SECTORS.map((s) => (
                <button
                  key={s}
                  onClick={() => toggleSector(s)}
                  className={`rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                    sectors.includes(s)
                      ? 'bg-gradient-to-r from-brand-500 to-brand-600 text-white shadow-glow'
                      : 'bg-ink-100 text-ink-600 hover:bg-ink-200 dark:bg-ink-800 dark:text-ink-400 dark:hover:bg-ink-700'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Step 4: Notifications */}
          {step === 4 && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center justify-between rounded-lg border border-ink-200 p-3.5 dark:border-ink-700">
                <div>
                  <p className="text-sm font-semibold text-ink-900 dark:text-ink-100">Email Notifications</p>
                  <p className="text-xs text-ink-500">Receive alerts via email</p>
                </div>
                <button onClick={() => setEmailNotif(!emailNotif)} className={`relative h-6 w-11 rounded-full transition-colors ${emailNotif ? 'bg-brand-500 shadow-glow' : 'bg-ink-300 dark:bg-ink-700'}`}>
                  <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${emailNotif ? 'translate-x-5' : 'translate-x-0.5'}`} />
                </button>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-ink-200 p-3.5 dark:border-ink-700">
                <div>
                  <p className="text-sm font-semibold text-ink-900 dark:text-ink-100">Browser Notifications</p>
                  <p className="text-xs text-ink-500">Get push notifications in your browser</p>
                </div>
                <button onClick={() => setBrowserNotif(!browserNotif)} className={`relative h-6 w-11 rounded-full transition-colors ${browserNotif ? 'bg-brand-500 shadow-glow' : 'bg-ink-300 dark:bg-ink-700'}`}>
                  <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${browserNotif ? 'translate-x-5' : 'translate-x-0.5'}`} />
                </button>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-ink-500">Alert Frequency</label>
                <select value={frequency} onChange={(e) => setFrequency(e.target.value as 'Instant' | 'Hourly' | 'Daily')} className="input">
                  <option value="Instant">Instant (as they happen)</option>
                  <option value="Hourly">Hourly digest</option>
                  <option value="Daily">Daily summary</option>
                </select>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="mt-6 flex items-center justify-between">
            {step > 0 ? (
              <button onClick={() => setStep(step - 1)} className="btn-ghost">
                <ArrowLeft className="h-4 w-4" /> Back
              </button>
            ) : <div />}
            <button onClick={handleNext} disabled={!canProceed()} className="btn-primary">
              {step === STEPS.length - 1 ? (
                <>Complete <Sparkles className="h-4 w-4" /></>
              ) : (
                <>Next <ArrowRight className="h-4 w-4" /></>
              )}
            </button>
          </div>
        </div>

        <p className="mt-4 text-center text-[10px] text-ink-400">
          Step {step + 1} of {STEPS.length} · Your preferences are saved securely
        </p>
      </div>
    </div>
  );
}
