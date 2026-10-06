import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, CalendarDays, CalendarRange, List, Linkedin, Facebook, Save, CalendarClock, Send, Ban, Trash2, Megaphone } from "lucide-react";
import { toast } from "sonner";
import { useStore, setStore, pubTone, TONES, TODAY, type Publication, type Platform, type PubStatus } from "@/lib/store";
import { Panel, StatusBadge, EmptyState } from "@/components/app/kit";
import { MediaDropzone } from "./MediaDropzone";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

const MONTHS = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
const DAYS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
const iso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const parse = (s: string) => { const [y, m, d] = s.split("-").map(Number); return new Date(y!, m! - 1, d!); };
const addDays = (s: string, n: number) => { const d = parse(s); d.setDate(d.getDate() + n); return iso(d); };
const mondayOf = (s: string) => { const d = parse(s); d.setDate(d.getDate() - ((d.getDay() + 6) % 7)); return iso(d); };
const frDate = (s: string) => parse(s).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" });
const statusBar: Record<PubStatus, string> = { Brouillon: "border-l-muted-foreground", "Planifié": "border-l-info", "Publié": "border-l-primary", "Annulé": "border-l-destructive opacity-60 line-through" };

export function CalendarTab() {
  const pubs = useStore("publications");
  const [view, setView] = useState<"mois" | "semaine" | "liste">("mois");
  const [cursor, setCursor] = useState(TODAY);
  const [drag, setDrag] = useState<string | null>(null);
  const [over, setOver] = useState<string | null>(null);
  const [open, setOpen] = useState<Publication | null>(null);
  const [filter, setFilter] = useState<"Tous" | PubStatus>("Tous");

  const move = (id: string, date: string) => {
    setStore((s) => ({ publications: s.publications.map((p) => p.id === id ? { ...p, date } : p) }));
    toast.success("Planification mise à jour.");
  };
  const dropProps = (k: string) => ({
    onDragOver: (e: React.DragEvent) => { e.preventDefault(); setOver(k); },
    onDragLeave: () => setOver(null),
    onDrop: () => { if (drag) move(drag, k); setDrag(null); setOver(null); },
  });
  const shift = (n: number) => {
    if (view === "semaine") setCursor(addDays(cursor, n * 7));
    else { const d = parse(cursor); d.setMonth(d.getMonth() + n, 1); setCursor(iso(d)); }
  };

  const cd = parse(cursor);
  const visible = pubs.filter((p) => filter === "Tous" || p.status === filter);
  const byDay = (k: string) => visible.filter((p) => p.date === k).sort((a, b) => a.time.localeCompare(b.time));
  const weekStart = mondayOf(cursor);
  const title = view === "semaine" ? `Semaine du ${parse(weekStart).toLocaleDateString("fr-FR", { day: "numeric", month: "long" })}` : `${MONTHS[cd.getMonth()]} ${cd.getFullYear()}`;

  const Item = ({ p, compact }: { p: Publication; compact?: boolean }) => {
    const I = p.platform === "LinkedIn" ? Linkedin : Facebook;
    return (
      <button draggable onDragStart={() => setDrag(p.id)} onClick={() => setOpen(p)}
        className={cn("w-full cursor-grab rounded-md border border-l-[3px] bg-secondary/60 px-1.5 py-1 text-left text-[11px] transition hover:bg-accent active:cursor-grabbing", statusBar[p.status])}>
        <span className="flex items-center gap-1"><I className="h-3 w-3 shrink-0 text-info" /><span className="font-semibold">{p.time}</span><span className="truncate">{p.title}</span></span>
        {!compact && <span className="mt-1 flex items-center gap-1"><StatusBadge tone={pubTone(p.status)}>{p.status}</StatusBadge><span className="text-muted-foreground">{p.type}</span></span>}
      </button>
    );
  };

  return (
    <Panel>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <Button size="icon" variant="outline" onClick={() => shift(-1)} aria-label="Précédent"><ChevronLeft /></Button>
        <h3 className="min-w-48 text-center font-semibold capitalize">{title}</h3>
        <Button size="icon" variant="outline" onClick={() => shift(1)} aria-label="Suivant"><ChevronRight /></Button>
        <Button size="sm" variant="ghost" onClick={() => setCursor(TODAY)}>Aujourd'hui</Button>
        <Select value={filter} onValueChange={(v) => setFilter(v as typeof filter)}><SelectTrigger className="ml-auto w-36"><SelectValue /></SelectTrigger><SelectContent>{["Tous", "Brouillon", "Planifié", "Publié", "Annulé"].map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select>
        <div className="flex rounded-lg border bg-secondary/40 p-0.5">
          {([["mois", CalendarDays, "Mois"], ["semaine", CalendarRange, "Semaine"], ["liste", List, "Liste"]] as const).map(([v, I, l]) => (
            <button key={v} onClick={() => setView(v)} className={cn("flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs transition", view === v ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground")}><I className="h-3.5 w-3.5" />{l}</button>
          ))}
        </div>
      </div>

      {view === "mois" && (() => {
        const first = new Date(cd.getFullYear(), cd.getMonth(), 1);
        const offset = (first.getDay() + 6) % 7;
        const days = new Date(cd.getFullYear(), cd.getMonth() + 1, 0).getDate();
        return (
          <div className="grid grid-cols-7 gap-px overflow-hidden rounded-xl border bg-border text-xs">
            {DAYS.map((d) => <div key={d} className="bg-background/80 p-2 text-center font-medium text-muted-foreground">{d}</div>)}
            {Array.from({ length: offset }).map((_, i) => <div key={`e${i}`} className="min-h-28 bg-background/40" />)}
            {Array.from({ length: days }, (_, i) => i + 1).map((d) => {
              const k = iso(new Date(cd.getFullYear(), cd.getMonth(), d));
              return (
                <div key={k} {...dropProps(k)} className={cn("min-h-28 space-y-1 bg-background/70 p-1.5 transition", over === k && "bg-primary/10 ring-1 ring-inset ring-primary/40")}>
                  <span className={cn("grid h-6 w-6 place-items-center rounded-full", k === TODAY && "bg-primary font-bold text-primary-foreground")}>{d}</span>
                  {byDay(k).map((p) => <Item key={p.id} p={p} compact />)}
                </div>
              );
            })}
          </div>
        );
      })()}

      {view === "semaine" && (
        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)).map((k, i) => (
            <div key={k} {...dropProps(k)} className={cn("min-h-[420px] rounded-xl border bg-background/50 p-2 transition", over === k && "border-primary/50 bg-primary/10")}>
              <div className={cn("mb-2 rounded-lg p-2 text-center", k === TODAY && "bg-primary/15")}><div className="text-xs text-muted-foreground">{DAYS[i]}</div><div className="font-display text-lg font-semibold">{parse(k).getDate()}</div></div>
              <div className="space-y-1.5">{byDay(k).map((p) => <Item key={p.id} p={p} />)}</div>
            </div>
          ))}
        </div>
      )}

      {view === "liste" && (() => {
        const sorted = [...visible].sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
        if (!sorted.length) return <EmptyState icon={CalendarDays} title="Aucune publication" text="Aucune publication ne correspond à ce filtre." />;
        return (
          <div className="divide-y rounded-xl border">
            {sorted.map((p) => { const I = p.platform === "LinkedIn" ? Linkedin : Facebook; return (
              <button key={p.id} onClick={() => setOpen(p)} className="flex w-full items-center gap-4 p-3 text-left transition hover:bg-accent/30">
                <div className="w-28 shrink-0 text-xs"><div className="font-semibold capitalize">{parse(p.date).toLocaleDateString("fr-FR", { day: "2-digit", month: "short" })}</div><div className="text-muted-foreground">{p.time}</div></div>
                {p.media[0]?.kind === "image" ? <img src={p.media[0].url} alt="" className="h-10 w-14 rounded-md object-cover" /> : <span className="h-10 w-14 rounded-md bg-secondary" />}
                <div className="min-w-0 flex-1"><div className="truncate font-medium">{p.title}</div><div className="flex items-center gap-1 text-xs text-muted-foreground"><I className="h-3 w-3 text-info" />{p.platform} · {p.type}</div></div>
                <StatusBadge tone={pubTone(p.status)}>{p.status}</StatusBadge>
              </button>); })}
          </div>
        );
      })()}

      <p className="mt-3 text-xs text-muted-foreground">Astuce : glissez-déposez une publication sur un autre jour pour la replanifier.</p>
      <PublicationSheet pub={open} onClose={() => setOpen(null)} />
    </Panel>
  );
}

function PublicationSheet({ pub, onClose }: { pub: Publication | null; onClose: () => void }) {
  const navigate = useNavigate();
  const [p, setP] = useState<Publication | null>(pub);
  useEffect(() => setP(pub), [pub]);
  if (!p) return <Sheet open={false} />;
  const commit = (patch: Partial<Publication>, msg: string) => {
    setStore((s) => ({ publications: s.publications.map((x) => x.id === p.id ? { ...p, ...patch } : x) }));
    toast.success(msg); onClose();
  };
  return (
    <Sheet open={!!pub} onOpenChange={(o) => !o && onClose()}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-xl">
        <SheetHeader><SheetTitle>Détail de la publication</SheetTitle><SheetDescription className="capitalize">{frDate(p.date)} · {p.time} · <StatusBadge tone={pubTone(p.status)}>{p.status}</StatusBadge></SheetDescription></SheetHeader>
        <div className="mt-5 space-y-4">
          <L label="Titre / contenu"><Input maxLength={160} value={p.title} onChange={(e) => setP({ ...p, title: e.target.value })} /></L>
          <div className="grid grid-cols-2 gap-3">
            <L label="Plateforme"><Select value={p.platform} onValueChange={(v) => setP({ ...p, platform: v as Platform })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="LinkedIn">LinkedIn</SelectItem><SelectItem value="Facebook">Facebook</SelectItem></SelectContent></Select></L>
            <L label="Tonalité"><Select value={p.tone} onValueChange={(v) => setP({ ...p, tone: v })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{TONES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent></Select></L>
            <L label="Date"><Input type="date" value={p.date} onChange={(e) => setP({ ...p, date: e.target.value })} /></L>
            <L label="Heure"><Input type="time" value={p.time} onChange={(e) => setP({ ...p, time: e.target.value })} /></L>
          </div>
          <L label="Légende"><Textarea rows={6} maxLength={3000} value={p.caption} onChange={(e) => setP({ ...p, caption: e.target.value })} /></L>
          <L label="Hashtags"><Input maxLength={300} value={p.hashtags} onChange={(e) => setP({ ...p, hashtags: e.target.value })} /></L>
          <L label="Call-to-action"><Input maxLength={60} value={p.cta} onChange={(e) => setP({ ...p, cta: e.target.value })} /></L>
          <L label="Médias"><MediaDropzone media={p.media} onChange={(m) => setP({ ...p, media: m })} /></L>
          <div className="grid grid-cols-2 gap-2 pt-2">
            <Button onClick={() => commit({}, "Publication enregistrée.")}><Save /> Enregistrer</Button>
            <Button variant="outline" onClick={() => { if (!p.date || p.date < TODAY) { toast.error("Choisissez une date à venir."); return; } commit({ status: "Planifié" }, "Planification mise à jour."); }}><CalendarClock /> Replanifier</Button>
            <Button variant="outline" onClick={() => commit({ status: "Publié", date: TODAY }, "Publication publiée avec succès.")}><Send /> Publier maintenant</Button>
            <Button variant="outline" onClick={() => commit({ status: "Annulé" }, "Publication annulée.")}><Ban /> Annuler la publication</Button>
            <Button variant="ai" onClick={() => { onClose(); navigate({ to: "/campagnes-ads", search: { post: p.id } }); }}><Megaphone /> Utiliser dans une campagne Ads</Button>
            <Button variant="destructive" onClick={() => { setStore((s) => ({ publications: s.publications.filter((x) => x.id !== p.id) })); toast("Publication supprimée."); onClose(); }}><Trash2 /> Supprimer</Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function L({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><label className="mb-1.5 block text-xs font-medium text-muted-foreground">{label}</label>{children}</div>;
}
