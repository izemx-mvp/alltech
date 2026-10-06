import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Linkedin, Facebook, Instagram, Youtube, Search, MoreHorizontal, Copy, Trash2, CheckCircle2, Pencil, Users, Eye, Heart, Inbox } from "lucide-react";
import { toast } from "sonner";
import { seo } from "@/lib/seo";
import { posts as seed, type Post, type PostStatus } from "@/lib/mock";
import { PageHeader, Panel, StatusBadge, statusTone, AiTag, NetworkDot, fmt, EmptyState } from "@/components/app/kit";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/_app/reseaux-sociaux")({
  head: () => seo("Réseaux sociaux", "Gérez les comptes LinkedIn, Facebook, Instagram et YouTube d'ALLTECH."),
  component: Social,
});

const accounts = [
  { n: "LinkedIn", icon: Linkedin, followers: 18420, reach: 182000, eng: 6.9, growth: 12 },
  { n: "Facebook", icon: Facebook, followers: 42100, reach: 412000, eng: 7.4, growth: 8 },
  { n: "Instagram", icon: Instagram, followers: 12870, reach: 156000, eng: 5.8, growth: 19 },
  { n: "YouTube", icon: Youtube, followers: 4210, reach: 61000, eng: 4.2, growth: 6 },
];
const PER = 6;

function Social() {
  const [data, setData] = useState<Post[]>(seed);
  const [q, setQ] = useState("");
  const [net, setNet] = useState("all");
  const [status, setStatus] = useState("all");
  const [sort, setSort] = useState<"date" | "reach">("date");
  const [page, setPage] = useState(1);
  const [edit, setEdit] = useState<Post | null>(null);

  const filtered = useMemo(() => data
    .filter((p) => p.title.toLowerCase().includes(q.toLowerCase()) && (net === "all" || p.network === net) && (status === "all" || p.status === status))
    .sort((a, b) => sort === "date" ? b.date.localeCompare(a.date) : b.reach - a.reach), [data, q, net, status, sort]);
  const pages = Math.max(1, Math.ceil(filtered.length / PER));
  const rows = filtered.slice((page - 1) * PER, page * PER);

  const setSt = (id: string, s: PostStatus) => { setData((d) => d.map((p) => p.id === id ? { ...p, status: s } : p)); toast.success(`Statut mis à jour : ${s}`); };

  return (
    <>
      <PageHeader eyebrow="Comptes connectés" title="Réseaux sociaux" subtitle="Pilotez l'ensemble de vos publications et comptes depuis un seul espace." />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {accounts.map((a) => (
          <Panel key={a.n} className="glass-hover">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary"><a.icon className="h-5 w-5" /></span>
              <div><div className="font-semibold">{a.n}</div><div className="text-xs text-muted-foreground">@alltech.crop</div></div>
              <StatusBadge tone="green">Connecté</StatusBadge>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2 text-center">
              <Stat icon={Users} v={fmt(a.followers)} l="Abonnés" /><Stat icon={Eye} v={`${Math.round(a.reach / 1000)}k`} l="Portée" /><Stat icon={Heart} v={`${a.eng}%`} l="Engag." />
            </div>
            <div className="mt-3 text-xs text-primary">▲ {a.growth} % ce mois</div>
          </Panel>
        ))}
      </div>

      <Panel className="mt-6">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <h3 className="mr-auto font-semibold">Publications</h3>
          <div className="relative"><Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} placeholder="Rechercher..." className="w-56 pl-8" /></div>
          <Select value={net} onValueChange={(v) => { setNet(v); setPage(1); }}><SelectTrigger className="w-36"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">Tous réseaux</SelectItem>{accounts.map((a) => <SelectItem key={a.n} value={a.n}>{a.n}</SelectItem>)}</SelectContent></Select>
          <Select value={status} onValueChange={(v) => { setStatus(v); setPage(1); }}><SelectTrigger className="w-36"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">Tous statuts</SelectItem>{["Publié", "Programmé", "À valider", "Brouillon"].map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select>
          <Select value={sort} onValueChange={(v) => setSort(v as "date" | "reach")}><SelectTrigger className="w-36"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="date">Trier : date</SelectItem><SelectItem value="reach">Trier : portée</SelectItem></SelectContent></Select>
        </div>
        {rows.length === 0 ? <EmptyState icon={Inbox} title="Aucune publication" text="Aucun résultat ne correspond à vos filtres." /> : (
          <Table>
            <TableHeader><TableRow><TableHead>Publication</TableHead><TableHead>Réseau</TableHead><TableHead>Date</TableHead><TableHead>Statut</TableHead><TableHead className="text-right">Portée</TableHead><TableHead className="text-right">Engag.</TableHead><TableHead /></TableRow></TableHeader>
            <TableBody>
              {rows.map((p) => (
                <TableRow key={p.id} className="hover:bg-accent/30">
                  <TableCell><div className="flex items-center gap-2"><span className="max-w-xs truncate font-medium">{p.title}</span>{p.ai && <AiTag />}</div><div className="text-xs text-muted-foreground">{p.type}</div></TableCell>
                  <TableCell><span className="flex items-center gap-1.5"><NetworkDot n={p.network} />{p.network}</span></TableCell>
                  <TableCell className="text-muted-foreground">{p.date.split("-").reverse().join("/")} · {p.time}</TableCell>
                  <TableCell><StatusBadge tone={statusTone(p.status)}>{p.status}</StatusBadge></TableCell>
                  <TableCell className="text-right">{p.reach ? fmt(p.reach) : "—"}</TableCell>
                  <TableCell className="text-right">{p.engagement ? `${p.engagement} %` : "—"}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild><Button size="icon" variant="ghost"><MoreHorizontal /></Button></DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setEdit(p)}><Pencil /> Modifier</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => { setData((d) => [{ ...p, id: crypto.randomUUID(), title: `${p.title} (copie)`, status: "Brouillon", reach: 0, engagement: 0 }, ...d]); toast.success("Publication dupliquée."); }}><Copy /> Dupliquer</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setSt(p.id, "Programmé")}><CheckCircle2 /> Valider & programmer</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive" onClick={() => { setData((d) => d.filter((x) => x.id !== p.id)); toast("Publication supprimée."); }}><Trash2 /> Supprimer</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
        <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
          <span>{filtered.length} publications</span>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" disabled={page === 1} onClick={() => setPage(page - 1)}>Précédent</Button>
            <span>{page} / {pages}</span>
            <Button size="sm" variant="outline" disabled={page === pages} onClick={() => setPage(page + 1)}>Suivant</Button>
          </div>
        </div>
      </Panel>

      <Dialog open={!!edit} onOpenChange={(o) => !o && setEdit(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Modifier la publication</DialogTitle></DialogHeader>
          {edit && <Input value={edit.title} maxLength={200} onChange={(e) => setEdit({ ...edit, title: e.target.value })} />}
          <DialogFooter><Button onClick={() => { if (edit) setData((d) => d.map((p) => p.id === edit.id ? edit : p)); setEdit(null); toast.success("Modifications enregistrées."); }}>Enregistrer</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function Stat({ icon: I, v, l }: { icon: typeof Users; v: string; l: string }) {
  return <div className="rounded-lg bg-secondary/40 p-2"><I className="mx-auto h-3.5 w-3.5 text-muted-foreground" /><div className="mt-1 text-sm font-semibold">{v}</div><div className="text-[10px] text-muted-foreground">{l}</div></div>;
}
