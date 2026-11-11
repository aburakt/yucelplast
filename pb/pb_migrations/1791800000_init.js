/// <reference path="../pb_data/types.d.ts" />

/**
 * Yücel Plast içerik şeması. Standart: astro-pocketbase (koleksiyon/alan adları İngilizce).
 * - settings: Site Ayarları (tek kayıt, herkese açık)
 * - features: "Neden Yücel Plast?" maddeleri
 * - categories: ürün grupları (/urunler/<adres>/); alt grup üst gruba bağlanır (/urunler/<üst>/<adres>/)
 * - products: bir grubun içindeki ürünler (grup sayfasında kart olarak)
 * Okuma: içerik published = true ile sınırlı; Site Ayarları herkese açık. Yazma: yalnız superuser (null).
 * Panel müşterinin kendi başına düzenleyebileceği hâlde gelir: her alanda Türkçe yardım, her koleksiyonda okunur alan.
 * Yayına çıktıktan sonra düzenlenmez, yeni migration eklenir.
 */
migrate((app) => {
  const SIRA = "Sitede küçük sayı önce gelir. Araya eklemek için 10, 20, 30 gibi aralıklı sayılar kullanın."
  const PUB = "İşaretli değilse kayıt sitede görünmez (taslak). Yeni kayıtta işaretlemeyi unutmayın; siteden kaldırmak için silmek yerine işareti kaldırın."
  const IMG = "Telefon fotoğrafı da yükleyebilirsiniz; site görseli web için kendisi küçültür. Mümkünse en yüksek çözünürlüklü dosyayı yükleyin."
  const IMAGE_MIME = ["image/png", "image/jpeg", "image/webp"]
  // site/src/lib/icons.ts ile aynı tutulur (tests/site.test.ts ölçer)
  const ICONS = ["kutu", "belge", "imza", "menu", "kartela", "ruhsat", "bloknot", "yillik", "ajanda", "klasor", "canta"]

  const text = (name, help, extra) => Object.assign({ name, type: "text", help }, extra || {})
  const long = (name, help, extra) => text(name, help, Object.assign({ max: 5000 }, extra || {}))
  const image = (name, help, extra) => Object.assign({ name, type: "file", maxSelect: 1, maxSize: 20 * 1024 * 1024, mimeTypes: IMAGE_MIME, thumbs: ["400x0", "1200x0"], help }, extra || {})
  const position = () => ({ name: "position", type: "number", onlyInt: true, help: SIRA })
  const published = () => ({ name: "published", type: "bool", help: PUB })
  const timestamps = () => [
    { name: "created", type: "autodate", onCreate: true, onUpdate: false },
    { name: "updated", type: "autodate", onCreate: true, onUpdate: true },
  ]
  const make = (name, fields, rules, indexes) => {
    const c = new Collection({
      type: "base", name,
      listRule: rules.list, viewRule: rules.view, createRule: rules.create, updateRule: rules.update, deleteRule: rules.delete,
      fields: [...fields, ...timestamps()],
      indexes: indexes || [],
    })
    app.save(c)
    return c
  }
  const PUBLISHED = { list: "published = true", view: "published = true", create: null, update: null, delete: null }
  const PUBLIC = { list: "", view: "", create: null, update: null, delete: null }

  // ---------- settings (Site Ayarları, tek kayıt) ----------
  make("settings", [
    text("company_name", "Firmanın adı. Sayfa başlığında ve sayfa altında görünür.", { required: true, max: 120, presentable: true }),
    text("phone", "Ana telefon (ör. 0312 395 42 01). Üst menüde, iletişim sayfasında ve sayfa altında görünür.", { max: 40 }),
    text("phone_2", "İkinci telefon. Boşsa görünmez.", { max: 40 }),
    { name: "email", type: "email", help: "İletişim e-postası. Boşsa görünmez." },
    long("address", "Açık adres. Satırları Enter ile ayırabilirsiniz.", { max: 500 }),
    { name: "maps_url", type: "url", help: "Google Haritalar'da firmanın bağlantısı (Paylaş > Bağlantıyı kopyala). \"Yol tarifi al\" düğmesi buraya gider. Boşsa adresle arama açılır." },
    text("hero_title", "Ana sayfanın en üstündeki büyük başlık.", { required: true, max: 160 }),
    long("hero_text", "Büyük başlığın altındaki 1-2 cümlelik açıklama.", { max: 400 }),
    image("hero_image", "Ana sayfanın en üstündeki fotoğraf. Yatay ürün fotoğrafı önerilir. " + IMG),
    text("about_title", "Ana sayfadaki ve Hakkımızda sayfasındaki tanıtım başlığı.", { required: true, max: 160 }),
    long("about_text", "Firmayı anlatan metin. Paragrafları boş satırla ayırın.", { required: true, max: 3000 }),
    image("about_image", "Tanıtım bölümündeki fotoğraf (ör. fabrika binası). " + IMG),
    image("about_image_2", "Hakkımızda sayfasındaki ikinci fotoğraf (ör. üretim alanı). Boşsa görünmez. " + IMG),
    { name: "since", type: "number", onlyInt: true, min: 1900, max: 2100, help: "Kuruluş yılı (ör. 1977). Ana sayfada \"... yılından bu yana\" olarak görünür. Boşsa görünmez." },
    long("design_text", "Tasarım ve Özelleştirme sayfasının giriş metni. Paragrafları boş satırla ayırın.", { required: true, max: 3000 }),
    image("design_image", "Tasarım ve Özelleştirme sayfasındaki fotoğraf. " + IMG),
    long("hr_text", "İnsan Kaynakları sayfasındaki metin (iş başvurusu nasıl yapılır). Paragrafları boş satırla ayırın.", { required: true, max: 3000 }),
    image("hr_image", "İnsan Kaynakları sayfasındaki fotoğraf (ör. fabrika binası). Boşsa görünmez. " + IMG),
    text("seo_description", "Google'da ve link paylaşımlarında görünen site açıklaması (150-160 karakter).", { max: 300 }),
    image("share_image", "Site linki paylaşılınca görünen görsel. Yatay, 1200x630 piksel önerilir. Boşsa ana sayfa fotoğrafı kullanılır."),
  ], PUBLIC)

  // ---------- features ("Neden Yücel Plast?" maddeleri) ----------
  make("features", [
    text("title", "Maddenin kısa başlığı (ör. Ürün Seçimi Danışmanlığı).", { required: true, max: 80, presentable: true }),
    long("text", "Başlığın altındaki 1-2 cümle.", { required: true, max: 400 }),
    position(), published(),
  ], PUBLISHED)

  // ---------- categories (Ürün grupları) ----------
  const categories = make("categories", [
    text("title", "Grubun adı (ör. İmza Dosyası). Menüde, ana sayfada ve grup sayfasında görünür.", { required: true, max: 80, presentable: true }),
    text("slug", "Sayfa adresi (/urunler/<adres>/). Boş bırakın; addan üretilir. Kaydettikten sonra değiştirilemez.", { max: 80, pattern: "^[a-z0-9-]*$" }),
    long("summary", "Kartlarda ve Google'da görünen 1-2 cümlelik özet.", { required: true, max: 300 }),
    { name: "body", type: "editor", help: "Grup sayfasındaki tanıtım metni. Başlık, liste ve bağlantı kullanabilirsiniz. Boşsa yalnız özet görünür." },
    { name: "icon", type: "select", maxSelect: 1, values: ICONS, help: "Fotoğrafı olmayan kartta görünen simge: kutu, belge, imza, menu, kartela, ruhsat, bloknot, yillik, ajanda, klasor, canta." },
    image("cover", "Kartta ve grup sayfasının üstünde görünen fotoğraf. Boşsa simge görünür. " + IMG),
    { name: "gallery", type: "file", maxSelect: 30, maxSize: 20 * 1024 * 1024, mimeTypes: IMAGE_MIME, thumbs: ["400x0", "1200x0"], help: "Grup sayfasının altındaki fotoğraf galerisi (en çok 30). Sürükleyerek sıralayabilirsiniz. " + IMG },
    { name: "featured", type: "bool", help: "İşaretliyse ana sayfadaki ürün grupları arasında görünür (yalnız üst gruplar)." },
    position(), published(),
  ], PUBLISHED, ["CREATE UNIQUE INDEX idx_categories_slug ON categories (slug)"])
  categories.fields.addAt(2, new RelationField({
    name: "parent", collectionId: categories.id, maxSelect: 1, cascadeDelete: false,
    help: "Alt grup ise bağlı olduğu üst grup (ör. Kapaklı Kutu için Kutu Üretimi). Üst grupta boş bırakın. Adres /urunler/<üst>/<adres>/ olur.",
  }))
  app.save(categories)

  // ---------- products (Ürünler, grup sayfasında kart) ----------
  make("products", [
    text("title", "Ürünün adı (ör. 10 Yaprak Suni Deri İmza Dosyası).", { required: true, max: 120, presentable: true }),
    { name: "category", type: "relation", required: true, collectionId: categories.id, maxSelect: 1, cascadeDelete: false, help: "Ürünün göründüğü grup." },
    long("description", "Kısa açıklama: malzeme, ölçü, seçenekler. Boşsa yalnız ad görünür.", { max: 600 }),
    image("image", "Ürün fotoğrafı. Boşsa grubun simgesi görünür. " + IMG),
    position(), published(),
  ], PUBLISHED)

  // ---------- panel ve sunucu ayarları ----------
  const s = app.settings()
  s.meta.appName = "Yücel Plast Yönetimi"
  s.meta.hideControls = true
  s.logs.maxDays = 14
  s.backups.cron = "0 3 * * *"
  s.backups.cronMaxKeep = 7
  s.rateLimits.enabled = true
  s.rateLimits.rules = [
    { label: "*:auth", audience: "", duration: 3, maxRequests: 5 },
    { label: "/api/", audience: "", duration: 10, maxRequests: 300 },
    // build görselleri aynı anda çeker; dosya indirme için geniş sınır
    { label: "*:file", audience: "", duration: 10, maxRequests: 100000 },
  ]
  s.trustedProxy.headers = ["X-Forwarded-For"]
  s.trustedProxy.useLeftmostIP = false
  app.save(s)

  // kullanılmayan varsayılan users koleksiyonu (boşsa)
  try {
    const users = app.findCollectionByNameOrId("users")
    if (app.countRecords("users") === 0) app.delete(users)
  } catch (_) { /* zaten yok */ }
}, (app) => {
  for (const name of ["products", "categories", "features", "settings"]) {
    try { app.delete(app.findCollectionByNameOrId(name)) } catch (_) {}
  }
})
