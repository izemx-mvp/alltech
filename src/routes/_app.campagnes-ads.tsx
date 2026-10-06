import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Plus, Pause, Play, TrendingUp, Users, Rocket, Sparkles, Wallet, Target, MousePointerClick, Eye } from "lucide-react";
import { toast } from "sonner";
import { seo } from "@/lib/seo";
import { campaigns as seed, type Campaign } from "@/lib/mock";
import { PageHeader, Panel, Kpi, StatusBadge, statusTone, NetworkDot, fmt, chartTooltip, AiTag } from "@/components/app/kit";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const Route = createFileRoute("/_app/campagnes-ads")({
  head: () => seo("Campagnes Ads", "Suivez budgets, leads et recommandations IA de vos campagnes publicitaires."),
  component: Ads,
});

function Ads() {
  const [list, setList] = useState<Campaign[]>(seed);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [budget, setBudget] = useState("2000");
  const [network, setNetwork] = useState("Facebook");
  const [recos, setRecos] = useState([
    { icon: TrendingUp, t: "Augmenter le budget de cette campagne de 15 %", d: "« Lancement biostimulant automne » : CPL 22 % sous la moyenne.", act: () => setList((l) => l.map((c) => c.id === "c1" ? { ...c, budget: Math.round(c.budget * 1.15) } : c)) },
    { icon: Users, t: "Tester une nouvelle audience", d: "Producteurs d'agrumes 35-55 ans, région Oriental.", act: () => {} },
    { icon: Rocket, t: "Sponsoriser ce contenu", d: "« Témoignage tomates sous serre » : engagement organique de 8,1 %.", act: () => {} },
  ]);
  const active = list.filter((c) => c.status === "Active");
  const total = (k: keyof Campaign) => list.reduce((s, c) => s + (c[k] as number), 0);

  return (
    <>
      <PageHeader eyebrow="Publicité" title="Campagnes Ads" subtitle="Pilotez vos investissements publicitaires avec l'aide de l'IA."
        actions={<Button onClick={() => setOpen(true)}><Plus /> Nouvelle campagne</Button>} />
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <Kpi label="Budget consommé" value={`${fmt(total("spent"))} €`} delta={6} icon={Wallet} />
        <Kpi label="Impressions" value={fmt(total("impressions"))} delta={14} icon={Eye} />
        <Kpi label="Clics" value={fmt(total("clicks"))} delta={9} icon={MousePointerClick} />
        <Kpi label="Leads" value={fmt(total("leads"))} delta={22} icon={Target} />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <Panel className="xl:col-span-2">
          <h3 className="mb-4 font-semibold">Leads par campagne</h3>
          <div className="h-64"><ResponsiveContainer><BarChart data={list}>
            <CartesianGrid stroke="var(--border)" vertical={false} />
            <XAxis dataKey="name" tick={false} axisLine={false} /><YAxis stroke="var(--muted-foreground)" fontSize={12} axisLine={false} tickLine={false} />
            <Tooltip {...chartTooltip} cursor={{ fill: "var(--accent)" }} />
            <Bar dataKey="leads" fill="var(--primary)" radius={[8, 8, 0, 0]} />
          </BarChart></ResponsiveContainer></div>
        </Panel>
        <Panel className="ai-border">
          <div className="mb-3 flex items-center justify-between"><h3 className="font-semibold">Recommandations IA</h3><AiTag /></div>
          <div className="space-y-3">
            {recos.length === 0 && <p className="py-6 text-center text-sm text-muted-foreground">Toutes les recommandations ont été appliquées.</p>}
            {recos.map((r) => (
              <div key={r.t} className="rounded-xl border bg-secondary/30 p-3">
                <div className="flex gap-2"><r.icon className="mt-0.5 h-4 w-4 shrink-0 text-ai" /><div><p className="text-sm font-semibold">{r.t}</p><p className="text-xs text-muted-foreground">{r.d}</p></div></div>
                <Button size="sm" className="mt-2" onClick={() => { r.act(); setRecos((x) => x.filter((y) => y.t !== r.t)); toast.success("Campagne mise à jour."); }}><Sparkles /> Appliquer</Button>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {list.map((c) => (
          <Panel key={c.id} className="glass-hover">
            <div className="flex items-start justify-between gap-2"><div><p className="font-semibold">{c.name}</p><p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground"><NetworkDot n={c.network} />{c.network} · {c.objective}</p></div><StatusBadge tone={statusTone(c.status)}>{c.status}</StatusBadge></div>
            <Progress value={(c.spent / c.budget) * 100} className="mt-4 h-1.5" />
            <div className="mt-1 text-xs text-muted-foreground">{fmt(c.spent)} € dépensés sur {fmt(c.budget)} €</div>
            <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
              <div><div className="font-semibold">{fmt(c.clicks)}</div><div className="text-muted-foreground">Clics</div></div>
              <div><div className="font-semibold">{c.leads}</div><div className="text-muted-foreground">Leads</div></div>
              <div><div className="font-semibold">{c.cpl} €</div><div className="text-muted-foreground">CPL</div></div>
            </div>
            {c.status !== "Terminée" && (
              <Button size="sm" variant="outline" className="mt-4 w-full" onClick={() => { setList((l) => l.map((x) => x.id === c.id ? { ...x, status: x.status === "Active" ? "En pause" : "Active" } : x)); toast.success("Campagne mise à jour."); }}>
                {c.status === "Active" ? <><Pause /> Mettre en pause</> : <><Play /> Réactiver</>}
              </Button>
            )}
          </Panel>
        ))}
      </div>
      <p className="mt-3 text-xs text-muted-foreground">{active.length} campagnes actives</p>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Nouvelle campagne</DialogTitle></DialogHeader>
          <Input placeholder="Nom de la campagne" value={name} maxLength={120} onChange={(e) => setName(e.target.value)} />
          <Input type="number" min={100} placeholder="Budget (€)" value={budget} onChange={(e) => setBudget(e.target.value)} />
          <Select value={network} onValueChange={setNetwork}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{["Facebook", "Instagram", "LinkedIn"].map((n) => <SelectItem key={n} value={n}>{n}</SelectItem>)}</SelectContent></Select>
          <DialogFooter><Button disabled={!name.trim() || Number(budget) < 100} onClick={() => {
            setList((l) => [{ id: crypto.randomUUID(), name: name.trim(), network: network as Campaign["network"], status: "Active", budget: Number(budget), spent: 0, impressions: 0, clicks: 0, leads: 0, cpl: 0, objective: "Leads" }, ...l]);
            setOpen(false); setName(""); toast.success("Campagne créée et lancée.");
          }}>Lancer la campagne</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
