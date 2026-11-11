// SİTEYE ÖZEL: ortak betikler (scripts/verify.ts, tests/hooks.test.ts) bu dosyayı okur.
// PB tarafındaki karşılığı pb/pb_hooks/site.js (ID, içerik koleksiyonları, panel korumaları).
import type { Pb } from "./scripts/pb-harness"
import { GEO_CHECKS } from "./scripts/geo-check"
import { seed } from "./scripts/seed"
import type { SiteConfig } from "./scripts/site-types"

const TOKEN = "0123456789abcdef0123456789abcdef"
const first = async (pb: Pb, collection: string, filter = "") =>
  ((await (await pb.admin(`/api/collections/${collection}/records?perPage=1&filter=${encodeURIComponent(filter)}`)).json()) as { items: { id: string }[] }).items[0]!.id
const patch = async (pb: Pb, collection: string, id: string, body: Record<string, unknown>) => {
  const res = await pb.admin(`/api/collections/${collection}/records/${id}`, { method: "PATCH", body: JSON.stringify(body) })
  if (!res.ok) throw new Error(`testSeed ${collection}: ${res.status} ${await res.text()}`)
}

export const SITE: SiteConfig = {
  checks: [
    // tek dilli: hreflang yok (çok dilli sitede hasNot kaldırılır, has'a hreflang eklenir; docs/i18n.md)
    { name: "Ana sayfa", path: "/", has: ['<html lang="tr"', "<h1", "Markanıza özel dosya, kap ve kutu üretimi", 'rel="canonical"', 'property="og:image"', '"@type":"LocalBusiness"', 'href="/urunler/imza-dosyasi/"', "Ürün seçimi danışmanlığı", "1977", 'href="/kvkk-aydinlatma-metni/"'], hasNot: ["hreflang", 'href="/urunler/yillik/" class="card'] },
    { name: "Ürünler", path: "/urunler/", has: ["<h1", 'href="/urunler/kutu-uretimi/"', 'href="/urunler/canta/"', '"@type":"BreadcrumbList"'], hasNot: ['href="/urunler/kutu-uretimi/kapakli-kutu/" class="card'] },
    { name: "Ürün grubu ve modelleri", path: "/urunler/imza-dosyasi/", has: ["<h1", "İmza Dosyası", "18 Yaprak İçten Körüklü İmza Dosyası", "Fotoğraflar", '"@type":"CollectionPage"'] },
    { name: "Üst grup alt gruplarını listeler", path: "/urunler/kutu-uretimi/", has: ["Kutu Üretimi çeşitleri", 'href="/urunler/kutu-uretimi/kapakli-kutu/"', 'href="/urunler/kutu-uretimi/miknatisli-kutu/"', "Diğer modeller", "Silindir Kutu"] },
    { name: "Alt grup sayfası", path: "/urunler/kutu-uretimi/miknatisli-kutu/", has: ["<h1", "Mıknatıslı Kutu", 'href="/urunler/kutu-uretimi/">Kutu Üretimi</a>'] },
    { name: "Fotoğrafsız grup simgeyle görünür", path: "/urunler/canta/", has: ["<h1", "Karton Çanta", '<svg viewBox="0 0 24 24"'] },
    { name: "Hakkımızda", path: "/hakkimizda/", has: ["<h1", "İnovasyon ve kaliteli işçiliğin buluştuğu nokta", '"@type":"AboutPage"'] },
    { name: "Tasarım ve Özelleştirme", path: "/tasarim-ve-ozellestirme/", has: ["<h1", "Sıvama kutu modelleri", "Nasıl çalışıyoruz?"] },
    { name: "İnsan Kaynakları formu", path: "/insan-kaynaklari/", has: ["<h1", 'name="topic" value="is-basvurusu"', 'toolname="job_application"', "/api/collections/messages/records"] },
    { name: "İletişim formu PB'ye gönderir", path: "/iletisim/", has: ["İvedik Organize Sanayi Bölgesi", 'data-contact-form', 'id="form"', "/api/collections/messages/records", 'name="kvkk_consent"', 'name="website"', 'name="topic"', '"@type":"ContactPage"'] },
    { name: "KVKK aydınlatma metni", path: "/kvkk-aydinlatma-metni/", has: ["<h1", "KVKK Aydınlatma Metni", "Taslak metin, gözden geçirilmeli"] },
    { name: "Gizlilik ve çerez politikası", path: "/gizlilik-politikasi/", has: ["<h1", "Çerezler"] },
    // PB adresi build'de connect-src'ye eklenir (site/integrations/pb-csp.ts); verify PB'si 127.0.0.1'de çalışır
    { name: "CSP form gönderimine izin verir", path: "/_headers", has: ["connect-src 'self' https://cloudflareinsights.com http://127.0.0.1:"] },
    { name: "404 sayfası", path: "/yok-boyle-bir-sayfa/", status: 404, has: ["Sayfa bulunamadı"] },
    { name: "Sitemap", path: "/sitemap-index.xml" },
    { name: "Sitemap grupları", path: "/sitemap-0.xml", has: ["/urunler/kutu-uretimi/kapakli-kutu/</loc>"] },
    { name: "Robots", path: "/robots.txt", has: ["Sitemap:"] },
    // GEO ve WebMCP (lib/geo.ts, docs/geo-webmcp.md): ortak kontroller, sonra bu sitenin içeriği
    ...GEO_CHECKS,
    { name: "Robots: eğitim tarayıcıları izinli (geo.ts aiTraining)", path: "/robots.txt", has: ["User-agent: meta-externalagent\nAllow: /\n"] },
    { name: "llms.txt", path: "/llms.txt", has: ["Yücel Plast", "/urunler/imza-dosyasi/): ", "## Ürünler", "## Yasal bilgiler"] },
    { name: "llms-full.txt", path: "/llms-full.txt", has: ["## İmza Dosyası", "PVC İmza Dosyası", "## Veri sorumlusu"] },
    { name: "Grubun markdown eşi", path: "/urunler/kutu-uretimi/index.md", has: ["# Kutu Üretimi", "Kaynak: ", "## Kutu Üretimi çeşitleri"] },
    { name: "Markdown eşi ve WebMCP betiği sayfada", path: "/urunler/kutu-uretimi/", has: ['<link rel="alternate" type="text/markdown" href="/urunler/kutu-uretimi/index.md">'] },
    { name: "WebMCP verisi", path: "/webmcp.json", has: ['"name":"Yücel Plast"', '"path":"/urunler/klasor/"', '"kind":"form"'] },
    { name: "İletişim formu WebMCP bildirimsel araç", path: "/iletisim/", has: ['toolname="contact_message"', "toolparamdescription="], hasNot: ["toolautosubmit"] },
    { name: "Yönlendirmeler", path: "/_redirects", has: ["\n/index.html / 301\n", "/urunler/kutu-uretimi/miknatisli-kutuzz /urunler/kutu-uretimi/miknatisli-kutu/ 301"] },
  ],
  hookSample: {
    collection: "features",
    create: { title: "hook-testi", text: "x", published: true },
    update: (n) => ({ text: `metin ${n}` }),
  },
  // Gerçek içerikte olmayan durumlar: ziyaret sayacı anahtarı dolu, KVKK metni taslakta (bağlantısı ve sayfası yok olmalı),
  // üst grubu taslakta olan alt grup (sayfası üretilmez), taslak ürün.
  testSeed: async (pb) => {
    await seed(pb)
    await patch(pb, "settings", await first(pb, "settings"), { cf_analytics_token: TOKEN })
    await patch(pb, "pages", await first(pb, "pages", 'slug = "kvkk-aydinlatma-metni"'), { published: false })
    await patch(pb, "categories", await first(pb, "categories", 'slug = "kutu-uretimi"'), { published: false })
    await patch(pb, "products", await first(pb, "products", 'title = "PVC İmza Dosyası"'), { published: false })
  },
  testChecks: [
    {
      name: "Ziyaret sayacı (Cloudflare Web Analytics) dış betik", path: "/",
      has: ['src="https://static.cloudflareinsights.com/beacon.min.js"', `data-cf-beacon="{&quot;token&quot;:&quot;${TOKEN}&quot;}"`, 'href="/gizlilik-politikasi/"'],
      hasNot: ['href="/kvkk-aydinlatma-metni/"'],
    },
    { name: "Taslak sayfa yayınlanmaz", path: "/kvkk-aydinlatma-metni/", status: 404 },
    { name: "Taslak üst grup ve alt grupları yayınlanmaz", path: "/urunler/kutu-uretimi/miknatisli-kutu/", status: 404 },
    { name: "Taslak ürün görünmez", path: "/urunler/imza-dosyasi/", has: ["İçi Süet İmza Dosyası"], hasNot: ["PVC İmza Dosyası"] },
    { name: "Taslak grup menüde yok", path: "/urunler/", hasNot: ['href="/urunler/kutu-uretimi/"'] },
  ],
}
