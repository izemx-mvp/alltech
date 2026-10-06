import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Sparkles } from "lucide-react";
import { toast } from "sonner";
import { seo } from "@/lib/seo";
import { monthly, posts, campaigns } from "@/lib/mock";
import { PageHeader, Panel, chartTooltip, NetworkDot, fmt, useAiRun, AiThinking } from "@/components/app/kit";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const Route = createFileRoute("/_app/analytics")({
  head: () => seo("Analytics", "Analyses détaillées : réseaux sociaux, top contenus, Ads et service client."),
  component: Analytics,
});

const axis = { stroke: "var(--muted-foreground)", fontSize: 12, axisLine: false, tickLine: false };
const channels = [{ name: "WhatsApp", value: 46 }, { name: "Messenger", value: 22 }, { name: "Site web", value: 20 }, { name: "Instagram", value: 12 }];
const colors = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)"];

function Analytics() {
  const ai = useAiRun();
  const [period, setPeriod] = useState("7m");
  const [insight, setInsight] = useState("");
  return (
    <>
      <PageHeader eyebrow="Performance" title="Analytics" subtitle="Mesurez l'impact de chaque action digitale."
        actions={<>
          <Select value={period} onValueChange={(v) => { setPeriod(v); toast("Période mise à jour."); }}><SelectTrigger className="w-40"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="30j">30 derniers jours</SelectItem><SelectItem value="7m">7 derniers mois</SelectItem><SelectItem value="1a">12 derniers mois</SelectItem></SelectContent></Select>
          <Button variant="ai" disabled={ai.running} onClick={async () => { await ai.run(["Analyse des performances...", "Détection des tendances..."]); setInsight("L'engagement a progressé de 46 % en 7 mois, porté par les carrousels pédagogiques LinkedIn. Les vidéos témoignages génèrent 2,3× plus de leads. Recommandation : publier 2 vidéos terrain par mois et renforcer le budget Facebook Leads."); }}><Sparkles /> Analyse IA</Button>
        </>} />
      {ai.running && <div className="mb-4"><AiThinking step={ai.step} /></div>}
      {insight && <Panel className="ai-border mb-6 bg-ai/5"><p className="mb-1 text-xs font-semibold uppercase tracking-wider text-ai">Insight IA</p><p className="text-sm">{insight}</p></Panel>}
      <Tabs defaultValue="rs">
        <TabsList className="mb-5 bg-secondary/50"><TabsTrigger value="rs">Réseaux sociaux</TabsTrigger><TabsTrigger value="top">Top contenus</TabsTrigger><TabsTrigger value="ads">Ads</TabsTrigger><TabsTrigger value="sc">Service client</TabsTrigger></TabsList>
        <TabsContent value="rs" className="grid gap-6 xl:grid-cols-2">
          <Panel><h3 className="mb-4 font-semibold">Évolution des abonnés</h3><div className="h-64"><ResponsiveContainer><AreaChart data={monthly}><defs><linearGradient id="ab" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="var(--primary)" stopOpacity={0.4} /><stop offset="100%" stopColor="var(--primary)" stopOpacity={0} /></linearGradient></defs><CartesianGrid stroke="var(--border)" vertical={false} /><XAxis dataKey="m" {...axis} /><YAxis {...axis} /><Tooltip {...chartTooltip} /><Area dataKey="abonnes" stroke="var(--primary)" fill="url(#ab)" strokeWidth={2} /></AreaChart></ResponsiveContainer></div></Panel>
          <Panel><h3 className="mb-4 font-semibold">Taux d'engagement (%)</h3><div className="h-64"><ResponsiveContainer><LineChart data={monthly}><CartesianGrid stroke="var(--border)" vertical={false} /><XAxis dataKey="m" {...axis} /><YAxis {...axis} /><Tooltip {...chartTooltip} /><Line dataKey="engagement" stroke="var(--ai)" strokeWidth={2.5} dot={{ r: 3 }} /></LineChart></ResponsiveContainer></div></Panel>
        </TabsContent>
        <TabsContent value="top">
          <Panel><h3 className="mb-4 font-semibold">Top contenus</h3>
            {posts.filter((p) => p.reach).sort((a, b) => b.reach - a.reach).map((p, i) => (
              <div key={p.id} className="flex items-center gap-4 border-b py-3 last:border-0">
                <span className="font-display text-2xl font-semibold text-muted-foreground/50">0{i + 1}</span>
                <div className="flex-1"><p className="font-medium">{p.title}</p><p className="flex items-center gap-1 text-xs text-muted-foreground"><NetworkDot n={p.network} />{p.network} · {p.type}</p></div>
                <div className="text-right text-sm"><div className="font-semibold">{fmt(p.reach)}</div><div className="text-xs text-primary">{p.engagement} %</div></div>
              </div>
            ))}
          </Panel>
        </TabsContent>
        <TabsContent value="ads" className="grid gap-6 xl:grid-cols-2">
          <Panel><h3 className="mb-4 font-semibold">Leads générés par mois</h3><div className="h-64"><ResponsiveContainer><BarChart data={monthly}><CartesianGrid stroke="var(--border)" vertical={false} /><XAxis dataKey="m" {...axis} /><YAxis {...axis} /><Tooltip {...chartTooltip} cursor={{ fill: "var(--accent)" }} /><Bar dataKey="leads" fill="var(--primary)" radius={[8, 8, 0, 0]} /></BarChart></ResponsiveContainer></div></Panel>
          <Panel><h3 className="mb-4 font-semibold">Coût par lead (€)</h3>{campaigns.map((c) => <div key={c.id} className="mb-3"><div className="flex justify-between text-sm"><span>{c.name}</span><span className="font-semibold">{c.cpl} €</span></div><div className="mt-1 h-1.5 rounded-full bg-secondary"><div className="h-full rounded-full bg-gradient-primary" style={{ width: `${(c.cpl / 14) * 100}%` }} /></div></div>)}</Panel>
        </TabsContent>
        <TabsContent value="sc" className="grid gap-6 xl:grid-cols-2">
          <Panel><h3 className="mb-4 font-semibold">Conversations par mois</h3><div className="h-64"><ResponsiveContainer><BarChart data={monthly}><CartesianGrid stroke="var(--border)" vertical={false} /><XAxis dataKey="m" {...axis} /><YAxis {...axis} /><Tooltip {...chartTooltip} cursor={{ fill: "var(--accent)" }} /><Bar dataKey="conv" fill="var(--ai)" radius={[8, 8, 0, 0]} /></BarChart></ResponsiveContainer></div></Panel>
          <Panel><h3 className="mb-4 font-semibold">Canaux de contact</h3><div className="flex items-center gap-6"><div className="h-56 w-56"><ResponsiveContainer><PieChart><Pie data={channels} dataKey="value" innerRadius={60} outerRadius={90} paddingAngle={3} stroke="none">{channels.map((_, i) => <Cell key={i} fill={colors[i]} />)}</Pie><Tooltip {...chartTooltip} /></PieChart></ResponsiveContainer></div>
            <div className="space-y-2 text-sm">{channels.map((c, i) => <div key={c.name} className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full" style={{ background: colors[i] }} />{c.name} <span className="text-muted-foreground">{c.value} %</span></div>)}<div className="pt-3 text-xs text-muted-foreground">Temps de réponse IA moyen : <span className="text-primary">8 s</span></div></div></div></Panel>
        </TabsContent>
      </Tabs>
    </>
  );
}
