import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Upload, Search, FileText, Trash2, RefreshCw, Inbox } from "lucide-react";
import { toast } from "sonner";
import { seo } from "@/lib/seo";
import { kbDocs, type KbDoc } from "@/lib/mock";
import { PageHeader, Panel, StatusBadge, statusTone, Kpi, EmptyState } from "@/components/app/kit";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BookOpen, Database, Zap } from "lucide-react";

export const Route = createFileRoute("/_app/base-de-connaissance")({
  head: () => seo("Base de connaissance", "Documents techniques utilisés par les Agents IA ALLTECH."),
  component: Kb,
});

function Kb() {
  const [docs, setDocs] = useState<KbDoc[]>(kbDocs);
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("Toutes");
  const cats = ["Toutes", ...Array.from(new Set(kbDocs.map((d) => d.category)))];
  const list = docs.filter((d) => d.title.toLowerCase().includes(q.toLowerCase()) && (cat === "Toutes" || d.category === cat));

  const onUpload = (f?: File) => {
    if (!f) return;
    const id = crypto.randomUUID();
    setDocs((d) => [{ id, title: f.name.slice(0, 80), category: "Produits", type: "PDF", updated: new Date().toLocaleDateString("fr-FR"), usage: 0, status: "En cours" }, ...d]);
    toast("Indexation du document par l'IA...");
    setTimeout(() => { setDocs((d) => d.map((x) => x.id === id ? { ...x, status: "Indexé" } : x)); toast.success("Document indexé dans la base de connaissance."); }, 2200);
  };

  return (
    <>
      <PageHeader eyebrow="Agents IA" title="Base de connaissance" subtitle="Les sources que l'Agent IA utilise pour répondre à vos clients."
        actions={<label className="inline-flex"><input type="file" className="hidden" onChange={(e) => onUpload(e.target.files?.[0])} /><span className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-lg bg-gradient-primary px-4 text-sm font-semibold text-primary-foreground shadow-glow"><Upload className="h-4 w-4" /> Importer un document</span></label>} />
      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <Kpi label="Documents indexés" value={String(docs.filter((d) => d.status === "Indexé").length)} icon={Database} />
        <Kpi label="Réponses IA sourcées" value="1 718" delta={16} icon={Zap} ai />
        <Kpi label="Taux de couverture" value="94 %" delta={3} icon={BookOpen} />
      </div>
      <Panel>
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <div className="relative"><Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Rechercher un document..." className="w-64 pl-8" /></div>
          {cats.map((c) => <Button key={c} size="sm" variant={cat === c ? "secondary" : "ghost"} onClick={() => setCat(c)}>{c}</Button>)}
        </div>
        {list.length === 0 ? <EmptyState icon={Inbox} title="Aucun document" text="Importez une fiche technique ou un guide pour enrichir l'Agent IA." /> : (
          <Table>
            <TableHeader><TableRow><TableHead>Document</TableHead><TableHead>Catégorie</TableHead><TableHead>Type</TableHead><TableHead>Mise à jour</TableHead><TableHead className="text-right">Utilisations IA</TableHead><TableHead>Statut</TableHead><TableHead /></TableRow></TableHeader>
            <TableBody>
              {list.map((d) => (
                <TableRow key={d.id}>
                  <TableCell><span className="flex items-center gap-2 font-medium"><FileText className="h-4 w-4 text-primary" />{d.title}</span></TableCell>
                  <TableCell>{d.category}</TableCell><TableCell>{d.type}</TableCell><TableCell className="text-muted-foreground">{d.updated}</TableCell>
                  <TableCell className="text-right">{d.usage}</TableCell>
                  <TableCell><StatusBadge tone={statusTone(d.status)}>{d.status}</StatusBadge></TableCell>
                  <TableCell className="text-right">
                    <Button size="icon" variant="ghost" onClick={() => toast.success("Document réindexé.")}><RefreshCw /></Button>
                    <Button size="icon" variant="ghost" onClick={() => { setDocs((x) => x.filter((y) => y.id !== d.id)); toast("Document supprimé."); }}><Trash2 /></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Panel>
    </>
  );
}
