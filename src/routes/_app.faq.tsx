import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Pencil, Trash2, Sparkles, Eye } from "lucide-react";
import { toast } from "sonner";
import { seo } from "@/lib/seo";
import { faqs as seed, type Faq } from "@/lib/mock";
import { PageHeader, Panel, StatusBadge, useAiRun, AiThinking } from "@/components/app/kit";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

export const Route = createFileRoute("/_app/faq")({
  head: () => seo("FAQ", "Questions fréquentes des agriculteurs, utilisées par l'Agent IA Service Client."),
  component: FaqPage,
});

function FaqPage() {
  const ai = useAiRun();
  const [items, setItems] = useState<Faq[]>(seed);
  const [edit, setEdit] = useState<Faq | null>(null);

  const save = () => {
    if (!edit || !edit.q.trim() || !edit.a.trim()) { toast.error("Question et réponse requises."); return; }
    setItems((l) => l.some((x) => x.id === edit.id) ? l.map((x) => x.id === edit.id ? edit : x) : [edit, ...l]);
    setEdit(null); toast.success("FAQ enregistrée.");
  };

  return (
    <>
      <PageHeader eyebrow="Agents IA" title="FAQ" subtitle="Réponses validées, utilisées en priorité par l'Agent IA."
        actions={<>
          <Button variant="ai" disabled={ai.running} onClick={async () => { await ai.run(["Analyse des conversations...", "Détection des questions récurrentes..."]); setItems((l) => [{ id: crypto.randomUUID(), q: "Quel est le délai de livraison des produits ?", a: "Les commandes sont livrées sous 48 à 72 h via nos distributeurs agréés.", category: "Logistique", views: 0 }, ...l]); toast.success("Nouvelle FAQ suggérée par l'IA."); }}><Sparkles /> Suggérer avec l'IA</Button>
          <Button onClick={() => setEdit({ id: crypto.randomUUID(), q: "", a: "", category: "Produit", views: 0 })}><Plus /> Ajouter une FAQ</Button>
        </>} />
      {ai.running && <div className="mb-4"><AiThinking step={ai.step} /></div>}
      <Panel>
        <Accordion type="single" collapsible>
          {items.map((f) => (
            <AccordionItem key={f.id} value={f.id}>
              <AccordionTrigger className="hover:no-underline"><span className="flex items-center gap-3 text-left"><StatusBadge tone="blue">{f.category}</StatusBadge>{f.q}</span></AccordionTrigger>
              <AccordionContent>
                <p className="text-muted-foreground">{f.a}</p>
                <div className="mt-3 flex items-center gap-2">
                  <span className="flex items-center gap-1 text-xs text-muted-foreground"><Eye className="h-3 w-3" />{f.views} vues</span>
                  <Button size="sm" variant="outline" className="ml-auto" onClick={() => setEdit(f)}><Pencil /> Modifier</Button>
                  <Button size="sm" variant="ghost" onClick={() => { setItems((l) => l.filter((x) => x.id !== f.id)); toast("FAQ supprimée."); }}><Trash2 /></Button>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Panel>
      <Dialog open={!!edit} onOpenChange={(o) => !o && setEdit(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>{edit?.q ? "Modifier la FAQ" : "Ajouter une FAQ"}</DialogTitle></DialogHeader>
          {edit && <>
            <Input placeholder="Question" maxLength={200} value={edit.q} onChange={(e) => setEdit({ ...edit, q: e.target.value })} />
            <Textarea placeholder="Réponse" maxLength={1000} rows={4} value={edit.a} onChange={(e) => setEdit({ ...edit, a: e.target.value })} />
            <Input placeholder="Catégorie" maxLength={40} value={edit.category} onChange={(e) => setEdit({ ...edit, category: e.target.value })} />
          </>}
          <DialogFooter><Button onClick={save}>Enregistrer</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
