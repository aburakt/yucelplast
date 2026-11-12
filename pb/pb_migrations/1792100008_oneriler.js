/// <reference path="../pb_data/types.d.ts" />

/**
 * Göç denetimi kararları (2026-11-13), eski siteye sadakat:
 * - settings.email_2: eski İletişim sayfasında info@ yanında yucelplast@yucelplast.com da vardı.
 * - messages.message artık zorunlu değil: eski İK formunda mesaj isteğe bağlıydı (iletişim formunda sitede zorunlu kalır).
 * - "plastik" sözcüğü eski metindeki iki cümleye geri gelir (İmza Dosyası, Ruhsat Kabı); cümle panelde değiştirildiyse dokunulmaz.
 * - KVKK aydınlatma metni ve gizlilik politikası template taslağı hâlâ duruyorsa yayından alınır (hukuk onayına kadar, arolat ile aynı).
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

  const METIN = {
    "imza-dosyasi": ["Yücel Plast, 1977 yılından bu yana kaliteli ürünleriyle", "Yücel Plast, 1977 yılından bu yana kaliteli plastik ürünleriyle"],
    "ruhsat-kabi": ["Dayanıklı malzemeden üretildiği için uzun ömürlüdür.", "Ayrıca, dayanıklı plastik malzemeden üretilmiş olması sayesinde uzun ömürlü kullanım sağlar."],
  }
  for (const slug of Object.keys(METIN)) {
    const rec = app.findRecordsByFilter("categories", "slug = {:slug}", "", 1, 0, { slug })[0]
    const body = rec ? rec.getString("body") : ""
    if (rec && body.indexOf(METIN[slug][0]) !== -1) { rec.set("body", body.replace(METIN[slug][0], METIN[slug][1])); app.save(rec) }
  }
  for (const slug of ["kvkk-aydinlatma-metni", "gizlilik-politikasi"]) {
    const p = app.findRecordsByFilter("pages", "slug = {:slug}", "", 1, 0, { slug })[0]
    if (p && p.getBool("published") && p.getString("body").indexOf("Taslak metin, gözden geçirilmeli") !== -1) { p.set("published", false); app.save(p) }
  }
}, (app) => {
  const messages = app.findCollectionByNameOrId("messages")
  const msg = messages.fields.getByName("message")
  if (msg && !msg.required) { msg.required = true; app.save(messages) }
  const settings = app.findCollectionByNameOrId("settings")
  if (settings.fields.getByName("email_2")) { settings.fields.removeByName("email_2"); app.save(settings) }
})
