import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Sparkles, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { toast } from "sonner";
import { seo } from "@/lib/seo";
import { posts as seed, type Post } from "@/lib/mock";
import { PageHeader, Panel, AiThinking, useAiRun, NetworkDot } from "@/components/app/kit";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/calendrier")({
  head: () => seo("Calendrier éditorial", "Planifiez et réorganisez vos publications par glisser-déposer."),
  component: Cal,
});

const MONTHS = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
const aiPosts = ["Conseil du lundi : fertirrigation", "Focus produit : biostimulant racinaire", "Témoignage coopérative", "Quiz nutrition des agrumes", "Infographie carences", "Live agronome", "Récap de la semaine"];
const nets = ["LinkedIn", "Facebook", "Instagram"] as const;

function Cal() {
  const ai = useAiRun();
  const [month, setMonth] = useState(9);
  const [items, setItems] = useState<Post[]>(seed);
  const [drag, setDrag] = useState<string | null>(null);
  const [over, setOver] = useState<string | null>(null);
  const [newDay, setNewDay] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [net, setNet] = useState("LinkedIn");

  const first = new Date(2026, month, 1);
  const offset = (first.getDay() + 6) % 7;
  const days = new Date(2026, month + 1, 0).getDate();
  const key = (d: number) => `2026-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

  const generate = async () => {
    await ai.run(["Analyse des performances...", "Identification des meilleurs créneaux...", "Génération du calendrier..."]);
    const add: Post[] = aiPosts.map((t, i) => ({ id: crypto.randomUUID(), title: t, network: nets[i % 3]!, status: "À valider", date: key(Math.min(days, 13 + i * 2)), time: "09:00", reach: 0, engagement: 0, ai: true, type: "Post" }));
    setItems((x) => [...x, ...add]);
    toast.success("Calendrier généré : 7 publications proposées par l'IA.");
  };

  return (
    <>
      <PageHeader eyebrow="Planification" title="Calendrier éditorial" subtitle="Glissez-déposez vos publications pour les reprogrammer."
        actions={<Button variant="ai" onClick={generate} disabled={ai.running}><Sparkles /> Générer mon calendrier avec l'IA</Button>} />
      {ai.running && <div className="mb-4"><AiThinking step={ai.step} /></div>}
      <Panel>
        <div className="mb-4 flex items-center gap-2">
          <Button size="icon" variant="outline" onClick={() => setMonth((m) => Math.max(0, m - 1))}><ChevronLeft /></Button>
          <h3 className="w-40 text-center font-semibold">{MONTHS[month]} 2026</h3>
          <Button size="icon" variant="outline" onClick={() => setMonth((m) => Math.min(11, m + 1))}><ChevronRight /></Button>
          <div className="ml-auto flex gap-3 text-xs text-muted-foreground">{nets.map((n) => <span key={n} className="flex items-center gap-1"><NetworkDot n={n} />{n}</span>)}</div>
        </div>
        <div className="grid grid-cols-7 gap-px overflow-hidden rounded-xl border bg-border text-xs">
          {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map((d) => <div key={d} className="bg-background/80 p-2 text-center font-medium text-muted-foreground">{d}</div>)}
          {Array.from({ length: offset }).map((_, i) => <div key={`e${i}`} className="min-h-28 bg-background/40" />)}
          {Array.from({ length: days }, (_, i) => i + 1).map((d) => {
            const k = key(d);
            const list = items.filter((p) => p.date === k);
            const today = month === 9 && d === 6;
            return (
              <div key={d} onDragOver={(e) => { e.preventDefault(); setOver(k); }} onDragLeave={() => setOver(null)}
                onDrop={() => { if (drag) { setItems((x) => x.map((p) => p.id === drag ? { ...p, date: k } : p)); toast.success(`Publication déplacée au ${d} ${MONTHS[month]!.toLowerCase()}.`); } setDrag(null); setOver(null); }}
                className={cn("group min-h-28 bg-background/70 p-1.5 transition", over === k && "bg-primary/10")}>
                <div className="mb-1 flex items-center justify-between">
                  <span className={cn("grid h-6 w-6 place-items-center rounded-full", today && "bg-primary font-bold text-primary-foreground")}>{d}</span>
                  <button onClick={() => setNewDay(k)} className="opacity-0 transition group-hover:opacity-100" aria-label="Ajouter"><Plus className="h-3.5 w-3.5 text-primary" /></button>
                </div>
                <div className="space-y-1">
                  {list.map((p) => (
                    <div key={p.id} draggable onDragStart={() => setDrag(p.id)}
                      className={cn("cursor-grab truncate rounded-md border px-1.5 py-1 active:cursor-grabbing", p.ai ? "border-ai/30 bg-ai/10" : "border-primary/20 bg-primary/10")}>
                      <span className="flex items-center gap-1"><NetworkDot n={p.network} /><span className="truncate">{p.title}</span></span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </Panel>

      <Dialog open={!!newDay} onOpenChange={(o) => !o && setNewDay(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Nouvelle publication · {newDay?.split("-").reverse().join("/")}</DialogTitle></DialogHeader>
          <Input placeholder="Titre de la publication" value={title} maxLength={200} onChange={(e) => setTitle(e.target.value)} />
          <Select value={net} onValueChange={setNet}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{nets.map((n) => <SelectItem key={n} value={n}>{n}</SelectItem>)}</SelectContent></Select>
          <DialogFooter><Button disabled={!title.trim()} onClick={() => {
            setItems((x) => [...x, { id: crypto.randomUUID(), title: title.trim(), network: net as Post["network"], status: "Programmé", date: newDay!, time: "10:00", reach: 0, engagement: 0, type: "Post" }]);
            setTitle(""); setNewDay(null); toast.success("Publication programmée avec succès.");
          }}>Programmer</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
