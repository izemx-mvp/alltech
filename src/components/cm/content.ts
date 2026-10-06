import type { CaptionLength } from "@/lib/store";

const EXTRA = [
  "Sur le terrain, nos agronomes constatent que des apports fractionnés et ajustés au stade de la culture améliorent nettement l'efficience des nutriments.",
  "L'analyse de sol et le suivi foliaire restent les meilleurs alliés pour éviter la sur-fertilisation et préserver la rentabilité de l'exploitation.",
  "Associer un biostimulant racinaire à un programme nutritionnel raisonné aide la plante à mieux résister aux stress climatiques.",
  "Chaque exploitation est unique : sol, climat, variété et objectifs de rendement doivent guider la stratégie de nutrition.",
];

export function generateCaption(idea: string, tone: string, length: CaptionLength, lang: string) {
  if (lang === "Anglais") {
    return `🌱 ${idea}\n\nBalanced plant nutrition is the foundation of healthy, high-yielding crops. Our agronomists recommend split applications adapted to each growth stage.\n\n✅ Analyse your soil\n✅ Adjust inputs to real crop needs\n✅ Strengthen roots with a biostimulant`;
  }
  if (lang === "Arabe") {
    return `🌱 ${idea}\n\nالتغذية النباتية المتوازنة هي أساس محاصيل صحية ومردودية عالية. ينصح خبراؤنا بتقسيم الإضافات حسب مراحل نمو المحصول.\n\n✅ حلّل تربتك\n✅ عدّل المدخلات حسب حاجة النبات\n✅ قوِّ الجذور بمحفز حيوي`;
  }
  const intro = tone === "Expert" || tone === "Professionnel" || tone === "Institutionnel"
    ? "La performance d'une culture se joue en grande partie sur la qualité de sa nutrition."
    : tone === "Commercial" ? "Vous voulez des cultures plus fortes et un meilleur rendement ? Tout commence par la nutrition."
    : "Bien nourrir ses cultures, c'est simple quand on a les bons repères 👇";
  const bullets = "✅ Analysez votre sol avant chaque saison\n✅ Fractionnez les apports selon les stades clés\n✅ Renforcez le système racinaire\n✅ Surveillez les signes de carence";
  const extra = length === "Courte" ? "" : length === "Moyenne" ? `\n\n${EXTRA[0]}` : `\n\n${EXTRA.join("\n\n")}`;
  return `🌱 ${idea}\n\n${intro}\n\n${bullets}${extra}`;
}

export const HASHTAG_SETS = [
  "#NutritionVégétale #Agriculture #ALLTECH #Rendement",
  "#Fertilisation #AgricultureDurable #Biostimulants #ALLTECH",
  "#ConseilsAgricoles #Agronomie #Cultures #ALLTECH",
];
export const CTAS = ["Contactez nos experts", "Téléchargez le guide", "En savoir plus", "Demandez un diagnostic gratuit"];
