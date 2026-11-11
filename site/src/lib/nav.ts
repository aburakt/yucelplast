/** Üst menü (eski sitedeki sıra): Kurumsal ve Ürünlerimiz açılır menü; ürün grupları panelden gelir (Base.astro). */
export const CORPORATE = [
  { href: "/hakkimizda/", label: "Hakkımızda" },
  { href: "/insan-kaynaklari/", label: "İnsan Kaynakları" },
] as const

export const MENU = [
  { href: "/tasarim-ve-ozellestirme/", label: "Tasarım ve Özelleştirme" },
  { href: "/iletisim/", label: "İletişim" },
] as const

/** Haritada açma bağlantısı: panelde Google Haritalar bağlantısı yoksa adresle arama. */
export const mapsHref = (mapsUrl: string | undefined, address: string): string =>
  mapsUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address.replace(/\s*\n\s*/g, ", "))}`

/** Harita gömme adresi (iletişim sayfası): anahtar gerektirmeyen Google Haritalar gömmesi; CSP frame-src www.google.com. */
export const mapsEmbed = (address: string): string =>
  `https://www.google.com/maps?q=${encodeURIComponent(address.replace(/\s*\n\s*/g, ", "))}&z=13&output=embed`
