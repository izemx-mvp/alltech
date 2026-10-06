import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { Plus, Eye, Pencil, Trash2, Search, HelpCircle, FileText, Info, UploadCloud, Download, RefreshCw, MoreHorizontal, Tag, Type, Inbox } from "lucide-react";
import { toast } from "sonner";
import { seo } from "@/lib/seo";
import { useStore, setStore, uid, todayFr, type FaqItem, type Doc, type InfoItem, type DocStatus } from "@/lib/store";
import { PageHeader, Panel, StatusBadge, Kpi, EmptyState } from "@/components/app/kit";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/base-de-connaissance")({
  head: () => seo("Base de connaissance IA", "FAQ, documents et informations générales utilisés par l'Agent Service Client IA."),
  component: Kb,
});

function Kb() {
  const faqs = useStore("faqs"); const docs = useStore("docs"); const infos = useStore("infos");
  return (
    <>
      <PageHeader eyebrow="Agents IA" title="Base de connaissance IA" subtitle="Ces contenus sont utilisés directement par l'Agent Service Client IA pour répondre à vos clients." />
      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <Kpi label="FAQ actives" value={`${faqs.filter((f) => f.active).length} / ${faqs.length}`} icon={HelpCircle} />
        <Kpi label="Documents indexés" value={`${docs.filter((d) => d.status === "Indexé").length} / ${docs.length}`} icon={FileText} ai />
        <Kpi label="Informations générales" value={String(infos.filter((i) => i.active).length)} icon={Info} />
      </div>
      <Tabs defaultValue="faq">
        <TabsList className="mb-5 h-11 bg-secondary/50 p-1">
          <TabsTrigger value="faq" className="px-4"><HelpCircle className="mr-1.5 h-4 w-4" />FAQ</TabsTrigger>
          <TabsTrigger value="docs" className="px-4"><FileText className="mr-1.5 h-4 w-4" />Documents</TabsTrigger>
          <TabsTrigger value="infos" className="px-4"><Info className="mr-1.5 h-4 w-4" />Informations générales</TabsTrigger>
        </TabsList>
        <TabsContent value="faq"><FaqTab /></TabsContent>
        <TabsContent value="docs"><DocsTab /></TabsContent>
        <TabsContent value="infos"><InfosTab /></TabsContent>
      </Tabs>
    </>
  );
}

function SearchBox({ v, set, ph }: { v: string; set: (s: string) => void; ph: string }) {
  return <div className="relative"><Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input value={v} onChange={(e) => set(e.target.value)} placeholder={ph} className="w-64 pl-8" /></div>;
}
const L = ({ label, children }: { label: string; children: React.ReactNode }) => <div><label className="mb-1.5 block text-xs font-medium text-muted-foreground">{label}</label>{children}</div>;

/* ---------------- FAQ ---------------- */
function FaqTab() {
  const faqs = useStore("faqs");
  const [q, setQ] = useState("");
  const [edit, setEdit] = useState<FaqItem | null>(null);
  const [view, setView] = useState<FaqItem | null>(null);
  const list = faqs.filter((f) => (f.q + f.a + f.keywords + f.category).toLowerCase().includes(q.toLowerCase()));
  const save = () => {
    if (!edit || !edit.q.trim() || !edit.a.trim() || !edit.category.trim()) { toast.error("Question, réponse et catégorie sont requises."); return; }
    const item = { ...edit, updated: todayFr() };
    setStore((s) => ({ faqs: s.faqs.some((x) => x.id === item.id) ? s.faqs.map((x) => x.id === item.id ? item : x) : [item, ...s.faqs] }));
    setEdit(null); toast.success("FAQ enregistrée.");
  };
  return (
    <Panel className="overflow-x-auto">
      <div className="mb-4 flex flex-wrap items-center gap-2"><SearchBox v={q} set={setQ} ph="Rechercher une FAQ..." /><Button className="ml-auto" onClick={() => setEdit({ id: uid(), q: "", a: "", category: "", keywords: "", active: true, updated: "" })}><Plus /> Ajouter une FAQ</Button></div>
      {list.length === 0 ? <EmptyState icon={Inbox} title="Aucune FAQ" text="Ajoutez une question fréquente pour enrichir l'Agent IA." /> : (
        <Table>
          <TableHeader><TableRow><TableHead>Question</TableHead><TableHead>Réponse</TableHead><TableHead>Catégorie</TableHead><TableHead>Statut</TableHead><TableHead>Dernière modification</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
          <TableBody>{list.map((f) => (
            <TableRow key={f.id} className={cn(!f.active && "opacity-60")}>
              <TableCell className="max-w-64 font-medium">{f.q}</TableCell>
              <TableCell className="max-w-72"><p className="line-clamp-2 text-muted-foreground">{f.a}</p></TableCell>
              <TableCell><StatusBadge tone="blue">{f.category}</StatusBadge></TableCell>
              <TableCell><div className="flex items-center gap-2"><Switch checked={f.active} onCheckedChange={(v) => { setStore((s) => ({ faqs: s.faqs.map((x) => x.id === f.id ? { ...x, active: v, updated: todayFr() } : x) })); toast(v ? "FAQ activée." : "FAQ désactivée."); }} /><span className="text-xs">{f.active ? "Active" : "Inactive"}</span></div></TableCell>
              <TableCell className="text-muted-foreground">{f.updated}</TableCell>
              <TableCell className="whitespace-nowrap text-right">
                <Button size="icon" variant="ghost" title="Voir" onClick={() => setView(f)}><Eye /></Button>
                <Button size="icon" variant="ghost" title="Modifier" onClick={() => setEdit(f)}><Pencil /></Button>
                <Button size="icon" variant="ghost" title="Supprimer" onClick={() => { setStore((s) => ({ faqs: s.faqs.filter((x) => x.id !== f.id) })); toast("FAQ supprimée."); }}><Trash2 /></Button>
              </TableCell>
            </TableRow>))}
          </TableBody>
        </Table>
      )}
      <Dialog open={!!view} onOpenChange={(o) => !o && setView(null)}>
        <DialogContent>{view && <><DialogHeader><DialogTitle>{view.q}</DialogTitle><DialogDescription>{view.category} · modifiée le {view.updated}</DialogDescription></DialogHeader><p className="text-sm">{view.a}</p><p className="text-xs text-muted-foreground">Mots-clés : {view.keywords || "—"}</p></>}</DialogContent>
      </Dialog>
      <Dialog open={!!edit} onOpenChange={(o) => !o && setEdit(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>{faqs.some((x) => x.id === edit?.id) ? "Modifier la FAQ" : "Ajouter une FAQ"}</DialogTitle></DialogHeader>
          {edit && <div className="space-y-3">
            <L label="Question"><Input maxLength={200} value={edit.q} onChange={(e) => setEdit({ ...edit, q: e.target.value })} /></L>
            <L label="Réponse"><Textarea rows={4} maxLength={1500} value={edit.a} onChange={(e) => setEdit({ ...edit, a: e.target.value })} /></L>
            <div className="grid grid-cols-2 gap-3">
              <L label="Catégorie"><Input maxLength={40} value={edit.category} onChange={(e) => setEdit({ ...edit, category: e.target.value })} placeholder="Ex. Dosage" /></L>
              <L label="Mots-clés"><Input maxLength={200} value={edit.keywords} onChange={(e) => setEdit({ ...edit, keywords: e.target.value })} placeholder="séparés par des virgules" /></L>
            </div>
            <label className="flex items-center gap-2 text-sm"><Switch checked={edit.active} onCheckedChange={(v) => setEdit({ ...edit, active: v })} />{edit.active ? "Active" : "Inactive"}</label>
          </div>}
          <DialogFooter><Button onClick={save}>Enregistrer</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </Panel>
  );
}

/* ---------------- Documents ---------------- */
const docTone = (s: DocStatus) => ({ "Indexé": "green", "En cours d'analyse": "amber", "Erreur": "red", "Désactivé": "gray" } as const)[s];
const CATS = ["Produits", "Technique", "Agronomie", "Commercial", "Entreprise", "Réglementation"];

function DocsTab() {
  const docs = useStore("docs");
  const input = useRef<HTMLInputElement>(null);
  const [q, setQ] = useState("");
  const [over, setOver] = useState(false);
  const [view, setView] = useState<Doc | null>(null);
  const [rename, setRename] = useState<Doc | null>(null);
  const list = docs.filter((d) => (d.name + d.category).toLowerCase().includes(q.toLowerCase()));
  const upd = (id: string, patch: Partial<Doc>) => setStore((s) => ({ docs: s.docs.map((d) => d.id === id ? { ...d, ...patch } : d) }));
  const analyse = (id: string, name: string) => {
    toast("Analyse du document...", { description: name });
    setTimeout(() => {
      const fail = /\.(exe|zip)$/i.test(name);
      upd(id, { status: fail ? "Erreur" : "Indexé" });
      fail ? toast.error("Format non pris en charge par l'IA.") : toast.success("Document ajouté à la base de connaissance IA.");
    }, 2200);
  };
  const add = (files: FileList | null) => {
    Array.from(files ?? []).slice(0, 10).forEach((f) => {
      const id = uid(); const ext = (f.name.split(".").pop() ?? "DOC").toUpperCase().slice(0, 5);
      const size = f.size > 1e6 ? `${(f.size / 1e6).toFixed(1).replace(".", ",")} Mo` : `${Math.max(1, Math.round(f.size / 1e3))} Ko`;
      setStore((s) => ({ docs: [{ id, name: f.name.slice(0, 120), type: ext, size, category: "Produits", added: todayFr(), status: "En cours d'analyse" }, ...s.docs] }));
      analyse(id, f.name);
    });
  };
  return (
    <div className="space-y-5">
      <div onDragOver={(e) => { e.preventDefault(); setOver(true); }} onDragLeave={() => setOver(false)} onDrop={(e) => { e.preventDefault(); setOver(false); add(e.dataTransfer.files); }} onClick={() => input.current?.click()}
        className={cn("glass cursor-pointer rounded-2xl border-2 border-dashed p-8 text-center transition", over ? "border-primary bg-primary/10" : "hover:border-primary/40")}>
        <UploadCloud className="mx-auto h-10 w-10 text-primary" />
        <p className="mt-2 font-medium">Glissez-déposez vos documents ici</p>
        <p className="text-sm text-muted-foreground">PDF, DOCX, PPTX, XLSX · l'IA les analyse et les indexe automatiquement</p>
        <Button className="mt-4" onClick={(e) => { e.stopPropagation(); input.current?.click(); }}><Plus /> Ajouter un document</Button>
        <input ref={input} type="file" multiple className="hidden" onChange={(e) => { add(e.target.files); e.target.value = ""; }} />
      </div>
      <Panel className="overflow-x-auto">
        <div className="mb-4"><SearchBox v={q} set={setQ} ph="Rechercher un document..." /></div>
        {list.length === 0 ? <EmptyState icon={Inbox} title="Aucun document" text="Importez un catalogue ou une fiche technique." /> : (
          <Table>
            <TableHeader><TableRow><TableHead>Nom</TableHead><TableHead>Type</TableHead><TableHead>Taille</TableHead><TableHead>Catégorie</TableHead><TableHead>Date d'ajout</TableHead><TableHead>Statut IA</TableHead><TableHead /></TableRow></TableHeader>
            <TableBody>{list.map((d) => (
              <TableRow key={d.id}>
                <TableCell><span className="flex items-center gap-2 font-medium"><FileText className="h-4 w-4 shrink-0 text-primary" />{d.name}</span></TableCell>
                <TableCell>{d.type}</TableCell><TableCell>{d.size}</TableCell>
                <TableCell>
                  <DropdownMenu><DropdownMenuTrigger className="rounded-md border px-2 py-0.5 text-xs hover:border-primary/40">{d.category}</DropdownMenuTrigger>
                    <DropdownMenuContent>{CATS.map((c) => <DropdownMenuItem key={c} onClick={() => { upd(d.id, { category: c }); toast.success(`Catégorie modifiée : ${c}.`); }}>{c}</DropdownMenuItem>)}</DropdownMenuContent></DropdownMenu>
                </TableCell>
                <TableCell className="text-muted-foreground">{d.added}</TableCell>
                <TableCell><StatusBadge tone={docTone(d.status)}>{d.status === "En cours d'analyse" && <RefreshCw className="h-3 w-3 animate-spin" />}{d.status}</StatusBadge></TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild><Button size="icon" variant="ghost" aria-label="Actions"><MoreHorizontal /></Button></DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setView(d)}><Eye /> Voir</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => toast.success(`Téléchargement de ${d.name}`)}><Download /> Télécharger</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setRename(d)}><Type /> Renommer</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => { upd(d.id, { status: "En cours d'analyse" }); analyse(d.id, d.name); }}><RefreshCw /> Réindexer</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => { upd(d.id, { status: d.status === "Désactivé" ? "Indexé" : "Désactivé" }); toast(d.status === "Désactivé" ? "Document réactivé." : "Document désactivé pour l'IA."); }}><Tag /> {d.status === "Désactivé" ? "Activer" : "Désactiver"}</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive" onClick={() => { setStore((s) => ({ docs: s.docs.filter((x) => x.id !== d.id) })); toast("Document supprimé."); }}><Trash2 /> Supprimer</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>))}
            </TableBody>
          </Table>
        )}
      </Panel>
      <Dialog open={!!view} onOpenChange={(o) => !o && setView(null)}>
        <DialogContent>{view && <>
          <DialogHeader><DialogTitle>{view.name}</DialogTitle><DialogDescription>{view.type} · {view.size} · ajouté le {view.added}</DialogDescription></DialogHeader>
          <div className="rounded-xl bg-secondary/40 p-4 text-sm"><p className="mb-1 text-xs font-semibold uppercase tracking-wider text-ai">Résumé IA</p>Ce document couvre les recommandations ALLTECH en matière de nutrition végétale : doses, périodes d'application et compatibilités. Il est utilisé dans les réponses liées à la catégorie « {view.category} ».</div>
          <StatusBadge tone={docTone(view.status)}>{view.status}</StatusBadge>
        </>}</DialogContent>
      </Dialog>
      <Dialog open={!!rename} onOpenChange={(o) => !o && setRename(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Renommer le document</DialogTitle></DialogHeader>
          {rename && <Input maxLength={120} value={rename.name} onChange={(e) => setRename({ ...rename, name: e.target.value })} />}
          <DialogFooter><Button onClick={() => { if (!rename?.name.trim()) return; upd(rename.id, { name: rename.name.trim() }); setRename(null); toast.success("Document renommé."); }}>Enregistrer</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* ---------------- Informations générales ---------------- */
function InfosTab() {
  const infos = useStore("infos");
  const [q, setQ] = useState("");
  const [edit, setEdit] = useState<InfoItem | null>(null);
  const [view, setView] = useState<InfoItem | null>(null);
  const list = infos.filter((i) => (i.title + i.content + i.category).toLowerCase().includes(q.toLowerCase()));
  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-2"><SearchBox v={q} set={setQ} ph="Rechercher une information..." /><Button className="ml-auto" onClick={() => setEdit({ id: uid(), title: "", category: "", content: "", updated: "", active: true })}><Plus /> Ajouter une information</Button></div>
      {list.length === 0 ? <EmptyState icon={Inbox} title="Aucune information" text="Ajoutez les informations que l'Agent IA doit connaître sur ALLTECH." /> : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {list.map((i) => (
            <Panel key={i.id} className={cn("glass-hover flex flex-col", !i.active && "opacity-60")}>
              <div className="flex items-start justify-between gap-2"><div><StatusBadge tone="blue">{i.category}</StatusBadge><h3 className="mt-2 font-semibold">{i.title}</h3></div><Switch checked={i.active} onCheckedChange={(v) => { setStore((s) => ({ infos: s.infos.map((x) => x.id === i.id ? { ...x, active: v, updated: todayFr() } : x) })); toast(v ? "Information activée." : "Information désactivée."); }} /></div>
              <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{i.content}</p>
              <div className="mt-auto flex items-center gap-1 pt-4">
                <span className="text-[11px] text-muted-foreground">Modifiée le {i.updated} · {i.active ? "Active" : "Inactive"}</span>
                <Button size="icon" variant="ghost" className="ml-auto" title="Voir" onClick={() => setView(i)}><Eye /></Button>
                <Button size="icon" variant="ghost" title="Modifier" onClick={() => setEdit(i)}><Pencil /></Button>
                <Button size="icon" variant="ghost" title="Supprimer" onClick={() => { setStore((s) => ({ infos: s.infos.filter((x) => x.id !== i.id) })); toast("Information supprimée."); }}><Trash2 /></Button>
              </div>
            </Panel>
          ))}
        </div>
      )}
      <Dialog open={!!view} onOpenChange={(o) => !o && setView(null)}>
        <DialogContent>{view && <><DialogHeader><DialogTitle>{view.title}</DialogTitle><DialogDescription>{view.category} · modifiée le {view.updated}</DialogDescription></DialogHeader><p className="whitespace-pre-line text-sm">{view.content}</p></>}</DialogContent>
      </Dialog>
      <Dialog open={!!edit} onOpenChange={(o) => !o && setEdit(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>{infos.some((x) => x.id === edit?.id) ? "Modifier l'information" : "Ajouter une information"}</DialogTitle></DialogHeader>
          {edit && <div className="space-y-3">
            <L label="Titre"><Input maxLength={100} value={edit.title} onChange={(e) => setEdit({ ...edit, title: e.target.value })} placeholder="Ex. Conditions commerciales" /></L>
            <L label="Catégorie"><Input maxLength={40} value={edit.category} onChange={(e) => setEdit({ ...edit, category: e.target.value })} placeholder="Ex. Commercial" /></L>
            <L label="Contenu"><Textarea rows={5} maxLength={2000} value={edit.content} onChange={(e) => setEdit({ ...edit, content: e.target.value })} /></L>
            <label className="flex items-center gap-2 text-sm"><Switch checked={edit.active} onCheckedChange={(v) => setEdit({ ...edit, active: v })} />{edit.active ? "Active" : "Inactive"}</label>
          </div>}
          <DialogFooter><Button onClick={() => {
            if (!edit || !edit.title.trim() || !edit.content.trim() || !edit.category.trim()) { toast.error("Titre, catégorie et contenu sont requis."); return; }
            const item = { ...edit, updated: todayFr() };
            setStore((s) => ({ infos: s.infos.some((x) => x.id === item.id) ? s.infos.map((x) => x.id === item.id ? item : x) : [item, ...s.infos] }));
            setEdit(null); toast.success("Information enregistrée.");
          }}>Enregistrer</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
