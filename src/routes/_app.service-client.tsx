import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Search, Send, Sparkles, UserRoundPlus, CheckCircle2, Bot, User, BookOpen } from "lucide-react";
import { toast } from "sonner";
import { seo } from "@/lib/seo";
import { conversations as seed, type Conversation } from "@/lib/mock";
import { PageHeader, Panel, StatusBadge, statusTone, AiThinking, useAiRun } from "@/components/app/kit";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/service-client")({
  head: () => seo("Service Client IA", "Conversations clients traitées par l'Agent IA avec transfert humain."),
  component: Support,
});

const now = () => new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
const AI_ANSWER = "D'après la base de connaissance ALLTECH, pour des tomates sous serre je recommande notre biostimulant racinaire en fertirrigation (2 à 3 L/ha tous les 10 à 15 jours), associé à un apport de calcium pour prévenir la nécrose apicale. Souhaitez-vous qu'un conseiller vous contacte pour un plan nutritionnel personnalisé ?";

function Support() {
  const ai = useAiRun();
  const [list, setList] = useState<Conversation[]>(seed);
  const [activeId, setActiveId] = useState(seed[0]!.id);
  const [filter, setFilter] = useState("Toutes");
  const [q, setQ] = useState("");
  const [msg, setMsg] = useState("");
  const endRef = useRef<HTMLDivElement>(null);
  const c = list.find((x) => x.id === activeId)!;
  const update = (fn: (c: Conversation) => Conversation) => setList((l) => l.map((x) => x.id === activeId ? fn(x) : x));

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [c.messages.length, ai.running]);

  const aiReply = async () => {
    await ai.run(["Analyse de la demande...", "Analyse de la base de connaissance...", "Rédaction de la réponse..."], 800);
    update((x) => ({ ...x, messages: [...x.messages, { from: "ia", text: AI_ANSWER, time: now() }] }));
    toast.success("Réponse envoyée par l'Agent IA.");
  };
  const send = () => {
    if (!msg.trim()) return;
    update((x) => ({ ...x, status: "Humain", messages: [...x.messages, { from: "agent", text: msg.trim().slice(0, 1000), time: now() }] }));
    setMsg(""); toast.success("Message envoyé.");
  };

  const shown = list.filter((x) => (filter === "Toutes" || x.status === filter) && x.name.toLowerCase().includes(q.toLowerCase()));

  return (
    <>
      <PageHeader eyebrow="Agent IA" title="Service Client IA" subtitle="L'Agent IA répond en temps réel en s'appuyant sur votre base de connaissance." />
      <div className="grid h-[calc(100vh-13rem)] min-h-[600px] gap-4 xl:grid-cols-[300px_1fr_300px]">
        <Panel className="flex flex-col overflow-hidden p-3">
          <div className="relative"><Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Rechercher..." className="pl-8" /></div>
          <div className="my-3 flex flex-wrap gap-1">
            {["Toutes", "IA", "Humain", "En attente", "Résolu"].map((f) => (
              <button key={f} onClick={() => setFilter(f)} className={cn("rounded-full border px-2.5 py-0.5 text-xs transition", filter === f ? "border-primary/40 bg-primary/15 text-primary" : "text-muted-foreground hover:bg-accent")}>{f}</button>
            ))}
          </div>
          <div className="-mx-1 flex-1 space-y-1 overflow-y-auto px-1">
            {shown.map((x) => (
              <button key={x.id} onClick={() => setActiveId(x.id)} className={cn("w-full rounded-xl p-3 text-left transition", x.id === activeId ? "bg-primary/10 ring-1 ring-primary/30" : "hover:bg-accent/40")}>
                <div className="flex items-center justify-between"><span className="truncate text-sm font-medium">{x.name}</span><span className="text-[10px] text-muted-foreground">{x.time}</span></div>
                <p className="truncate text-xs text-muted-foreground">{x.preview}</p>
                <div className="mt-1.5 flex items-center gap-1"><StatusBadge tone={statusTone(x.status)}>{x.status}</StatusBadge><span className="text-[10px] text-muted-foreground">{x.channel}</span>{x.unread && <span className="ml-auto grid h-4 w-4 place-items-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">{x.unread}</span>}</div>
              </button>
            ))}
          </div>
        </Panel>

        <Panel className="flex flex-col overflow-hidden p-0">
          <div className="flex items-center gap-3 border-b px-5 py-3">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-secondary text-xs font-semibold">{c.name.split(" ").map((s) => s[0]).slice(0, 2).join("")}</span>
            <div><p className="font-semibold">{c.name}</p><p className="text-xs text-muted-foreground">{c.farm} · {c.channel}</p></div>
            <div className="ml-auto flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild><Button size="sm" variant="outline"><UserRoundPlus /> Transférer</Button></DropdownMenuTrigger>
                <DropdownMenuContent align="end">{["Imane", "Karim", "Omar"].map((p) => <DropdownMenuItem key={p} onClick={() => { update((x) => ({ ...x, status: "Humain" })); toast.success(`Conversation transférée à ${p}.`); }}>{p}</DropdownMenuItem>)}</DropdownMenuContent>
              </DropdownMenu>
              <Button size="sm" variant="outline" onClick={() => { update((x) => ({ ...x, status: "Résolu" })); toast.success("Conversation marquée comme résolue."); }}><CheckCircle2 /> Résoudre</Button>
            </div>
          </div>
          <div className="flex-1 space-y-4 overflow-y-auto p-5">
            {c.messages.map((m, i) => (
              <div key={i} className={cn("flex gap-2 animate-in fade-in slide-in-from-bottom-1", m.from !== "client" && "flex-row-reverse")}>
                <span className={cn("grid h-7 w-7 shrink-0 place-items-center rounded-full", m.from === "ia" ? "bg-gradient-ai text-primary-foreground" : m.from === "agent" ? "bg-info/20 text-info" : "bg-secondary")}>
                  {m.from === "ia" ? <Bot className="h-3.5 w-3.5" /> : <User className="h-3.5 w-3.5" />}
                </span>
                <div className={cn("max-w-[75%] rounded-2xl px-4 py-2.5 text-sm", m.from === "client" ? "rounded-tl-sm bg-secondary/70" : m.from === "ia" ? "ai-border rounded-tr-sm bg-ai/10" : "rounded-tr-sm bg-info/15")}>
                  {m.from === "ia" && <div className="mb-1 flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-ai"><Sparkles className="h-3 w-3" /> Agent IA</div>}
                  {m.text}
                  <div className="mt-1 text-right text-[10px] text-muted-foreground">{m.time}</div>
                </div>
              </div>
            ))}
            {ai.running && <AiThinking step={ai.step} />}
            <div ref={endRef} />
          </div>
          <div className="flex gap-2 border-t p-3">
            <Input value={msg} onChange={(e) => setMsg(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} maxLength={1000} placeholder="Répondre manuellement..." />
            <Button variant="outline" onClick={send}><Send /></Button>
            <Button variant="ai" onClick={aiReply} disabled={ai.running}><Sparkles /> Réponse IA</Button>
          </div>
        </Panel>

        <Panel className="space-y-5 overflow-y-auto">
          <div className="ai-border rounded-xl bg-ai/5 p-4">
            <div className="mb-2 flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-ai"><Sparkles className="h-3 w-3" /> Résumé IA</div>
            <p className="text-sm">{c.name} ({c.farm}) cherche une solution « {c.intent.toLowerCase()} » — catégorie {c.category.toLowerCase()}. {c.status === "Résolu" ? "Demande résolue." : "Réponse personnalisée recommandée."}</p>
          </div>
          <Info label="Classification" value={<StatusBadge tone="blue">{c.category}</StatusBadge>} />
          <Info label="Priorité" value={<StatusBadge tone={statusTone(c.priority)}>{c.priority}</StatusBadge>} />
          <Info label="Intention" value={<span className="text-sm">{c.intent}</span>} />
          <Info label="Sentiment" value={<span className="text-sm text-primary">Positif · 82 %</span>} />
          <div>
            <p className="mb-2 text-xs text-muted-foreground">Sources utilisées</p>
            {["Guide nutrition tomate sous serre", "Fiche technique — Biostimulant racinaire"].map((s) => <div key={s} className="mb-1 flex items-center gap-2 rounded-lg bg-secondary/40 px-2 py-1.5 text-xs"><BookOpen className="h-3.5 w-3.5 text-primary" />{s}</div>)}
          </div>
        </Panel>
      </div>
    </>
  );
}

function Info({ label, value }: { label: string; value: React.ReactNode }) {
  return <div className="flex items-center justify-between border-b pb-3"><span className="text-xs text-muted-foreground">{label}</span>{value}</div>;
}
