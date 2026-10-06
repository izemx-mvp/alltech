import { useRef, useState } from "react";
import { Linkedin, Facebook, Upload, Trash2, RefreshCw, Save, Sprout, Check } from "lucide-react";
import { toast } from "sonner";
import { useStore, setStore, TONES, OBJECTIVES, THEMES, TARGETS, LENGTH_HINT, type CmConfig, type Platform, type CaptionLength } from "@/lib/store";
import { Panel } from "@/components/app/kit";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

const LENGTHS: CaptionLength[] = ["Courte", "Moyenne", "Longue"];

export function ConfigTab() {
  const saved = useStore("cmConfig");
  const [cfg, setCfg] = useState<CmConfig>(saved);
  const file = useRef<HTMLInputElement>(null);
  const setP = (p: Platform, patch: Partial<CmConfig["platforms"][Platform]>) => setCfg((c) => ({ ...c, platforms: { ...c.platforms, [p]: { ...c.platforms[p], ...patch } } }));
  const toggle = (k: "themes" | "targets", v: string) => setCfg((c) => ({ ...c, [k]: c[k].includes(v) ? c[k].filter((x) => x !== v) : [...c[k], v] }));

  return (
    <div className="space-y-6">
      <Panel>
        <h3 className="font-semibold">A. Identité</h3>
        <p className="text-sm text-muted-foreground">Le logo apparaît dans les aperçus de vos publications.</p>
        <div className="mt-4 flex flex-wrap items-center gap-5">
          <div className="grid h-24 w-24 place-items-center overflow-hidden rounded-2xl border bg-secondary/50">
            {cfg.logo ? <img src={cfg.logo} alt="Logo" className="h-full w-full object-contain" /> :
              <div className="text-center"><span className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-gradient-primary text-primary-foreground shadow-glow"><Sprout className="h-6 w-6" /></span><span className="mt-1 block text-[10px] font-bold">ALLTECH</span></div>}
          </div>
          <input ref={file} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) { setCfg((c) => ({ ...c, logo: URL.createObjectURL(f) })); toast.success("Logo importé."); } e.target.value = ""; }} />
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => file.current?.click()}>{cfg.logo ? <><RefreshCw /> Remplacer</> : <><Upload /> Importer un logo</>}</Button>
            {cfg.logo && <Button variant="ghost" onClick={() => { setCfg((c) => ({ ...c, logo: null })); toast("Logo supprimé, logo ALLTECH par défaut rétabli."); }}><Trash2 /> Supprimer</Button>}
          </div>
        </div>
      </Panel>

      <div>
        <h3 className="mb-3 font-semibold">B. Plateformes</h3>
        <div className="grid gap-5 lg:grid-cols-2">
          {(["LinkedIn", "Facebook"] as Platform[]).map((p) => {
            const c = cfg.platforms[p]; const Icon = p === "LinkedIn" ? Linkedin : Facebook;
            return (
              <Panel key={p} className="space-y-4">
                <div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-info/15 text-info"><Icon className="h-5 w-5" /></span><div className="font-semibold">{p}</div></div>
                <div><label className="mb-1.5 block text-xs text-muted-foreground">Tonalité</label>
                  <Select value={c.tone} onValueChange={(v) => setP(p, { tone: v })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{TONES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent></Select></div>
                <div><label className="mb-1.5 block text-xs text-muted-foreground">Objectif principal</label>
                  <Select value={c.objective} onValueChange={(v) => setP(p, { objective: v })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{OBJECTIVES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent></Select></div>
                <div>
                  <div className="mb-2 flex justify-between text-xs"><span className="text-muted-foreground">Taille de légende</span><span className="font-medium text-primary">{c.length} · {LENGTH_HINT[c.length]}</span></div>
                  <Slider value={[LENGTHS.indexOf(c.length)]} max={2} step={1} onValueChange={(v) => setP(p, { length: LENGTHS[v[0] ?? 1]! })} />
                  <div className="mt-1.5 flex justify-between text-[10px] text-muted-foreground">{LENGTHS.map((l) => <span key={l}>{l}</span>)}</div>
                </div>
              </Panel>
            );
          })}
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <Panel><h3 className="font-semibold">C. Thématiques principales</h3><Chips all={THEMES} sel={cfg.themes} onToggle={(v) => toggle("themes", v)} /></Panel>
        <Panel><h3 className="font-semibold">D. Cibles</h3><Chips all={TARGETS} sel={cfg.targets} onToggle={(v) => toggle("targets", v)} /></Panel>
      </div>

      <div className="flex justify-end">
        <Button size="lg" onClick={() => {
          if (!cfg.themes.length || !cfg.targets.length) { toast.error("Sélectionnez au moins une thématique et une cible."); return; }
          setStore(() => ({ cmConfig: cfg })); toast.success("Configuration du Community Manager IA enregistrée avec succès.");
        }}><Save /> Enregistrer la configuration</Button>
      </div>
    </div>
  );
}

function Chips({ all, sel, onToggle }: { all: string[]; sel: string[]; onToggle: (v: string) => void }) {
  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {all.map((t) => {
        const on = sel.includes(t);
        return <button key={t} type="button" onClick={() => onToggle(t)} className={cn("flex items-center gap-1 rounded-full border px-3 py-1.5 text-xs transition", on ? "border-primary/50 bg-primary/15 text-primary" : "text-muted-foreground hover:border-primary/30 hover:text-foreground")}>{on && <Check className="h-3 w-3" />}{t}</button>;
      })}
    </div>
  );
}
