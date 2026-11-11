# Mağaza (isteğe bağlı)

Template'te sepet, stok ve ödeme için hazır bir modül var (core). Ürün kataloğu, stok ve siparişler sitenin kendi PocketBase'inde durur; müşteri yalnız kart bilgisini ödeme sağlayıcısının sayfasında girer. Mağazası olmayan site bundan hiçbir şey ödemez: `SHOP` null kaldıkça hook ve adres kaydedilmez, şema eklenmez.

İki sağlayıcı hazır: Shopier (ayrı sanal POS başvurusu gerekmez, komisyon Shopier'in oranıdır) ve iyzico (Checkout Form: kendi markanla ödeme, taksit, iyzico üye işyeri başvurusu gerekir). Sağlayıcı arayüzü iki fonksiyondur (`start`, `callback`; `pb/pb_hooks/lib/shop-<ad>.js`), PayTR aynı arayüzle eklenir.

| Parça | Nerede | Core mu |
| --- | --- | --- |
| Şema: Ürünler (`products`), Siparişler (`orders`) | `pb/shop/1792200000_shop.js` → sitede `pb/pb_migrations/`'a kopyalanır | evet (kopyası siteye ait) |
| Ödeme adımı, ödeme dönüşü, sipariş sayfası, süre dolumu, panel korumaları | `pb/pb_hooks/shop.pb.js`, `lib/shop.js` | evet |
| Shopier | `pb/pb_hooks/lib/shop-shopier.js` | evet |
| iyzico | `pb/pb_hooks/lib/shop-iyzico.js` | evet |
| Sepet ve ödeme istemcisi (tarayıcı) | `site/src/lib/shop.ts` | evet |
| Build'de mağaza ayarı, sayfa öznitelikleri | `site/src/lib/shop-config.ts` | evet |
| CSP: PB `connect-src`, sağlayıcı `form-action` | `site/integrations/pb-csp.ts` | evet |
| Ürün sayfaları, sepet, ödeme formu, sipariş sayfası, yasal metinler | site | hayır |

## Akış

1. Sepet tarayıcıda (`localStorage`). Sayfa statik olduğu için ürün sayfası stoğu `liveProducts()` ile PB'den tazeler.
2. `checkout()` → `POST /api/<ID>/shop/checkout`. Hook fiyatı ve stoğu veritabanından yeniden hesaplar (tarayıcının gönderdiği fiyat yok sayılır), ürünleri tek transaction içinde stoktan düşer, `pending` sipariş açar, imzalı ödeme formunu döndürür. Onaylar (KVKK, ön bilgilendirme + mesafeli satış) zorunlu; fiziksel üründe adres zorunlu, atölyede (`kind = workshop`) adres ve kargo yok.
3. `submitPayment()` formu sağlayıcıya gönderir (sayfada inline betik yok; `form-action`'a sağlayıcı build'de eklenir).
4. Sağlayıcı müşteriyi `POST /api/<ID>/shop/callback/<sağlayıcı>` adresine döndürür: imza doğrulanır, sipariş `paid` ya da `failed` olur, müşteri `BRAND.url + returnPath?no=&t=` sayfasına yönlenir. Aynı dönüşün tekrarı bir şey değiştirmez.
5. Sitedeki sipariş sayfası `orderStatus()` ile durumu gösterir (`GET /api/<ID>/shop/order?no=&t=`, gizli anahtar olmadan açılmaz).
6. Ödenmeyen sipariş `reserveMinutes` sonra `expired` olur, ürünler stoğa döner (cron, 5 dakikada bir). Süresi dolduktan sonra gelen başarılı ödeme siparişi yeniden ayırır; stok yetmezse not düşülür.

Seçenek (ör. beden): `SHOP.option = { field: "sizes", label: "Beden" }` ve ürünlerde o adla bir çoklu seçim alanı (sitenin migration'ı). Üründe alan doluysa müşteri listeden birini seçer (zorunlu), boşsa seçenek yok. Aynı ürünün farklı bedenleri sepette ve siparişte ayrı kalemdir (`option`, `optionLabel`); stok ürün başınadır (bedene göre stok yok). Sepet istemcisinde satır anahtarı `lineKey()`, görünen ad `lineName()`.

Stok kuralı tek: sipariş `pending/paid/shipped/delivered` iken ürünler stoktan düşülü, `failed/expired/cancelled/refunded` iken stokta. Panelden durum değişince stok kendiliğinden izler (iptal ürünü geri koyar). Panelde sipariş açılamaz, tutar ve kalemler kilitli, bekleyen/ödenmiş sipariş silinemez.

Ödeme gelince satıcıya (`settings.form_recipient`, yoksa sunucu `.env` `SHOP_NOTIFY_TO`, o da yoksa `FORM_NOTIFY_TO`) ve müşteriye markalı e-posta gider. SMTP yoksa yalnız loglanır, sipariş bozulmaz; mağazalı sitede SMTP kurulmalıdır.

## Açma listesi

1. `pb/shop/1792200000_shop.js` dosyasını `pb/pb_migrations/` altına kopyala.
2. `site.js`: `SHOP` doldur; `CONTENT`'e `products` ekle (stok değişince site yeniden yayınlanır, tükenen ürün statik sayfada da tükenir); `RULES.products = { slugFrom: "title", locked: ["slug"] }`.
3. `site.config.ts` `hookSample` ve `seed.ts`'e ürün ekle; ürün ve sipariş sayfalarını, sepeti, `/siparis/` sayfasını yaz (`lib/shop.ts`, `lib/shop-config.ts` `shopAttrs()` → layout `<body>`).
4. Yasal metinler: ön bilgilendirme formu, mesafeli satış sözleşmesi, iade koşulları (`pages`); müşterinin hukuk/muhasebe onayı olmadan yayına alınmaz. Satıcı ETBİS kaydını yapar.
5. Sunucu `.env` (Infisical'da), isteğe bağlı `SHOP_NOTIFY_TO`, SMTP ayarı:
   - Shopier: `SHOPIER_API_KEY`, `SHOPIER_API_SECRET`.
   - iyzico: `IYZICO_API_KEY`, `IYZICO_SECRET_KEY`; denemede `IYZICO_BASE_URL=https://sandbox-api.iyzipay.com` (sandbox anahtarlarıyla). Dönüş adresini kod iyzico'ya her ödemede gönderir: PB ayarlarındaki Application URL + `/api/<ID>/shop/callback/iyzico` (farklıysa `IYZICO_CALLBACK_URL`); Application URL `https://cms.<alan-adı>` olmalı.
6. Sağlayıcı paneli:
   - Shopier: Entegrasyonlar > Modül yönetimi: API anahtarlarını al; `website_index` (varsayılan 1) için geri dönüş adresi `https://<pb-adresi>/api/<ID>/shop/callback/shopier`.
   - iyzico: Ayarlar > Firma Ayarları'ndan API ve güvenlik anahtarı; taksit seçenekleri panelden ya da `SHOP.iyzico.installments`. Başvuruda sitede mesafeli satış, iade ve gizlilik metinleri ile iletişim bilgisi görünür olmalı.
7. Yayından önce gerçek kartla küçük tutarlı bir sipariş ve iade dene.

## Bilinen sınırlar

- Shopier'in dış siteden ödeme API'si (`api_pay4`) resmi olarak belgelenmemiştir; alanlar ve imza WooCommerce/OpenCart modülleri ve topluluk SDK'larıyla aynıdır. Shopier değiştirirse yalnız `lib/shop-shopier.js` değişir.
- Ödeme dönüşü müşterinin tarayıcısı üzerinden gelir; müşteri sayfayı kapatırsa sipariş süre dolunca `expired` olur. Satıcı ödemeyi Shopier panelinde görürse siparişi panelden `paid` yapar (stok yeniden düşülür). Shopier REST API'si (`developer.shopier.com`, PAT) ile otomatik mutabakat sonraki adımdır.
- iyzico: alıcıdan T.C. kimlik no istenmez, iyzico'nun önerdiği yer tutucu (`11111111111`) gönderilir; fatura için gerekiyorsa mağaza ayrıca sorar. Sonuç her zaman iyzico'dan sorulur (CF-Retrieve) ve yanıt imzası doğrulanır; dönüşteki veriye güvenilmez. Dolandırıcılık kontrolünde reddedilen (`fraudStatus = -1`) ödeme alınmamış sayılır. iyzico webhook'u ile mutabakat sonraki adımdır.
- Fiyatlar TL; döviz ve kupon yok. İade parası sağlayıcının panelinden yapılır, panelde durum `refunded` yapılır.
- Kampanya izni (`marketing_consent`) siparişte saklanır; e-posta kampanyası gönderimi modülde yok (İYS'ye aktarım ve gönderim bir e-posta servisiyle).
