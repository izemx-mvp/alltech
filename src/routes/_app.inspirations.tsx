import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Bookmark, BookmarkCheck, Sparkles, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import { seo } from "@/lib/seo";
import { inspirations } from "@/lib/mock";
import { PageHeader, Panel, StatusBadge, NetworkDot } from "@/components/app/kit";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export const Route = createFileRoute("/_app/inspirations")({
  head: () => seo("Inspirations", "Veille des meilleurs contenus du secteur agricole pour inspirer vos publications."),
  component: Insp,
});

function Insp() {
  const nav = useNavigate();
  const [tag, setTag] = useState("all");
  const [saved, setSaved] = useState<string[]>([]);
  const tags = Array.from(new Set(inspirations.map((i) => i.tag)));
  const list = inspirations.filter((i) => tag === "all" || i.tag === tag);

  return (
    <>
      <PageHeader eyebrow="Veille" title="Inspirations" subtitle="Les contenus les plus performants du secteur, analysés par l'IA." />
      <ToggleGroup type="single" value={tag} onValueChange={(v) => setTag(v || "all")} className="mb-6 flex-wrap justify-start">
        <ToggleGroupItem value="all">Tous</ToggleGroupItem>
        {tags.map((t) => <ToggleGroupItem key={t} value={t}>{t}</ToggleGroupItem>)}
      </ToggleGroup>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {list.map((i, idx) => {
          const isSaved = saved.includes(i.title);
          return (
            <Panel key={i.title} className="glass-hover overflow-hidden p-0">
              <div className="relative h-36 overflow-hidden" style={{ background: `radial-gradient(circle at ${20 + idx * 12}% 30%, var(--primary), transparent 60%), radial-gradient(circle at 80% 80%, var(--ai), transparent 55%), var(--secondary)` }}>
                <div className="absolute inset-0 opacity-40 [background:repeating-linear-gradient(110deg,transparent_0_18px,var(--border)_18px_19px)]" />
                <span className="absolute left-3 top-3"><StatusBadge tone="ai">{i.tag}</StatusBadge></span>
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 text-xs text-muted-foreground"><NetworkDot n={i.network} /> {i.brand} · {i.network}</div>
                <p className="mt-2 font-medium">{i.title}</p>
                <div className="mt-2 flex items-center gap-1 text-xs text-primary"><TrendingUp className="h-3.5 w-3.5" /> {i.engagement} % d'engagement</div>
                <div className="mt-4 flex gap-2">
                  <Button size="sm" variant="ai" onClick={() => { toast.success("Idée adaptée au ton ALLTECH par l'IA."); nav({ to: "/agent-community-manager" }); }}><Sparkles /> Adapter avec l'IA</Button>
                  <Button size="sm" variant="outline" onClick={() => { setSaved((s) => isSaved ? s.filter((x) => x !== i.title) : [...s, i.title]); toast(isSaved ? "Retiré des favoris." : "Ajouté aux favoris."); }}>
                    {isSaved ? <BookmarkCheck className="text-primary" /> : <Bookmark />}
                  </Button>
                </div>
              </div>
            </Panel>
          );
        })}
      </div>
    </>
  );
}
