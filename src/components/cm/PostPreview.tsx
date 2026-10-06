import { Globe, ThumbsUp, MessageCircle, Repeat2, Send, Share2, MoreHorizontal, Sprout } from "lucide-react";
import type { Media, Platform } from "@/lib/store";

interface Props { platform: Platform; caption: string; hashtags: string; cta: string; media: Media[]; logo: string | null }

function Avatar({ logo }: { logo: string | null }) {
  return logo
    ? <img src={logo} alt="Logo ALLTECH" className="h-11 w-11 rounded-full border border-border bg-background object-contain" />
    : <span className="grid h-11 w-11 place-items-center rounded-full bg-gradient-primary text-primary-foreground"><Sprout className="h-5 w-5" /></span>;
}

function MediaGrid({ media }: { media: Media[] }) {
  if (!media.length) return null;
  const shown = media.slice(0, 4);
  return (
    <div className={`grid gap-0.5 ${shown.length > 1 ? "grid-cols-2" : ""}`}>
      {shown.map((m, i) => (
        <div key={m.id} className={`relative overflow-hidden bg-secondary ${shown.length === 3 && i === 0 ? "col-span-2" : ""}`}>
          {m.kind === "video"
            ? <video src={m.url} className="aspect-video w-full object-cover" controls />
            : <img src={m.url} alt={m.name} className={`w-full object-cover ${shown.length > 1 ? "aspect-square" : "aspect-[1.6]"}`} />}
          {i === 3 && media.length > 4 && <span className="absolute inset-0 grid place-items-center bg-background/70 text-xl font-semibold">+{media.length - 4}</span>}
        </div>
      ))}
    </div>
  );
}

/** Simulated LinkedIn / Facebook post card. */
export function PostPreview({ platform, caption, hashtags, cta, media, logo }: Props) {
  const body = (
    <div className="whitespace-pre-line px-4 pb-3 text-[13px] leading-relaxed">
      {caption}
      {hashtags && <div className="mt-2 font-medium text-info">{hashtags}</div>}
    </div>
  );
  if (platform === "LinkedIn") {
    return (
      <div className="overflow-hidden rounded-xl border bg-popover text-popover-foreground shadow-xl">
        <div className="flex items-start gap-3 p-4">
          <Avatar logo={logo} />
          <div className="flex-1"><div className="text-sm font-semibold">ALLTECH Crop Science</div><div className="text-xs text-muted-foreground">18 420 abonnés</div><div className="flex items-center gap-1 text-xs text-muted-foreground">Maintenant · <Globe className="h-3 w-3" /></div></div>
          <MoreHorizontal className="h-5 w-5 text-muted-foreground" />
        </div>
        {body}
        <MediaGrid media={media} />
        {cta && <div className="flex items-center justify-between border-t bg-secondary/40 px-4 py-3"><span className="text-xs text-muted-foreground">alltech-crop.com</span><span className="rounded-full border border-info px-4 py-1 text-xs font-semibold text-info">{cta}</span></div>}
        <div className="flex justify-around border-t px-2 py-2 text-xs font-medium text-muted-foreground">
          {[[ThumbsUp, "J'aime"], [MessageCircle, "Commenter"], [Repeat2, "Republier"], [Send, "Envoyer"]].map(([I, l]) => { const Ic = I as typeof ThumbsUp; return <span key={l as string} className="flex items-center gap-1.5 rounded px-2 py-1"><Ic className="h-4 w-4" />{l as string}</span>; })}
        </div>
      </div>
    );
  }
  return (
    <div className="overflow-hidden rounded-xl border bg-popover text-popover-foreground shadow-xl">
      <div className="flex items-start gap-3 p-4">
        <Avatar logo={logo} />
        <div className="flex-1"><div className="text-sm font-semibold">ALLTECH Maroc</div><div className="flex items-center gap-1 text-xs text-muted-foreground">À l'instant · <Globe className="h-3 w-3" /></div></div>
        <MoreHorizontal className="h-5 w-5 text-muted-foreground" />
      </div>
      {body}
      <MediaGrid media={media} />
      {cta && <div className="flex items-center justify-between bg-secondary/50 px-4 py-3"><div><div className="text-[10px] uppercase text-muted-foreground">alltech-crop.com</div><div className="text-sm font-semibold">Solutions de nutrition végétale</div></div><span className="rounded-md bg-secondary px-3 py-1.5 text-xs font-semibold">{cta}</span></div>}
      <div className="flex justify-around border-t px-2 py-2 text-xs font-medium text-muted-foreground">
        <span className="flex items-center gap-1.5"><ThumbsUp className="h-4 w-4" />J'aime</span><span className="flex items-center gap-1.5"><MessageCircle className="h-4 w-4" />Commenter</span><span className="flex items-center gap-1.5"><Share2 className="h-4 w-4" />Partager</span>
      </div>
    </div>
  );
}
