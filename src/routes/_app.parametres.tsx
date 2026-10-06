import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Bot, Headset, Save } from "lucide-react";
import { toast } from "sonner";
import { seo } from "@/lib/seo";
import { PageHeader, Panel } from "@/components/app/kit";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/_app/parametres")({
  head: () => seo("Paramètres des Agents IA", "Configurez le ton, les règles et l'autonomie des Agents IA ALLTECH."),
  component: Settings,
});

const autonomy = ["Suggestion uniquement", "Validation requise", "Semi-autonome", "Autonome"];

function Settings() {
  const [cmAuto, setCmAuto] = useState([1]);
  const [scAuto, setScAuto] = useState([2]);
  return (
    <>
      <PageHeader eyebrow="Configuration" title="Paramètres des Agents IA" subtitle="Ajustez le comportement de vos agents à votre ligne éditoriale." />
      <Tabs defaultValue="cm">
        <TabsList className="mb-5 bg-secondary/50"><TabsTrigger value="cm"><Bot className="mr-1 h-4 w-4" />Agent Community Manager</TabsTrigger><TabsTrigger value="sc"><Headset className="mr-1 h-4 w-4" />Agent Service Client</TabsTrigger></TabsList>
        <TabsContent value="cm">
          <div className="grid gap-6 xl:grid-cols-2">
            <Panel className="space-y-5">
              <Field label="Ton de marque"><Sel def="Expert & pédagogique" opts={["Expert & pédagogique", "Inspirant", "Proche & chaleureux", "Institutionnel"]} /></Field>
              <Field label="Langues"><Sel def="Français" opts={["Français", "Français + Arabe", "Français + Anglais"]} /></Field>
              <Field label="Réseaux gérés">{["LinkedIn", "Facebook", "Instagram", "YouTube"].map((n) => <Row key={n} label={n} def={n !== "YouTube"} />)}</Field>
            </Panel>
            <Panel className="space-y-5">
              <Field label="Piliers éditoriaux"><Textarea defaultValue="Expertise agronomique · Témoignages agriculteurs · Innovation produit · Agriculture durable" rows={3} /></Field>
              <Field label="Mots à éviter"><Textarea defaultValue="garanti, miracle, 100 % efficace" rows={2} /></Field>
              <Field label={`Niveau d'autonomie : ${autonomy[cmAuto[0]]}`}><Slider value={cmAuto} onValueChange={setCmAuto} max={3} step={1} /></Field>
              <Row label="Publier automatiquement aux meilleurs horaires" def />
            </Panel>
          </div>
        </TabsContent>
        <TabsContent value="sc">
          <div className="grid gap-6 xl:grid-cols-2">
            <Panel className="space-y-5">
              <Field label="Message d'accueil"><Textarea defaultValue="Bonjour 🌱 Je suis l'assistant ALLTECH. Comment puis-je vous aider pour la nutrition de vos cultures ?" rows={3} /></Field>
              <Field label="Langue"><Sel def="Français" opts={["Français", "Arabe", "Darija", "Anglais"]} /></Field>
              <Field label="Ton"><Sel def="Professionnel et bienveillant" opts={["Professionnel et bienveillant", "Technique", "Concis"]} /></Field>
              <Field label="Règles de réponse"><Textarea defaultValue="Toujours citer la source de la base de connaissance. Ne jamais donner de prix. Recommander un conseiller pour toute surface > 50 ha." rows={3} /></Field>
            </Panel>
            <Panel className="space-y-5">
              <Field label="Règles de transfert humain">
                <Row label="Demande de devis ou commerciale" def /><Row label="Client mécontent (sentiment négatif)" def /><Row label="Question hors base de connaissance" def /><Row label="Diagnostic phytosanitaire complexe" def={false} />
              </Field>
              <Field label="Informations à collecter">
                <Row label="Type de culture" def /><Row label="Surface cultivée" def /><Row label="Région" def /><Row label="Numéro de téléphone" def={false} />
              </Field>
              <Field label={`Niveau d'autonomie : ${autonomy[scAuto[0]]}`}><Slider value={scAuto} onValueChange={setScAuto} max={3} step={1} /></Field>
            </Panel>
          </div>
        </TabsContent>
      </Tabs>
      <div className="mt-6 flex justify-end"><Button onClick={() => toast.success("Paramètres des Agents IA enregistrés.")}><Save /> Enregistrer</Button></div>
    </>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><p className="mb-2 text-sm font-medium">{label}</p><div className="space-y-2">{children}</div></div>;
}
function Row({ label, def }: { label: string; def: boolean }) {
  return <div className="flex items-center justify-between rounded-lg bg-secondary/40 px-3 py-2 text-sm">{label}<Switch defaultChecked={def} onCheckedChange={(v) => toast(`${label} : ${v ? "activé" : "désactivé"}`)} /></div>;
}
function Sel({ def, opts }: { def: string; opts: string[] }) {
  return <Select defaultValue={def}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{opts.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent></Select>;
}
