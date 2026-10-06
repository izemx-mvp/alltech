import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Settings2, Lightbulb, CalendarDays } from "lucide-react";
import { seo } from "@/lib/seo";
import { useStore } from "@/lib/store";
import { PageHeader } from "@/components/app/kit";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ConfigTab } from "@/components/cm/ConfigTab";
import { IdeasTab } from "@/components/cm/IdeasTab";
import { CalendarTab } from "@/components/cm/CalendarTab";

type Tab = "configuration" | "idees" | "calendrier";

export const Route = createFileRoute("/_app/community-manager")({
  validateSearch: (s: Record<string, unknown>): { tab?: Tab } =>
    ["configuration", "idees", "calendrier"].includes(s["tab"] as string) ? { tab: s["tab"] as Tab } : {},
  head: () => seo("Community Manager IA", "Configurez l'Agent IA, générez des idées de posts et gérez votre calendrier éditorial."),
  component: CM,
});

function CM() {
  const { tab = "idees" } = Route.useSearch();
  const navigate = useNavigate({ from: "/community-manager" });
  const pubs = useStore("publications");
  const planned = pubs.filter((p) => p.status === "Planifié").length;

  return (
    <>
      <PageHeader eyebrow="Agent IA" title="Community Manager IA" subtitle="Votre copilote IA pour vos publications LinkedIn et Facebook." />
      <Tabs value={tab} onValueChange={(v) => navigate({ search: { tab: v as Tab } })}>
        <TabsList className="mb-6 h-11 bg-secondary/50 p-1">
          <TabsTrigger value="configuration" className="px-4"><Settings2 className="mr-1.5 h-4 w-4" />Configuration</TabsTrigger>
          <TabsTrigger value="idees" className="px-4"><Lightbulb className="mr-1.5 h-4 w-4" />Idées</TabsTrigger>
          <TabsTrigger value="calendrier" className="px-4"><CalendarDays className="mr-1.5 h-4 w-4" />Calendrier<span className="ml-1.5 rounded-full bg-primary/20 px-1.5 text-[10px] text-primary">{planned}</span></TabsTrigger>
        </TabsList>
        <TabsContent value="configuration"><ConfigTab /></TabsContent>
        <TabsContent value="idees"><IdeasTab /></TabsContent>
        <TabsContent value="calendrier"><CalendarTab /></TabsContent>
      </Tabs>
    </>
  );
}
