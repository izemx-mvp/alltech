import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Sparkles, Wand2, CalendarClock, RefreshCw, Lightbulb, Hash, Copy } from "lucide-react";
import { toast } from "sonner";
import { seo } from "@/lib/seo";
import { contentIdeas } from "@/lib/mock";
import { PageHeader, Panel, AiThinking, AiTag, StatusBadge, useAiRun } from "@/components/app/kit";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const Route = createFileRoute("/_app/agent-community-manager")({
  head: () => seo("Agent IA Community Manager", "Votre copilote IA pour générer idées, publications et calendrier éditorial."),
  component: AgentCM,
});

const extraIdeas = [
  { title: "Irrigation intelligente : économiser 30 % d'eau", format: "Vidéo courte", pillar: "Innovation", angle: "Démonstration terrain avec capteurs d'humidité." },
  { title: "3 questions à notre agronome sur l'olivier", format: "Post LinkedIn", pillar: "Expertise", angle: "Format interview, réponses courtes et actionnables." },
  { title: "La journée type d'un conseiller ALLTECH", format: "Carrousel Instagram", pillar: "Communauté", angle: "Coulisses humaines et proximité avec les agriculteurs." },
];

const draftFor = (title: string, tone: string) =>
  `🌱 ${title}\n\nQuand les températures dépassent 35 °C, vos cultures ferment leurs stomates et l'absorption des nutriments chute. Résultat : stress, baisse de calibre et pertes de rendement.\n\n✅ Fractionnez les apports en fertirrigation\n✅ Privilégiez les applications tôt le matin\n✅ Renforcez le système racinaire avec un biostimulant adapté\n✅ Surveillez le potassium et le calcium\n\n${tone === "Expert" ? "Nos agronomes accompagnent chaque exploitation avec un plan nutritionnel sur mesure." : "Besoin d'un conseil ? Nos équipes sont à votre écoute 👇"}\n\n#NutritionVégétale #Agriculture #ALLTECH #Biostimulants`;

function AgentCM() {
  const ai = useAiRun();
  const [ideas, setIdeas] = useState(contentIdeas.slice(0, 3));
  const [selected, setSelected] = useState(contentIdeas[0]);
  const [draft, setDraft] = useState("");
  const [tone, setTone] = useState("Pédagogique");
  const [network, setNetwork] = useState("LinkedIn");

  const genIdeas = async () => {
    await ai.run(["Analyse des tendances agricoles...", "Analyse des performances...", "Génération des idées..."]);
    setIdeas((i) => [...contentIdeas.slice(3), ...extraIdeas, ...i].slice(0, 6));
    toast.success("6 nouvelles idées générées par l'Agent IA.");
  };
  const genPost = async () => {
    await ai.run(["Recherche dans la base de connaissance...", "Adaptation au ton de marque...", "Génération du contenu..."]);
    setDraft(draftFor(selected.title, tone));
    toast.success("Contenu généré par l'Agent IA.");
  };

  return (
    <>
      <PageHeader eyebrow="Agent IA" title="Agent IA Community Manager" subtitle="Votre copilote IA pour votre communication digitale"
        actions={<Button variant="ai" onClick={genIdeas} disabled={ai.running}><Sparkles /> Générer des idées</Button>} />
      {ai.running && <div className="mb-6"><AiThinking step={ai.step} /></div>}

      <div className="grid gap-6 xl:grid-cols-[1fr_1.1fr]">
        <Panel>
          <div className="mb-4 flex items-center gap-2"><Lightbulb className="h-4 w-4 text-primary" /><h3 className="font-semibold">1. Idées de contenu</h3><span className="ml-auto"><AiTag /></span></div>
          <div className="space-y-3">
            {ideas.map((i) => (
              <button key={i.title} onClick={() => setSelected(i)}
                className={`w-full rounded-xl border p-4 text-left transition hover:border-primary/40 ${selected.title === i.title ? "border-primary/50 bg-primary/5 shadow-glow" : "bg-secondary/30"}`}>
                <div className="flex flex-wrap items-center gap-2"><StatusBadge tone="blue">{i.format}</StatusBadge><StatusBadge tone="gray">{i.pillar}</StatusBadge></div>
                <p className="mt-2 font-medium">{i.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{i.angle}</p>
              </button>
            ))}
          </div>
        </Panel>

        <Panel className="ai-border">
          <div className="mb-4 flex items-center gap-2"><Wand2 className="h-4 w-4 text-ai" /><h3 className="font-semibold">2. Rédaction de la publication</h3></div>
          <p className="text-sm text-muted-foreground">Sujet : <span className="text-foreground">{selected.title}</span></p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Select value={network} onValueChange={setNetwork}><SelectTrigger className="w-36"><SelectValue /></SelectTrigger><SelectContent>{["LinkedIn", "Facebook", "Instagram"].map((n) => <SelectItem key={n} value={n}>{n}</SelectItem>)}</SelectContent></Select>
            <Select value={tone} onValueChange={setTone}><SelectTrigger className="w-40"><SelectValue /></SelectTrigger><SelectContent>{["Pédagogique", "Expert", "Inspirant", "Proche"].map((n) => <SelectItem key={n} value={n}>Ton : {n}</SelectItem>)}</SelectContent></Select>
            <Button variant="ai" onClick={genPost} disabled={ai.running}><Sparkles /> Générer la publication</Button>
          </div>
          <Textarea value={draft} onChange={(e) => setDraft(e.target.value)} rows={14} placeholder="Sélectionnez une idée puis cliquez sur « Générer la publication »."
            className="mt-4 bg-secondary/30 text-sm leading-relaxed" />
          <div className="mt-3 flex flex-wrap gap-2">
            <Button variant="outline" disabled={!draft} onClick={genPost}><RefreshCw /> Régénérer</Button>
            <Button variant="outline" disabled={!draft} onClick={() => { setDraft((d) => d + " #AgricultureDurable #Rendement"); toast.success("Hashtags optimisés ajoutés."); }}><Hash /> Optimiser hashtags</Button>
            <Button variant="outline" disabled={!draft} onClick={() => { navigator.clipboard?.writeText(draft); toast.success("Texte copié."); }}><Copy /> Copier</Button>
            <Button className="ml-auto" disabled={!draft} onClick={() => toast.success(`Publication programmée avec succès sur ${network}.`)}><CalendarClock /> Programmer</Button>
          </div>
        </Panel>
      </div>
    </>
  );
}
