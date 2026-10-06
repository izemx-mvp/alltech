import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import {
  LayoutDashboard, Share2, Bot, Lightbulb, CalendarDays, PenTool, Megaphone, Headset, BookOpen, HelpCircle,
  FolderOpen, BarChart3, FileText, Settings, Search, Bell, Plus, LogOut, User, Sprout, Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { AnimatedBackground } from "./kit";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/reseaux-sociaux", label: "Réseaux sociaux", icon: Share2 },
  { to: "/agent-community-manager", label: "Agent IA Community Manager", icon: Bot, ai: true },
  { to: "/inspirations", label: "Inspirations", icon: Lightbulb },
  { to: "/calendrier", label: "Calendrier éditorial", icon: CalendarDays },
  { to: "/studio", label: "Studio de contenu", icon: PenTool },
  { to: "/campagnes-ads", label: "Campagnes Ads", icon: Megaphone },
  { to: "/service-client", label: "Service Client IA", icon: Headset, ai: true },
  { to: "/base-de-connaissance", label: "Base de connaissance", icon: BookOpen },
  { to: "/faq", label: "FAQ", icon: HelpCircle },
  { to: "/bibliotheque", label: "Bibliothèque", icon: FolderOpen },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/rapports", label: "Rapports", icon: FileText },
  { to: "/parametres", label: "Paramètres", icon: Settings },
] as const;

const initialNotifs = [
  { t: "L'Agent IA a généré 3 nouvelles publications", time: "Il y a 5 min", ai: true },
  { t: "Conversation prioritaire : Youssef El Amrani", time: "Il y a 12 min" },
  { t: "Campagne « Biostimulant automne » : CPL en baisse de 8 %", time: "Il y a 1 h" },
  { t: "2 publications attendent votre validation", time: "Il y a 2 h" },
];

export function AppShell({ children }: { children: ReactNode }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [notifs, setNotifs] = useState(initialNotifs);
  const results = q ? nav.filter((n) => n.label.toLowerCase().includes(q.toLowerCase())) : [];

  return (
    <div className="min-h-screen">
      <AnimatedBackground />
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-sidebar-border bg-sidebar backdrop-blur-xl lg:flex">
        <Link to="/dashboard" className="flex items-center gap-3 px-5 py-5">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-primary text-primary-foreground shadow-glow"><Sprout className="h-5 w-5" /></span>
          <div>
            <div className="font-display text-lg font-bold tracking-tight">ALLTECH</div>
            <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">Digital Intelligence</div>
          </div>
        </Link>
        <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 pb-4">
          {nav.map((n) => {
            const active = path.startsWith(n.to);
            return (
              <Link key={n.to} to={n.to}
                className={cn("group relative flex items-center gap-3 rounded-lg px-3 py-2 text-[13px] text-sidebar-foreground transition-all hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  active && "bg-sidebar-accent font-semibold text-sidebar-accent-foreground")}>
                {active && <span className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r bg-primary shadow-glow" />}
                <n.icon className={cn("h-4 w-4 shrink-0", active ? "text-primary" : "text-muted-foreground group-hover:text-primary")} />
                <span className="truncate">{n.label}</span>
                {"ai" in n && <Sparkles className="ml-auto h-3 w-3 text-ai" />}
              </Link>
            );
          })}
        </nav>
        <div className="m-3 rounded-xl ai-border bg-ai/5 p-3 text-xs">
          <div className="flex items-center gap-2 font-semibold text-ai"><span className="h-2 w-2 rounded-full bg-primary animate-pulse-ring" /> Agents IA actifs</div>
          <p className="mt-1 text-muted-foreground">2 agents · 148 actions aujourd'hui</p>
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b bg-background/60 px-6 backdrop-blur-xl">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Rechercher une page, un contenu, une conversation..."
              className="h-10 w-full rounded-xl border bg-secondary/50 pl-9 pr-3 text-sm outline-none transition focus:border-primary/40 focus:ring-2 focus:ring-ring/30" />
            {results.length > 0 && (
              <div className="glass absolute mt-2 w-full rounded-xl p-1">
                {results.map((r) => (
                  <button key={r.to} onClick={() => { navigate({ to: r.to }); setQ(""); }}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm hover:bg-accent">
                    <r.icon className="h-4 w-4 text-primary" /> {r.label}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="ml-auto flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild><Button size="sm"><Plus /> Action rapide</Button></DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-60">
                <DropdownMenuItem onClick={() => navigate({ to: "/studio" })}><PenTool /> Nouvelle publication</DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate({ to: "/agent-community-manager" })}><Sparkles /> Générer avec l'IA</DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate({ to: "/campagnes-ads" })}><Megaphone /> Nouvelle campagne</DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate({ to: "/faq" })}><HelpCircle /> Ajouter une FAQ</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Popover>
              <PopoverTrigger asChild>
                <button className="relative grid h-9 w-9 place-items-center rounded-lg border bg-secondary/40 hover:border-primary/30" aria-label="Notifications">
                  <Bell className="h-4 w-4" />
                  {notifs.length > 0 && <span className="absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">{notifs.length}</span>}
                </button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-80 p-0">
                <div className="flex items-center justify-between border-b px-4 py-3">
                  <span className="font-display text-sm font-semibold">Notifications</span>
                  <button className="text-xs text-primary" onClick={() => { setNotifs([]); toast.success("Notifications marquées comme lues"); }}>Tout marquer lu</button>
                </div>
                {notifs.length === 0 ? <p className="p-6 text-center text-sm text-muted-foreground">Vous êtes à jour.</p> :
                  notifs.map((n, i) => (
                    <div key={i} className="flex gap-3 border-b px-4 py-3 last:border-0">
                      <span className={cn("mt-1.5 h-2 w-2 shrink-0 rounded-full", n.ai ? "bg-ai" : "bg-primary")} />
                      <div><p className="text-sm">{n.t}</p><p className="text-xs text-muted-foreground">{n.time}</p></div>
                    </div>
                  ))}
              </PopoverContent>
            </Popover>
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-2 rounded-lg px-2 py-1 hover:bg-accent">
                <span className="grid h-8 w-8 place-items-center rounded-full bg-gradient-primary text-xs font-bold text-primary-foreground">SM</span>
                <div className="hidden text-left md:block"><div className="text-xs font-semibold">Sophie Martin</div><div className="text-[10px] text-muted-foreground">Responsable Marketing</div></div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate({ to: "/parametres" })}><User /> Profil & paramètres</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { toast("Déconnexion réussie"); navigate({ to: "/" }); }}><LogOut /> Se déconnecter</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        <main className="mx-auto max-w-[1500px] p-6">{children}</main>
      </div>
    </div>
  );
}
