/// <reference path="../pb_data/types.d.ts" />

/**
 * Burak onayı (2026-11-12): eski sitede olmayan metinler müşteri onayına kadar yayından kalkar.
 * - Ürün grubu metinleri ve özetleri eski sitedeki haline döner ("plastik" dahil); model açıklamaları boşalır.
 * - İmza Dosyası'na sonradan eklenen 4 model taslağa alınır, eski sitedeki "Deri İmza Dosyası" eklenir.
 * - KVKK ve Gizlilik sayfaları hukuk onayına kadar taslak.
 * Değer yalnız hâlâ tohumdaki (ya da önceki migration'daki) haliyse değişir; panelde yazılan ezilmez.
 * Boş PB'de (verify, yeni kurulum) settings kaydı yoktur, bir şey yapılmaz. Metinler site/src/data/content.json ile aynıdır.
 * Kaldırılan metinlerin listesi: proje dosyaları yucelplast/musteri-onayi-metinler.md.
 */
migrate((app) => {
  if (!app.findRecordsByFilter("settings", "1=1", "", 1, 0)[0]) return
  const ESKI = {
    "kutu-uretimi": {
      "body": [
        [
          "<p>Kozmetikten gıdaya, mücevherata promosyona kadar farklı sektörlerin kutu ihtiyacını sıvama tekniğiyle karşılıyoruz. Kutularımız 1-3 mm sert mukavvanın kuşe kağıt, fantazi kağıt, kumaş, cilt bezi, termo deri ya da suni deriyle kaplanmasıyla üretilir.</p><p>Ölçü, kaplama, baskı ve iç düzen (köpük, oluk, bölme) tamamen ürününüze göre tasarlanır.</p>"
        ],
        ""
      ],
      "summary": [
        [
          "Kapaklı, mıknatıslı, çekmeceli ve silindir kutular; markanıza özel ölçü ve kaplamayla."
        ],
        "Kapaklı Kutu, Mıknatıslı Kutu, Çekmeceli Kutu, Arşiv Kutusu, Magazinlik Kutu, Silindir Kutu ve Kitap Kutusu."
      ],
      "descs": [
        "Belge ve dosya saklamak için dayanıklı, etiket alanlı kutu.",
        "Dergi, katalog ve broşürleri dik tutan açık kutu.",
        "Kitap ve set ürünler için kapaklı kutu.",
        "Kızaklı çekmece yapısıyla takı, kalem ve aksesuar için.",
        "İçecek, parfüm ve hediye ürünleri için yuvarlak kutu."
      ]
    },
    "kapakli-kutu": {
      "body": [
        [
          "<p>Yücel Plast, yılların verdiği deneyimle, kapaklı kutu üretimindeki uzmanlığıyla müşterilerine kaliteli ve şık çözümler sunmaktadır. Her bir ürünümüz, titizlikle seçilmiş malzemeler ve detaylı işçilikle üretilerek, içeriğinizi korurken estetik bir görünüm sağlar.</p><p>Ürünlerimizin temel özelliklerinden biri, dayanıklı ve uzun ömürlü olmalarıdır. Seçtiğimiz malzemeler çevresel etkilere karşı dirençlidir; böylece içerisindeki eşyaları güvenle saklar ve uzun yıllar kullanım sağlar.</p><h2>Özellikler</h2><ul><li><strong>Dayanıklı malzeme:</strong> Kapaklı kutularımız uzun ömürlü kullanım için özel olarak seçilmiş yüksek kaliteli malzemelerden üretilir.</li><li><strong>Şık tasarım:</strong> Estetik açıdan dikkat çeken tasarımlarımız, ürünlerinizi sergilemek için mükemmel bir seçenektir.</li><li><strong>Fonksiyonellik:</strong> Kolay açılıp kapanabilen kapaklarıyla kullanımı pratik ve kullanıcı dostudur.</li><li><strong>Özelleştirilebilirlik:</strong> İhtiyacınıza uygun olarak farklı boyut ve renklerde üretilir.</li></ul><h2>Kullanım alanları</h2><ul><li><strong>Hediye kutuları:</strong> Özel günlerde sevdiklerinize hediye vermek için mükemmel bir seçenek.</li><li><strong>Ürün ambalajı:</strong> Ürünlerinizi güvenle saklamak ve göstermek için ideal bir ambalaj çözümü.</li><li><strong>Organizasyon kutuları:</strong> Ev ve ofis düzeninde küçük eşyaları düzenlemek için pratik bir çözüm.</li></ul>"
        ],
        "<p>Yücel Plast, yılların verdiği deneyimle, kapaklı kutu üretimindeki uzmanlığıyla müşterilerine kaliteli ve şık çözümler sunmaktadır. Her bir ürünümüz, titizlikle seçilmiş malzemeler ve detaylı işçilikle üretilerek, içeriğinizi korurken estetik bir görünüm sağlar.</p><p>Ürünlerimizin temel özelliklerinden biri, dayanıklı ve uzun ömürlü olmalarıdır. Seçtiğimiz malzemeler, çevresel etkilere karşı dirençli ve dayanıklıdır, böylece içerisindeki eşyaları güvenle saklarlar ve uzun yıllar boyunca kullanım sağlarlar.</p><h2>Teknik Özellikler</h2><p>Yücel Plast, kapaklı kutu üretimindeki uzmanlığıyla müşterilerine şıklık, dayanıklılık ve fonksiyonellik sunmaktadır. Her bir kutu, özenle seçilmiş malzemeler ve detaylı işçilikle üretilerek, içeriğinizi korurken zarafet ve pratik kullanım sunar.</p><h2>Özellikler</h2><ul><li><strong>Dayanıklı Malzeme:</strong> Kapaklı kutularımız, uzun ömürlü kullanım için özel olarak seçilmiş yüksek kaliteli malzemelerden üretilmiştir.</li><li><strong>Şık Tasarım:</strong> Estetik açıdan dikkat çeken tasarımlarımız, ürünlerinizi sergilemek için mükemmel bir seçenektir.</li><li><strong>Fonksiyonellik:</strong> Kolay açılıp kapanabilen kapaklarıyla kullanımı pratik ve kullanıcı dostudur.</li><li><strong>Özelleştirilebilirlik:</strong> Müşterilerimizin ihtiyaçlarına uygun olarak farklı boyutlarda ve renklerde özelleştirilebilir.</li></ul><h2>Kullanım Alanları</h2><ul><li><strong>Hediye Kutuları:</strong> Özel günlerde sevdiklerinize hediye vermek için mükemmel bir seçenek.</li><li><strong>Ürün Ambalajı:</strong> Ürünlerinizi güvenle saklamak ve göstermek için ideal bir ambalaj çözümü.</li><li><strong>Organizasyon Kutuları:</strong> Ev ve ofis düzeninde kullanılmak üzere küçük eşyaları düzenlemek için pratik bir çözüm.</li></ul>"
      ],
      "summary": [
        [
          "Ayrı kapaklı sıvama kutular: hediye, kozmetik ve kurumsal set ambalajları için."
        ],
        "Yücel Plast, yılların verdiği deneyimle, kapaklı kutu üretimindeki uzmanlığıyla müşterilerine kaliteli ve şık çözümler sunmaktadır."
      ],
      "descs": []
    },
    "miknatisli-kutu": {
      "body": [
        [
          "<p>Yücel Plast, yılların verdiği deneyimle, kutu üretimindeki uzmanlığıyla müşterilerine şıklık, dayanıklılık ve fonksiyonellik sunmaktadır. Her bir kutu, özenle seçilmiş malzemeler ve detaylı işçilikle üretilerek, içeriğinizi korurken zarafet ve pratik kullanım sunar.</p><p>Mıknatıslı kapak sistemi kutuya kolay açılış ve güvenli kapanış sağlar. İç köpük ya da karton yuvalar ürününüzün ölçüsüne göre kesilir; kalem, saat, elektronik cihaz ve kurumsal hediye setleri için idealdir.</p><p>Ürünlerimizin temel özelliklerinden biri, dayanıklı ve uzun ömürlü olmalarıdır. Seçtiğimiz malzemeler çevresel etkilere karşı dirençlidir; böylece içerisindeki eşyaları güvenle saklar ve uzun yıllar kullanım sağlar.</p><h2>Özellikler</h2><ul><li><strong>Dayanıklı malzeme:</strong> Mıknatıslı kutularımız uzun ömürlü kullanım için özel olarak seçilmiş yüksek kaliteli malzemelerden üretilir.</li><li><strong>Şık tasarım:</strong> Estetik açıdan dikkat çeken tasarımlarımız, ürünlerinizi sergilemek için mükemmel bir seçenektir.</li><li><strong>Fonksiyonellik:</strong> Mıknatıslı kapağı tek hareketle açılır, kendiliğinden kapanır.</li><li><strong>Özelleştirilebilirlik:</strong> İhtiyacınıza uygun olarak farklı boyut ve renklerde üretilir.</li></ul><h2>Kullanım alanları</h2><ul><li><strong>Hediye kutuları:</strong> Özel günlerde sevdiklerinize hediye vermek için mükemmel bir seçenek.</li><li><strong>Ürün ambalajı:</strong> Ürünlerinizi güvenle saklamak ve göstermek için ideal bir ambalaj çözümü.</li><li><strong>Organizasyon kutuları:</strong> Ev ve ofis düzeninde küçük eşyaları düzenlemek için pratik bir çözüm.</li></ul>"
        ],
        "<p>Yücel Plast, yılların verdiği deneyimle, kapaklı kutu üretimindeki uzmanlığıyla müşterilerine kaliteli ve şık çözümler sunmaktadır. Her bir ürünümüz, titizlikle seçilmiş malzemeler ve detaylı işçilikle üretilerek, içeriğinizi korurken estetik bir görünüm sağlar.</p><p>Ürünlerimizin temel özelliklerinden biri, dayanıklı ve uzun ömürlü olmalarıdır. Seçtiğimiz malzemeler, çevresel etkilere karşı dirençli ve dayanıklıdır, böylece içerisindeki eşyaları güvenle saklarlar ve uzun yıllar boyunca kullanım sağlarlar.</p><h2>Teknik Özellikler</h2><p>Yücel Plast, kapaklı kutu üretimindeki uzmanlığıyla müşterilerine şıklık, dayanıklılık ve fonksiyonellik sunmaktadır. Her bir kutu, özenle seçilmiş malzemeler ve detaylı işçilikle üretilerek, içeriğinizi korurken zarafet ve pratik kullanım sunar.</p><h2>Özellikler</h2><ul><li><strong>Dayanıklı Malzeme:</strong> Kapaklı kutularımız, uzun ömürlü kullanım için özel olarak seçilmiş yüksek kaliteli malzemelerden üretilmiştir.</li><li><strong>Şık Tasarım:</strong> Estetik açıdan dikkat çeken tasarımlarımız, ürünlerinizi sergilemek için mükemmel bir seçenektir.</li><li><strong>Fonksiyonellik:</strong> Kolay açılıp kapanabilen kapaklarıyla kullanımı pratik ve kullanıcı dostudur.</li><li><strong>Özelleştirilebilirlik:</strong> Müşterilerimizin ihtiyaçlarına uygun olarak farklı boyutlarda ve renklerde özelleştirilebilir.</li></ul><h2>Kullanım Alanları</h2><ul><li><strong>Hediye Kutuları:</strong> Özel günlerde sevdiklerinize hediye vermek için mükemmel bir seçenek.</li><li><strong>Ürün Ambalajı:</strong> Ürünlerinizi güvenle saklamak ve göstermek için ideal bir ambalaj çözümü.</li><li><strong>Organizasyon Kutuları:</strong> Ev ve ofis düzeninde kullanılmak üzere küçük eşyaları düzenlemek için pratik bir çözüm.</li></ul>"
      ],
      "summary": [
        [
          "Mıknatıslı kapaklı, iç köpüğü ürüne göre kesilen prestij kutuları."
        ],
        "Yücel Plast, yılların verdiği deneyimle, kapaklı kutu üretimindeki uzmanlığıyla müşterilerine kaliteli ve şık çözümler sunmaktadır."
      ],
      "descs": []
    },
    "belge-kabi": {
      "body": [
        [
          "<p>Yücel Plast, uzun yıllardır sektöründe kalitesiyle tanınan bir firma olarak öne çıkmaktadır. Ürün yelpazesinde yer alan Belge Kabı, sağlam ve dayanıklı yapısıyla dikkat çekmektedir.</p><p>Belge Kabı; imperteks çantalar, suni deri kongre ve evrak çantaları, körüklü dershane çantaları gibi ürünlerle birlikte kullanılabilecek şekilde tasarlanmıştır. En önemli özelliği, içindeki belgeleri düzenli ve güvenli bir şekilde saklamasıdır. Mekanizmalı klasör ve dosyalar, ajanda, bloknot ve kimlik kılıfları, ehliyet, ruhsat ve gözlük kılıfları gibi farklı belgeleri de kolayca barındırabilir.</p><p>Yücel Plast, sürekli gelişen teknolojiyi yakından takip eder. Belge Kabı gibi ürünlerinde de en son teknolojiyi ve kalite standartlarını kullanır. Sağlam malzeme ve özenli işçilikle üretilen Belge Kabı, uzun ömürlü kullanım ve kullanıcı memnuniyeti sağlar.</p><p>Belge Kabı; iş hayatında, ofis ortamlarında ve eğitim alanlarında belgeleri düzenli tutmak ve korumak için mükemmel bir çözümdür. Kurum logonuz yaldız, gofre ya da baskıyla kapağa uygulanır.</p>",
          "<p>Yücel Plast, uzun yıllardır sektöründe kalitesiyle tanınan bir firma olarak öne çıkmaktadır. Ürün yelpazesinde yer alan Belge Kabı, sağlam ve dayanıklı yapısıyla dikkat çekmektedir.</p><p>Belge Kabı; imperteks çantalar, suni deri kongre ve evrak çantaları, körüklü dershane çantaları gibi ürünlerle birlikte kullanılabilecek şekilde tasarlanmıştır. En önemli özelliği, içindeki belgeleri düzenli ve güvenli bir şekilde saklamasıdır. Mekanizmalı klasör ve dosyalar, ajanda, bloknot ve kimlik kılıfları, ehliyet, ruhsat ve gözlük kılıfları gibi farklı belgeleri de kolayca barındırabilir.</p><p>Yücel Plast, sürekli gelişen teknolojiyi yakından takip eder. Belge Kabı gibi ürünlerinde de en son teknolojiyi ve kalite standartlarını kullanır. Sağlam malzeme ve özenli işçilikle üretilen Belge Kabı, uzun ömürlü kullanım ve kullanıcı memnuniyeti sağlar.</p><p>Belge Kabı; iş hayatında, ofis ortamlarında ve eğitim alanlarında belgeleri düzenli tutmak ve korumak için mükemmel bir çözümdür. Yücel Plast’ın tecrübesi ve kalitesiyle üretilen Belge Kabı, güvenilirliği ve işlevselliğiyle kullanıcılarına kolaylık ve konfor sağlamaktadır. Kurum logonuz yaldız, gofre ya da baskıyla kapağa uygulanır.</p>"
        ],
        "<p>Yücel Plast, uzun yıllardır plastik sektöründe kalitesiyle tanınan bir firma olarak öne çıkmaktadır. Ürün yelpazesinde yer alan Belge Kabı, sağlam ve dayanıklı yapısıyla dikkat çekmektedir.</p><p>Belge Kabı, İmperteks Çantalar, Sunideri Kongre-Evrak Çantaları ve Körüklü Dersane Çantaları gibi çeşitli ürünlerle birlikte kullanılabilecek şekilde tasarlanmıştır. Bu kabın en önemli özelliklerinden biri, içindeki belgeleri düzenli ve güvenli bir şekilde saklamak için ideal olmasıdır. Ayrıca, Mekanizmalı Klasörler-Dosyalar, Ajanda-Bloknot-Kimlik Kılıfları ve Ehliyet-Ruhsat-Gözlük Kılıfları gibi farklı belgeleri de kolayca içinde barındırabilir.</p><p>Yücel Plast, sürekli olarak gelişen teknolojiyi yakından takip eden bir yapıya sahiptir. Bu sayede Belge Kabı gibi ürünlerinde de en son teknolojiyi ve kalite standartlarını kullanarak müşterilerine yüksek kaliteli ürünler sunmaktadır. Sağlam malzeme kullanımı ve özenli işçilik ile üretilen Belge Kabı, uzun ömürlü kullanım ve kullanıcı memnuniyeti sağlamaktadır.</p><p>Belge Kabı, iş hayatında, ofis ortamlarında ve eğitim alanlarında belgeleri düzenli tutmak ve korumak için mükemmel bir çözüm sunmaktadır. Yücel Plast’ın tecrübesi ve kalitesiyle üretilen Belge Kabı, güvenilirliği ve işlevselliğiyle kullanıcılarına kolaylık ve konfor sağlamaktadır.</p>"
      ],
      "summary": [
        [
          "Diploma, sertifika ve resmi belgeler için kurumsal belge kapları."
        ],
        "Yücel Plast, uzun yıllardır plastik sektöründe kalitesiyle tanınan bir firma olarak öne çıkmaktadır."
      ],
      "descs": [
        "Hakiki ya da suni deri, prestijli sunum için.",
        "Suni deri ya da termo kaplama, logolu kapak."
      ]
    },
    "imza-dosyasi": {
      "body": [
        [
          "<p>Yücel Plast, 1977 yılından bu yana kaliteli ürünleriyle öne çıkan bir firma olarak faaliyet göstermektedir. Kurumsal kimliğinizi yansıtan profesyonel imza dosyalarımız; iş görüşmeleri, resmi yazışmalar ve diğer kurumsal iletişimlerde kullanılarak kurumunuzun güvenilirliğini ve profesyonelliğini temsil eder.</p><p>Yaprak sayısı, kaplama malzemesi (cilt bezi, termo deri, suni deri, PVC), köşe aksesuarı ve kapak etiketi isteğe göre belirlenir.</p>",
          "<p>Yücel Plast, 1977 yılından bu yana kaliteli ürünleriyle öne çıkan bir firma olarak faaliyet göstermektedir. Şirketimiz, müşterilerine sağladığı yüksek kaliteli ürünlerin yanı sıra, kurumsal kimliğimizi yansıtan profesyonel imza dosyalarıyla da dikkat çekmektedir. Kurumsal kimliğinizi yansıtan profesyonel imza dosyalarımız; iş görüşmeleri, resmi yazışmalar ve diğer kurumsal iletişimlerde kullanılarak kurumunuzun güvenilirliğini ve profesyonelliğini temsil eder.</p><p>Yaprak sayısı, kaplama malzemesi (cilt bezi, termo deri, suni deri, PVC), köşe aksesuarı ve kapak etiketi isteğe göre belirlenir.</p>"
        ],
        "<p>Yücel Plast, 1977 yılından bu yana kaliteli plastik ürünleriyle öne çıkan bir firma olarak faaliyet göstermektedir. Şirketimiz, müşterilerine sağladığı yüksek kaliteli ürünlerin yanı sıra, kurumsal kimliğimizi yansıtan profesyonel imza dosyalarıyla da dikkat çekmektedir. İmza dosyamız, iş görüşmeleri, resmi yazışmalar ve diğer kurumsal iletişimlerde kullanılarak şirketimizin güvenilirliğini ve profesyonelliğini temsil etmektedir.</p>"
      ],
      "summary": [
        [
          "10 ve 18 yapraklı, köşe aksesuarlı kurumsal imza dosyaları."
        ],
        "Yücel Plast, 1977 yılından bu yana kaliteli plastik ürünleriyle öne çıkan bir firma olarak faaliyet göstermektedir."
      ],
      "descs": [
        "Hafif, silinebilir PVC kaplama, canlı renk seçenekleri.",
        "Körüklü iç yapı, kalın evrak için geniş hacim.",
        "Suni deri kaplama, metal köşe aksesuarı, etiket cebi.",
        "Süet iç yüzey, şık ve yumuşak dokunuş."
      ]
    },
    "menu-kabi-adisyon": {
      "body": [
        [
          "<p>Restoran, kafe ve oteller için ürettiğimiz menü kapları ve adisyon dosyaları, yoğun kullanıma dayanıklı termo deri ve suni deri kaplamalarla üretilir. Logonuz yaldız ya da gofreyle uygulanır; vidalı, halkalı ya da cepli iç yapı seçenekleri vardır.</p>"
        ],
        ""
      ],
      "summary": [
        [
          "Restoran, kafe ve oteller için menü kapları ve adisyon dosyaları."
        ],
        "Termo ve Sunideri Menü Kabı."
      ],
      "descs": [
        "Logolu kapak, dikişli kenar.",
        "Vidalı ya da cepli iç yapı, köşe aksesuarı."
      ]
    },
    "kartela": {
      "body": [
        [
          "<p>Yücel Plast Kartela, müşterilerin ihtiyaçlarına uygun olarak farklı renk ve malzeme seçenekleri sunar. Bu sayede müşteriler, ürünlerin farklı renklerini ve dokularını inceleyerek kendilerine en uygun olanı seçme imkânına sahip olurlar. Kartela, ürünler hakkında daha iyi bir fikir edinmeyi sağlar ve doğru kararı vermeye yardımcı olur.</p><p>Yücel Plast’ın kalitesi ve geniş ürün yelpazesiyle desteklenen Kartela, müşterilerimize daha iyi bir alışveriş deneyimi sunmayı amaçlar. Müşteri memnuniyetini ön planda tutan Yücel Plast, Kartela ürünüyle de bu prensibe bağlı kalarak müşterilerinin beklentilerini karşılamayı hedefler.</p>"
        ],
        "<p>Yücel Plast Kartela, müşterilerin ihtiyaçlarına uygun olarak farklı renk ve malzeme seçenekleri sunar. Bu sayede müşteriler, ürünlerin farklı renklerini ve dokularını inceleyerek kendilerine en uygun olanı seçme imkanına sahip olurlar. Kartela, müşterilerin ürünler hakkında daha iyi bir fikir edinmelerini sağlar ve doğru kararı vermelerine yardımcı olur.</p><p>Yücel Plast’ın kalitesi ve geniş ürün yelpazesiyle desteklenen Kartela, müşterilerimize daha iyi bir alışveriş deneyimi sunmayı amaçlamaktadır. Müşteri memnuniyetini ön planda tutan Yücel Plast, Kartela ürünüyle de bu prensibe bağlı kalarak müşterilerinin beklentilerini karşılamayı hedeflemektedir.</p>"
      ],
      "summary": [
        [
          "Renk ve malzeme seçeneklerinizi müşterinize sunmanız için kartela."
        ],
        "Yücel Plast Kartela, müşterilerin ihtiyaçlarına uygun olarak farklı renk ve malzeme seçenekleri sunar."
      ],
      "descs": []
    },
    "ruhsat-kabi": {
      "body": [
        [
          "<p>Yücel Plast’ın ürettiği Ruhsat Kabı, önemli belgeleri düzenli ve güvenli bir şekilde saklamak için ideal bir çözümdür. Sağlam malzeme ve özenli işçilikle üretilen bu ürünle müşterilerimize güvenilir bir çözüm sunuyoruz.</p><p>Ruhsat Kabı; sürücü ruhsatı, araç belgeleri ve trafik sigortası gibi önemli evrakları saklamak için kullanılır. Şeffaf tasarımıyla belgelerin kolayca görünmesini sağlar ve düzenli dosyalanmasına yardımcı olur. Dayanıklı malzemeden üretildiği için uzun ömürlüdür.</p><p>Yücel Plast Ruhsat Kabı; araç sahipleri, sürücüler ve işletmeler için pratik bir çözümdür. Bayi ve kurum logonuzla promosyon ürünü olarak da tercih edilir.</p>",
          "<p>Yücel Plast’ın ürettiği Ruhsat Kabı, önemli belgeleri düzenli ve güvenli bir şekilde saklamak için ideal bir çözümdür. Sağlam malzeme ve özenli işçilikle üretilen bu ürünle müşterilerimize güvenilir bir çözüm sunuyoruz.</p><p>Ruhsat Kabı; sürücü ruhsatı, araç belgeleri ve trafik sigortası gibi önemli evrakları saklamak için kullanılır. Şeffaf tasarımıyla belgelerin kolayca görünmesini sağlar ve düzenli dosyalanmasına yardımcı olur. Dayanıklı malzemeden üretildiği için uzun ömürlüdür.</p><p>Yücel Plast Ruhsat Kabı; araç sahipleri, sürücüler ve işletmeler için pratik bir çözümdür. Belgelerinizi düzenli tutarak gerektiğinde kolayca erişebilir ve güvende tutabilirsiniz. Yücel Plast’ın kalite ve güvenilirliğiyle birleşen Ruhsat Kabı, müşterilerine konfor ve kullanışlılık sağlamaktadır. Bayi ve kurum logonuzla promosyon ürünü olarak da tercih edilir.</p>"
        ],
        "<p>Yücel Plast’ın ürettiği Ruhsat Kabı, önemli belgeleri düzenli ve güvenli bir şekilde saklamak için ideal bir çözümdür. Şirketimiz, sağlam malzeme kullanımı ve özenli işçilikle üretilen bu ürünüyle müşterilerine güvenilir bir çözüm sunmaktadır.</p><p>Ruhsat Kabı, sürücü ruhsatı, araç belgeleri, trafik sigortası gibi önemli evrakları saklamak için kullanılabilir. Şeffaf tasarımıyla belgelerin kolayca görünmesini sağlar ve düzenli bir şekilde dosyalanmasına yardımcı olur. Ayrıca, dayanıklı plastik malzemeden üretilmiş olması sayesinde uzun ömürlü kullanım sağlar.</p><p>Yücel Plast Ruhsat Kabı, araç sahipleri, sürücüler ve işletmeler için pratik bir çözüm sunar. Belgelerinizi düzenli tutarak gerektiğinde kolayca erişebilir ve güvende tutabilirsiniz. Yücel Plast’ın kalite ve güvenilirliğiyle birleşen Ruhsat Kabı, müşterilerine konfor ve kullanışlılık sağlamaktadır.</p>"
      ],
      "summary": [
        [
          "Araç ruhsatı, sigorta ve önemli evraklar için logolu kaplar."
        ],
        "Yücel Plast’ın ürettiği Ruhsat Kabı, önemli belgeleri düzenli ve güvenli bir şekilde saklamak için ideal bir çözümdür."
      ],
      "descs": []
    },
    "bloknot-organizer": {
      "body": [
        [
          "<p>Bloknot Organizer, çeşitli boyutlardaki bloknotları ve kalemleri bir arada tutmak için idealdir. İş toplantıları, seminerler veya günlük not alma gibi durumlarda kullanılabilir. Şeffaf cebiyle ekstra dokümanları da saklayabilir ve her şeyi tek bir yerde tutabilirsiniz.</p><p>Yücel Plast Bloknot Organizer, iş hayatınızı kolaylaştırmak için tasarlanmıştır. Notlarınızı düzenli bir şekilde tutarak verimliliğinizi artırabilir ve önemli bilgilerinizi kaybetmeden organize edebilirsiniz. Günlük kullanıma uygun pratik boyutuyla da dikkat çeker.</p><p>Yücel Plast’ın kalite ve işlevselliği bir araya getiren Bloknot Organizer, müşterilerine kullanışlılık ve konfor sağlar.</p>"
        ],
        "<p>Bloknot Organize, çeşitli boyutlardaki bloknotları ve kalemleri bir arada tutmak için idealdir. İş toplantıları, seminerler veya günlük not alma gibi durumlarda kullanılabilir. Şeffaf cebiyle ekstra dokümanları da saklayabilir ve her şeyi tek bir yerde tutabilirsiniz.</p><p>Yücel Plast Bloknot Organize, iş hayatınızı kolaylaştırmak için tasarlanmıştır. Notlarınızı düzenli bir şekilde tutarak verimliliğinizi artırabilir ve önemli bilgilerinizi kaybetmeden organize edebilirsiniz. Günlük kullanıma uygun pratik boyutuyla da dikkat çeker.</p><p>Yücel Plast’ın kalite ve işlevselliği bir araya getiren Bloknot Organize, müşterilerine kullanışlılık ve konfor sağlamaktadır.</p>"
      ],
      "summary": [
        [
          "Toplantı ve seminerler için bloknotluk ve masa organizerleri."
        ],
        "Bloknot Organize, çeşitli boyutlardaki bloknotları ve kalemleri bir arada tutmak için idealdir."
      ],
      "descs": [
        "Hafif PVC kaplama, renk seçenekli.",
        "Logolu kapak, kalemlik.",
        "Not kağıdı ve kalem için masaüstü kutu."
      ]
    },
    "yillik": {
      "body": [
        [
          "<p>Yücel Plast’ın ürettiği Yıllık, yıl içindeki önemli tarihleri takip etmenizi sağlayan ve not almanıza olanak tanıyan kullanışlı bir üründür. Kaliteli malzemeler ve şık tasarımıyla müşterilerimize güvenilir bir çözüm sunuyoruz.</p><p>Yıllık, tüm yıl boyunca günlük randevularınızı, toplantılarınızı, doğum günlerini ve diğer önemli etkinlikleri organize etmenize yardımcı olur. Not almak için geniş alan sunar ve kişisel bilgilerinizi düzenli bir şekilde saklamanıza olanak tanır.</p><p>Yücel Plast Yıllık, iş ve özel yaşamınızı organize etmek için ideal bir araçtır. Hafif ve taşınabilir olmasıyla dikkat çeker; her zaman yanınızda taşıyabileceğiniz pratik bir çözümdür.</p>",
          "<p>Yücel Plast’ın ürettiği Yıllık, yıl içindeki önemli tarihleri takip etmenizi sağlayan ve not almanıza olanak tanıyan kullanışlı bir üründür. Kaliteli malzemeler ve şık tasarımıyla müşterilerimize güvenilir bir çözüm sunuyoruz.</p><p>Yıllık, tüm yıl boyunca günlük randevularınızı, toplantılarınızı, doğum günlerini ve diğer önemli etkinlikleri organize etmenize yardımcı olur. Not almak için geniş alan sunar ve kişisel bilgilerinizi düzenli bir şekilde saklamanıza olanak tanır.</p><p>Yücel Plast Yıllık, iş ve özel yaşamınızı organize etmek için ideal bir araçtır. Hafif ve taşınabilir olmasıyla dikkat çeker; her zaman yanınızda taşıyabileceğiniz pratik bir çözümdür.</p><p>Yücel Plast’ın kalite ve işlevselliği bir araya getiren Yıllık, müşterilerine konfor ve kullanışlılık sağlamaktadır.</p>"
        ],
        "<p>Yücel Plast’ın ürettiği Yıllık, yıl içindeki önemli tarihleri takip etmenizi sağlayan ve not almanıza olanak tanıyan kullanışlı bir üründür. Şirketimiz, kaliteli malzemeler ve şık tasarımıyla müşterilerine güvenilir bir çözüm sunmaktadır.</p><p>Yıllık, tüm yıl boyunca günlük randevularınızı, toplantılarınızı, doğum günlerini ve diğer önemli etkinlikleri organize etmenize yardımcı olur. Ayrıca, not almak için geniş alan sunar ve kişisel bilgilerinizi düzenli bir şekilde saklamanıza olanak tanır.</p><p>Yücel Plast Yıllık, iş ve özel yaşamınızı organize etmek için ideal bir araçtır. Hafif ve taşınabilir olmasıyla da dikkat çeker ve her zaman yanınızda taşıyabileceğiniz pratik bir çözümdür.</p><p>Yücel Plast’ın kalite ve işlevselliği bir araya getiren Yıllık, müşterilerine konfor ve kullanışlılık sağlamaktadır.</p>"
      ],
      "summary": [
        [
          "Termo ve suni deri kapaklı kurumsal yıllıklar."
        ],
        "Yücel Plast’ın ürettiği Yıllık, yıl içindeki önemli tarihleri takip etmenizi sağlayan ve not almanıza olanak tanıyan kullanışlı bir üründür."
      ],
      "descs": []
    },
    "ajanda-kapagi": {
      "body": [
        [
          "<p>Ajandalarınızı özel ve şık bir görünüme kavuşturan Yücel Plast Ajanda Kapağı, iş ve günlük yaşamınızı düzenli tutmanıza yardımcı olur. Kaliteli malzemelerle üretilen kapağın dayanıklı yapısı, ajandanızı dış etkenlere karşı korur ve uzun süre kullanım sağlar.</p><p>Ajanda Kapağı, farklı renk ve desen seçenekleriyle kişisel tarzınıza uyum sağlar. Hem profesyonel bir izlenim bırakır hem de tarzınızı yansıtmanıza imkân tanır. Şık ve kullanışlı tasarımıyla ajandanızı tamamlayarak işlevselliği ve estetiği bir arada sunar.</p><p>Yücel Plast’ın özenli işçiliği ve kaliteli malzemeleriyle üretilen Ajanda Kapağı, iş ve kişisel yaşamında düzen ve şıklık arayanlar için ideal bir tercihtir. Ajandalarınızı koruyarak onları daha uzun ömürlü hale getiren bu kapağın kullanımı, günlük yaşantınızı daha pratik hale getirecek.</p>",
          "<p>Ajandalarınızı özel ve şık bir görünüme kavuşturan Yücel Plast Ajanda Kapağı, iş ve günlük yaşamınızı düzenli tutmanıza yardımcı olur. Kaliteli malzemelerle üretilen kapağın dayanıklı yapısı, ajandanızı dış etkenlere karşı korur ve uzun süre kullanım sağlar.</p><p>Ajanda Kapağı, farklı renk ve desen seçenekleriyle kişisel tarzınıza uyum sağlar. Hem profesyonel bir izlenim bırakır hem de tarzınızı yansıtmanıza imkân tanır. Şık ve kullanışlı tasarımıyla ajandanızı tamamlayarak işlevselliği ve estetiği bir arada sunar.</p><p>Yücel Plast’ın özenli işçiliği ve kaliteli malzemeleriyle üretilen Ajanda Kapağı, iş ve kişisel yaşamında düzen ve şıklık arayanlar için ideal bir tercihtir.</p>"
        ],
        "<p>Ajandalarınızı özel ve şık bir görünüme kavuşturan Yücel Plast Ajanda Kapağı, iş ve günlük yaşamınızı düzenli tutmanıza yardımcı olur. Kaliteli malzemelerle üretilmiş olan bu kapağın dayanıklı yapısı, ajandanızı dış etkenlere karşı korur ve uzun süre kullanım sağlar.</p><p>Ajanda Kapağı, farklı renk ve desen seçenekleriyle kişisel tarzınıza uyum sağlar. Hem profesyonel bir izlenim bırakırken hem de tarzınızı yansıtmanıza imkan tanır. Şık ve kullanışlı tasarımıyla ajandanızı tamamlayarak işlevselliği ve estetiği bir arada sunar.</p><p>Yücel Plast’ın özenli işçiliği ve kaliteli malzemeleriyle üretilen Ajanda Kapağı, iş ve kişisel yaşamınızda düzen ve şıklık arayanlar için ideal bir tercihtir. Ajandalarınızı koruyarak onları daha uzun ömürlü hale getiren bu kapağın kullanımı, günlük yaşantınızı daha pratik hale getirecek.</p>"
      ],
      "summary": [
        [
          "Ajandalarınız için logolu, dayanıklı kapaklar."
        ],
        "Ajandalarınızı özel ve şık bir görünüme kavuşturan Yücel Plast Ajanda Kapağı, iş ve günlük yaşamınızı düzenli tutmanıza yardımcı olur."
      ],
      "descs": []
    },
    "klasor": {
      "body": [
        [
          "<p>Yücel Plast’ın kaliteli ve dayanıklı malzemelerden ürettiği Klasör, belgelerinizi düzenli bir şekilde saklayarak işlerinizi kolaylaştırır. Şık tasarımıyla dikkat çeken bu klasör, profesyonel bir görünüm sunar ve dosyalarınızı güvenle korur.</p><p>Klasör, farklı boyut ve renk seçenekleriyle tercihinize uyum sağlar. İş yerinde veya okulda kullanabileceğiniz pratik boyutlarıyla önemli belgelerinizi organize etmenizi sağlar. Şeffaf cepleri ve iç bölümleriyle ekstra dokümanları ve küçük malzemeleri de düzenli saklayabilirsiniz.</p><p>Yücel Plast Klasör, iş yaşamında düzen ve organizasyon arayanlar için ideal bir tercihtir. Belgelerinizi kolayca bulabilmeniz ve dosyalarınızı güvenle saklayabilmeniz için tasarlanmıştır. Yüksek kaliteli malzeme ve özenli işçilikle uzun süre kullanabileceğiniz bir üründür.</p>",
          "<p>Yücel Plast’ın kaliteli ve dayanıklı malzemelerden ürettiği Klasör, belgelerinizi düzenli bir şekilde saklayarak işlerinizi kolaylaştırır. Şık tasarımıyla dikkat çeken bu klasör, profesyonel bir görünüm sunar ve dosyalarınızı güvenle korur.</p><p>Klasör, farklı boyut ve renk seçenekleriyle tercihinize uyum sağlar. İş yerinde veya okulda kullanabileceğiniz pratik boyutlarıyla önemli belgelerinizi organize etmenizi sağlar. Şeffaf cepleri ve iç bölümleriyle ekstra dokümanları ve küçük malzemeleri de düzenli saklayabilirsiniz.</p><p>Yücel Plast Klasör, iş yaşamında düzen ve organizasyon arayanlar için ideal bir tercihtir. Yüksek kaliteli malzeme ve özenli işçilikle uzun süre kullanabileceğiniz bir üründür.</p>"
        ],
        "<p>Yücel Plast’ın kaliteli ve dayanıklı malzemelerden ürettiği Klasör, belgelerinizi düzenli bir şekilde saklayarak işlerinizi kolaylaştırır. Şık tasarımıyla da dikkat çeken bu klasör, profesyonel bir görünüm sunar ve dosyalarınızı güvenle korur.</p><p>Klasör, farklı boyut ve renk seçenekleriyle kişisel tercihinize uyum sağlar. İş yerinde veya okulda kullanabileceğiniz pratik boyutlarıyla önemli belgelerinizi organize etmenizi sağlar. Şeffaf cepleri ve iç bölümleriyle de ekstra dokümanları ve küçük malzemeleri düzenli bir şekilde saklayabilirsiniz.</p><p>Yücel Plast Klasör, iş yaşamınızda düzen ve organizasyon arayanlar için ideal bir tercihtir. Belgelerinizi kolayca bulabilmeniz ve dosyalarınızı güvenle saklayabilmeniz için tasarlanmıştır. Yüksek kaliteli malzeme kullanımı ve özenli işçiliğiyle uzun süre kullanabileceğiniz bir üründür.</p>"
      ],
      "summary": [
        [
          "Mekanizmalı, sıvama ve PVC klasörler."
        ],
        "Yücel Plast’ın kaliteli ve dayanıklı malzemelerden ürettiği Klasör, belgelerinizi düzenli bir şekilde saklayarak işlerinizi kolaylaştırır."
      ],
      "descs": [
        "Halka mekanizmalı, logolu kapak."
      ]
    },
    "canta": {
      "body": [
        [
          "<p>Yücel Plast’ın ürettiği çanta koleksiyonu, şıklığı ve işlevselliği bir araya getirerek geniş bir seçenek sunar. Her ihtiyaca uygun çeşitler arasında seçim yapabileceğiniz bu koleksiyon, kaliteli malzeme ve özenli işçilikle üretilir.</p><p>Çanta koleksiyonu, günlük kullanımdan kongre, seminer ve özel etkinliklere kadar geniş bir yelpazede kullanıma uygun çeşitler sunar. Dayanıklı yapıları ve şık tasarımlarıyla dikkat çeker.</p><p>Geniş iç bölmeleri, fermuarlı cepleri ve ergonomik tasarımlarıyla günlük yaşamı kolaylaştırır. Kurum logonuzla üretilir.</p>",
          "<p>Yücel Plast’ın ürettiği çanta koleksiyonu, şıklığı ve işlevselliği bir araya getirerek geniş bir seçenek sunar. Her ihtiyaca uygun çeşitler arasında seçim yapabileceğiniz bu koleksiyon, kaliteli malzeme ve özenli işçilikle üretilir.</p><p>Çanta koleksiyonu, günlük kullanımdan kongre, seminer ve özel etkinliklere kadar geniş bir yelpazede kullanıma uygun çeşitler sunar. Spor çantaları, iş çantaları, seyahat çantaları ve daha fazlasıyla her tarza ve ihtiyaca hitap eder. Dayanıklı yapıları ve şık tasarımlarıyla dikkat çeker.</p><p>Yücel Plast Çanta koleksiyonu, kullanıcılarına konfor ve kullanışlılık sağlarken aynı zamanda tarzlarını da yansıtmalarına imkan tanır. Geniş iç bölmeleri, fermuarlı cepleri ve ergonomik tasarımlarıyla günlük yaşamı kolaylaştırır. Kurum logonuzla üretilir.</p><p>Yücel Plast’ın çanta koleksiyonu, kalite ve şıklığı birleştirerek kullanıcılarına güvenilir ve fonksiyonel bir çözüm sunar.</p>"
        ],
        "<p>Yücel Plast’ın ürettiği çanta koleksiyonu, şıklığı ve işlevselliği bir araya getirerek kullanıcılarına geniş bir seçenek sunar. Her ihtiyaca uygun çeşitler arasında seçim yapabileceğiniz bu koleksiyon, kaliteli malzeme ve özenli işçilikle üretilmiştir.</p><p>Çanta koleksiyonu, günlük kullanımdan özel etkinliklere kadar geniş bir yelpazede kullanıma uygun çeşitler sunar. Spor çantaları, iş çantaları, seyahat çantaları ve daha fazlasıyla her tarza ve ihtiyaca hitap eder. Dayanıklı yapıları ve şık tasarımlarıyla da dikkat çekerler.</p><p>Yücel Plast Çanta koleksiyonu, kullanıcılarına konfor ve kullanışlılık sağlarken aynı zamanda tarzlarını da yansıtmalarına imkan tanır. Geniş iç bölmeleri, fermuarlı cepleri ve ergonomik tasarımlarıyla günlük yaşamı kolaylaştırır ve organizasyonu artırır.</p><p>Yücel Plast’ın çanta koleksiyonu, kalite ve şıklığı birleştirerek kullanıcılarına güvenilir ve fonksiyonel bir çözüm sunar.</p>"
      ],
      "summary": [
        [
          "Kongre, evrak ve promosyon çantaları."
        ],
        "Yücel Plast’ın ürettiği çanta koleksiyonu, şıklığı ve işlevselliği bir araya getirerek kullanıcılarına geniş bir seçenek sunar."
      ],
      "descs": []
    }
  }

  for (const slug of Object.keys(ESKI)) {
    const c = app.findRecordsByFilter("categories", "slug = {:slug}", "", 1, 0, { slug })[0]
    if (!c) continue
    const e = ESKI[slug]
    let changed = false
    for (const f of ["body", "summary"]) {
      if (e[f][0].indexOf(c.getString(f)) >= 0 && c.getString(f) !== e[f][1]) {
        c.set(f, e[f][1])
        changed = true
      }
    }
    if (changed) app.save(c)
    for (const p of app.findRecordsByFilter("products", "category = {:c}", "", 0, 0, { c: c.id })) {
      if (p.getString("description") && e.descs.indexOf(p.getString("description")) >= 0) {
        p.set("description", "")
        app.save(p)
      }
    }
  }

  const imza = app.findRecordsByFilter("categories", "slug = 'imza-dosyasi'", "", 1, 0)[0]
  if (imza) {
    const yeni = ["10 Yaprak Suni Deri İmza Dosyası", "18 Yaprak İçten Körüklü İmza Dosyası", "İçi Süet İmza Dosyası", "PVC İmza Dosyası"]
    let foto = null
    for (const title of yeni) {
      const p = app.findRecordsByFilter("products", "category = {:c} && title = {:t}", "", 1, 0, { c: imza.id, t: title })[0]
      if (!p) continue
      if (title === yeni[0] && p.getString("image")) foto = p
      if (p.getBool("published")) {
        p.set("published", false)
        app.save(p)
      }
    }
    if (!app.findRecordsByFilter("products", "category = {:c} && title = 'Deri İmza Dosyası'", "", 1, 0, { c: imza.id })[0]) {
      const p = new Record(app.findCollectionByNameOrId("products"))
      p.set("title", "Deri İmza Dosyası")
      p.set("category", imza.id)
      p.set("description", "")
      p.set("position", 20)
      p.set("published", true)
      if (foto) {
        try {
          p.set("image", $filesystem.fileFromPath(app.dataDir() + "/storage/" + foto.collection().id + "/" + foto.id + "/" + foto.getString("image")))
        } catch (_) {
          // görsel kopyalanamazsa panelden eklenir
        }
      }
      app.save(p)
    }
  }

  for (const slug of ["kvkk-aydinlatma-metni", "gizlilik-politikasi"]) {
    const page = app.findRecordsByFilter("pages", "slug = {:slug}", "", 1, 0, { slug })[0]
    if (page && page.getBool("published")) {
      page.set("published", false)
      app.save(page)
    }
  }
}, () => {})
