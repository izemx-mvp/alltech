import { useEffect, useState, type ReactNode } from "react";
import { Sparkles, Loader2, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function AnimatedBackground() {
  const [dots, setDots] = useState<{ l: number; d: number; s: number; delay: number }[]>([]);
  useEffect(() => {
    setDots(Array.from({ length: 28 }, () => ({ l: Math.random() * 100, d: 18 + Math.random() * 22, s: 1 + Math.random() * 2.5, delay: -Math.random() * 30 })));
  }, []);
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute -left-40 -top-40 h-[520px] w-[520px] animate-float rounded-full bg-primary/15 blur-[120px]" />
      <div className="absolute right-[-10%] top-1/3 h-[480px] w-[480px] animate-float rounded-full bg-ai/10 blur-[130px] [animation-delay:-6s]" />
      <div className="absolute bottom-[-20%] left-1/3 h-[520px] w-[520px] animate-float rounded-full bg-forest/25 blur-[140px] [animation-delay:-12s]" />
      <svg className="absolute inset-0 h-full w-full opacity-[0.05]">
        <defs><pattern id="g" width="48" height="48" patternUnits="userSpaceOnUse"><path d="M48 0H0V48" fill="none" stroke="currentColor" /></pattern></defs>
        <rect width="100%" height="100%" fill="url(#g)" />
      </svg>
      {dots.map((p, i) => (
        <span key={i} className="absolute bottom-0 animate-drift rounded-full bg-primary-glow/60"
          style={{ left: `${p.l}%`, width: p.s, height: p.s, animationDuration: `${p.d}s`, animationDelay: `${p.delay}s` }} />
      ))}
    </div>
  );
}

export function Panel({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn("glass rounded-2xl p-5", className)}>{children}</div>;
}

export function PageHeader({ title, subtitle, actions, eyebrow }: { title: string; subtitle?: string; actions?: ReactNode; eyebrow?: string }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        {eyebrow && <div className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary">{eyebrow}</div>}
        <h1 className="text-3xl font-semibold text-gradient">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

export function Kpi({ label, value, delta, icon: Icon, ai }: { label: string; value: string; delta?: number; icon: LucideIcon; ai?: boolean }) {
  return (
    <div className={cn("glass glass-hover group relative overflow-hidden rounded-2xl p-4", ai && "ai-border")}>
      <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-primary/10 blur-2xl transition-opacity group-hover:opacity-100" />
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">{label}</span>
        <span className={cn("grid h-8 w-8 place-items-center rounded-lg", ai ? "bg-ai/15 text-ai" : "bg-primary/10 text-primary")}><Icon className="h-4 w-4" /></span>
      </div>
      <div className="mt-3 font-display text-2xl font-semibold">{value}</div>
      {delta !== undefined && (
        <div className={cn("mt-1 text-xs font-medium", delta >= 0 ? "text-primary" : "text-destructive")}>
          {delta >= 0 ? "▲" : "▼"} {Math.abs(delta)} % <span className="text-muted-foreground">vs. mois dernier</span>
        </div>
      )}
    </div>
  );
}

const toneMap: Record<string, string> = {
  green: "bg-primary/12 text-primary border-primary/25",
  blue: "bg-info/12 text-info border-info/25",
  amber: "bg-warning/12 text-warning border-warning/25",
  red: "bg-destructive/12 text-destructive border-destructive/25",
  gray: "bg-muted text-muted-foreground border-border",
  ai: "bg-ai/12 text-ai border-ai/25",
};
export function StatusBadge({ children, tone = "gray" }: { children: ReactNode; tone?: keyof typeof toneMap | string }) {
  return <span className={cn("inline-flex items-center gap-1 whitespace-nowrap rounded-full border px-2 py-0.5 text-[11px] font-medium", toneMap[tone] ?? toneMap.gray)}>{children}</span>;
}
export const statusTone = (s: string) =>
  ({ "Publié": "green", "Active": "green", "Résolu": "green", "Indexé": "green", "Programmé": "blue", "IA": "ai", "À valider": "amber", "En pause": "amber", "En attente": "amber", "En cours": "amber", "Humain": "blue", "Haute": "red", "Moyenne": "amber", "Basse": "gray" } as Record<string, string>)[s] ?? "gray";

export function AiTag() {
  return <StatusBadge tone="ai"><Sparkles className="h-3 w-3" /> IA</StatusBadge>;
}

/** Simulated AI run: cycles through steps then resolves. */
export function useAiRun() {
  const [running, setRunning] = useState(false);
  const [step, setStep] = useState("");
  const run = (steps: string[], ms = 700) =>
    new Promise<void>((resolve) => {
      setRunning(true);
      steps.forEach((s, i) => setTimeout(() => setStep(s), i * ms));
      setTimeout(() => { setRunning(false); setStep(""); resolve(); }, steps.length * ms + 200);
    });
  return { running, step, run };
}

export function AiThinking({ step }: { step: string }) {
  return (
    <div className="ai-border flex items-center gap-3 rounded-xl bg-ai/5 px-4 py-3 text-sm">
      <span className="relative grid h-8 w-8 place-items-center rounded-full bg-gradient-ai text-primary-foreground animate-pulse-ring">
        <Sparkles className="h-4 w-4" />
      </span>
      <span className="text-ai">{step || "Analyse en cours..."}</span>
      <Loader2 className="ml-auto h-4 w-4 animate-spin text-ai" />
    </div>
  );
}

export function EmptyState({ icon: Icon, title, text }: { icon: LucideIcon; title: string; text: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed p-10 text-center">
      <span className="mb-3 grid h-12 w-12 place-items-center rounded-full bg-primary/10 text-primary"><Icon className="h-5 w-5" /></span>
      <div className="font-display font-medium">{title}</div>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">{text}</p>
    </div>
  );
}

export function NetworkDot({ n }: { n: string }) {
  const c = { LinkedIn: "bg-info", Facebook: "bg-chart-2", Instagram: "bg-warning", YouTube: "bg-destructive" }[n] ?? "bg-muted";
  return <span className={cn("inline-block h-2 w-2 rounded-full", c)} />;
}

export const fmt = (n: number) => n.toLocaleString("fr-FR");
