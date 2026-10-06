import { useRef, useState } from "react";
import { UploadCloud, Trash2, RefreshCw, ChevronLeft, ChevronRight, Film } from "lucide-react";
import { toast } from "sonner";
import { uid, type Media } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function MediaDropzone({ media, onChange, accept = "image/*,video/*" }: { media: Media[]; onChange: (m: Media[]) => void; accept?: string }) {
  const input = useRef<HTMLInputElement>(null);
  const replaceInput = useRef<HTMLInputElement>(null);
  const [replaceId, setReplaceId] = useState<string | null>(null);
  const [over, setOver] = useState(false);

  const toMedia = (f: File): Media => ({ id: uid(), url: URL.createObjectURL(f), kind: f.type.startsWith("video") ? "video" : "image", name: f.name });
  const add = (files: FileList | null) => {
    if (!files?.length) return;
    const list = Array.from(files).filter((f) => f.type.startsWith("image") || f.type.startsWith("video")).slice(0, 10);
    if (!list.length) { toast.error("Formats acceptés : images et vidéos."); return; }
    onChange([...media, ...list.map(toMedia)]);
    toast.success(`${list.length} média(s) importé(s).`);
  };
  const move = (i: number, d: number) => { const n = [...media]; const j = i + d; if (j < 0 || j >= n.length) return; [n[i], n[j]] = [n[j]!, n[i]!]; onChange(n); };

  return (
    <div>
      <div onDragOver={(e) => { e.preventDefault(); setOver(true); }} onDragLeave={() => setOver(false)}
        onDrop={(e) => { e.preventDefault(); setOver(false); add(e.dataTransfer.files); }} onClick={() => input.current?.click()}
        className={cn("cursor-pointer rounded-2xl border-2 border-dashed p-6 text-center transition", over ? "border-primary bg-primary/10" : "border-border hover:border-primary/40 hover:bg-primary/5")}>
        <UploadCloud className="mx-auto h-8 w-8 text-primary" />
        <p className="mt-2 text-sm font-medium">Glissez-déposez vos images ou vidéos</p>
        <p className="text-xs text-muted-foreground">ou cliquez pour parcourir · JPG, PNG, MP4</p>
        <input ref={input} type="file" multiple accept={accept} className="hidden" onChange={(e) => { add(e.target.files); e.target.value = ""; }} />
        <input ref={replaceInput} type="file" accept={accept} className="hidden" onChange={(e) => {
          const f = e.target.files?.[0]; if (f && replaceId) { onChange(media.map((m) => m.id === replaceId ? toMedia(f) : m)); toast.success("Média remplacé."); } e.target.value = "";
        }} />
      </div>
      {media.length > 0 && (
        <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
          {media.map((m, i) => (
            <div key={m.id} className="group relative overflow-hidden rounded-xl border bg-secondary">
              {m.kind === "video" ? <div className="grid aspect-square place-items-center"><Film className="h-6 w-6 text-primary" /></div> : <img src={m.url} alt={m.name} className="aspect-square w-full object-cover" />}
              <span className="absolute left-1 top-1 rounded bg-background/80 px-1.5 text-[10px]">{i + 1}</span>
              <div className="absolute inset-x-0 bottom-0 flex justify-center gap-0.5 bg-background/85 p-1 opacity-0 transition group-hover:opacity-100">
                <Button type="button" size="icon" variant="ghost" className="h-6 w-6" onClick={() => move(i, -1)} aria-label="Avancer"><ChevronLeft /></Button>
                <Button type="button" size="icon" variant="ghost" className="h-6 w-6" onClick={() => { setReplaceId(m.id); replaceInput.current?.click(); }} aria-label="Remplacer"><RefreshCw /></Button>
                <Button type="button" size="icon" variant="ghost" className="h-6 w-6" onClick={() => { onChange(media.filter((x) => x.id !== m.id)); toast("Média supprimé."); }} aria-label="Supprimer"><Trash2 /></Button>
                <Button type="button" size="icon" variant="ghost" className="h-6 w-6" onClick={() => move(i, 1)} aria-label="Reculer"><ChevronRight /></Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
