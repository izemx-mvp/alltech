import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Search, Send, Sparkles, UserRoundCheck, Bot, User, BookOpen, Phone, Mail, MapPin, Building2, Sprout, StickyNote, UserPlus, Lock, Undo2, MessagesSquare, Settings2, Save, Inbox } from "lucide-react";
import { toast } from "sonner";
import { seo } from "@/lib/seo";
import { useStore, setStore, getStore, type Conv } from "@/lib/store";
import { PageHeader, Panel, StatusBadge, statusTone, AiThinking, useAiRun, EmptyState } from "@/components/app/kit";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

type Tab = "conversations" | "configuration";
export const Route = createFileRoute("/_app/service-client")({
  validateSearch: (s: Record<string, unknown>): { tab?: Tab } => (s["tab"] === "configuration" || s["tab"] === "conversations" ? { tab: s["tab"] } : {}),
  head: () => seo("Service Client IA", "Conversations clients gérées par l'Agent IA, prise de relais humaine et configuration de l'agent."),
  component: Support,
});

function Support() {
  const { tab = "conversations" } = Route.useSearch();
  const navigate = useNavigate({ from: "/service-client" });
  return (
    <>
      <PageHeader eyebrow="Agent IA" title="Service Client IA" subtitle="L'Agent IA répond à vos clients en s'appuyant sur votre base de connaissance." />
      <Tabs value={tab} onValueChange={(v) => navigate({ search: { tab: v as Tab } })}>
        <TabsList className="mb-5 h-11 bg-secondary/50 p-1">
          <TabsTrigger value="conversations" className="px-4"><MessagesSquare className="mr-1.5 h-4 w-4" />Conversations</TabsTrigger>
          <TabsTrigger value="configuration" className="px-4"><Settings2 className="mr-1.5 h-4 w-4" />Configuration</TabsTrigger>
        </TabsList>
        <TabsContent value="conversations"><Conversations /></TabsContent>
        <TabsContent value="configuration"><AgentConfigTab /></TabsContent>
      </Tabs>
    </>
  );
}

const now = () => new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
const prioRank = { Haute: 0, Moyenne: 1, Basse: 2 } as const;
const statusLabel = (s: Conv["status"]) => (s === "Humain" ? "Agent humain" : s);
const FILTERS = ["Toutes", "IA", "Humain", "Non lues", "Urgentes", "Résolues"] as const;

function aiAnswerFor(c: Conv): { text: string; source: string } {
  const faqs = getStore().faqs.filter((f) => f.active);
  const docs = getStore().docs.filter((d) => d.status === "Indexé");
  const crop = c.client.crop.toLowerCase();
  if (crop.includes("tomate")) return { text: "D'après nos recommandations, pour des tomates sous serre : biostimulant racinaire en fertirrigation (2 à 3 L/ha tous les 10 à 15 jours) et apport de calcium pour prévenir la nécrose apicale. Souhaitez-vous qu'un conseiller vous propose un plan nutritionnel personnalisé ?", source: docs.find((d) => d.name.includes("nutrition"))?.name.replace(/\.\w+$/, "") ?? "FAQ ALLTECH" };
  if (c.intent === "Distributeur") return { text: "Nous disposons de distributeurs agréés dans votre région. Je vous transmets les coordonnées du plus proche par message. Nos horaires : lundi au vendredi, 8h30 – 18h00.", source: "Informations générales — Zones desservies" };
  const f = faqs[0];
  return { text: f ? `${f.a} N'hésitez pas à me préciser votre culture pour une recommandation plus précise.` : "Pouvez-vous me préciser votre culture et votre surface afin que je vous oriente ?", source: f ? "FAQ ALLTECH" : "Base de connaissance" };
}

function Conversations() {
  const list = useStore("conversations");
  const ai = useAiRun();
  const [activeId, setActiveId] = useState(list[0]?.id ?? "");
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("Toutes");
  const [sort, setSort] = useState<"recent" | "prio">("recent");
  const [q, setQ] = useState("");
  const [msg, setMsg] = useState("");
  const [note, setNote] = useState("");
  const [confirm, setConfirm] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const c = list.find((x) => x.id === activeId);
  const update = (fn: (c: Conv) => Partial<Conv>) => setStore((s) => ({ conversations: s.conversations.map((x) => x.id === activeId ? { ...x, ...fn(x) } : x) }));

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [c?.messages.length, ai.running]);

  const shown = list
    .filter((x) => {
      if (!(x.name + x.preview + x.client.company).toLowerCase().includes(q.toLowerCase())) return false;
      return filter === "Toutes" || (filter === "IA" && x.status === "IA") || (filter === "Humain" && x.status === "Humain") || (filter === "Non lues" && !x.read) || (filter === "Urgentes" && x.urgent) || (filter === "Résolues" && x.status === "Résolu");
    })
    .sort((a, b) => sort === "prio" ? prioRank[a.priority] - prioRank[b.priority] : 0);

  const open = (id: string) => { setActiveId(id); setStore((s) => ({ conversations: s.conversations.map((x) => x.id === id ? { ...x, read: true, unread: 0 } : x) })); };
  const aiReply = async () => {
    if (!c) return;
    await ai.run(["Analyse de la demande...", "Recherche dans la base de connaissance...", "Rédaction de la réponse..."], 800);
    const a = aiAnswerFor(c);
    update((x) => ({ messages: [...x.messages, { from: "ia", text: a.text, time: now(), source: a.source }], preview: a.text.slice(0, 50) }));
    toast.success("Réponse envoyée par l'Agent IA.");
  };
  const send = () => {
    const t = msg.trim().slice(0, 1000); if (!t) return;
    update((x) => ({ messages: [...x.messages, { from: "agent", text: t, time: now() }], preview: t.slice(0, 50) }));
    setMsg(""); toast.success("Message envoyé.");
  };

  if (!c) return <EmptyState icon={Inbox} title="Aucune conversation" text="Les nouvelles conversations apparaîtront ici." />;
  const human = c.status === "Humain";

  return (
    <div className="grid h-[calc(100vh-15rem)] min-h-[620px] gap-4 xl:grid-cols-[320px_1fr_320px]">
      <Panel className="flex flex-col overflow-hidden p-3">
        <div className="flex gap-2">
          <div className="relative flex-1"><Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Rechercher..." className="pl-8" /></div>
          <Select value={sort} onValueChange={(v) => setSort(v as typeof sort)}><SelectTrigger className="w-28"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="recent">Récentes</SelectItem><SelectItem value="prio">Priorité</SelectItem></SelectContent></Select>
        </div>
        <div className="my-3 flex flex-wrap gap-1">
          {FILTERS.map((f) => <button key={f} onClick={() => setFilter(f)} className={cn("rounded-full border px-2.5 py-0.5 text-xs transition", filter === f ? "border-primary/40 bg-primary/15 text-primary" : "text-muted-foreground hover:bg-accent")}>{f}</button>)}
        </div>
        <div className="-mx-1 flex-1 space-y-1 overflow-y-auto px-1">
          {shown.length === 0 && <p className="py-8 text-center text-sm text-muted-foreground">Aucune conversation.</p>}
          {shown.map((x) => (
            <button key={x.id} onClick={() => open(x.id)} className={cn("flex w-full gap-3 rounded-xl p-3 text-left transition", x.id === activeId ? "bg-primary/10 ring-1 ring-primary/30" : "hover:bg-accent/40")}>
              <span className="relative grid h-10 w-10 shrink-0 place-items-center rounded-full bg-secondary text-xs font-semibold">{x.name.split(" ").map((s) => s[0]).slice(0, 2).join("")}{!x.read && <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-primary" />}</span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between"><span className={cn("truncate text-sm", !x.read ? "font-bold" : "font-medium")}>{x.name}</span><span className="text-[10px] text-muted-foreground">{x.time}</span></div>
                <p className="truncate text-xs text-muted-foreground">{x.preview}</p>
                <div className="mt-1.5 flex flex-wrap items-center gap-1"><StatusBadge tone={statusTone(x.status)}>{statusLabel(x.status)}</StatusBadge><StatusBadge tone={statusTone(x.priority)}>{x.priority}</StatusBadge><span className="text-[10px] text-muted-foreground">{x.channel}</span></div>
              </div>
            </button>
          ))}
        </div>
      </Panel>

      <Panel className="flex flex-col overflow-hidden p-0">
        <div className="flex flex-wrap items-center gap-3 border-b px-5 py-3">
          <div className="min-w-0"><p className="font-semibold">{c.name}</p><p className="text-xs text-muted-foreground">{c.client.company} · {c.channel}</p></div>
          <StatusBadge tone={statusTone(c.status)}>{human ? <><UserRoundCheck className="h-3 w-3" /> Agent humain</> : c.status === "IA" ? <><Bot className="h-3 w-3" /> Agent IA</> : c.status}</StatusBadge>
          <div className="ml-auto">
            {human
              ? <Button size="sm" variant="ai" onClick={() => { update(() => ({ status: "IA" })); toast.success("Conversation rendue à l'Agent IA."); }}><Undo2 /> Rendre la conversation à l'IA</Button>
              : c.status !== "Résolu" && <Button size="sm" onClick={() => setConfirm(true)}><UserRoundCheck /> Prendre le relais</Button>}
          </div>
        </div>
        <div className="flex-1 space-y-4 overflow-y-auto p-5">
          {c.messages.map((m, i) => (
            <div key={i} className={cn("flex gap-2 animate-in fade-in slide-in-from-bottom-1", m.from !== "client" && "flex-row-reverse")}>
              <span className={cn("grid h-7 w-7 shrink-0 place-items-center rounded-full", m.from === "ia" ? "bg-gradient-ai text-primary-foreground" : m.from === "agent" ? "bg-info/20 text-info" : "bg-secondary")}>{m.from === "ia" ? <Bot className="h-3.5 w-3.5" /> : <User className="h-3.5 w-3.5" />}</span>
              <div className={cn("max-w-[75%] rounded-2xl px-4 py-2.5 text-sm", m.from === "client" ? "rounded-tl-sm bg-secondary/70" : m.from === "ia" ? "ai-border rounded-tr-sm bg-ai/10" : "rounded-tr-sm border border-info/30 bg-info/15")}>
                {m.from === "ia" && <div className="mb-1 flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-ai"><Sparkles className="h-3 w-3" /> Réponse générée par l'Agent IA</div>}
                {m.from === "agent" && <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-info">Agent humain · Sophie</div>}
                {m.text}
                {m.source && <div className="mt-2 flex items-center gap-1 rounded-md bg-background/40 px-2 py-1 text-[11px] text-muted-foreground"><BookOpen className="h-3 w-3 text-primary" />Source utilisée : {m.source}</div>}
                <div className="mt-1 text-right text-[10px] text-muted-foreground">{m.time}</div>
              </div>
            </div>
          ))}
          {ai.running && <AiThinking step={ai.step} />}
          <div ref={endRef} />
        </div>
        <div className="border-t p-3">
          {human ? (
            <div className="flex gap-2"><Input value={msg} onChange={(e) => setMsg(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} maxLength={1000} placeholder="Écrivez votre réponse au client..." /><Button onClick={send}><Send /> Envoyer</Button></div>
          ) : c.status === "Résolu" ? (
            <p className="text-center text-sm text-muted-foreground">Conversation clôturée.</p>
          ) : (
            <div className="flex items-center gap-3"><Lock className="h-4 w-4 text-muted-foreground" /><p className="flex-1 text-xs text-muted-foreground">L'Agent IA gère cette conversation. Prenez le relais pour répondre manuellement.</p><Button variant="ai" onClick={aiReply} disabled={ai.running}><Sparkles /> Générer une réponse IA</Button></div>
          )}
        </div>
      </Panel>

      <Panel className="space-y-5 overflow-y-auto">
        <div>
          <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Fiche client</h4>
          <div className="space-y-2 text-sm">
            {[[User, c.name], [Phone, c.client.phone], [Mail, c.client.email], [MapPin, c.client.location], [Building2, c.client.company], [Sprout, c.client.crop]].map(([I, v], i) => { const Ic = I as typeof User; return <div key={i} className="flex items-center gap-2"><Ic className="h-3.5 w-3.5 shrink-0 text-primary" /><span className="truncate">{v as string}</span></div>; })}
          </div>
        </div>
        <div className="ai-border rounded-xl bg-ai/5 p-4">
          <div className="mb-2 flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-ai"><Sparkles className="h-3 w-3" /> Analyse IA</div>
          <p className="text-sm">{c.name} ({c.client.crop.toLowerCase()}) — demande de type « {c.intent.toLowerCase()} ». {c.status === "Résolu" ? "Demande traitée." : "Une réponse personnalisée est recommandée."}</p>
          <dl className="mt-3 space-y-2 text-xs">
            {[["Intention", c.intent], ["Sujet", c.category], ["Priorité", c.priority], ["Sentiment", c.sentiment], ["Produit concerné", c.product]].map(([k, v]) => <div key={k} className="flex justify-between gap-2"><dt className="text-muted-foreground">{k}</dt><dd className="text-right font-medium">{k === "Priorité" ? <StatusBadge tone={statusTone(v!)}>{v}</StatusBadge> : v}</dd></div>)}
          </dl>
        </div>
        <div>
          <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Notes internes</h4>
          {c.notes.map((n, i) => <p key={i} className="mb-1.5 rounded-lg bg-warning/10 px-2.5 py-1.5 text-xs">{n}</p>)}
          <div className="flex gap-1.5"><Input value={note} maxLength={300} onChange={(e) => setNote(e.target.value)} placeholder="Ajouter une note..." className="h-8 text-xs" />
            <Button size="sm" variant="outline" onClick={() => { if (!note.trim()) return; update((x) => ({ notes: [...x.notes, note.trim()] })); setNote(""); toast.success("Note ajoutée."); }}><StickyNote /></Button></div>
        </div>
        <div className="grid gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild><Button variant="outline"><UserPlus /> {c.assignee ? `Assignée à ${c.assignee}` : "Assigner"}</Button></DropdownMenuTrigger>
            <DropdownMenuContent>{["Imane", "Karim", "Omar", "Sophie"].map((p) => <DropdownMenuItem key={p} onClick={() => { update(() => ({ assignee: p })); toast.success(`Conversation assignée à ${p}.`); }}>{p}</DropdownMenuItem>)}</DropdownMenuContent>
          </DropdownMenu>
          <Button variant="outline" disabled={c.status === "Résolu"} onClick={() => { update(() => ({ status: "Résolu", urgent: false })); toast.success("Conversation clôturée."); }}><Lock /> Clôturer la conversation</Button>
        </div>
      </Panel>

      <AlertDialog open={confirm} onOpenChange={setConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Prendre le relais</AlertDialogTitle><AlertDialogDescription>Vous allez prendre le contrôle de cette conversation. L'Agent IA suspendra ses réponses automatiques.</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel>Annuler</AlertDialogCancel><AlertDialogAction onClick={() => { update(() => ({ status: "Humain", assignee: "Sophie" })); toast.success("Vous avez pris le relais de la conversation."); }}>Prendre le relais</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

const AUTONOMY = [["Faible", "L'IA propose des réponses mais attend validation."], ["Moyen", "L'IA répond aux demandes simples."], ["Élevé", "L'IA répond automatiquement sauf cas sensibles."]] as const;

function AgentConfigTab() {
  const saved = useStore("agent");
  const [a, setA] = useState(saved);
  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-2">
        <Panel className="space-y-4">
          <h3 className="font-semibold">Identité de l'agent</h3>
          <div className="flex items-center gap-4">
            <span className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-gradient-ai font-display text-2xl font-bold text-primary-foreground shadow-glow">{a.avatar || "?"}</span>
            <div className="flex-1 space-y-2">
              <Input maxLength={60} value={a.name} onChange={(e) => setA({ ...a, name: e.target.value })} placeholder="Nom de l'agent" />
              <div className="flex gap-1.5">{["N", "A", "🌱", "🤖"].map((v) => <button key={v} onClick={() => setA({ ...a, avatar: v })} className={cn("grid h-8 w-8 place-items-center rounded-lg border text-sm", a.avatar === v ? "border-primary bg-primary/15" : "")}>{v}</button>)}</div>
            </div>
          </div>
          <div><label className="mb-1.5 block text-xs text-muted-foreground">Message d'accueil</label><Textarea rows={3} maxLength={400} value={a.greeting} onChange={(e) => setA({ ...a, greeting: e.target.value })} /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="mb-1.5 block text-xs text-muted-foreground">Tonalité</label><Select value={a.tone} onValueChange={(v) => setA({ ...a, tone: v })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{["Professionnelle", "Pédagogique", "Chaleureuse", "Directe", "Technique"].map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent></Select></div>
            <div><label className="mb-1.5 block text-xs text-muted-foreground">Langues</label><div className="flex flex-wrap gap-1.5">{["Français", "Anglais", "Arabe"].map((l) => { const on = a.languages.includes(l); return <button key={l} onClick={() => setA({ ...a, languages: on ? a.languages.filter((x) => x !== l) : [...a.languages, l] })} className={cn("rounded-full border px-3 py-1.5 text-xs", on ? "border-primary/50 bg-primary/15 text-primary" : "text-muted-foreground")}>{l}</button>; })}</div></div>
          </div>
        </Panel>
        <Panel className="space-y-4">
          <h3 className="font-semibold">Niveau d'autonomie</h3>
          <Slider value={[a.autonomy]} max={2} step={1} onValueChange={(v) => setA({ ...a, autonomy: v[0] ?? 1 })} />
          <div className="grid grid-cols-3 gap-2">{AUTONOMY.map(([l, d], i) => <div key={l} className={cn("rounded-xl border p-3 text-xs transition", a.autonomy === i ? "border-primary/50 bg-primary/10" : "opacity-60")}><div className="mb-1 font-semibold">{l}</div><div className="text-muted-foreground">{d}</div></div>)}</div>
          <div className="rounded-xl bg-secondary/30 p-4 text-sm"><p className="mb-1 text-xs text-muted-foreground">Aperçu du message d'accueil</p><div className="flex gap-2"><span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-gradient-ai text-xs text-primary-foreground">{a.avatar}</span><p className="ai-border rounded-2xl rounded-tl-sm bg-ai/10 px-3 py-2">{a.greeting}</p></div></div>
        </Panel>
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        <Panel><h3 className="mb-3 font-semibold">Règles de transfert humain</h3><div className="space-y-2">{Object.entries(a.transfer).map(([k, v]) => <div key={k} className="flex items-center justify-between rounded-lg bg-secondary/40 px-3 py-2.5 text-sm">{k}<Switch checked={v} onCheckedChange={(c) => setA({ ...a, transfer: { ...a.transfer, [k]: c } })} /></div>)}</div></Panel>
        <Panel><h3 className="mb-3 font-semibold">Informations à collecter</h3><div className="grid grid-cols-2 gap-2">{Object.entries(a.collect).map(([k, v]) => <label key={k} className="flex cursor-pointer items-center gap-2 rounded-lg bg-secondary/40 px-3 py-2.5 text-sm"><Checkbox checked={v} onCheckedChange={(c) => setA({ ...a, collect: { ...a.collect, [k]: c === true } })} />{k}</label>)}</div></Panel>
      </div>
      <div className="flex justify-end"><Button size="lg" onClick={() => { if (!a.name.trim() || !a.languages.length) { toast.error("Nom de l'agent et au moins une langue requis."); return; } setStore(() => ({ agent: a })); toast.success("Configuration de l'Agent IA enregistrée."); }}><Save /> Enregistrer la configuration de l'Agent IA</Button></div>
    </div>
  );
}
