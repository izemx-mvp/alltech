import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import {
  LayoutDashboard, Bot, PenTool, Megaphone, Headset, BookOpen, HelpCircle, Settings, Search, Bell, Plus, LogOut, Sprout, Sparkles, PanelLeftClose, PanelLeftOpen,
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
  { to: "/community-manager", label: "Community Manager IA", icon: Bot, ai: true },
  { to: "/campagnes-ads", label: "Campagnes Ads IA", icon: Megaphone, ai: true },
  { to: "/service-client", label: "Service Client IA", icon: Headset, ai: true },
  { to: "/base-de-connaissance", label: "Base de connaissance IA", icon: BookOpen, ai: true },
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
  const [collapsed, setCollapsed] = useState(false);
  const [notifs, setNotifs] = useState(initialNotifs);
  const results = q ? nav.filter((n) => n.label.toLowerCase().includes(q.toLowerCase())) : [];

  return (
    <div className="min-h-screen">
      <AnimatedBackground />
      <aside className={`fixed inset-y-0 left-0 z-30 hidden flex-col transition-[width] duration-300 ${collapsed ? "w-[76px]" : "w-64"} border-r border-sidebar-border bg-sidebar backdrop-blur-xl lg:flex`}>
        <Link to="/dashboard" className="flex items-center gap-3 px-5 py-5">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-primary text-primary-foreground shadow-glow"><Sprout className="h-5 w-5" /></span>
          <div className={collapsed ? "hidden" : ""}>
            <div className="font-display text-lg font-bold tracking-tight">ALLTECH</div>
            <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">Digital Intelligence</div>
          </div>
        </Link>
        <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 pb-4">
          {nav.map((n) => {
            const active = path.startsWith(n.to);
            return (
              <Link key={n.to} to={n.to} title={n.label}
                className={cn("group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] text-sidebar-foreground transition-all hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  active && "bg-sidebar-accent font-semibold text-sidebar-accent-foreground")}>
                {active && <span className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r bg-primary shadow-glow" />}
                <n.icon className={cn("h-4 w-4 shrink-0", active ? "text-primary" : "text-muted-foreground group-hover:text-primary")} />
                {!collapsed && <span className="truncate">{n.label}</span>}
                {!collapsed && "ai" in n && <Sparkles className="ml-auto h-3 w-3 text-ai" />}
              </Link>
            );
          })}
        </nav>
        <button onClick={() => setCollapsed((c) => !c)} className="mx-3 mb-2 flex items-center gap-2 rounded-lg px-3 py-2 text-xs text-muted-foreground hover:bg-sidebar-accent hover:text-foreground">
          {collapsed ? <PanelLeftOpen className="h-4 w-4" /> : <><PanelLeftClose className="h-4 w-4" /> Réduire le menu</>}
        </button>
        <div className={`m-3 rounded-xl ai-border ${collapsed ? "hidden" : ""} bg-ai/5 p-3 text-xs`}>
          <div className="flex items-center gap-2 font-semibold text-ai"><span className="h-2 w-2 rounded-full bg-primary animate-pulse-ring" /> Agents IA actifs</div>
          <p className="mt-1 text-muted-foreground">2 agents · 148 actions aujourd'hui</p>
        </div>
      </aside>

      <div className={`transition-[padding] duration-300 ${collapsed ? "lg:pl-[76px]" : "lg:pl-64"}`}>
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
                <DropdownMenuItem onClick={() => navigate({ to: "/community-manager", search: { tab: "idees" } })}><Sparkles /> Générer des idées de posts</DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate({ to: "/community-manager", search: { tab: "calendrier" } })}><PenTool /> Voir le calendrier</DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate({ to: "/campagnes-ads" })}><Megaphone /> Nouvelle campagne</DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate({ to: "/base-de-connaissance" })}><HelpCircle /> Ajouter une FAQ</DropdownMenuItem>
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
                <DropdownMenuItem onClick={() => navigate({ to: "/service-client", search: { tab: "configuration" } })}><Settings /> Configuration des agents</DropdownMenuItem>
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
