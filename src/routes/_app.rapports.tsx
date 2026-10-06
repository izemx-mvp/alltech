import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { FileText, Download, Mail, Sparkles, CalendarRange } from "lucide-react";
import { toast } from "sonner";
import { seo } from "@/lib/seo";
import { PageHeader, Panel, StatusBadge, useAiRun, AiThinking } from "@/components/app/kit";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

export const Route = createFileRoute("/_app/rapports")({
  head: () => seo("Rapports", "Rapports hebdomadaires, mensuels, réseaux sociaux, Ads et service client."),
  component: Reports,
});

const reports = [
  { t: "Rapport hebdomadaire", d: "Synthèse des 7 derniers jours : publications, portée, leads et conversations.", last: "05/10/2026", freq: "Chaque lundi" },
  { t: "Rapport mensuel", d: "Bilan complet du mois avec tendances et recommandations IA.", last: "01/10/2026", freq: "Le 1er du mois" },
  { t: "Rapport réseaux sociaux", d: "Croissance d'audience, engagement et top contenus par réseau.", last: "01/10/2026", freq: "Mensuel" },
  { t: "Rapport campagnes Ads", d: "Budgets, CPL, ROAS et performance des audiences.", last: "30/09/2026", freq: "Bimensuel" },
  { t: "Rapport Service Client", d: "Volume, taux de résolution IA, satisfaction et motifs de contact.", last: "30/09/2026", freq: "Mensuel" },
];

function Reports() {
  const ai = useAiRun();
  const [busy, setBusy] = useState<string | null>(null);
  return (
    <>
      <PageHeader eyebrow="Reporting" title="Rapports" subtitle="Générez et partagez des rapports prêts pour la direction." />
      {ai.running && <div className="mb-4"><AiThinking step={ai.step} /></div>}
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {reports.map((r) => (
          <Panel key={r.t} className="glass-hover flex flex-col">
            <div className="flex items-start gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary"><FileText className="h-5 w-5" /></span><div><h3 className="font-semibold">{r.t}</h3><p className="mt-1 text-sm text-muted-foreground">{r.d}</p></div></div>
            <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground"><CalendarRange className="h-3.5 w-3.5" />Dernier : {r.last}<StatusBadge tone="green">Prêt</StatusBadge></div>
            <div className="mt-3 flex items-center justify-between rounded-lg bg-secondary/40 px-3 py-2 text-xs"><span>Envoi automatique · {r.freq}</span><Switch defaultChecked onCheckedChange={(v) => toast(v ? "Envoi automatique activé." : "Envoi automatique désactivé.")} /></div>
            <div className="mt-auto flex gap-2 pt-4">
              <Button size="sm" variant="ai" disabled={ai.running} onClick={async () => { setBusy(r.t); await ai.run(["Collecte des données...", "Analyse des performances...", "Rédaction de la synthèse IA..."]); setBusy(null); toast.success(`${r.t} généré avec succès.`); }}><Sparkles /> {busy === r.t ? "Génération..." : "Générer"}</Button>
              <Button size="sm" variant="outline" onClick={() => toast.success(`${r.t} téléchargé (PDF).`)}><Download /></Button>
              <Button size="sm" variant="outline" onClick={() => toast.success("Rapport envoyé à direction@alltech.com")}><Mail /></Button>
            </div>
          </Panel>
        ))}
      </div>
    </>
  );
}
