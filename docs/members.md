# Üye alanı (MEMBERS)

İsteğe bağlı. Sitede giriş yapan hesapların (bayi, şube, üye) **kendi kayıtlarını** tarayıcıdan okuyup yazdığı bir alan
gerektiğinde açılır. Varsayılan standart değişmez: içerik koleksiyonlarına yalnız superuser yazar, ziyaretçi yalnız form gönderir.
Üye alanı bu iki kuralın yanına üçüncü bir sınıf ekler: **giriş yapmış hesaba bağlı** kayıtlar.

İlk kullanım: `aburakt/jci-turkiye-dijital` (şube hesapları, yıl teması, şube materyalleri, özel gün düzenlemeleri).

## Açma

1. Migration: bir `auth` koleksiyonu (ör. `branch_users`) ve üyelerin yazdığı koleksiyonlar. `users` adı kullanılmaz (test ölçer).
2. `pb/pb_hooks/site.js`:

   ```js
   MEMBERS: { auth: "branch_users", collections: ["year_themes", "branch_assets", "day_overrides"] },
   ```

3. Bu koleksiyonlar `CONTENT`'e ve `FORMS`'a yazılmaz: değişiklikleri siteyi yeniden yayınlatmaz (statik sitede görünmezler),
   tarayıcıdaki uygulama PB API'sinden okur.
4. `pbCsp()` PB kökenini `connect-src`'ye ekler (giriş ve kayıtlar tarayıcıdan).

## Kurallar (tests/core.test.ts ölçer)

- Hesap koleksiyonu `auth` tipindedir. `createRule` ve `deleteRule` `null`: hesabı yönetici (panel) açar ve kapatır,
  kendi kendine kayıt yoktur. `listRule`/`viewRule`/`updateRule` `null` ya da `@request.auth.id` içerir
  (ör. `@request.auth.id = id`: hesap yalnız kendini görür).
- Üye koleksiyonlarında beş kuralın her biri `null` ya da `@request.auth.id` içerir. Herkese açık (`""`) kural yoktur.
- Sahiplik kuralla yazılır, istemciye güvenilmez. Örnek (hesabın `branch` alanı):

  ```js
  const ACTIVE = '@request.auth.id != "" && @request.auth.collectionName = "branch_users" && @request.auth.active = true'
  listRule:   `${ACTIVE} && branch = @request.auth.branch`
  createRule: `${ACTIVE} && @request.body.branch = @request.auth.branch`
  updateRule: `${ACTIVE} && branch = @request.auth.branch && @request.body.branch:isset = false`
  ```

  `@request.auth.collectionName` şartı başka bir auth koleksiyonunun (ör. superuser) kuralı kazara geçmesini engeller.
- Hesap kendi kaydında yalnız zararsız alanları değiştirir; rol, sahiplik ve durum alanları `@request.body.<alan>:isset = false`
  ile kilitlenir.
- Dosya alanları korumalı değildir (PB dosya adresi tahmin edilemez ama gizli de değildir); kişisel veri içeren dosya için
  `protected: true` ve dosya token'ı kullanılır.

## Oturum

Giriş `POST /api/collections/<auth>/auth-with-password`. Token tarayıcıda saklanır (localStorage), süre PB ayarındadır.
Şifre sıfırlama ve OTP SMTP ister; SMTP yoksa şifreyi yönetici panelden değiştirir.
