export type Network = "LinkedIn" | "Facebook" | "Instagram" | "YouTube";
export type PostStatus = "Publié" | "Programmé" | "À valider" | "Brouillon";

export interface Post {
  id: string; title: string; network: Network; status: PostStatus; date: string; time: string;
  reach: number; engagement: number; ai?: boolean; type: "Post" | "Carrousel" | "Vidéo" | "Article";
}

export const posts: Post[] = [
  { id: "p1", title: "5 signes de carence en zinc sur maïs", network: "LinkedIn", status: "Programmé", date: "2026-10-07", time: "09:00", reach: 0, engagement: 0, ai: true, type: "Carrousel" },
  { id: "p2", title: "Témoignage : +18 % de rendement sur tomates sous serre", network: "Facebook", status: "Programmé", date: "2026-10-08", time: "12:30", reach: 0, engagement: 0, type: "Vidéo" },
  { id: "p3", title: "Biostimulants : comment résister au stress hydrique", network: "Instagram", status: "À valider", date: "2026-10-09", time: "18:00", reach: 0, engagement: 0, ai: true, type: "Post" },
  { id: "p4", title: "Webinar : fertilisation raisonnée des agrumes", network: "LinkedIn", status: "Publié", date: "2026-10-02", time: "10:00", reach: 14820, engagement: 6.4, type: "Post" },
  { id: "p5", title: "Visite terrain chez un producteur de fraises à Larache", network: "Facebook", status: "Publié", date: "2026-10-01", time: "17:00", reach: 22410, engagement: 8.1, type: "Vidéo" },
  { id: "p6", title: "Nutrition foliaire : le bon timing", network: "Instagram", status: "Publié", date: "2026-09-29", time: "19:00", reach: 9870, engagement: 5.2, ai: true, type: "Carrousel" },
  { id: "p7", title: "Préparer le sol avant semis d'automne", network: "YouTube", status: "Brouillon", date: "2026-10-12", time: "15:00", reach: 0, engagement: 0, type: "Vidéo" },
  { id: "p8", title: "Les oligo-éléments essentiels pour l'olivier", network: "LinkedIn", status: "À valider", date: "2026-10-10", time: "08:30", reach: 0, engagement: 0, ai: true, type: "Article" },
  { id: "p9", title: "Santé racinaire et rendement : ce que dit la science", network: "LinkedIn", status: "Publié", date: "2026-09-26", time: "09:00", reach: 18300, engagement: 7.3, type: "Article" },
  { id: "p10", title: "Quiz : connaissez-vous vos besoins en potassium ?", network: "Facebook", status: "Programmé", date: "2026-10-11", time: "11:00", reach: 0, engagement: 0, ai: true, type: "Post" },
];

export const reachSeries = [
  { d: "Lun", linkedin: 4200, facebook: 6100, instagram: 3100 },
  { d: "Mar", linkedin: 5100, facebook: 5800, instagram: 3600 },
  { d: "Mer", linkedin: 6800, facebook: 7200, instagram: 4200 },
  { d: "Jeu", linkedin: 6200, facebook: 8100, instagram: 5100 },
  { d: "Ven", linkedin: 7900, facebook: 9400, instagram: 5900 },
  { d: "Sam", linkedin: 5300, facebook: 10200, instagram: 6800 },
  { d: "Dim", linkedin: 4800, facebook: 9100, instagram: 7200 },
];

export const monthly = ["Avr", "Mai", "Juin", "Juil", "Août", "Sep", "Oct"].map((m, i) => ({
  m, abonnes: 8200 + i * 640 + (i % 2) * 210, engagement: 4.1 + i * 0.4, leads: 120 + i * 34, conv: 420 + i * 55,
}));

export interface Campaign {
  id: string; name: string; network: Network; status: "Active" | "En pause" | "Terminée"; budget: number; spent: number;
  impressions: number; clicks: number; leads: number; cpl: number; objective: string;
}
export const campaigns: Campaign[] = [
  { id: "c1", name: "Lancement biostimulant automne", network: "Facebook", status: "Active", budget: 4500, spent: 2870, impressions: 412000, clicks: 9840, leads: 312, cpl: 9.2, objective: "Leads" },
  { id: "c2", name: "Webinar fertilisation agrumes", network: "LinkedIn", status: "Active", budget: 3000, spent: 2210, impressions: 128000, clicks: 3120, leads: 188, cpl: 11.8, objective: "Inscriptions" },
  { id: "c3", name: "Notoriété marque — Souss", network: "Instagram", status: "Active", budget: 2000, spent: 940, impressions: 356000, clicks: 6720, leads: 74, cpl: 12.7, objective: "Notoriété" },
  { id: "c4", name: "Retargeting guide nutrition tomate", network: "Facebook", status: "En pause", budget: 1500, spent: 1120, impressions: 98000, clicks: 2410, leads: 96, cpl: 11.7, objective: "Conversions" },
  { id: "c5", name: "Campagne printemps maraîchage", network: "LinkedIn", status: "Terminée", budget: 5000, spent: 5000, impressions: 520000, clicks: 11200, leads: 486, cpl: 10.3, objective: "Leads" },
];

export interface Message { from: "client" | "ia" | "agent"; text: string; time: string }
export interface Conversation {
  id: string; name: string; farm: string; channel: "WhatsApp" | "Messenger" | "Site web" | "Instagram";
  preview: string; time: string; status: "IA" | "Humain" | "Résolu" | "En attente"; priority: "Haute" | "Moyenne" | "Basse";
  intent: string; category: string; unread?: number; messages: Message[];
}
export const conversations: Conversation[] = [
  { id: "v1", name: "Youssef El Amrani", farm: "Domaine Atlas Primeurs", channel: "WhatsApp", preview: "Tomates sous serre.", time: "10:24", status: "IA", priority: "Haute", intent: "Recommandation produit", category: "Nutrition", unread: 2,
    messages: [
      { from: "client", text: "Bonjour, quel produit recommandez-vous pour améliorer la nutrition de mes cultures ?", time: "10:21" },
      { from: "ia", text: "Bonjour, je peux vous aider. Afin de vous orienter vers une solution adaptée, pouvez-vous m'indiquer le type de culture concerné ?", time: "10:21" },
      { from: "client", text: "Tomates sous serre.", time: "10:24" },
      { from: "ia", text: "Merci. Je vais rechercher les informations correspondantes dans la base de connaissance ALLTECH.", time: "10:24" },
    ] },
  { id: "v2", name: "Fatima Zahra Bennani", farm: "Coopérative Agrumes Berkane", channel: "Messenger", preview: "Quelle dose pour mes clémentiniers ?", time: "09:58", status: "IA", priority: "Moyenne", intent: "Dosage", category: "Fertilisation",
    messages: [{ from: "client", text: "Quelle dose de biostimulant pour mes clémentiniers en floraison ?", time: "09:58" }] },
  { id: "v3", name: "Pierre Duval", farm: "EARL Duval Céréales", channel: "Site web", preview: "Je souhaite parler à un conseiller.", time: "09:12", status: "Humain", priority: "Haute", intent: "Demande commerciale", category: "Devis",
    messages: [{ from: "client", text: "Je souhaite parler à un conseiller pour un devis sur 120 ha de blé.", time: "09:12" }, { from: "agent", text: "Bonjour Pierre, Imane de l'équipe ALLTECH. Je vous prépare une proposition.", time: "09:20" }] },
  { id: "v4", name: "Hassan Ouazzani", farm: "Ferme Oasis Dattes", channel: "WhatsApp", preview: "Merci, c'est très clair !", time: "Hier", status: "Résolu", priority: "Basse", intent: "Information", category: "Produit",
    messages: [{ from: "client", text: "Ce produit est-il compatible bio ?", time: "Hier" }, { from: "ia", text: "Oui, il est utilisable en agriculture biologique selon le règlement UE 2018/848.", time: "Hier" }, { from: "client", text: "Merci, c'est très clair !", time: "Hier" }] },
  { id: "v5", name: "Salma Idrissi", farm: "Les Vergers du Saïss", channel: "Instagram", preview: "Où trouver un distributeur à Meknès ?", time: "Hier", status: "En attente", priority: "Moyenne", intent: "Distributeur", category: "Logistique",
    messages: [{ from: "client", text: "Où trouver un distributeur ALLTECH à Meknès ?", time: "Hier" }] },
  { id: "v6", name: "Marc Lefèvre", farm: "Vignobles Lefèvre", channel: "Site web", preview: "Problème de chlorose sur vigne", time: "Lun", status: "IA", priority: "Haute", intent: "Diagnostic", category: "Agronomie",
    messages: [{ from: "client", text: "J'observe une chlorose sur mes jeunes vignes, que faire ?", time: "Lun" }] },
];

export const aiSuggestions = [
  { title: "Publier un carrousel sur la gestion du stress thermique", reason: "Vague de chaleur annoncée dans le Souss cette semaine", score: 94 },
  { title: "Augmenter de 15 % le budget « Lancement biostimulant »", reason: "CPL 22 % inférieur à la moyenne", score: 89 },
  { title: "Créer une FAQ sur la compatibilité bio", reason: "37 questions similaires reçues ce mois", score: 86 },
  { title: "Republier le témoignage tomates sous serre", reason: "Top contenu du mois (+8,1 % d'engagement)", score: 81 },
];

export const contentIdeas = [
  { title: "Optimiser la nutrition végétale pendant les périodes chaudes", format: "Carrousel LinkedIn", pillar: "Expertise", angle: "5 gestes concrets pour limiter le stress thermique des cultures." },
  { title: "Avant / après : une saison avec nos biostimulants", format: "Vidéo Reels", pillar: "Preuve", angle: "Comparaison visuelle de deux parcelles de poivrons." },
  { title: "Le mot de l'agronome : zinc et maïs", format: "Post Facebook", pillar: "Pédagogie", angle: "Identifier et corriger une carence en 3 étapes." },
  { title: "Rencontre avec une coopérative d'agrumes", format: "Article", pillar: "Communauté", angle: "Portrait d'agriculteurs et résultats terrain." },
  { title: "Mythe ou réalité : plus d'engrais = plus de rendement ?", format: "Carrousel Instagram", pillar: "Pédagogie", angle: "Déconstruire une idée reçue avec des données." },
  { title: "Checklist automne pour l'olivier", format: "Infographie", pillar: "Expertise", angle: "Les 6 interventions clés avant l'hiver." },
];

export const inspirations = [
  { brand: "Yara", network: "LinkedIn" as Network, title: "Série « Farmer stories » en vidéo courte", engagement: 9.4, tag: "Storytelling" },
  { brand: "Syngenta", network: "Instagram" as Network, title: "Carrousels data sur le climat", engagement: 7.8, tag: "Data" },
  { brand: "Bayer Crop", network: "YouTube" as Network, title: "Tutoriels terrain de 60 secondes", engagement: 8.6, tag: "Pédagogie" },
  { brand: "John Deere", network: "Facebook" as Network, title: "Coulisses technologie et précision", engagement: 6.9, tag: "Innovation" },
  { brand: "Corteva", network: "LinkedIn" as Network, title: "Infographies saisonnières", engagement: 7.1, tag: "Saisonnalité" },
  { brand: "OCP Group", network: "Instagram" as Network, title: "Portraits d'agricultrices", engagement: 10.2, tag: "Communauté" },
];

export interface KbDoc { id: string; title: string; category: string; type: "PDF" | "Fiche" | "Guide" | "Vidéo"; updated: string; usage: number; status: "Indexé" | "En cours" }
export const kbDocs: KbDoc[] = [
  { id: "k1", title: "Fiche technique — Biostimulant racinaire", category: "Produits", type: "Fiche", updated: "02/10/2026", usage: 412, status: "Indexé" },
  { id: "k2", title: "Guide nutrition tomate sous serre", category: "Cultures", type: "Guide", updated: "28/09/2026", usage: 356, status: "Indexé" },
  { id: "k3", title: "Programme fertilisation agrumes", category: "Cultures", type: "PDF", updated: "21/09/2026", usage: 288, status: "Indexé" },
  { id: "k4", title: "Compatibilité agriculture biologique", category: "Réglementation", type: "PDF", updated: "15/09/2026", usage: 197, status: "Indexé" },
  { id: "k5", title: "Diagnostic des carences foliaires", category: "Agronomie", type: "Guide", updated: "10/09/2026", usage: 254, status: "Indexé" },
  { id: "k6", title: "Webinar : stress hydrique et biostimulants", category: "Formation", type: "Vidéo", updated: "05/10/2026", usage: 48, status: "En cours" },
  { id: "k7", title: "Réseau de distributeurs Maroc", category: "Logistique", type: "Fiche", updated: "01/09/2026", usage: 163, status: "Indexé" },
];

export interface Faq { id: string; q: string; a: string; category: string; views: number }
export const faqs: Faq[] = [
  { id: "f1", q: "Vos produits sont-ils utilisables en agriculture biologique ?", a: "Une large partie de la gamme est utilisable en AB conformément au règlement UE 2018/848. Consultez la fiche produit pour la mention exacte.", category: "Réglementation", views: 1240 },
  { id: "f2", q: "Quelle dose de biostimulant appliquer sur tomate ?", a: "En général 2 à 3 L/ha en fertirrigation tous les 10 à 15 jours, à ajuster selon le stade et l'analyse de sol.", category: "Dosage", views: 980 },
  { id: "f3", q: "Comment trouver un distributeur près de chez moi ?", a: "Indiquez votre ville à notre assistant ou consultez la carte des distributeurs agréés.", category: "Logistique", views: 742 },
  { id: "f4", q: "Peut-on mélanger vos produits avec des phytosanitaires ?", a: "La plupart sont miscibles. Réalisez toujours un test de compatibilité en petit volume avant application.", category: "Application", views: 655 },
  { id: "f5", q: "Quand appliquer un traitement foliaire ?", a: "Tôt le matin ou en fin de journée, hors période de forte chaleur et de vent.", category: "Application", views: 512 },
];

export interface Asset { id: string; name: string; kind: "Image" | "Vidéo" | "Document" | "Logo"; size: string; tags: string[]; hue: number }
export const assets: Asset[] = [
  { id: "a1", name: "Serre tomates — Agadir.jpg", kind: "Image", size: "3,2 Mo", tags: ["serre", "tomate"], hue: 145 },
  { id: "a2", name: "Témoignage producteur.mp4", kind: "Vidéo", size: "84 Mo", tags: ["témoignage"], hue: 160 },
  { id: "a3", name: "Fiche biostimulant.pdf", kind: "Document", size: "1,1 Mo", tags: ["produit"], hue: 220 },
  { id: "a4", name: "Logo ALLTECH vert.svg", kind: "Logo", size: "48 Ko", tags: ["marque"], hue: 130 },
  { id: "a5", name: "Verger agrumes drone.jpg", kind: "Image", size: "5,4 Mo", tags: ["agrumes", "drone"], hue: 90 },
  { id: "a6", name: "Racines analyse labo.jpg", kind: "Image", size: "2,6 Mo", tags: ["science"], hue: 175 },
  { id: "a7", name: "Tutoriel fertirrigation.mp4", kind: "Vidéo", size: "112 Mo", tags: ["tutoriel"], hue: 200 },
  { id: "a8", name: "Charte graphique 2026.pdf", kind: "Document", size: "8,9 Mo", tags: ["marque"], hue: 150 },
];

export const team = ["Imane Alaoui", "Karim Tazi", "Sophie Martin", "Omar Fassi"];
