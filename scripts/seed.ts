import { join } from "node:path"
import type { Pb } from "./pb-harness"

// SİTEYE ÖZEL: site/src/data/content.json + görseller -> PocketBase. İçeriği ilk kez PB'ye yükler; testler ve verify kullanır.
// Sözleşme: `seed(pb)` boş bir PB'yi doldurur (scripts/verify.ts ve seed-remote.ts bunu çağırır).
const SITE = join(import.meta.dir, "..", "site")
const MEDIA = join(SITE, "src", "assets", "media")

type Json = Record<string, unknown>
type Product = { title: string; description: string; image?: string }
type Category = {
  title: string; slug: string; parent?: string; icon: string; summary: string; body: string; cover?: string; gallery: string[]
  featured: boolean; products: Product[]
}
export type Content = {
  settings: {
    companyName: string; phone: string; phone2: string; email: string; email2?: string; address: string; mapsUrl: string
    heroTitle: string; heroText: string; heroImage: string; aboutTitle: string; aboutText: string; aboutImage: string; aboutImage2: string
    since: number; designText: string; designImage: string; hrText: string; hrImage?: string; seoDescription: string; cfAnalyticsToken?: string
  }
  features: { title: string; text: string }[]
  stats: { label: string; value: number; suffix: string }[]
  categories: Category[]
  redirects: { from: string; to: string; code: string }[]
  pages: { title: string; slug: string; seoDescription: string; body: string; published: boolean }[]
}
export const loadContent = async (): Promise<Content> => (await Bun.file(join(SITE, "src", "data", "content.json")).json()) as Content

const blob = async (name: string) => new Blob([await Bun.file(join(MEDIA, name)).arrayBuffer()], { type: "image/webp" })

/** Kayıt açar. Boş alanlar gönderilmez; görseller media klasöründen yüklenir (dizi = çoklu dosya alanı, sırasıyla). */
export async function save(pb: Pb, collection: string, fields: Json, files: Record<string, string | string[] | undefined> = {}): Promise<Json> {
  const form = new FormData()
  for (const [k, v] of Object.entries(fields)) {
    if (v === undefined || v === null || v === "" || v === 0) continue
    form.set(k, String(v))
  }
  for (const [field, names] of Object.entries(files)) {
    for (const name of [names ?? []].flat()) form.append(field, await blob(name), name)
  }
  const res = await pb.admin(`/api/collections/${collection}/records`, { method: "POST", body: form })
  if (!res.ok) throw new Error(`seed ${collection}: ${res.status} ${await res.text()}`)
  return (await res.json()) as Json
}

/** Boş bir PB'yi içerikle doldurur. Site Ayarları zaten varsa (canlıda) durur. */
export async function seed(pb: Pb): Promise<void> {
  const existing = await pb.admin("/api/collections/settings/records?perPage=1")
  if (!existing.ok) throw new Error(`seed settings: ${existing.status}`)
  if (((await existing.json()) as { totalItems: number }).totalItems > 0) throw new Error("PB dolu (settings kaydı var); tohumlama yalnız boş PB'ye yapılır")
  const { settings: s, features, stats, categories, redirects, pages } = await loadContent()
  await save(pb, "settings", {
    company_name: s.companyName, phone: s.phone, phone_2: s.phone2, email: s.email, email_2: s.email2, address: s.address, maps_url: s.mapsUrl,
    hero_title: s.heroTitle, hero_text: s.heroText, about_title: s.aboutTitle, about_text: s.aboutText, since: s.since,
    design_text: s.designText, hr_text: s.hrText, seo_description: s.seoDescription, cf_analytics_token: s.cfAnalyticsToken,
  }, { hero_image: s.heroImage, about_image: s.aboutImage, about_image_2: s.aboutImage2, design_image: s.designImage, hr_image: s.hrImage })
  for (const [i, f] of features.entries()) await save(pb, "features", { title: f.title, text: f.text, position: (i + 1) * 10, published: true })
  for (const [i, x] of stats.entries()) await save(pb, "stats", { label: x.label, value: x.value, suffix: x.suffix, position: (i + 1) * 10, published: true })

  // önce üst gruplar (alt grup üst grubun id'sine bağlanır)
  const ids = new Map<string, string>()
  const ordered = [...categories.filter((c) => !c.parent), ...categories.filter((c) => c.parent)]
  for (const c of ordered) {
    const position = (categories.indexOf(c) + 1) * 10
    const rec = await save(pb, "categories", {
      title: c.title, slug: c.slug, parent: c.parent ? ids.get(c.parent) : undefined, summary: c.summary, body: c.body, icon: c.icon,
      featured: c.featured, position, published: true,
    }, { cover: c.cover, gallery: c.gallery })
    ids.set(c.slug, rec.id as string)
    for (const [j, p] of c.products.entries()) {
      await save(pb, "products", { title: p.title, category: rec.id, description: p.description, position: (j + 1) * 10, published: true }, { image: p.image })
    }
  }

  for (const [i, p] of pages.entries()) {
    await save(pb, "pages", { title: p.title, slug: p.slug, body: p.body, seo_description: p.seoDescription, position: (i + 1) * 10, published: p.published })
  }
  for (const [i, r] of redirects.entries()) await save(pb, "redirects", { from: r.from, to: r.to, code: r.code, position: (i + 1) * 10, published: true })
}
