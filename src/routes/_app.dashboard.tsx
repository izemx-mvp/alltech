import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Send, CalendarClock, FileEdit, Heart, Megaphone, Wallet, Target, Coins, MessagesSquare, Bot, UserRoundCheck, Timer, HelpCircle, FileText, Info, RefreshCw, ArrowRight, Sparkles, Linkedin, Facebook, type LucideIcon } from "lucide-react";
import { seo } from "@/lib/seo";
import { reachSeries } from "@/lib/mock";
import { useStore, pubTone } from "@/lib/store";
import { PageHeader, Panel, StatusBadge, statusTone, fmt, chartTooltip, NetworkDot } from "@/components/app/kit";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/_app/dashboard")({
  head: () => seo("Dashboard", "Vue d'ensemble du Community Manager IA, des Campagnes Ads IA, du Service Client IA et de la base de connaissance."),
  component: Dashboard,
});

type To = "/community-manager" | "/campagnes-ads" | "/service-client" | "/base-de-connaissance";

function Dashboard() {
  const pubs = useStore("publications"); const camps = useStore("campaigns"); const convs = useStore("conversations");
  const faqs = useStore("faqs"); const docs = useStore("docs"); const infos = useStore("infos");
  const [loading, setLoading] = useState(true);
  useEffect(() => { const t = setTimeout(() => setLoading(false), 600); return () => clearTimeout(t); }, []);

  const spent = camps.reduce((s, c) => s + c.spent, 0); const leads = camps.reduce((s, c) => s + c.leads, 0);
  const upcoming = pubs.filter((p) => p.status === "Planifié").sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time)).slice(0, 4);

  const modules: { title: string; to: To; icon: LucideIcon; search?: Record<string, string>; kpis: [string, string, LucideIcon][] }[] = [
    { title: "Community Manager IA", to: "/community-manager", icon: Bot, kpis: [
      ["Publications publiées", String(pubs.filter((p) => p.status === "Publié").length + 124), Send],
      ["Publications planifiées", String(pubs.filter((p) => p.status === "Planifié").length), CalendarClock],
      ["Brouillons", String(pubs.filter((p) => p.status === "Brouillon").length), FileEdit],
      ["Engagement moyen", "6,8 %", Heart]] },
    { title: "Campagnes Ads IA", to: "/campagnes-ads", icon: Megaphone, kpis: [
      ["Campagnes actives", String(camps.filter((c) => c.status === "Active").length), Megaphone],
      ["Budget consommé", `${fmt(spent)} €`, Wallet],
      ["Leads générés", fmt(leads), Target],
      ["Coût par lead", `${leads ? (spent / leads).toFixed(2).replace(".", ",") : "0"} €`, Coins]] },
    { title: "Service Client IA", to: "/service-client", icon: MessagesSquare, kpis: [
      ["Conversations du jour", String(convs.length + 42), MessagesSquare],
      ["Gérées automatiquement", String(convs.filter((c) => c.status === "IA").length + 36), Bot],
      ["Nécessitent un humain", String(convs.filter((c) => c.status === "Humain" || c.status === "En attente").length), UserRoundCheck],
      ["Temps moyen de réponse", "8 s", Timer]] },
    { title: "Base de connaissance IA", to: "/base-de-connaissance", icon: HelpCircle, kpis: [
      ["FAQ", String(faqs.length), HelpCircle],
      ["Documents", String(docs.length), FileText],
      ["Informations générales", String(infos.filter((i) => i.active).length), Info],
      ["Dernière mise à jour", [...faqs.map((f) => f.updated), ...infos.map((i) => i.updated)].sort((a, b) => b.split("/").reverse().join("").localeCompare(a.split("/").reverse().join("")))[0] ?? "—", RefreshCw]] },
  ];

  return (
    <>
      <PageHeader eyebrow="Mardi 6 octobre 2026" title="Bonjour Sophie" subtitle="Vos 4 agents IA en un coup d'œil."
        actions={<Button variant="ai" asChild><Link to="/community-manager" search={{ tab: "idees" }}><Sparkles /> Générer des idées de posts</Link></Button>} />

      <div className="grid gap-5 lg:grid-cols-2">
        {modules.map((m) => (
          <Panel key={m.title} className="glass-hover group">
            <div className="mb-4 flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-ai text-primary-foreground shadow-glow"><m.icon className="h-5 w-5" /></span>
              <h3 className="font-semibold">{m.title}</h3>
              <Link to={m.to} className="ml-auto flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-primary transition hover:bg-primary/10">Ouvrir <ArrowRight className="h-3 w-3 transition group-hover:translate-x-0.5" /></Link>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {m.kpis.map(([l, v, I]) => loading ? <Skeleton key={l} className="h-[72px] rounded-xl" /> : (
                <Link key={l} to={m.to} className="rounded-xl border bg-secondary/30 p-3 transition hover:border-primary/40 hover:bg-primary/5">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">{l}<I className="h-3.5 w-3.5 text-primary" /></div>
                  <div className="mt-1 font-display text-xl font-semibold">{v}</div>
                </Link>
              ))}
            </div>
          </Panel>
        ))}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <Panel className="xl:col-span-2">
          <div className="mb-4"><h3 className="font-semibold">Portée des publications</h3><p className="text-xs text-muted-foreground">LinkedIn et Facebook · 7 derniers jours</p></div>
          <div className="h-64">
            <ResponsiveContainer>
              <AreaChart data={reachSeries}>
                <defs>{["chart-3", "chart-2"].map((c) => <linearGradient key={c} id={c} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={`var(--${c})`} stopOpacity={0.4} /><stop offset="100%" stopColor={`var(--${c})`} stopOpacity={0} /></linearGradient>)}</defs>
                <CartesianGrid stroke="var(--border)" vertical={false} />
                <XAxis dataKey="d" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip {...chartTooltip} />
                <Area type="monotone" dataKey="linkedin" name="LinkedIn" stroke="var(--chart-3)" fill="url(#chart-3)" strokeWidth={2} />
                <Area type="monotone" dataKey="facebook" name="Facebook" stroke="var(--chart-2)" fill="url(#chart-2)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Panel>
        <Panel>
          <div className="mb-3 flex items-center justify-between"><h3 className="font-semibold">Prochaines publications</h3><Link to="/community-manager" search={{ tab: "calendrier" }} className="text-xs text-primary hover:underline">Calendrier</Link></div>
          <div className="space-y-2">
            {upcoming.length === 0 && <p className="py-6 text-center text-sm text-muted-foreground">Aucune publication planifiée.</p>}
            {upcoming.map((p) => { const I = p.platform === "LinkedIn" ? Linkedin : Facebook; return (
              <Link key={p.id} to="/community-manager" search={{ tab: "calendrier" }} className="flex items-center gap-3 rounded-xl p-2 transition hover:bg-accent/40">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-secondary text-center text-[10px] leading-tight"><span className="font-bold">{p.date.slice(8)}</span>oct.</div>
                <div className="min-w-0 flex-1"><p className="truncate text-sm">{p.title}</p><p className="flex items-center gap-1 text-xs text-muted-foreground"><I className="h-3 w-3 text-info" />{p.platform} · {p.time}</p></div>
                <StatusBadge tone={pubTone(p.status)}>{p.status}</StatusBadge>
              </Link>); })}
          </div>
          <h3 className="mb-2 mt-5 font-semibold">Conversations récentes</h3>
          {convs.slice(0, 3).map((c) => (
            <Link key={c.id} to="/service-client" className="flex items-center gap-2 rounded-lg p-2 text-sm transition hover:bg-accent/40"><NetworkDot n="LinkedIn" /><span className="flex-1 truncate">{c.name}</span><StatusBadge tone={statusTone(c.status)}>{c.status === "Humain" ? "Agent humain" : c.status}</StatusBadge></Link>
          ))}
        </Panel>
      </div>
    </>
  );
}
