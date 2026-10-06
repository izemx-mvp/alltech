export const seo = (page: string, description: string) => ({
  meta: [
    { title: `${page} — ALLTECH Digital Intelligence` },
    { name: "description", content: description },
    { property: "og:title", content: `${page} — ALLTECH Digital Intelligence` },
    { property: "og:description", content: description },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ],
});
