import content from "../data/content.json"
import { isIconName } from "./icons"
import { categoryPath } from "./paths"
import { loadFromPb } from "./pb-loader"
import { isFixtureMode, pbUrl } from "./pb"
import type { Category, Img, Redirect, Site } from "./types"

const assets = import.meta.glob<{ default: ImageMetadata }>("../assets/media/*.webp", { eager: true })

/** content.json'daki görsel adı -> optimize edilecek yerel görsel. Yoksa build kırılır. */
export function localImage(name: string): Img {
  const mod = assets[`../assets/media/${name}`]
  if (!mod) throw new Error(`görsel yok: ${name}`)
  return { src: mod.default }
}
const opt = (name: string | undefined): Img | undefined => (name ? localImage(name) : undefined)


function fromFixture(): Site {
  const s = content.settings
  const categories: Category[] = content.categories.map((c) => {
    const parent = "parent" in c ? (c.parent as string) : undefined
    if (!isIconName(c.icon)) throw new Error(`bilinmeyen simge: ${c.icon}`)
    return {
      title: c.title, slug: c.slug, parent, path: categoryPath(c.slug, parent), summary: c.summary, body: c.body, icon: c.icon,
      cover: opt("cover" in c ? (c.cover as string) : undefined), gallery: c.gallery.map(localImage), featured: c.featured,
      products: c.products.map((p) => ({ title: p.title, description: p.description, image: opt("image" in p ? (p.image as string) : undefined) })),
    }
  })
  // PB yalnız yayındaki sayfaları verir (published = true); fixture da aynısını yapar
  const pages = content.pages.filter((p) => p.published).map((p) => ({ title: p.title, slug: p.slug, body: p.body, seoDescription: p.seoDescription }))
  return {
    settings: {
      companyName: s.companyName, phone: s.phone, phone2: s.phone2, email: s.email, email2: s.email2, address: s.address, mapsUrl: s.mapsUrl,
      heroTitle: s.heroTitle, heroText: s.heroText, heroImage: opt(s.heroImage),
      aboutTitle: s.aboutTitle, aboutText: s.aboutText, aboutImage: opt(s.aboutImage), aboutImage2: opt(s.aboutImage2), since: s.since,
      designText: s.designText, designImage: opt(s.designImage), hrText: s.hrText, hrImage: opt(s.hrImage), seoDescription: s.seoDescription,
    },
    features: content.features,
    stats: content.stats,
    categories,
    redirects: content.redirects as Redirect[],
    pages,
  }
}

let cache: Promise<Site> | undefined

/** Tüm içeriği bir kez yükler. CONTENT_SOURCE=fixture dışında PB gerekir; yoksa build kırılır. */
export function loadSite(): Promise<Site> {
  if (isFixtureMode()) return (cache ??= Promise.resolve(fromFixture()))
  pbUrl() // PB_URL yoksa burada hata fırlatır; build kırılır, boş site yayına çıkmaz
  return (cache ??= loadFromPb())
}

/** Üst gruplar (menü ve ürünler sayfası) ve bir grubun alt grupları. */
export const topCategories = (site: Site): Category[] => site.categories.filter((c) => !c.parent)
export const childrenOf = (site: Site, slug: string): Category[] => site.categories.filter((c) => c.parent === slug)
