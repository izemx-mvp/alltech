import { useEffect, useState } from "react";
import { Sparkles, ArrowLeft, Save, CheckCircle2, Send, CalendarClock, Check, Linkedin, Facebook } from "lucide-react";
import { toast } from "sonner";
import { useStore, setStore, getStore, TONES, TODAY, uid, type Idea, type Platform, type CaptionLength, type Media, type Publication } from "@/lib/store";
import { AiThinking, useAiRun } from "@/components/app/kit";
import { PostPreview } from "./PostPreview";
import { MediaDropzone } from "./MediaDropzone";
import { generateCaption, HASHTAG_SETS, CTAS } from "./content";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const IMAGE_COUNTS = ["1", "2", "3", "4", "Carousel"];
const VIDEO_COUNTS = ["1 vidéo", "Plusieurs clips"];

export function PostWizard({ idea, onClose }: { idea: Idea | null; onClose: () => void }) {
  const cfg = useStore("cmConfig");
  const ai = useAiRun();
  const [step, setStep] = useState(1);
  const [platform, setPlatform] = useState<Platform>("LinkedIn");
  const [tone, setTone] = useState("Expert");
  const [lang, setLang] = useState("Français");
  const [length, setLength] = useState<CaptionLength>("Moyenne");
  const [text, setText] = useState("");
  const [mediaType, setMediaType] = useState<"image" | "video">("image");
  const [count, setCount] = useState("1");
  const [media, setMedia] = useState<Media[]>([]);
  const [caption, setCaption] = useState("");
  const [hashtags, setHashtags] = useState("");
  const [cta, setCta] = useState("");
  const [publishOpen, setPublishOpen] = useState(false);
  const [mode, setMode] = useState<"now" | "schedule">("now");
  const [date, setDate] = useState("2026-10-09");
  const [time, setTime] = useState("09:00");
  const [tz, setTz] = useState("Africa/Casablanca (UTC+1)");

  useEffect(() => {
    if (!idea) return;
    const p = cfg.platforms[idea.platform];
    setStep(1); setPlatform(idea.platform); setTone(p.tone); setLength(p.length); setLang("Français");
    setText(`${idea.title}\n${idea.description}`); setMedia([{ id: uid(), url: idea.image, kind: "image", name: "visuel-ia.jpg" }]);
    setMediaType("image"); setCount("1"); setCaption(""); setHashtags(""); setCta("");
  }, [idea, cfg]);

  const generate = async () => {
    if (!text.trim()) { toast.error("Décrivez l'idée du post."); return; }
    await ai.run(["Analyse de votre configuration...", "Rédaction de la légende...", "Génération des hashtags et du CTA..."]);
    setCaption(generateCaption(text.split("\n")[0]!.slice(0, 140), tone, length, lang));
    setHashtags(HASHTAG_SETS[Math.floor(Math.random() * HASHTAG_SETS.length)]!);
    setCta(CTAS[Math.floor(Math.random() * CTAS.length)]!);
    setStep(2); toast.success("Contenu généré par l'Agent IA.");
  };

  const save = (status: Publication["status"]) => {
    if (!idea) return;
    const d = status === "Publié" ? TODAY : date;
    const t = status === "Publié" ? new Date().toTimeString().slice(0, 5) : time;
    const type: Publication["type"] = mediaType === "video" && media.length ? "Vidéo" : media.length > 1 || count === "Carousel" ? "Carrousel" : media.length ? "Image" : "Texte";
    const p: Publication = { id: uid(), title: idea.title, platform, tone, caption, hashtags, cta, media, date: d, time: t, timezone: tz, status, type };
    setStore((s) => ({ publications: [p, ...s.publications], ideas: s.ideas.map((i) => i.id === idea.id ? { ...i, status } : i) }));
    setPublishOpen(false); onClose();
    toast.success(status === "Publié" ? "Publication publiée avec succès." : status === "Planifié" ? "Publication planifiée avec succès." : "Brouillon enregistré.");
  };

  return (
    <>
      <Dialog open={!!idea} onOpenChange={(o) => !o && onClose()}>
        <DialogContent className="max-h-[94vh] max-w-6xl overflow-y-auto backdrop-blur-xl">
          <DialogHeader><DialogTitle>Générer le post</DialogTitle><DialogDescription>{idea?.title}</DialogDescription></DialogHeader>
          <div className="flex items-center gap-3">
            {["Configuration", "Preview & Validation"].map((l, i) => (
              <div key={l} className="flex flex-1 items-center gap-3">
                <span className={cn("grid h-8 w-8 shrink-0 place-items-center rounded-full border text-sm font-semibold transition", step > i + 1 ? "border-primary bg-primary text-primary-foreground" : step === i + 1 ? "border-primary text-primary shadow-glow" : "text-muted-foreground")}>{step > i + 1 ? <Check className="h-4 w-4" /> : i + 1}</span>
                <span className={cn("text-sm", step === i + 1 ? "font-semibold" : "text-muted-foreground")}>Étape {i + 1} — {l}</span>
                {i === 0 && <span className="h-px flex-1 bg-border" />}
              </div>
            ))}
          </div>

          {step === 1 && (
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="space-y-4">
                <Field label="Plateforme">
                  <div className="grid grid-cols-2 gap-2">
                    {(["LinkedIn", "Facebook"] as Platform[]).map((p) => { const I = p === "LinkedIn" ? Linkedin : Facebook; return (
                      <button key={p} type="button" onClick={() => { setPlatform(p); setTone(cfg.platforms[p].tone); setLength(cfg.platforms[p].length); }} className={cn("flex items-center gap-2 rounded-xl border p-3 text-sm transition", platform === p ? "border-primary/50 bg-primary/10" : "hover:border-primary/30")}>
                        <I className="h-4 w-4 text-info" />{p}{idea?.platform === p && <span className="ml-auto text-[10px] text-primary">Recommandée</span>}
                      </button>); })}
                  </div>
                </Field>
                <div className="grid grid-cols-3 gap-3">
                  <Field label="Tonalité"><Select value={tone} onValueChange={setTone}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{TONES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent></Select></Field>
                  <Field label="Langue"><Select value={lang} onValueChange={setLang}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{["Français", "Anglais", "Arabe"].map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent></Select></Field>
                  <Field label="Taille de légende"><Select value={length} onValueChange={(v) => setLength(v as CaptionLength)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{["Courte", "Moyenne", "Longue"].map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent></Select></Field>
                </div>
                <Field label="Idée du post"><Textarea rows={5} maxLength={1000} value={text} onChange={(e) => setText(e.target.value)} /></Field>
              </div>
              <div className="space-y-4">
                <Field label="Type et nombre de médias">
                  <div className="flex gap-2">
                    {(["image", "video"] as const).map((t) => <Button key={t} type="button" size="sm" variant={mediaType === t ? "secondary" : "ghost"} onClick={() => { setMediaType(t); setCount(t === "image" ? "1" : "1 vidéo"); }}>{t === "image" ? "Images" : "Vidéos"}</Button>)}
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {(mediaType === "image" ? IMAGE_COUNTS : VIDEO_COUNTS).map((c) => <button key={c} type="button" onClick={() => setCount(c)} className={cn("rounded-lg border px-3 py-1.5 text-xs", count === c ? "border-primary/50 bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground")}>{c}</button>)}
                  </div>
                </Field>
                <Field label="Import média"><MediaDropzone media={media} onChange={setMedia} accept={mediaType === "image" ? "image/*" : "video/*"} /></Field>
              </div>
              <div className="lg:col-span-2">
                {ai.running ? <AiThinking step={ai.step} /> : <div className="flex justify-end"><Button variant="ai" size="lg" onClick={generate}><Sparkles /> Générer le contenu avec l'IA</Button></div>}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
              <div className="rounded-2xl bg-secondary/30 p-4"><p className="mb-3 text-xs uppercase tracking-wider text-muted-foreground">Aperçu {platform}</p><PostPreview platform={platform} caption={caption} hashtags={hashtags} cta={cta} media={media} logo={cfg.logo} /></div>
              <div className="space-y-4">
                {ai.running && <AiThinking step={ai.step} />}
                <Field label="Texte"><Textarea rows={9} maxLength={3000} value={caption} onChange={(e) => setCaption(e.target.value)} /></Field>
                <Field label="Hashtags"><Input maxLength={300} value={hashtags} onChange={(e) => setHashtags(e.target.value)} /></Field>
                <Field label="Call-to-action"><Input maxLength={60} value={cta} onChange={(e) => setCta(e.target.value)} /></Field>
                <Field label="Médias"><MediaDropzone media={media} onChange={setMedia} /></Field>
              </div>
            </div>
          )}

          {step === 2 && (
            <DialogFooter className="flex-wrap gap-2 sm:justify-between">
              <div className="flex gap-2"><Button variant="ghost" onClick={() => setStep(1)}><ArrowLeft /> Retour</Button><Button variant="outline" disabled={ai.running} onClick={generate}><Sparkles /> Régénérer avec l'IA</Button></div>
              <div className="flex gap-2"><Button variant="outline" onClick={() => save("Brouillon")}><Save /> Enregistrer comme brouillon</Button><Button onClick={() => { if (!caption.trim()) { toast.error("Le texte est vide."); return; } setPublishOpen(true); }}><CheckCircle2 /> Valider</Button></div>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={publishOpen} onOpenChange={setPublishOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Publication validée</DialogTitle><DialogDescription>Comment souhaitez-vous la diffuser ?</DialogDescription></DialogHeader>
          <div className="grid grid-cols-2 gap-3">
            {([["now", Send, "Publier immédiatement"], ["schedule", CalendarClock, "Planifier la publication"]] as const).map(([m, I, l]) => (
              <button key={m} type="button" onClick={() => setMode(m)} className={cn("rounded-xl border p-4 text-left text-sm transition", mode === m ? "border-primary/50 bg-primary/10 shadow-glow" : "hover:border-primary/30")}><I className="mb-2 h-5 w-5 text-primary" />{l}</button>
            ))}
          </div>
          {mode === "schedule" ? (
            <div className="grid grid-cols-2 gap-3">
              <Field label="Date"><Input type="date" min={TODAY} value={date} onChange={(e) => setDate(e.target.value)} /></Field>
              <Field label="Heure"><Input type="time" value={time} onChange={(e) => setTime(e.target.value)} /></Field>
              <Field label="Plateforme"><Select value={platform} onValueChange={(v) => setPlatform(v as Platform)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="LinkedIn">LinkedIn</SelectItem><SelectItem value="Facebook">Facebook</SelectItem></SelectContent></Select></Field>
              <Field label="Fuseau horaire"><Select value={tz} onValueChange={setTz}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{["Africa/Casablanca (UTC+1)", "Europe/Paris (UTC+2)", "UTC"].map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent></Select></Field>
            </div>
          ) : <p className="rounded-lg bg-secondary/40 p-3 text-sm text-muted-foreground">Le post sera publié maintenant sur {platform}. Confirmez-vous ?</p>}
          <DialogFooter>
            <Button variant="ghost" onClick={() => setPublishOpen(false)}>Annuler</Button>
            {mode === "now" ? <Button onClick={() => save("Publié")}><Send /> Confirmer la publication</Button> : <Button disabled={!date || !time || date < TODAY} onClick={() => save("Planifié")}><CalendarClock /> Planifier</Button>}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><label className="mb-1.5 block text-xs font-medium text-muted-foreground">{label}</label>{children}</div>;
}
void getStore;
