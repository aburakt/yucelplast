/// <reference path="../pb_data/types.d.ts" />

/**
 * Denetim (2026-11-12): settings herkese açık okunur; bildirim alıcısı (form_recipient) API'de görünüyordu.
 * Alan gizlenir (hidden): ziyaretçi API'sinde dönmez, panelde ve hook'larda (lib/forms.js) okunmaya devam eder.
 */
migrate((app) => {
  const settings = app.findCollectionByNameOrId("settings")
  const field = settings.fields.getByName("form_recipient")
  if (!field) return
  field.hidden = true
  field.help = "İletişim formu bildirimlerinin gideceği e-posta. Boşsa sunucudaki varsayılan adres kullanılır. Gizli alan: sitede ve herkese açık API'de görünmez."
  app.save(settings)
}, (app) => {
  const settings = app.findCollectionByNameOrId("settings")
  const field = settings.fields.getByName("form_recipient")
  if (!field) return
  field.hidden = false
  app.save(settings)
})
