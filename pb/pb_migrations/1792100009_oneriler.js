/// <reference path="../pb_data/types.d.ts" />

/**
 * Göç denetimi kararları (2026-11-13), eski siteye sadakat (1792100008'in devamı):
 * - settings.email_2: eski İletişim sayfasında info@ yanında yucelplast@yucelplast.com da vardı.
 * - messages.message artık zorunlu değil: eski İK formunda mesaj isteğe bağlıydı (iletişim formunda sitede zorunlu kalır).
 * - İmza Dosyası'ndaki 4 model yeniden yayında: adları müşterinin Şubat 2025'te yüklediği fotoğraf dosyalarıyla aynı,
 *   gerçek ürünler. Açıklamaları eski sitede yoktu, boş kalır. 1792100008'in eklediği "Deri İmza Dosyası" aynı
 *   fotoğrafla "10 Yaprak Suni Deri" modelinin tekrarıdır; yalnız o migration'ın eklediği haliyle duruyorsa taslağa alınır.
 * Boş PB'de (verify, yeni kurulum) yalnız şema değişir; içerik tohumdan (site/src/data/content.json) gelir.
 */
migrate((app) => {
  const settings = app.findCollectionByNameOrId("settings")
  if (!settings.fields.getByName("email_2")) {
    settings.fields.add(new EmailField({ name: "email_2", help: "İkinci iletişim e-postası. Boşsa görünmez." }))
    app.save(settings)
  }
  const messages = app.findCollectionByNameOrId("messages")
  const msg = messages.fields.getByName("message")
  if (msg && msg.required) { msg.required = false; app.save(messages) }

  const s = app.findRecordsByFilter("settings", "1=1", "", 1, 0)[0]
  if (!s) return
  if (!s.getString("email_2")) { s.set("email_2", "yucelplast@yucelplast.com"); app.save(s) }

  const imza = app.findRecordsByFilter("categories", "slug = 'imza-dosyasi'", "", 1, 0)[0]
  if (!imza) return
  for (const t of ["10 Yaprak Suni Deri İmza Dosyası", "18 Yaprak İçten Körüklü İmza Dosyası", "İçi Süet İmza Dosyası", "PVC İmza Dosyası"]) {
    const p = app.findRecordsByFilter("products", "category = {:c} && title = {:t}", "", 1, 0, { c: imza.id, t })[0]
    if (p && !p.getBool("published")) { p.set("published", true); app.save(p) }
  }
  const deri = app.findRecordsByFilter("products", "category = {:c} && title = 'Deri İmza Dosyası'", "", 1, 0, { c: imza.id })[0]
  if (deri && deri.getBool("published") && !deri.getString("description") && deri.getInt("position") === 20) {
    deri.set("published", false)
    app.save(deri)
  }
}, (app) => {
  const messages = app.findCollectionByNameOrId("messages")
  const msg = messages.fields.getByName("message")
  if (msg && !msg.required) { msg.required = true; app.save(messages) }
  const settings = app.findCollectionByNameOrId("settings")
  if (settings.fields.getByName("email_2")) { settings.fields.removeByName("email_2"); app.save(settings) }
})
