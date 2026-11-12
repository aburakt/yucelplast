// SİTEYE ÖZEL: core.pb.js ve lib/protect.js bu dosyayı okur. Yeni sitede ilk iş buradaki değerleri değiştirmektir.
module.exports = {
  // Kısa site adı: cron adı, elle yayın adresi (POST /api/<ID>/deploy) ve test dizinlerinin öneki.
  ID: "yucelplast",

  // Değişince siteyi yeniden yayınlatan koleksiyonlar. Yeni içerik koleksiyonu buraya da eklenir (test ölçer).
  CONTENT: ["settings", "features", "stats", "categories", "products", "redirects", "pages"],

  // Ziyaretçi formlarının kutusu (ör. form_submissions): yayın tetiklemez, CONTENT'e girmez; ziyaretçi yalnız gönderir (test ölçer).
  // Spam tuzağı, KVKK onayı, e-posta bildirimi ve saklama süresi: pb_hooks/forms.pb.js (core).
  FORMS: ["messages"],

  // Üye alanı (isteğe bağlı, docs/members.md): giriş yapan hesapların (bayi, şube) kendi kayıtları. null kalırsa yok.
  // Açmak için ör.: MEMBERS: { auth: "branch_users", collections: ["year_themes"] },
  MEMBERS: null,

  // Form ayarları (isteğe bağlı; yazılmayan değer varsayılanla gelir, bkz. lib/forms.js):
  // retentionDays: gönderimler kaç gün saklanır (KVKK, varsayılan 365), honeypot: formdaki gizli tuzak alanının adı
  // (varsayılan "website"), staffFields: yalnız panelden yazılan alanlar (varsayılan ["notes"]).
  FORM_OPTIONS: { retentionDays: 365 },

  // Marka: sistem e-postalarının düzeni (lib/mail.js), form bildirimi ve panel logosu/rengi (lib/brand.js başında).
  // name: görünen ad. color: sitenin vurgu rengi, ink/paper: metin ve zemin (#rrggbb, CSS'teki renklerle aynı).
  // url: PUBLIC_SITE_URL. logo: site/public/logo.svg varsa build <url>/brand/logo-mail.png üretir, buraya o adres yazılır;
  // logo yoksa boş kalır, e-postada ve panelde ad yazıyla (marka renginde) görünür. icon: site/public/favicon.svg ya da
  // favicon.png varsa build <url>/brand/icon.png üretir, panel sekme simgesi o olur; yoksa boş (baş harfli rozet).
  BRAND: {
    name: "Yücel Plast",
    color: "#0061a3",
    ink: "#14202e",
    paper: "#f3f6f9",
    url: "https://www.yucelplast.com",
    logo: "https://www.yucelplast.com/brand/logo-mail.png",
    icon: "https://www.yucelplast.com/brand/icon.png",
  },

  // Mağaza (isteğe bağlı; açma listesi docs/shop.md, alanların anlamı lib/shop.js başında). null kalırsa shop.pb.js
  // hiçbir hook ya da adres kaydetmez. Açmak için ör.:
  // SHOP: { provider: "shopier", reserveMinutes: 30, shipping: { price: 120, freeOver: 2000 }, returnPath: "/siparis/" },
  // iyzico ve beden seçimiyle: { provider: "iyzico", option: { field: "sizes", label: "Beden" }, iyzico: { installments: [1, 2, 3, 6] } }
  SHOP: null,

  // Panel korumaları; alanların anlamı lib/protect.js başında.
  RULES: {
    settings: { label: "Site Ayarları", singleton: true, noDelete: true, deleteHint: "alanları düzenleyin." },
    categories: { slugFrom: "title", locked: ["slug"] },
    pages: { slugFrom: "title", locked: ["slug"] },
  },

  // Çok dillilik (isteğe bağlı; açma listesi docs/i18n.md, alanların anlamı lib/i18n.js başında). Tek dil kalırsa
  // i18n.pb.js hiçbir hook kaydetmez. langs, default ve reserved site/src/lib/i18n.ts ile aynı tutulur (test ölçer).
  LANG: {
    langs: ["tr"],
    default: "tr",
    reserved: ["tr", "api", "_astro", "urunler", "hakkimizda", "iletisim", "insan-kaynaklari", "tasarim-ve-ozellestirme"],
    rules: {},
  },
}
