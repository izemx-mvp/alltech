import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import {
  Send, Clock, CheckCircle2, Eye, Heart, MousePointerClick, UserPlus, Megaphone, Wallet, Target, MessageSquare, Bot, Sparkles, ArrowRight, Check, X,
} from "lucide-react";
import { toast } from "sonner";
import { seo } from "@/lib/seo";
import { posts, reachSeries, aiSuggestions, conversations, campaigns } from "@/lib/mock";
import { Kpi, PageHeader, Panel, StatusBadge, statusTone, AiTag, NetworkDot, fmt } from "@/components/app/kit";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";

export const Route = createFileRoute("/_app/dashboard")({
  head: () => seo("Dashboard", "Vue d'ensemble des performances réseaux sociaux, Ads et service client ALLTECH."),
  component: Dashboard,
});

export const chartTooltip = { contentStyle: { background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 12 } };

function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [sugg, setSugg] = useState(aiSuggestions);
  useEffect(() => { const t = setTimeout(() => setLoading(false), 700); return () => clearTimeout(t); }, []);

  const kpis = [
    { label: "Publications publiées", value: "128", delta: 12, icon: Send },
    { label: "Publications programmées", value: "24", delta: 8, icon: Clock },
    { label: "Publications à valider", value: "6", delta: -3, icon: CheckCircle2 },
    { label: "Portée totale", value: "1,24 M", delta: 18, icon: Eye },
    { label: "Engagement", value: "6,8 %", delta: 1.2, icon: Heart },
    { label: "Clics", value: "38 420", delta: 9, icon: MousePointerClick },
    { label: "Nouveaux abonnés", value: "+2 846", delta: 14, icon: UserPlus },
    { label: "Campagnes actives", value: "3", icon: Megaphone },
    { label: "Budget Ads consommé", value: "6 020 €", delta: 6, icon: Wallet },
    { label: "Leads générés", value: "670", delta: 22, icon: Target },
    { label: "Conversations reçues", value: "1 482", delta: 11, icon: MessageSquare },
    { label: "Traitées par l'IA", value: "82 %", delta: 5, icon: Bot, ai: true },
  ];

  return (
    <>
      <PageHeader eyebrow="Mardi 6 octobre 2026" title="Bonjour Sophie 👋" subtitle="Voici la performance de votre communication digitale cette semaine."
        actions={<><Button variant="outline" onClick={() => toast.success("Rapport hebdomadaire exporté (PDF).")}>Exporter</Button><Button variant="ai" asChild><Link to="/agent-community-manager"><Sparkles /> Demander à l'IA</Link></Button></>} />

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
        {kpis.map((k) => loading ? <Skeleton key={k.label} className="h-[118px] rounded-2xl" /> : <Kpi key={k.label} {...k} />)}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <Panel className="xl:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div><h3 className="font-semibold">Performance réseaux sociaux</h3><p className="text-xs text-muted-foreground">Portée par réseau · 7 derniers jours</p></div>
            <div className="flex gap-3 text-xs text-muted-foreground"><span className="flex items-center gap-1"><NetworkDot n="LinkedIn" />LinkedIn</span><span className="flex items-center gap-1"><NetworkDot n="Facebook" />Facebook</span><span className="flex items-center gap-1"><NetworkDot n="Instagram" />Instagram</span></div>
          </div>
          <div className="h-72">
            <ResponsiveContainer>
              <AreaChart data={reachSeries}>
                <defs>
                  {["chart-3", "chart-2", "chart-4"].map((c) => (
                    <linearGradient key={c} id={c} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={`var(--${c})`} stopOpacity={0.4} /><stop offset="100%" stopColor={`var(--${c})`} stopOpacity={0} /></linearGradient>
                  ))}
                </defs>
                <CartesianGrid stroke="var(--border)" vertical={false} />
                <XAxis dataKey="d" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip {...chartTooltip} />
                <Area type="monotone" dataKey="linkedin" stroke="var(--chart-3)" fill="url(#chart-3)" strokeWidth={2} />
                <Area type="monotone" dataKey="facebook" stroke="var(--chart-2)" fill="url(#chart-2)" strokeWidth={2} />
                <Area type="monotone" dataKey="instagram" stroke="var(--chart-4)" fill="url(#chart-4)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel className="ai-border">
          <div className="mb-4 flex items-center justify-between"><h3 className="font-semibold">Suggestions IA</h3><AiTag /></div>
          <div className="space-y-3">
            {sugg.length === 0 && <p className="py-8 text-center text-sm text-muted-foreground">Toutes les suggestions ont été traitées ✨</p>}
            {sugg.map((s) => (
              <div key={s.title} className="rounded-xl border bg-secondary/30 p-3 transition hover:border-ai/30">
                <div className="flex items-start justify-between gap-2"><p className="text-sm font-medium">{s.title}</p><span className="text-xs font-semibold text-ai">{s.score}</span></div>
                <p className="mt-1 text-xs text-muted-foreground">{s.reason}</p>
                <div className="mt-2 flex gap-2">
                  <Button size="sm" onClick={() => { setSugg((x) => x.filter((y) => y !== s)); toast.success("Suggestion appliquée par l'Agent IA."); }}><Check /> Appliquer</Button>
                  <Button size="sm" variant="ghost" onClick={() => { setSugg((x) => x.filter((y) => y !== s)); toast("Suggestion ignorée."); }}><X /> Ignorer</Button>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <Panel>
          <SectionTitle title="Prochaines publications" to="/calendrier" />
          <div className="space-y-2">
            {posts.filter((p) => p.status !== "Publié").slice(0, 5).map((p) => (
              <div key={p.id} className="flex items-center gap-3 rounded-xl p-2 hover:bg-accent/40">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-secondary text-center text-[10px] leading-tight"><span className="font-bold">{p.date.slice(8)}</span>oct.</div>
                <div className="min-w-0 flex-1"><p className="truncate text-sm">{p.title}</p><p className="flex items-center gap-1 text-xs text-muted-foreground"><NetworkDot n={p.network} /> {p.network} · {p.time}</p></div>
                <StatusBadge tone={statusTone(p.status)}>{p.status}</StatusBadge>
              </div>
            ))}
          </div>
        </Panel>
        <Panel>
          <SectionTitle title="Dernières conversations" to="/service-client" />
          <div className="space-y-2">
            {conversations.slice(0, 5).map((c) => (
              <div key={c.id} className="flex items-center gap-3 rounded-xl p-2 hover:bg-accent/40">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-secondary text-xs font-semibold">{c.name.split(" ").map((x) => x[0]).slice(0, 2).join("")}</span>
                <div className="min-w-0 flex-1"><p className="truncate text-sm font-medium">{c.name}</p><p className="truncate text-xs text-muted-foreground">{c.preview}</p></div>
                <StatusBadge tone={statusTone(c.status)}>{c.status}</StatusBadge>
              </div>
            ))}
          </div>
        </Panel>
        <Panel>
          <SectionTitle title="Campagnes Ads" to="/campagnes-ads" />
          <div className="space-y-4">
            {campaigns.filter((c) => c.status !== "Terminée").map((c) => (
              <div key={c.id}>
                <div className="flex items-center justify-between text-sm"><span className="truncate">{c.name}</span><StatusBadge tone={statusTone(c.status)}>{c.status}</StatusBadge></div>
                <Progress value={(c.spent / c.budget) * 100} className="mt-2 h-1.5" />
                <div className="mt-1 flex justify-between text-xs text-muted-foreground"><span>{fmt(c.spent)} € / {fmt(c.budget)} €</span><span>{c.leads} leads</span></div>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </>
  );
}

function SectionTitle({ title, to }: { title: string; to: "/calendrier" | "/service-client" | "/campagnes-ads" }) {
  return (
    <div className="mb-3 flex items-center justify-between">
      <h3 className="font-semibold">{title}</h3>
      <Link to={to} className="flex items-center gap-1 text-xs text-primary hover:underline">Voir tout <ArrowRight className="h-3 w-3" /></Link>
    </div>
  );
}
