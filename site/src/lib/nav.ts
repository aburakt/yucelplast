/** Üst menü (sabit sayfalar). Ürün grupları menüye ve sayfa altına panelden gelir. */
export const MENU = [
  { href: "/hakkimizda/", label: "Hakkımızda" },
  { href: "/urunler/", label: "Ürünler" },
  { href: "/tasarim-ve-ozellestirme/", label: "Tasarım ve Özelleştirme" },
  { href: "/insan-kaynaklari/", label: "İnsan Kaynakları" },
  { href: "/iletisim/", label: "İletişim" },
] as const

/** Haritada açma bağlantısı: panelde Google Haritalar bağlantısı yoksa adresle arama. */
export const mapsHref = (mapsUrl: string | undefined, address: string): string =>
  mapsUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address.replace(/\s*\n\s*/g, ", "))}`
