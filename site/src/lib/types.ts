import type { IconName } from "./icons"

export type Img = { src: ImageMetadata | string }

/** Site Ayarları (PB `settings`, tek kayıt). */
export type Settings = {
  companyName: string; phone: string; phone2?: string; email: string; address: string; mapsUrl?: string
  heroTitle: string; heroText: string; heroImage?: Img
  aboutTitle: string; aboutText: string; aboutImage?: Img; aboutImage2?: Img; since?: number
  designText: string; designImage?: Img
  hrText: string; hrImage?: Img
  seoDescription: string; shareImage?: Img
  /** Cloudflare Web Analytics anahtarı; boşsa sayaç eklenmez. */
  cfAnalyticsToken?: string
}

/** "Neden Yücel Plast?" maddesi (PB `features`). */
export type Feature = { title: string; text: string }

/** Ürün (PB `products`): grup sayfasında kart. */
export type Product = { title: string; description: string; image?: Img }

/**
 * Ürün grubu (PB `categories`). `parent`: üst grubun slug'ı (alt grupsa). `path`: /urunler/<üst>/<slug>/.
 * `body` panel editöründen gelen HTML. `updated`: son düzenleme (fixture'da yok).
 */
export type Category = {
  title: string; slug: string; parent?: string; path: string; summary: string; body: string
  icon: IconName; cover?: Img; gallery: Img[]; featured: boolean; products: Product[]; updated?: string
}

/** Yönlendirme (PB `redirects`): eski adres -> yeni adres. Dosyaya site/src/lib/redirects.ts yazar. */
export type Redirect = { from: string; to: string; code: "301" | "302" }

/** Sayfa (PB `pages`): yasal metinler gibi tek metinlik sayfa, /<slug>/ adresinde. Yalnız yayındakiler gelir. */
export type Page = { title: string; slug: string; body: string; seoDescription: string }

export type Site = { settings: Settings; features: Feature[]; categories: Category[]; redirects: Redirect[]; pages: Page[] }
