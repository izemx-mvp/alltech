import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Bot, Headset, Share2, Sprout, Megaphone, Loader2, Mail, Lock } from "lucide-react";
import { toast } from "sonner";
import hero from "@/assets/login-hero.jpg";
import { AnimatedBackground } from "@/components/app/kit";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Connexion — ALLTECH Digital Intelligence" },
      { name: "description", content: "Pilotez votre communication et votre relation client avec l'intelligence artificielle." },
      { property: "og:title", content: "Connexion — ALLTECH Digital Intelligence" },
      { property: "og:description", content: "Pilotez votre communication et votre relation client avec l'IA." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Login,
});

const chips = [
  { icon: Bot, label: "Agent IA", cls: "left-[8%] top-[18%]" },
  { icon: Share2, label: "Réseaux sociaux", cls: "right-[10%] top-[28%] [animation-delay:-4s]" },
  { icon: Headset, label: "Relation client", cls: "left-[14%] top-[52%] [animation-delay:-8s]" },
  { icon: Megaphone, label: "Communication digitale", cls: "right-[14%] top-[60%] [animation-delay:-11s]" },
];

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("sophie.martin@alltech.com");
  const [pwd, setPwd] = useState("demo2026");
  const [loading, setLoading] = useState(false);
  const [forgot, setForgot] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@") || pwd.length < 4) return toast.error("Veuillez saisir un email et un mot de passe valides.");
    setLoading(true);
    setTimeout(() => { toast.success("Connexion réussie. Bienvenue Sophie !"); navigate({ to: "/dashboard" }); }, 1100);
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-[1.15fr_1fr]">
      <AnimatedBackground />
      <section className="relative hidden overflow-hidden lg:block">
        <img src={hero} alt="Champs connectés et intelligence artificielle" className="absolute inset-0 h-full w-full object-cover opacity-70" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-background/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-background" />
        {chips.map((c) => (
          <div key={c.label} className={`glass absolute flex animate-float items-center gap-2 rounded-full px-4 py-2 text-sm ${c.cls}`}>
            <c.icon className="h-4 w-4 text-primary" /> {c.label}
          </div>
        ))}
        <div className="absolute bottom-14 left-12 right-16">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs text-primary">
            <Sprout className="h-3.5 w-3.5" /> Agriculture intelligente
          </div>
          <h2 className="max-w-xl text-4xl font-semibold leading-tight text-gradient">
            Pilotez votre communication et votre relation client avec l'intelligence artificielle.
          </h2>
        </div>
      </section>

      <section className="flex items-center justify-center p-6">
        <form onSubmit={submit} className="glass ai-border w-full max-w-md rounded-3xl p-8 animate-in fade-in zoom-in-95 duration-700">
          <div className="mb-8 flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-primary text-primary-foreground shadow-glow"><Sprout className="h-5 w-5" /></span>
            <span className="font-display text-xl font-bold">ALLTECH</span>
          </div>
          <h1 className="text-2xl font-semibold">Bienvenue sur ALLTECH Digital Intelligence</h1>
          <p className="mt-1 text-sm text-muted-foreground">Connectez-vous à votre espace.</p>
          <label className="mt-6 block text-xs text-muted-foreground">Email</label>
          <div className="relative mt-1">
            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" maxLength={255}
              className="h-11 w-full rounded-xl border bg-secondary/50 pl-9 pr-3 text-sm outline-none focus:border-primary/40 focus:ring-2 focus:ring-ring/30" />
          </div>
          <label className="mt-4 block text-xs text-muted-foreground">Mot de passe</label>
          <div className="relative mt-1">
            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input value={pwd} onChange={(e) => setPwd(e.target.value)} type="password" maxLength={128}
              className="h-11 w-full rounded-xl border bg-secondary/50 pl-9 pr-3 text-sm outline-none focus:border-primary/40 focus:ring-2 focus:ring-ring/30" />
          </div>
          <div className="mt-4 flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-muted-foreground"><Checkbox defaultChecked /> Se souvenir de moi</label>
            <button type="button" onClick={() => setForgot(true)} className="text-primary hover:underline">Mot de passe oublié ?</button>
          </div>
          <Button type="submit" className="mt-6 h-11 w-full" disabled={loading}>
            {loading ? <><Loader2 className="animate-spin" /> Connexion...</> : "Se connecter"}
          </Button>
          <p className="mt-6 text-center text-xs text-muted-foreground">Démo : identifiants pré-remplis</p>
        </form>
      </section>

      <Dialog open={forgot} onOpenChange={setForgot}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Réinitialiser le mot de passe</DialogTitle>
            <DialogDescription>Un lien de réinitialisation sera envoyé à {email}.</DialogDescription>
          </DialogHeader>
          <Button onClick={() => { setForgot(false); toast.success("Lien de réinitialisation envoyé."); }}>Envoyer le lien</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
