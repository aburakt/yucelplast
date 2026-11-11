// SİTEYE ÖZEL: GEO ve WebMCP için sitenin tanımı. Rehber docs/geo-webmcp.md.
// Core çıktılar (/llms.txt, /llms-full.txt, /robots.txt, /<yol>/index.md, /webmcp.json, WebMCP araçları) yalnız bunu okur.
// Veri sayfalarla aynı yerden gelir (loadSite: PB ya da fixture); PB/fixture paritesi bu dosyaları da karşılaştırır.
// Yeni sayfa ya da bölüm eklenince buraya da yazılır.
import { loadSite, topCategories } from "./content"
import { lines } from "./format"
import { type GeoSite, htmlToMarkdown } from "./llms"
import type { Category } from "./types"

const paras = (t: string) => t.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean).join("\n\n")

export async function geo(): Promise<GeoSite> {
  const site = await loadSite()
  const { settings: s, features, pages } = site
  const contact = [
    s.phone && `- Telefon: ${s.phone}`, s.phone2 && `- Telefon 2: ${s.phone2}`, s.email && `- E-posta: ${s.email}`,
    s.address && `- Adres: ${lines(s.address).join(", ")}`,
  ].filter(Boolean).join("\n")
  const catLine = (c: Category) => `- [${c.title}](${c.path}): ${c.summary}`
  const home = [
    `# ${s.heroTitle}`, s.heroText,
    "## Ürün grupları", topCategories(site).map(catLine).join("\n"),
    `## ${s.aboutTitle}`, paras(s.aboutText),
    features.length ? "## Neden Yücel Plast?" : "", features.map((f) => `- **${f.title}:** ${f.text}`).join("\n"),
    "## İletişim", contact,
  ].filter(Boolean).join("\n\n")
  const categoryContent = (c: Category) => [
    c.body ? htmlToMarkdown(c.body) : c.summary,
    site.categories.filter((k) => k.parent === c.slug).length ? `## ${c.title} çeşitleri\n\n${site.categories.filter((k) => k.parent === c.slug).map(catLine).join("\n")}` : "",
    c.products.length ? `## Modeller\n\n${c.products.map((p) => `- ${p.title}${p.description ? `: ${p.description}` : ""}`).join("\n")}` : "",
  ].filter(Boolean).join("\n\n")

  return {
    name: s.companyName,
    summary: s.seoDescription || s.heroText,
    facts: { "Kuruluş": s.since ? String(s.since) : "", Telefon: s.phone, "E-posta": s.email, Adres: lines(s.address).join(", ") },
    sections: [
      {
        title: "Sayfalar",
        pages: [
          { path: "/", title: "Ana sayfa", description: s.seoDescription, content: home },
          { path: "/hakkimizda/", title: "Hakkımızda", description: s.aboutTitle, content: `## ${s.aboutTitle}\n\n${paras(s.aboutText)}` },
          { path: "/tasarim-ve-ozellestirme/", title: "Tasarım ve Özelleştirme", description: "Ürün seçiminden kaplama, baskı ve iç düzene kadar markanıza özel üretim.", content: paras(s.designText) },
          { path: "/insan-kaynaklari/", title: "İnsan Kaynakları", description: "İş başvurusu", content: paras(s.hrText) },
          { path: "/iletisim/", title: "İletişim", description: "Teklif, numune ve sorular için iletişim bilgileri ve form.", content: contact },
        ],
      },
      {
        title: "Ürünler",
        pages: [
          { path: "/urunler/", title: "Ürünler", description: "Ürün grupları", content: topCategories(site).map(catLine).join("\n") },
          ...site.categories.map((c) => ({ path: c.path, title: c.title, description: c.summary, content: categoryContent(c) })),
        ],
      },
      { title: "Yasal bilgiler", pages: pages.map((p) => ({ path: `/${p.slug}/`, title: p.title, description: p.seoDescription, content: htmlToMarkdown(p.body) })) },
    ],
    contact: [
      { label: "Teklif ve iletişim formu", url: "/iletisim/#form", kind: "form", description: "Ürün, adet, ölçü ve logo bilgisiyle teklif isteyin." },
      { label: "İş başvurusu formu", url: "/insan-kaynaklari/", kind: "form", description: "İnsan Kaynakları sayfasındaki formla başvurun." },
    ],
    // Eğitim tarayıcıları (GPTBot, ClaudeBot, Google-Extended, CCBot...). Müşteri istemezse false; cevap botları yine izinli.
    aiTraining: true,
  }
}
