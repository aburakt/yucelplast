/// <reference path="../../pb/pb_data/types.d.ts" />

// ORTAK (core): template'ten gelir, sitede elle değiştirilmez.
// YALNIZ TESTLER: mağaza testleri (tests/shop*.test.ts) geçici PB'de bu dosyayı mağaza şemasından hemen önce çalıştırır.
// Sitenin mağazayla ilgisi olmayan kendi `products` koleksiyonu varsa (ör. ebsbilgisayar'ın Logo ürünleri) siler,
// böylece mağaza şeması kendi koleksiyonlarını açar ve testler sitenin şemasına değil mağaza modülüne bakar.
// Mağazası olan sitede (`products`'ta `kind` alanı var) dokunmaz. Hiçbir zaman pb/pb_migrations/'a kopyalanmaz.
migrate((app) => {
  let products
  try {
    products = app.findCollectionByNameOrId("products")
  } catch {
    return
  }
  if (products.fields.getByName("kind")) return
  app.delete(products)
}, () => {})
