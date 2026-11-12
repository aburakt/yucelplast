/// <reference path="../pb_data/types.d.ts" />

/**
 * "Rakamlarla Yücel Plast": ana sayfadaki sayı kutuları (eski sitedeki ihracat, iş ortağı, ürün çeşidi, üretilen ürün).
 * Okuma published = true ile sınırlı, yazma yalnız superuser. Canlı PB zaten tohumlandıysa (settings kaydı var) eski
 * sitedeki dört kayıt eklenir; boş PB'de kayıtları scripts/seed.ts yükler (content.json "stats").
 */
migrate((app) => {
  const c = new Collection({
    type: "base", name: "stats",
    listRule: "published = true", viewRule: "published = true", createRule: null, updateRule: null, deleteRule: null,
    fields: [
      { name: "label", type: "text", required: true, max: 60, presentable: true, help: "Sayının altındaki kısa açıklama (ör. Ülkeye İhracat)." },
      { name: "value", type: "number", required: true, onlyInt: true, min: 0, help: "Ana sayfada sayılarak görünen sayı (ör. 22)." },
      { name: "suffix", type: "text", max: 4, help: "Sayının sonuna eklenen kısa işaret (ör. + ya da %). Boş bırakılabilir." },
      { name: "position", type: "number", onlyInt: true, help: "Sitede küçük sayı önce gelir. Araya eklemek için 10, 20, 30 gibi aralıklı sayılar kullanın." },
      { name: "published", type: "bool", help: "İşaretli değilse kayıt sitede görünmez (taslak). Yeni kayıtta işaretlemeyi unutmayın; siteden kaldırmak için silmek yerine işareti kaldırın." },
      { name: "created", type: "autodate", onCreate: true, onUpdate: false },
      { name: "updated", type: "autodate", onCreate: true, onUpdate: true },
    ],
  })
  app.save(c)
  if (app.findRecordsByFilter("settings", "1=1", "", 1, 0).length === 0) return
  const rows = [["Ülkeye İhracat", 22], ["İş Ortağı", 12], ["Ürün Çeşidi", 54], ["Üretilen Ürün", 2514]]
  rows.forEach(([label, value], i) => {
    const r = new Record(c)
    r.set("label", label); r.set("value", value); r.set("position", (i + 1) * 10); r.set("published", true)
    app.save(r)
  })
}, (app) => {
  app.delete(app.findCollectionByNameOrId("stats"))
})
