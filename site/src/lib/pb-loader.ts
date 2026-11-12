import { isIconName } from "./icons"
import { categoryPath } from "./paths"
import { fileUrl, listAll } from "./pb"
import type { Category, Img, Site } from "./types"

type Rec = { id: string; collectionId: string }
type RawSettings = Rec & {
  company_name: string; phone: string; phone_2: string; email: string; address: string; maps_url: string
  hero_title: string; hero_text: string; hero_image: string
  about_title: string; about_text: string; about_image: string; about_image_2: string; since: number
  design_text: string; design_image: string; hr_text: string; hr_image: string
  seo_description: string; share_image: string; cf_analytics_token: string
}
type RawFeature = Rec & { title: string; text: string }
type RawStat = Rec & { label: string; value: number; suffix: string }
type RawCategory = Rec & {
  title: string; slug: string; parent: string; summary: string; body: string; icon: string; cover: string; gallery: string[]
  featured: boolean; updated: string
}
type RawProduct = Rec & { title: string; category: string; description: string; image: string }
type RawPage = Rec & { title: string; slug: string; body: string; seo_description: string }
type RawRedirect = Rec & { from: string; to: string; code: "301" | "302" }

const file = (r: Rec, name: string): Img | undefined => (name ? { src: fileUrl(r, name) } : undefined)

/** Tüm içeriği PB'den çeker (yalnız public kurallarla) ve doğrular. Eksik zorunlu içerik build'i kırar. */
export async function loadFromPb(): Promise<Site> {
  const [settingsList, features, stats, rawCategories, products, redirects, pages] = await Promise.all([
    listAll<RawSettings>("settings", { sort: "created" }),
    listAll<RawFeature>("features"),
    listAll<RawStat>("stats"),
    listAll<RawCategory>("categories"),
    listAll<RawProduct>("products"),
    listAll<RawRedirect>("redirects"),
    listAll<RawPage>("pages"),
  ])
  const s = settingsList[0]
  if (!s?.company_name || !s.hero_title) throw new Error("Site Ayarları (settings) kaydı yok ya da firma adı/ana başlık boş")

  const byId = new Map(rawCategories.map((c) => [c.id, c]))
  const categories: Category[] = rawCategories
    // üst grubu yayında olmayan alt grup gösterilmez (adresi kurulamaz)
    .filter((c) => !c.parent || byId.has(c.parent))
    .map((c) => {
      const parent = c.parent ? byId.get(c.parent)!.slug : undefined
      return {
        title: c.title, slug: c.slug, parent, path: categoryPath(c.slug, parent), summary: c.summary, body: c.body,
        icon: isIconName(c.icon) ? c.icon : "kutu", cover: file(c, c.cover), gallery: c.gallery.map((g) => ({ src: fileUrl(c, g) })),
        featured: c.featured, updated: c.updated,
        products: products.filter((p) => p.category === c.id).map((p) => ({ title: p.title, description: p.description, image: file(p, p.image) })),
      }
    })

  return {
    settings: {
      companyName: s.company_name, phone: s.phone, phone2: s.phone_2, email: s.email, address: s.address, mapsUrl: s.maps_url,
      heroTitle: s.hero_title, heroText: s.hero_text, heroImage: file(s, s.hero_image),
      aboutTitle: s.about_title, aboutText: s.about_text, aboutImage: file(s, s.about_image), aboutImage2: file(s, s.about_image_2),
      since: s.since || undefined, designText: s.design_text, designImage: file(s, s.design_image), hrText: s.hr_text, hrImage: file(s, s.hr_image),
      seoDescription: s.seo_description, shareImage: file(s, s.share_image), cfAnalyticsToken: s.cf_analytics_token,
    },
    features: features.map((f) => ({ title: f.title, text: f.text })),
    stats: stats.map((x) => ({ label: x.label, value: x.value, suffix: x.suffix })),
    categories,
    pages: pages.map((p) => ({ title: p.title, slug: p.slug, body: p.body, seoDescription: p.seo_description })),
    redirects: redirects.map((r) => ({ from: r.from, to: r.to, code: r.code })),
  }
}
