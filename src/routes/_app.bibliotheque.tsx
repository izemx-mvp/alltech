import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Upload, Search, Image as ImageIcon, Video, FileText, Shapes, Download, Trash2, Inbox } from "lucide-react";
import { toast } from "sonner";
import { seo } from "@/lib/seo";
import { assets as seed, type Asset } from "@/lib/mock";
import { PageHeader, EmptyState } from "@/components/app/kit";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";

export const Route = createFileRoute("/_app/bibliotheque")({
  head: () => seo("Bibliothèque", "Médiathèque ALLTECH : images, vidéos, documents et éléments de marque."),
  component: Lib,
});

const icons = { Image: ImageIcon, Vidéo: Video, Document: FileText, Logo: Shapes };

function Lib() {
  const [items, setItems] = useState<Asset[]>(seed);
  const [kind, setKind] = useState("Tous");
  const [q, setQ] = useState("");
  const list = items.filter((a) => (kind === "Tous" || a.kind === kind) && (a.name + a.tags.join(" ")).toLowerCase().includes(q.toLowerCase()));

  return (
    <TooltipProvider>
      <PageHeader eyebrow="Médias" title="Bibliothèque" subtitle={`${items.length} ressources partagées avec l'équipe.`}
        actions={<label><input type="file" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) { setItems((x) => [{ id: crypto.randomUUID(), name: f.name.slice(0, 60), kind: f.type.startsWith("video") ? "Vidéo" : f.type.startsWith("image") ? "Image" : "Document", size: `${(f.size / 1e6).toFixed(1)} Mo`, tags: ["nouveau"], hue: 150 }, ...x]); toast.success("Fichier ajouté à la bibliothèque."); } }} />
          <span className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-lg bg-gradient-primary px-4 text-sm font-semibold text-primary-foreground shadow-glow"><Upload className="h-4 w-4" /> Importer</span></label>} />
      <div className="mb-5 flex flex-wrap items-center gap-2">
        <div className="relative"><Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Rechercher par nom ou tag..." className="w-64 pl-8" /></div>
        {["Tous", "Image", "Vidéo", "Document", "Logo"].map((k) => <Button key={k} size="sm" variant={kind === k ? "secondary" : "ghost"} onClick={() => setKind(k)}>{k}</Button>)}
      </div>
      {list.length === 0 ? <EmptyState icon={Inbox} title="Aucune ressource" text="Essayez un autre filtre ou importez un nouveau fichier." /> : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
          {list.map((a) => {
            const I = icons[a.kind];
            return (
              <div key={a.id} className="glass glass-hover group overflow-hidden rounded-2xl">
                <div className="relative grid aspect-[4/3] place-items-center" style={{ background: `radial-gradient(circle at 30% 30%, oklch(0.7 0.15 ${a.hue}), var(--secondary) 75%)` }}>
                  <I className="h-8 w-8 text-foreground/80" />
                  <div className="absolute right-2 top-2 flex gap-1 opacity-0 transition group-hover:opacity-100">
                    <Tooltip><TooltipTrigger asChild><Button size="icon" variant="secondary" onClick={() => toast.success(`Téléchargement de ${a.name}`)}><Download /></Button></TooltipTrigger><TooltipContent>Télécharger</TooltipContent></Tooltip>
                    <Tooltip><TooltipTrigger asChild><Button size="icon" variant="secondary" onClick={() => { setItems((x) => x.filter((y) => y.id !== a.id)); toast("Ressource supprimée."); }}><Trash2 /></Button></TooltipTrigger><TooltipContent>Supprimer</TooltipContent></Tooltip>
                  </div>
                </div>
                <div className="p-3"><p className="truncate text-sm font-medium">{a.name}</p><p className="text-xs text-muted-foreground">{a.kind} · {a.size} · {a.tags.map((t) => `#${t}`).join(" ")}</p></div>
              </div>
            );
          })}
        </div>
      )}
    </TooltipProvider>
  );
}
