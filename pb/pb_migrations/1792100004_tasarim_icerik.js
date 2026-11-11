/// <reference path="../pb_data/types.d.ts" />

/**
 * Eski sitenin modernleştirilmiş düzeni (PR #4) canlı PB'ye: ana sayfa başlıkları, bina fotoğraflı hero ve ana sayfadaki
 * ürün grupları. Canlı PB 2026-11-11'de önceki content.json ile tohumlandı; yalnız değer hâlâ o tohumdaysa değiştirilir,
 * panelde yazılan ezilmez. Boş PB'de (verify, yeni kurulum) settings kaydı yoktur, bir şey yapılmaz.
 * Metinler site/src/data/content.json ile aynıdır. Görsel pb_hooks/media/hero-bina.webp (WorkingDirectory'ye göre).
 */
migrate((app) => {
  const settings = app.findRecordsByFilter("settings", "1=1", "", 1, 0)[0]
  if (settings) {
    if (settings.getString("hero_title") === "Kaliteli ürünler, güvenilir çözümler") settings.set("hero_title", "Kaliteli Ürünler, Güvenilir Çözümler")
    if (settings.getString("about_title") === "İnovasyon ve kaliteli işçiliğin buluştuğu nokta") settings.set("about_title", "İnovasyon ve Kaliteli İşçiliğin Buluştuğu Nokta")
    if (settings.getString("hero_image").startsWith("hero_dosyalar")) {
      try {
        settings.set("hero_image", $filesystem.fileFromPath("pb_hooks/media/hero-bina.webp"))
      } catch (_) {
        // dosya yoksa (başka çalışma dizini) görsel panelden değiştirilir
      }
    }
    app.save(settings)
  }
  const featured = { kartela: [false, true], "ruhsat-kabi": [false, true], klasor: [true, false] }
  for (const slug of Object.keys(featured)) {
    const [from, to] = featured[slug]
    const rec = app.findRecordsByFilter("categories", "slug = {:slug}", "", 1, 0, { slug })[0]
    if (rec && rec.getBool("featured") === from) {
      rec.set("featured", to)
      app.save(rec)
    }
  }
}, () => {})
