import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Sparkles, Image as ImageIcon, Video, FileText, Send, Plus, Trash2, Copy, Play } from "lucide-react";
import { toast } from "sonner";
import { seo } from "@/lib/seo";
import { posts } from "@/lib/mock";
import { PageHeader, Panel, AiThinking, useAiRun, StatusBadge, statusTone, AiTag, NetworkDot } from "@/components/app/kit";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/_app/studio")({
  head: () => seo("Studio de contenu", "Créez publications, articles, visuels et vidéos assistés par l'IA."),
  component: Studio,
});

const initArticles = [
  { id: "a1", title: "Guide complet : nutrition de la tomate sous serre", words: 1840, status: "Publié" },
  { id: "a2", title: "Comprendre le rôle des biostimulants en conditions de stress", words: 1260, status: "À valider" },
  { id: "a3", title: "Fertilisation des agrumes : calendrier annuel", words: 980, status: "Brouillon" },
];
const visuals = ["Carte conseil — stress thermique", "Infographie oligo-éléments", "Bannière webinar agrumes", "Citation agronome", "Avant/après parcelle poivrons", "Fiche produit visuelle"];
const videos = [{ t: "Témoignage producteur de fraises", d: "1:42" }, { t: "Tutoriel fertirrigation", d: "3:15" }, { t: "60 s pour comprendre le zinc", d: "0:58" }];

function Studio() {
  const ai = useAiRun();
  const [items, setItems] = useState(posts.slice(0, 6));
  const [arts, setArts] = useState(initArticles);
  const [prompt, setPrompt] = useState("Post LinkedIn sur l'importance du calcium pour éviter la nécrose apicale des tomates");
  const [vis, setVis] = useState(visuals);

  const generate = async () => {
    if (!prompt.trim()) { toast.error("Décrivez le contenu à générer."); return; }
    await ai.run(["Analyse de la demande...", "Recherche dans la base de connaissance...", "Génération du contenu..."]);
    setItems((x) => [{ ...posts[0]!, id: crypto.randomUUID(), title: prompt.slice(0, 70), status: "À valider", ai: true, network: "LinkedIn" }, ...x]);
    toast.success("Contenu généré par l'Agent IA.");
  };

  return (
    <>
      <PageHeader eyebrow="Création" title="Studio de contenu" subtitle="Tous vos formats, assistés par l'intelligence artificielle." />
      <Tabs defaultValue="pub">
        <TabsList className="mb-5 bg-secondary/50">
          <TabsTrigger value="pub"><Send className="mr-1 h-4 w-4" />Publications</TabsTrigger>
          <TabsTrigger value="art"><FileText className="mr-1 h-4 w-4" />Articles</TabsTrigger>
          <TabsTrigger value="vis"><ImageIcon className="mr-1 h-4 w-4" />Visuels</TabsTrigger>
          <TabsTrigger value="vid"><Video className="mr-1 h-4 w-4" />Vidéos</TabsTrigger>
        </TabsList>

        <TabsContent value="pub" className="space-y-5">
          <Panel className="ai-border">
            <div className="flex flex-col gap-3 md:flex-row">
              <Textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} maxLength={500} rows={2} className="bg-secondary/30" />
              <Button variant="ai" className="md:h-auto" onClick={generate} disabled={ai.running}><Sparkles /> Générer avec l'IA</Button>
            </div>
            {ai.running && <div className="mt-3"><AiThinking step={ai.step} /></div>}
          </Panel>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {items.map((p) => (
              <Panel key={p.id} className="glass-hover animate-in fade-in">
                <div className="flex items-center gap-2 text-xs text-muted-foreground"><NetworkDot n={p.network} />{p.network} · {p.type}{p.ai && <span className="ml-auto"><AiTag /></span>}</div>
                <p className="mt-2 font-medium">{p.title}</p>
                <div className="mt-4 flex items-center gap-2">
                  <StatusBadge tone={statusTone(p.status)}>{p.status}</StatusBadge>
                  <div className="ml-auto flex gap-1">
                    {p.status === "À valider" && <Button size="sm" onClick={() => { setItems((x) => x.map((y) => y.id === p.id ? { ...y, status: "Programmé" } : y)); toast.success("Publication programmée avec succès."); }}>Valider</Button>}
                    <Button size="icon" variant="ghost" onClick={() => { setItems((x) => [{ ...p, id: crypto.randomUUID(), status: "Brouillon" }, ...x]); toast.success("Publication dupliquée."); }}><Copy /></Button>
                    <Button size="icon" variant="ghost" onClick={() => { setItems((x) => x.filter((y) => y.id !== p.id)); toast("Publication supprimée."); }}><Trash2 /></Button>
                  </div>
                </div>
              </Panel>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="art">
          <Panel>
            <div className="mb-4 flex items-center justify-between"><h3 className="font-semibold">Articles de blog</h3>
              <Button size="sm" variant="ai" disabled={ai.running} onClick={async () => { await ai.run(["Analyse SEO...", "Rédaction de l'article..."]); setArts((a) => [{ id: crypto.randomUUID(), title: "Olivier : réussir la nutrition d'automne", words: 1420, status: "À valider" }, ...a]); toast.success("Article généré par l'Agent IA."); }}><Sparkles /> Rédiger un article</Button></div>
            {ai.running && <div className="mb-3"><AiThinking step={ai.step} /></div>}
            <div className="divide-y">
              {arts.map((a) => (
                <div key={a.id} className="flex items-center gap-3 py-3">
                  <FileText className="h-5 w-5 text-primary" /><div className="flex-1"><p className="font-medium">{a.title}</p><p className="text-xs text-muted-foreground">{a.words} mots · SEO 92/100</p></div>
                  <StatusBadge tone={statusTone(a.status)}>{a.status}</StatusBadge>
                  <Button size="sm" variant="outline" onClick={() => toast.success("Article ouvert dans l'éditeur.")}>Éditer</Button>
                </div>
              ))}
            </div>
          </Panel>
        </TabsContent>

        <TabsContent value="vis">
          <div className="mb-4 flex gap-2"><Input placeholder="Nom du nouveau visuel" id="nv" className="max-w-xs" />
            <Button onClick={() => { const el = document.getElementById("nv") as HTMLInputElement; const v = el.value.trim() || "Nouveau visuel IA"; setVis((x) => [v, ...x]); el.value = ""; toast.success("Visuel créé."); }}><Plus /> Créer un visuel</Button></div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
            {vis.map((v, i) => (
              <div key={v + i} className="glass glass-hover overflow-hidden rounded-2xl">
                <div className="aspect-square" style={{ background: `linear-gradient(${i * 50}deg, var(--forest), var(--primary) 70%, var(--ai))` }} />
                <p className="truncate p-3 text-xs">{v}</p>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="vid">
          <div className="grid gap-4 md:grid-cols-3">
            {videos.map((v, i) => (
              <Panel key={v.t} className="glass-hover p-0 overflow-hidden">
                <button onClick={() => toast("Lecture de l'aperçu vidéo...")} className="relative grid aspect-video w-full place-items-center" style={{ background: `radial-gradient(circle at ${30 + i * 20}% 40%, var(--primary), var(--secondary) 70%)` }}>
                  <span className="grid h-12 w-12 place-items-center rounded-full bg-background/60 backdrop-blur"><Play className="h-5 w-5 text-primary" /></span>
                  <span className="absolute bottom-2 right-2 rounded bg-background/70 px-1.5 text-xs">{v.d}</span>
                </button>
                <div className="flex items-center justify-between p-4"><p className="font-medium">{v.t}</p><Button size="sm" variant="ai" onClick={() => toast.success("Sous-titres générés par l'IA.")}><Sparkles /> Sous-titres</Button></div>
              </Panel>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </>
  );
}
