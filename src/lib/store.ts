import { useSyncExternalStore } from "react";
import img1 from "@/assets/idea-1.jpg";
import img2 from "@/assets/idea-2.jpg";
import img3 from "@/assets/idea-3.jpg";
import img4 from "@/assets/idea-4.jpg";
import img5 from "@/assets/idea-5.jpg";
import { campaigns as seedCampaigns, conversations as seedConvs, type Campaign, type Conversation } from "./mock";

export const TODAY = "2026-10-06";
export const ideaImages = [img1, img2, img3, img4, img5];

export type Platform = "LinkedIn" | "Facebook";
export type PubStatus = "Brouillon" | "Planifié" | "Publié" | "Annulé";
export type CaptionLength = "Courte" | "Moyenne" | "Longue";
export interface PlatformCfg { tone: string; objective: string; length: CaptionLength }
export interface CmConfig { logo: string | null; platforms: Record<Platform, PlatformCfg>; themes: string[]; targets: string[] }
export interface Idea { id: string; title: string; description: string; platform: Platform; theme: string; tone: string; objective: string; createdAt: string; status: PubStatus; image: string }
export interface Media { id: string; url: string; kind: "image" | "video"; name: string }
export interface Publication {
  id: string; title: string; platform: Platform; tone: string; caption: string; hashtags: string; cta: string;
  media: Media[]; date: string; time: string; timezone: string; status: PubStatus; type: "Image" | "Carrousel" | "Vidéo" | "Texte";
}
export interface AdCampaign extends Campaign { ctr: number }
export interface Client { phone: string; email: string; location: string; company: string; crop: string }
export interface Conv extends Conversation { client: Client; notes: string[]; assignee: string | null; read: boolean; urgent: boolean; product: string; sentiment: string }
export interface FaqItem { id: string; q: string; a: string; category: string; keywords: string; active: boolean; updated: string }
export type DocStatus = "Indexé" | "En cours d'analyse" | "Erreur" | "Désactivé";
export interface Doc { id: string; name: string; type: string; size: string; category: string; added: string; status: DocStatus }
export interface InfoItem { id: string; title: string; category: string; content: string; updated: string; active: boolean }
export interface AgentConfig {
  name: string; avatar: string; greeting: string; tone: string; languages: string[]; autonomy: number;
  transfer: Record<string, boolean>; collect: Record<string, boolean>;
}

export const TONES = ["Professionnel", "Expert", "Pédagogique", "Accessible", "Institutionnel", "Commercial", "Inspirant", "Conversationnel"];
export const OBJECTIVES = ["Notoriété", "Éducation", "Engagement", "Génération de leads", "Promotion produit", "Expertise", "Conversion"];
export const THEMES = ["Nutrition végétale", "Agriculture", "Conseils agricoles", "Innovation", "Produits", "Rendement", "Fertilisation", "Bonnes pratiques", "Témoignages", "Actualités", "Événements"];
export const TARGETS = ["Agriculteurs", "Exploitants agricoles", "Distributeurs", "Revendeurs", "Ingénieurs agronomes", "Professionnels agricoles"];
export const LENGTH_HINT: Record<CaptionLength, string> = { Courte: "50 à 100 mots", Moyenne: "100 à 200 mots", Longue: "200 à 400 mots" };

const idea = (i: number, title: string, description: string, platform: Platform, theme: string, tone: string, objective: string, createdAt: string): Idea =>
  ({ id: `i${i}`, title, description, platform, theme, tone, objective, createdAt, status: "Brouillon", image: ideaImages[i % 5]! });

const pub = (id: string, title: string, platform: Platform, date: string, time: string, status: PubStatus, type: Publication["type"], image: number | null): Publication => ({
  id, title, platform, tone: platform === "LinkedIn" ? "Expert" : "Pédagogique",
  caption: `🌱 ${title}\n\nNos agronomes partagent leurs conseils pour une nutrition végétale raisonnée, adaptée aux besoins réels de chaque culture.`,
  hashtags: "#NutritionVégétale #Agriculture #ALLTECH", cta: "Contactez nos experts", date, time, timezone: "Africa/Casablanca (UTC+1)", status, type,
  media: image === null ? [] : [{ id: `${id}m`, url: ideaImages[image]!, kind: "image", name: "visuel.jpg" }],
});

const clients: Client[] = [
  { phone: "+212 6 61 24 87 30", email: "y.elamrani@atlasprimeurs.ma", location: "Agadir, Souss-Massa", company: "Domaine Atlas Primeurs", crop: "Tomates sous serre" },
  { phone: "+212 6 70 11 45 92", email: "fz.bennani@coop-berkane.ma", location: "Berkane, Oriental", company: "Coopérative Agrumes Berkane", crop: "Clémentiniers" },
  { phone: "+33 6 12 45 78 90", email: "p.duval@earl-duval.fr", location: "Chartres, France", company: "EARL Duval Céréales", crop: "Blé tendre" },
  { phone: "+212 6 62 33 10 05", email: "h.ouazzani@oasis-dattes.ma", location: "Errachidia", company: "Ferme Oasis Dattes", crop: "Palmier dattier" },
  { phone: "+212 6 55 90 21 44", email: "salma@vergers-saiss.ma", location: "Meknès, Fès-Meknès", company: "Les Vergers du Saïss", crop: "Pommiers" },
  { phone: "+33 6 77 21 09 33", email: "marc@vignobles-lefevre.fr", location: "Bordeaux, France", company: "Vignobles Lefèvre", crop: "Vigne" },
];
const products = ["Biostimulant racinaire", "Correcteur de carence foliaire", "—", "Gamme bio", "—", "Chélate de fer"];

export interface State {
  cmConfig: CmConfig; ideas: Idea[]; publications: Publication[]; campaigns: AdCampaign[];
  conversations: Conv[]; faqs: FaqItem[]; docs: Doc[]; infos: InfoItem[]; agent: AgentConfig;
}

let state: State = {
  cmConfig: {
    logo: null,
    platforms: { LinkedIn: { tone: "Expert", objective: "Expertise", length: "Moyenne" }, Facebook: { tone: "Pédagogique", objective: "Engagement", length: "Courte" } },
    themes: ["Nutrition végétale", "Conseils agricoles", "Rendement", "Fertilisation"],
    targets: ["Agriculteurs", "Exploitants agricoles", "Ingénieurs agronomes"],
  },
  ideas: [
    idea(0, "5 bonnes pratiques pour optimiser la nutrition végétale", "Un carrousel pratique pour aider les producteurs à mieux piloter leurs apports.", "LinkedIn", "Nutrition végétale", "Expert", "Expertise", "05/10/2026"),
    idea(1, "Comment améliorer le rendement de vos cultures ?", "Témoignage d'un producteur de tomates sous serre et résultats chiffrés.", "Facebook", "Rendement", "Pédagogique", "Engagement", "05/10/2026"),
    idea(2, "Le rôle de la nutrition végétale face au stress hydrique", "Expliquer comment renforcer les plantes pendant les périodes chaudes.", "LinkedIn", "Conseils agricoles", "Expert", "Éducation", "04/10/2026"),
  ],
  publications: [
    pub("p1", "Webinar : fertilisation raisonnée des agrumes", "LinkedIn", "2026-10-02", "10:00", "Publié", "Image", 4),
    pub("p2", "Visite terrain chez un producteur de fraises", "Facebook", "2026-10-01", "17:00", "Publié", "Vidéo", 1),
    pub("p3", "5 signes de carence en zinc sur maïs", "LinkedIn", "2026-10-07", "09:00", "Planifié", "Carrousel", 0),
    pub("p4", "Témoignage : +18 % de rendement sur tomates", "Facebook", "2026-10-08", "12:30", "Planifié", "Image", 1),
    pub("p5", "Biostimulants et stress hydrique", "LinkedIn", "2026-10-13", "08:30", "Planifié", "Image", 2),
    pub("p6", "Quiz : vos besoins en potassium", "Facebook", "2026-10-15", "11:00", "Planifié", "Texte", null),
    pub("p7", "Checklist automne pour l'olivier", "LinkedIn", "2026-10-20", "09:00", "Brouillon", "Carrousel", 4),
    pub("p8", "Santé racinaire et rendement", "LinkedIn", "2026-09-26", "09:00", "Publié", "Image", 3),
    pub("p9", "Journée portes ouvertes Meknès", "Facebook", "2026-10-22", "18:00", "Annulé", "Image", 3),
  ],
  campaigns: seedCampaigns.map((c, i) => ({ ...c, ctr: [2.4, 2.1, 1.9, 2.5, 2.2][i] ?? 2 })),
  conversations: seedConvs.map((c, i) => ({
    ...c, client: clients[i]!, notes: [], assignee: c.status === "Humain" ? "Imane" : null, read: !c.unread, urgent: c.priority === "Haute",
    product: products[i] ?? "—", sentiment: ["Neutre", "Positif", "Neutre", "Positif", "Neutre", "Inquiet"][i] ?? "Neutre",
  })),
  faqs: [
    { id: "f1", q: "Vos produits sont-ils utilisables en agriculture biologique ?", a: "Une large partie de la gamme est utilisable en AB conformément au règlement UE 2018/848.", category: "Réglementation", keywords: "bio, AB, certification", active: true, updated: "02/10/2026" },
    { id: "f2", q: "Quelle dose de biostimulant appliquer sur tomate ?", a: "En général 2 à 3 L/ha en fertirrigation tous les 10 à 15 jours, à ajuster selon le stade.", category: "Dosage", keywords: "dose, tomate, biostimulant", active: true, updated: "28/09/2026" },
    { id: "f3", q: "Comment trouver un distributeur près de chez moi ?", a: "Indiquez votre ville à notre assistant ou consultez la carte des distributeurs agréés.", category: "Logistique", keywords: "distributeur, revendeur", active: true, updated: "21/09/2026" },
    { id: "f4", q: "Peut-on mélanger vos produits avec des phytosanitaires ?", a: "La plupart sont miscibles. Réalisez toujours un test de compatibilité en petit volume.", category: "Application", keywords: "mélange, compatibilité", active: true, updated: "15/09/2026" },
    { id: "f5", q: "Quand appliquer un traitement foliaire ?", a: "Tôt le matin ou en fin de journée, hors forte chaleur et vent.", category: "Application", keywords: "foliaire, horaire", active: false, updated: "10/09/2026" },
  ],
  docs: [
    { id: "d1", name: "Catalogue produits ALLTECH 2026.pdf", type: "PDF", size: "12,4 Mo", category: "Produits", added: "01/10/2026", status: "Indexé" },
    { id: "d2", name: "Fiche technique nutrition végétale.pdf", type: "PDF", size: "1,2 Mo", category: "Technique", added: "28/09/2026", status: "Indexé" },
    { id: "d3", name: "Guide fertilisation.pdf", type: "PDF", size: "4,8 Mo", category: "Agronomie", added: "21/09/2026", status: "Indexé" },
    { id: "d4", name: "Brochure commerciale.pdf", type: "PDF", size: "6,1 Mo", category: "Commercial", added: "15/09/2026", status: "En cours d'analyse" },
    { id: "d5", name: "Présentation entreprise.pptx", type: "PPTX", size: "18,7 Mo", category: "Entreprise", added: "10/09/2026", status: "Indexé" },
    { id: "d6", name: "Tarifs distributeurs 2025.xlsx", type: "XLSX", size: "320 Ko", category: "Commercial", added: "02/02/2026", status: "Désactivé" },
  ],
  infos: [
    { id: "n1", title: "Présentation de l'entreprise", category: "Entreprise", content: "ALLTECH accompagne les agriculteurs avec des solutions de nutrition végétale innovantes et durables, issues de la recherche.", updated: "01/10/2026", active: true },
    { id: "n2", title: "Activités", category: "Entreprise", content: "Nutrition végétale, biostimulants, conseil agronomique, formation des producteurs.", updated: "01/10/2026", active: true },
    { id: "n3", title: "Zones desservies", category: "Logistique", content: "Maroc (toutes régions), France, Espagne, Tunisie et Afrique de l'Ouest via distributeurs agréés.", updated: "25/09/2026", active: true },
    { id: "n4", title: "Horaires", category: "Contact", content: "Lundi au vendredi, 8h30 – 18h00. Samedi 9h00 – 12h30.", updated: "20/09/2026", active: true },
    { id: "n5", title: "Coordonnées", category: "Contact", content: "contact@alltech-crop.com · +212 5 22 00 00 00 · Casablanca.", updated: "20/09/2026", active: true },
    { id: "n6", title: "Process de commande", category: "Commercial", content: "Les commandes passent par nos distributeurs agréés. Un conseiller peut établir un devis pour les grandes exploitations.", updated: "18/09/2026", active: true },
    { id: "n7", title: "Informations livraison", category: "Logistique", content: "Livraison sous 48 à 72 h via le réseau de distribution.", updated: "18/09/2026", active: false },
  ],
  agent: {
    name: "Nour — Assistante ALLTECH", avatar: "N", greeting: "Bonjour 🌱 Je suis Nour, l'assistante ALLTECH. Comment puis-je vous aider pour la nutrition de vos cultures ?",
    tone: "Professionnelle", languages: ["Français", "Arabe"], autonomy: 1,
    transfer: { "Réclamation": true, "Demande commerciale importante": true, "Message négatif": true, "Question non comprise": true, "Demande technique complexe": false, "Client insatisfait": true },
    collect: { Nom: true, "Téléphone": true, Email: false, Entreprise: true, Localisation: true, "Type de culture": true, Besoin: true, "Produit recherché": false },
  },
};

const listeners = new Set<() => void>();
export const getStore = () => state;
export const setStore = (fn: (s: State) => Partial<State>) => { state = { ...state, ...fn(state) }; listeners.forEach((l) => l()); };
const subscribe = (l: () => void) => { listeners.add(l); return () => { listeners.delete(l); }; };
export function useStore<K extends keyof State>(key: K): State[K] {
  return useSyncExternalStore(subscribe, () => state[key], () => state[key]);
}

export const uid = () => Math.random().toString(36).slice(2, 10);
export const todayFr = () => new Date().toLocaleDateString("fr-FR");
export const pubTone = (s: string) => ({ Brouillon: "gray", "Planifié": "blue", "Publié": "green", "Annulé": "red" } as Record<string, string>)[s] ?? "gray";
