import { useState } from "react";
import { Sparkles, Eye, Pencil, Wand2, Trash2, Linkedin, Facebook, Lightbulb } from "lucide-react";
import { toast } from "sonner";
import { useStore, setStore, getStore, ideaImages, todayFr, uid, pubTone, TONES, OBJECTIVES, THEMES, type Idea, type Platform } from "@/lib/store";
import { AiThinking, useAiRun, StatusBadge, EmptyState } from "@/components/app/kit";
import { PostWizard } from "./PostWizard";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const POOL = [
  ["Pourquoi adapter la fertilisation aux besoins réels de la culture ?", "Démontrer l'intérêt économique et agronomique d'une fertilisation raisonnée."],
  ["Les erreurs fréquentes dans la nutrition des cultures", "Un format « à éviter » qui interpelle et génère des commentaires."],
  ["Zinc, bore, manganèse : les oligo-éléments qui font la différence", "Carrousel pédagogique sur les micronutriments essentiels."],
  ["Témoignage : une coopérative d'agrumes à Berkane", "Résultats terrain et parole d'agriculteurs pour renforcer la confiance."],
  ["Préparer ses sols avant les semis d'automne", "Checklist saisonnière pratique, très partageable."],
  ["Biostimulants : mythe ou réalité ?", "Démystifier avec des données d'essais terrain."],
  ["Nutrition foliaire : le bon timing pour une efficacité maximale", "Conseils concrets sur les horaires et conditions d'application."],
  ["Innovation : la nutrition de précision au service du rendement", "Mettre en avant l'expertise technologique d'ALLTECH."],
] as const;

export function IdeasTab() {
  const ideas = useStore("ideas");
  const ai = useAiRun();
  const [detail, setDetail] = useState<Idea | null>(null);
  const [edit, setEdit] = useState<Idea | null>(null);
  const [wizard, setWizard] = useState<Idea | null>(null);

  const generate = async () => {
    await ai.run(["Analyse de votre configuration...", "Recherche de sujets pertinents...", "Génération des idées..."], 850);
    const cfg = getStore().cmConfig;
    const existing = new Set(getStore().ideas.map((i) => i.title));
    const fresh = POOL.filter(([t]) => !existing.has(t)).slice(0, 4);
    const pick = fresh.length ? fresh : POOL.slice(0, 4);
    const created: Idea[] = pick.map(([title, description], i) => {
      const platform: Platform = i % 2 === 0 ? "LinkedIn" : "Facebook";
      return { id: uid(), title: fresh.length ? title : `${title} (variante)`, description, platform, theme: cfg.themes[i % cfg.themes.length] ?? "Nutrition végétale",
        tone: cfg.platforms[platform].tone, objective: cfg.platforms[platform].objective, createdAt: todayFr(), status: "Brouillon", image: ideaImages[(i + ideas.length) % 5]! };
    });
    setStore((s) => ({ ideas: [...created, ...s.ideas] }));
    toast.success(`${created.length} idées générées selon votre configuration.`);
  };

  return (
    <div>
      <div className="glass ai-border relative mb-6 overflow-hidden rounded-2xl p-6">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-ai/20 blur-3xl" />
        <div className="relative flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold">Idées de contenu générées par votre Community Manager IA</h2>
            <p className="mt-1 text-sm text-muted-foreground">Les suggestions sont automatiquement adaptées à votre configuration, votre audience et votre tonalité.</p>
          </div>
          <Button variant="ai" size="lg" className="h-12 px-6 text-base" onClick={generate} disabled={ai.running}><Sparkles className="!size-5" /> Générer des idées avec l'IA</Button>
        </div>
        {ai.running && <div className="relative mt-4"><AiThinking step={ai.step} /></div>}
      </div>

      {ideas.length === 0 ? <EmptyState icon={Lightbulb} title="Aucune idée pour l'instant" text="Cliquez sur « Générer des idées avec l'IA » pour obtenir des suggestions." /> : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {ideas.map((i) => {
            const P = i.platform === "LinkedIn" ? Linkedin : Facebook;
            return (
              <div key={i.id} className="glass glass-hover group flex flex-col overflow-hidden rounded-2xl animate-in fade-in zoom-in-95">
                <div className="relative h-44 overflow-hidden">
                  <img src={i.image} alt={i.title} loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
                  <span className="absolute left-3 top-3"><StatusBadge tone={pubTone(i.status)}>{i.status}</StatusBadge></span>
                  <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-background/80 px-2 py-0.5 text-[11px] backdrop-blur"><P className="h-3 w-3 text-info" />{i.platform}</span>
                </div>
                <div className="flex flex-1 flex-col p-4">
                  <h3 className="font-semibold leading-snug">{i.title}</h3>
                  <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{i.description}</p>
                  <div className="mt-3 flex flex-wrap gap-1.5"><StatusBadge tone="green">{i.theme}</StatusBadge><StatusBadge tone="ai">{i.tone}</StatusBadge><StatusBadge tone="blue">{i.objective}</StatusBadge></div>
                  <p className="mt-3 text-[11px] text-muted-foreground">Générée le {i.createdAt}</p>
                  <div className="mt-auto flex items-center gap-1 pt-4">
                    <Button size="sm" variant="ai" onClick={() => setWizard(i)}><Wand2 /> Générer le post</Button>
                    <Button size="icon" variant="ghost" title="Voir le détail" onClick={() => setDetail(i)}><Eye /></Button>
                    <Button size="icon" variant="ghost" title="Modifier" onClick={() => setEdit(i)}><Pencil /></Button>
                    <Button size="icon" variant="ghost" title="Supprimer" className="ml-auto" onClick={() => { setStore((s) => ({ ideas: s.ideas.filter((x) => x.id !== i.id) })); toast("Idée supprimée."); }}><Trash2 /></Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Dialog open={!!detail} onOpenChange={(o) => !o && setDetail(null)}>
        <DialogContent className="max-w-lg">
          {detail && <>
            <img src={detail.image} alt="" className="-mx-6 -mt-6 h-48 w-[calc(100%+3rem)] max-w-none rounded-t-lg object-cover" />
            <DialogHeader><DialogTitle>{detail.title}</DialogTitle><DialogDescription>{detail.description}</DialogDescription></DialogHeader>
            <dl className="grid grid-cols-2 gap-3 text-sm">
              {[["Plateforme", detail.platform], ["Thématique", detail.theme], ["Tonalité", detail.tone], ["Objectif", detail.objective], ["Générée le", detail.createdAt], ["Statut", detail.status]].map(([k, v]) => <div key={k} className="rounded-lg bg-secondary/40 p-2"><dt className="text-xs text-muted-foreground">{k}</dt><dd className="font-medium">{v}</dd></div>)}
            </dl>
            <DialogFooter><Button variant="ai" onClick={() => { setWizard(detail); setDetail(null); }}><Wand2 /> Générer le post</Button></DialogFooter>
          </>}
        </DialogContent>
      </Dialog>

      <Dialog open={!!edit} onOpenChange={(o) => !o && setEdit(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Modifier l'idée</DialogTitle></DialogHeader>
          {edit && <div className="space-y-3">
            <Input maxLength={160} value={edit.title} onChange={(e) => setEdit({ ...edit, title: e.target.value })} />
            <Textarea maxLength={500} rows={3} value={edit.description} onChange={(e) => setEdit({ ...edit, description: e.target.value })} />
            <div className="grid grid-cols-2 gap-2">
              <Select value={edit.platform} onValueChange={(v) => setEdit({ ...edit, platform: v as Platform })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="LinkedIn">LinkedIn</SelectItem><SelectItem value="Facebook">Facebook</SelectItem></SelectContent></Select>
              <Select value={edit.theme} onValueChange={(v) => setEdit({ ...edit, theme: v })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{THEMES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent></Select>
              <Select value={edit.tone} onValueChange={(v) => setEdit({ ...edit, tone: v })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{TONES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent></Select>
              <Select value={edit.objective} onValueChange={(v) => setEdit({ ...edit, objective: v })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{OBJECTIVES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent></Select>
            </div>
          </div>}
          <DialogFooter><Button onClick={() => { if (!edit?.title.trim()) { toast.error("Le titre est requis."); return; } setStore((s) => ({ ideas: s.ideas.map((x) => x.id === edit.id ? edit : x) })); setEdit(null); toast.success("Idée mise à jour."); }}>Enregistrer</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <PostWizard idea={wizard} onClose={() => setWizard(null)} />
    </div>
  );
}
