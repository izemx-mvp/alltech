import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Plus, Pause, Play, TrendingUp, TrendingDown, Users, Rocket, Sparkles, Wallet, Target, MousePointerClick, Megaphone, Copy, Trash2, MoreHorizontal, Check, ArrowLeft, ArrowRight, Layers, Percent, Coins } from "lucide-react";
import { toast } from "sonner";
import { seo } from "@/lib/seo";
import { useStore, setStore, getStore, uid, ideaImages, type AdCampaign } from "@/lib/store";
import { PageHeader, Panel, Kpi, StatusBadge, statusTone, NetworkDot, fmt, AiTag, AiThinking, useAiRun } from "@/components/app/kit";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/campagnes-ads")({
  validateSearch: (s: Record<string, unknown>): { post?: string } => (typeof s["post"] === "string" ? { post: s["post"] } : {}),
  head: () => seo("Campagnes Ads IA", "Créez et pilotez vos campagnes Meta et LinkedIn avec l'assistance de l'IA."),
  component: Ads,
});

interface Reco { id: string; icon: typeof TrendingUp; title: string; why: string; impact: string; apply: () => void }

function Ads() {
  const list = useStore("campaigns");
  const { post } = Route.useSearch();
  const navigate = useNavigate({ from: "/campagnes-ads" });
  const [wizard, setWizard] = useState(false);
  const [fromPost, setFromPost] = useState<string | null>(null);

  useEffect(() => { if (post) { setFromPost(post); setWizard(true); navigate({ search: {}, replace: true }); } }, [post, navigate]);

  const upd = (id: string, patch: Partial<AdCampaign>) => setStore((s) => ({ campaigns: s.campaigns.map((c) => c.id === id ? { ...c, ...patch } : c) }));
  const [recos, setRecos] = useState<Reco[]>(() => [
    { id: "r1", icon: TrendingUp, title: "Augmenter le budget de 15 %", why: "« Lancement biostimulant automne » a un CPL 22 % sous la moyenne du compte.", impact: "+45 leads estimés / mois", apply: () => { const c = getStore().campaigns.find((x) => x.id === "c1"); if (c) upd("c1", { budget: Math.round(c.budget * 1.15) }); } },
    { id: "r2", icon: TrendingDown, title: "Réduire « Notoriété marque — Souss »", why: "Le CTR baisse depuis 5 jours et le coût par clic a augmenté de 18 %.", impact: "−320 € de dépenses inutiles", apply: () => { const c = getStore().campaigns.find((x) => x.id === "c3"); if (c) upd("c3", { budget: Math.round(c.budget * 0.8) }); } },
    { id: "r3", icon: Users, title: "Tester une audience « Arboriculteurs Oriental »", why: "Forte affinité détectée avec les contenus agrumes publiés ce mois.", impact: "CTR potentiel +0,6 pt", apply: () => {} },
    { id: "r4", icon: Rocket, title: "Sponsoriser « Témoignage +18 % de rendement »", why: "Engagement organique de 8,1 %, meilleur post du mois sur Facebook.", impact: "≈ 60 000 personnes touchées", apply: () => addCampaign({ name: "Sponsorisation — Témoignage tomates", network: "Facebook", objective: "Engagement", budget: 800 }) },
    { id: "r5", icon: Layers, title: "Créer une variante visuelle du webinar", why: "La créative actuelle est diffusée depuis 21 jours (fatigue publicitaire).", impact: "CPL −10 % estimé", apply: () => addCampaign({ name: "Webinar agrumes — Variante B", network: "LinkedIn", objective: "Inscriptions", budget: 1200 }) },
  ]);

  const active = list.filter((c) => c.status === "Active");
  const sum = (k: "budget" | "spent" | "leads" | "clicks" | "impressions") => list.reduce((s, c) => s + c[k], 0);
  const cpl = sum("leads") ? sum("spent") / sum("leads") : 0;
  const ctr = sum("impressions") ? (sum("clicks") / sum("impressions")) * 100 : 0;

  return (
    <>
      <PageHeader eyebrow="Publicité" title="Campagnes Ads IA" subtitle="Créez, optimisez et suivez vos campagnes avec l'assistance de l'IA."
        actions={<Button variant="ai" size="lg" onClick={() => { setFromPost(null); setWizard(true); }}><Sparkles /> Créer une campagne avec l'IA</Button>} />
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
        <Kpi label="Campagnes actives" value={String(active.length)} icon={Megaphone} />
        <Kpi label="Budget total" value={`${fmt(sum("budget"))} €`} icon={Wallet} />
        <Kpi label="Dépenses" value={`${fmt(sum("spent"))} €`} delta={6} icon={Coins} />
        <Kpi label="Leads" value={fmt(sum("leads"))} delta={22} icon={Target} />
        <Kpi label="Coût par lead" value={`${cpl.toFixed(2).replace(".", ",")} €`} delta={-4} icon={MousePointerClick} />
        <Kpi label="CTR" value={`${ctr.toFixed(2).replace(".", ",")} %`} delta={3} icon={Percent} />
      </div>

      <Panel className="mt-6 overflow-x-auto">
        <h3 className="mb-3 font-semibold">Campagnes</h3>
        <Table>
          <TableHeader><TableRow><TableHead>Nom</TableHead><TableHead>Plateforme</TableHead><TableHead>Objectif</TableHead><TableHead className="text-right">Budget</TableHead><TableHead>Dépense</TableHead><TableHead className="text-right">Leads</TableHead><TableHead className="text-right">CTR</TableHead><TableHead>Statut</TableHead><TableHead /></TableRow></TableHeader>
          <TableBody>
            {list.map((c) => (
              <TableRow key={c.id} className="hover:bg-accent/30">
                <TableCell className="font-medium">{c.name}</TableCell>
                <TableCell><span className="flex items-center gap-1.5"><NetworkDot n={c.network} />{c.network === "Facebook" || c.network === "Instagram" ? `Meta · ${c.network}` : c.network}</span></TableCell>
                <TableCell>{c.objective}</TableCell>
                <TableCell className="text-right">{fmt(c.budget)} €</TableCell>
                <TableCell className="min-w-36"><div className="text-xs">{fmt(c.spent)} €</div><Progress value={Math.min(100, (c.spent / c.budget) * 100)} className="mt-1 h-1" /></TableCell>
                <TableCell className="text-right">{c.leads}</TableCell>
                <TableCell className="text-right">{c.ctr.toFixed(1)} %</TableCell>
                <TableCell><StatusBadge tone={statusTone(c.status)}>{c.status}</StatusBadge></TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild><Button size="icon" variant="ghost" aria-label="Actions"><MoreHorizontal /></Button></DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {c.status !== "Terminée" && <DropdownMenuItem onClick={() => { upd(c.id, { status: c.status === "Active" ? "En pause" : "Active" }); toast.success("Campagne mise à jour."); }}>{c.status === "Active" ? <><Pause /> Mettre en pause</> : <><Play /> Réactiver</>}</DropdownMenuItem>}
                      <DropdownMenuItem onClick={() => { upd(c.id, { budget: c.budget + 500 }); toast.success("Budget augmenté de 500 €."); }}><Plus /> Budget +500 €</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => { setStore((s) => ({ campaigns: [{ ...c, id: uid(), name: `${c.name} (copie)`, status: "En pause", spent: 0, leads: 0, clicks: 0, impressions: 0 }, ...s.campaigns] })); toast.success("Campagne dupliquée."); }}><Copy /> Dupliquer</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive" onClick={() => { setStore((s) => ({ campaigns: s.campaigns.filter((x) => x.id !== c.id) })); toast("Campagne supprimée."); }}><Trash2 /> Supprimer</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Panel>

      <div className="mt-6">
        <div className="mb-3 flex items-center gap-2"><h2 className="text-lg font-semibold">Recommandations IA</h2><AiTag /></div>
        {recos.length === 0 ? <Panel><p className="py-4 text-center text-sm text-muted-foreground">Toutes les recommandations ont été appliquées. L'IA continue d'analyser vos campagnes.</p></Panel> : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {recos.map((r) => (
              <Panel key={r.id} className="ai-border glass-hover flex flex-col">
                <div className="flex items-center gap-2"><span className="grid h-9 w-9 place-items-center rounded-lg bg-ai/15 text-ai"><r.icon className="h-4 w-4" /></span><p className="font-semibold">{r.title}</p></div>
                <p className="mt-3 text-sm text-muted-foreground"><span className="font-medium text-foreground">Justification : </span>{r.why}</p>
                <p className="mt-2 text-sm"><span className="text-muted-foreground">Impact potentiel : </span><span className="font-semibold text-primary">{r.impact}</span></p>
                <div className="mt-auto flex gap-2 pt-4">
                  <Button size="sm" onClick={() => { r.apply(); setRecos((x) => x.filter((y) => y.id !== r.id)); toast.success("Campagne mise à jour."); }}><Check /> Appliquer</Button>
                  <Button size="sm" variant="ghost" onClick={() => { setRecos((x) => x.filter((y) => y.id !== r.id)); toast("Recommandation ignorée."); }}>Ignorer</Button>
                </div>
              </Panel>
            ))}
          </div>
        )}
      </div>

      <CampaignWizard open={wizard} postId={fromPost} onClose={() => setWizard(false)} />
    </>
  );
}

function addCampaign(c: { name: string; network: AdCampaign["network"]; objective: string; budget: number }) {
  setStore((s) => ({ campaigns: [{ id: uid(), ...c, status: "Active", spent: 0, impressions: 0, clicks: 0, leads: 0, cpl: 0, ctr: 0 }, ...s.campaigns] }));
}

const STEPS = ["Objectif", "Audience", "Budget", "Contenu", "Preview", "Validation"];
const OBJ = [["Leads", "Collecter des contacts qualifiés"], ["Notoriété", "Faire connaître la marque"], ["Trafic", "Envoyer vers le site"], ["Conversions", "Générer des demandes de devis"], ["Engagement", "Faire réagir la communauté"], ["Inscriptions", "Remplir un webinar ou un événement"]] as const;
const INTERESTS = ["Maraîchage", "Arboriculture", "Céréales", "Agriculture biologique", "Irrigation", "Agronomie", "Viticulture"];

function CampaignWizard({ open, postId, onClose }: { open: boolean; postId: string | null; onClose: () => void }) {
  const pubs = useStore("publications");
  const ai = useAiRun();
  const [step, setStep] = useState(0);
  const [objective, setObjective] = useState("Leads");
  const [network, setNetwork] = useState<AdCampaign["network"]>("Facebook");
  const [region, setRegion] = useState("Souss-Massa");
  const [age, setAge] = useState([25, 60]);
  const [interests, setInterests] = useState<string[]>(["Maraîchage", "Agronomie"]);
  const [budget, setBudget] = useState([2500]);
  const [days, setDays] = useState("30");
  const [name, setName] = useState("");
  const [headline, setHeadline] = useState("");
  const [text, setText] = useState("");
  const [image, setImage] = useState(ideaImages[1]!);

  useEffect(() => {
    if (!open) return;
    setStep(0);
    const p = postId ? pubs.find((x) => x.id === postId) : undefined;
    if (p) { setName(`Sponsorisation — ${p.title}`.slice(0, 80)); setHeadline(p.title); setText(p.caption.slice(0, 400)); if (p.media[0]?.kind === "image") setImage(p.media[0].url); setNetwork(p.platform); setObjective("Engagement"); toast("Publication importée dans la campagne."); }
    else { setName("Campagne nutrition tomates — Automne"); setHeadline(""); setText(""); setImage(ideaImages[1]!); }
  }, [open, postId, pubs]);

  const reach = Math.round(budget[0]! * 92);
  const leads = Math.round(budget[0]! / (objective === "Leads" ? 9.5 : 14));
  const aiContent = async () => {
    await ai.run(["Analyse de l'audience...", "Rédaction de l'annonce...", "Optimisation pour la conversion..."]);
    setHeadline("Des cultures plus fortes, un rendement maîtrisé");
    setText("🌱 Producteurs de tomates : découvrez le programme de nutrition ALLTECH qui a permis jusqu'à +18 % de rendement sous serre. Diagnostic gratuit par nos agronomes.");
    toast.success("Annonce générée par l'IA.");
  };
  const canNext = step !== 3 || (name.trim() && headline.trim() && text.trim());

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[92vh] max-w-3xl overflow-y-auto">
        <DialogHeader><DialogTitle>Créer une campagne avec l'IA</DialogTitle><DialogDescription>Étape {step + 1} sur 6 — {STEPS[step]}</DialogDescription></DialogHeader>
        <div className="flex gap-1">{STEPS.map((s, i) => <div key={s} className="flex-1"><div className={cn("h-1.5 rounded-full transition", i <= step ? "bg-gradient-primary" : "bg-secondary")} /><div className={cn("mt-1 text-[10px]", i === step ? "text-primary" : "text-muted-foreground")}>{s}</div></div>)}</div>

        <div className="min-h-64 py-2">
          {step === 0 && <div className="grid grid-cols-2 gap-3 md:grid-cols-3">{OBJ.map(([o, d]) => <button key={o} onClick={() => setObjective(o)} className={cn("rounded-xl border p-4 text-left transition", objective === o ? "border-primary/50 bg-primary/10 shadow-glow" : "hover:border-primary/30")}><div className="font-semibold">{o}</div><div className="text-xs text-muted-foreground">{d}</div></button>)}</div>}
          {step === 1 && <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div><label className="mb-1 block text-xs text-muted-foreground">Plateforme</label><Select value={network} onValueChange={(v) => setNetwork(v as AdCampaign["network"])}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{["Facebook", "Instagram", "LinkedIn"].map((n) => <SelectItem key={n} value={n}>{n}</SelectItem>)}</SelectContent></Select></div>
              <div><label className="mb-1 block text-xs text-muted-foreground">Région</label><Select value={region} onValueChange={setRegion}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{["Souss-Massa", "Oriental", "Fès-Meknès", "Gharb", "Tout le Maroc", "France"].map((n) => <SelectItem key={n} value={n}>{n}</SelectItem>)}</SelectContent></Select></div>
            </div>
            <div><div className="mb-2 flex justify-between text-xs"><span className="text-muted-foreground">Âge</span><span>{age[0]} – {age[1]} ans</span></div><Slider value={age} min={18} max={70} step={1} onValueChange={setAge} /></div>
            <div><p className="mb-2 text-xs text-muted-foreground">Centres d'intérêt</p><div className="flex flex-wrap gap-2">{INTERESTS.map((i) => <button key={i} onClick={() => setInterests((x) => x.includes(i) ? x.filter((y) => y !== i) : [...x, i])} className={cn("rounded-full border px-3 py-1 text-xs", interests.includes(i) ? "border-primary/50 bg-primary/15 text-primary" : "text-muted-foreground")}>{i}</button>)}</div></div>
            <p className="rounded-lg bg-ai/10 p-3 text-xs text-ai"><Sparkles className="mr-1 inline h-3 w-3" />Audience estimée : {fmt(48000 + interests.length * 9000)} agriculteurs et professionnels.</p>
          </div>}
          {step === 2 && <div className="space-y-5">
            <div><div className="mb-2 flex justify-between text-sm"><span className="text-muted-foreground">Budget total</span><span className="font-display text-xl font-semibold text-primary">{fmt(budget[0]!)} €</span></div><Slider value={budget} min={300} max={10000} step={100} onValueChange={setBudget} /></div>
            <div className="w-48"><label className="mb-1 block text-xs text-muted-foreground">Durée</label><Select value={days} onValueChange={setDays}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{["7", "14", "30", "60"].map((d) => <SelectItem key={d} value={d}>{d} jours</SelectItem>)}</SelectContent></Select></div>
            <div className="grid grid-cols-3 gap-3 text-center">{[["Portée estimée", fmt(reach)], ["Leads estimés", fmt(leads)], ["Budget / jour", `${Math.round(budget[0]! / Number(days))} €`]].map(([l, v]) => <div key={l} className="rounded-xl bg-secondary/40 p-3"><div className="font-display text-lg font-semibold">{v}</div><div className="text-xs text-muted-foreground">{l}</div></div>)}</div>
          </div>}
          {step === 3 && <div className="space-y-3">
            <div className="flex justify-end"><Button size="sm" variant="ai" disabled={ai.running} onClick={aiContent}><Sparkles /> Générer l'annonce avec l'IA</Button></div>
            {ai.running && <AiThinking step={ai.step} />}
            <Input placeholder="Nom de la campagne" maxLength={80} value={name} onChange={(e) => setName(e.target.value)} />
            <Input placeholder="Titre de l'annonce" maxLength={90} value={headline} onChange={(e) => setHeadline(e.target.value)} />
            <Textarea placeholder="Texte de l'annonce" maxLength={600} rows={4} value={text} onChange={(e) => setText(e.target.value)} />
            <div><p className="mb-2 text-xs text-muted-foreground">Visuel</p><div className="flex gap-2">{ideaImages.map((im) => <button key={im} onClick={() => setImage(im)} className={cn("overflow-hidden rounded-lg border-2", image === im ? "border-primary" : "border-transparent")}><img src={im} alt="" className="h-14 w-20 object-cover" /></button>)}</div></div>
          </div>}
          {step === 4 && <div className="mx-auto max-w-sm overflow-hidden rounded-xl border bg-popover shadow-xl">
            <div className="flex items-center gap-2 p-3"><span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-primary text-xs font-bold text-primary-foreground">A</span><div><div className="text-sm font-semibold">ALLTECH</div><div className="text-[11px] text-muted-foreground">Sponsorisé · {network}</div></div></div>
            <p className="px-3 pb-3 text-sm">{text}</p>
            <img src={image} alt="" className="aspect-[1.6] w-full object-cover" />
            <div className="flex items-center justify-between bg-secondary/50 p-3"><div className="text-sm font-semibold">{headline}</div><span className="rounded-md bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">{objective === "Leads" ? "S'inscrire" : "En savoir plus"}</span></div>
          </div>}
          {step === 5 && <dl className="grid grid-cols-2 gap-3 text-sm">
            {[["Nom", name], ["Objectif", objective], ["Plateforme", network], ["Audience", `${region} · ${age[0]}-${age[1]} ans · ${interests.join(", ") || "large"}`], ["Budget", `${fmt(budget[0]!)} € sur ${days} jours`], ["Résultats estimés", `${fmt(reach)} personnes · ${leads} leads`]].map(([k, v]) => <div key={k} className="rounded-xl bg-secondary/40 p-3"><dt className="text-xs text-muted-foreground">{k}</dt><dd className="font-medium">{v}</dd></div>)}
          </dl>}
        </div>

        <DialogFooter className="sm:justify-between">
          <Button variant="ghost" disabled={step === 0} onClick={() => setStep(step - 1)}><ArrowLeft /> Retour</Button>
          {step < 5 ? <Button disabled={!canNext} onClick={() => setStep(step + 1)}>Suivant <ArrowRight /></Button>
            : <Button onClick={() => { addCampaign({ name: name.trim(), network, objective, budget: budget[0]! }); onClose(); toast.success("Campagne créée et lancée."); }}><Rocket /> Lancer la campagne</Button>}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
