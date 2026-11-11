# Sunucu ve yayın: Yücel Plast

`scripts/new-site.ts` üretti; değerler değişirse `bun run new-site -- --force …` ile yeniden üretin. Diğer sitelerle aynı düzen.

| | |
|---|---|
| ID (site.js) | `yucelplast` |
| Site | https://www.yucelplast.com |
| PB (Caddy) | https://cms.yucelplast.com → `127.0.0.1:8103` |
| VPS | `178.105.148.70`, `/opt/pb-yucelplast`, `pb-yucelplast.service` (MemoryMax=512M, CPUQuota=50%) |
| Panel | https://cms.yucelplast.com/_/ (müşteri kısıtlı superuser, guard.js) |
| Repo | `aburakt/yucelplast` |
| Elle yayın | `POST /api/yucelplast/deploy` (superuser) |

Dosyalar: `pb-yucelplast.service` (systemd unit), `Caddyfile.snippet` (sunucudaki mevcut bloklarla karşılaştırın), `env.example` (`/opt/pb-yucelplast/.env` şablonu; sır yazılmaz).

## Kurulum listesi

1. GitHub: konu etiketi ve CORE_SYNC_TOKEN
   Token: fine-grained PAT (template ve bu repo için Contents, Pull requests, Workflows: read/write); Infisical'dan alınır. Satır zsh içindir. PB_URL değişkeni haftalık sapma kontrolü (drift) içindir.
   ```sh
   gh repo edit aburakt/yucelplast --add-topic astro-pb
   read -rs "TOKEN?Token: " && printf %s "$TOKEN" | gh secret set CORE_SYNC_TOKEN -R aburakt/yucelplast; unset TOKEN
   gh variable set PB_URL -R aburakt/yucelplast -b https://cms.yucelplast.com
   ```

2. DNS: cms.yucelplast.com A kaydı → 178.105.148.70
   Proxy durumu diğer cms.* kayıtlarıyla aynı olsun. Caddy sertifikayı ilk istekte alır; kayıt yayılmadan Caddy adımına geçmeyin.
   Sonuç 178.105.148.70 olmalı.
   ```sh
   dig +short cms.yucelplast.com
   ```

3. PocketBase: /opt/pb-yucelplast ve pb-yucelplast.service (port 8103)
   Port boş mu (çıktı boş olmalı), mimari amd64 mi kontrol edin; sonra binary (PB_VERSION 0.40.4, sha256 doğrulamalı), migration ve hook'lar, .env ve unit.
   ```sh
   ssh root@178.105.148.70 'ss -ltnp | grep ":8103 "; uname -m'
   ssh root@178.105.148.70 'set -e; mkdir -p /opt/pb-yucelplast && cd /opt/pb-yucelplast && B=https://github.com/pocketbase/pocketbase/releases/download/v0.40.4 Z=pocketbase_0.40.4_linux_amd64.zip && curl -fsSLO "$B/$Z" && curl -fsSL "$B/checksums.txt" | grep " $Z$" | sha256sum -c - && unzip -o "$Z" pocketbase && rm "$Z" && ./pocketbase --version'
   rsync -a --delete pb/pb_migrations pb/pb_hooks root@178.105.148.70:/opt/pb-yucelplast/
   scp deploy/server/env.example root@178.105.148.70:/opt/pb-yucelplast/.env && ssh root@178.105.148.70 'chmod 600 /opt/pb-yucelplast/.env && sed -i "s|^PB_ENCRYPTION_KEY=.*|PB_ENCRYPTION_KEY=$(openssl rand -hex 16)|" /opt/pb-yucelplast/.env && grep PB_ENCRYPTION_KEY /opt/pb-yucelplast/.env'
   scp deploy/server/pb-yucelplast.service root@178.105.148.70:/etc/systemd/system/ && ssh root@178.105.148.70 'systemctl daemon-reload && systemctl enable --now pb-yucelplast && sleep 2 && curl -fsS http://127.0.0.1:8103/api/health && journalctl -u pb-yucelplast -n 20 --no-pager'
   ```

4. Superuser (ajans, sonra müşteri)
   Parola /root/.pb-secrets ve Infisical'a. Ajans e-postası (info@aburakt.com) PB_AGENCY_EMAILS'te olduğu için tam yetkili.
   Müşteri için aynı komut müşteri e-postasıyla: listede olmadığı için kısıtlıdır (yalnız içerik ve kendi şifresi).
   ```sh
   ssh root@178.105.148.70 -t 'cd /opt/pb-yucelplast && set -a && . ./.env && set +a && read -rs -p "Parola: " P && echo && ./pocketbase superuser upsert info@aburakt.com "$P" --dir /opt/pb-yucelplast/pb_data --encryptionEnv=PB_ENCRYPTION_KEY; unset P'
   ```

5. Caddy: cms.yucelplast.com bloğu
   deploy/server/Caddyfile.snippet'i önce sunucudaki mevcut bloklarla karşılaştırın (snippet adı). Ekleme yedek alır; validate geçmezse geri koyar. Sonda /api/health ve /_/ 200 dönmeli.
   ```sh
   ssh root@178.105.148.70 "grep -n -A8 '^cms\.' /etc/caddy/pocketbase.caddy"
   scp deploy/server/Caddyfile.snippet root@178.105.148.70:/tmp/pb-yucelplast.caddy && ssh root@178.105.148.70 'F=/etc/caddy/pocketbase.caddy; B=$F.bak.$(date +%F-%H%M%S); cp $F $B && { printf "\n" >> $F; cat /tmp/pb-yucelplast.caddy >> $F; } && { caddy validate --config /etc/caddy/Caddyfile && systemctl reload caddy || { cp $B $F; echo GERI ALINDI; }; }'
   curl -s -o /dev/null -w '%{http_code}\n' https://cms.yucelplast.com/api/health
   curl -s -o /dev/null -w '%{http_code}\n' https://cms.yucelplast.com/_/
   ```

6. Yedek: offsite listesine ekle
   /etc/cron.d/pb-offsite'in çağırdığı pb-offsite.sh içindeki "for n in …" listesine yucelplast eklenir (Storage Box: pb-sites/yucelplast/).
   ```sh
   ssh root@178.105.148.70 'S=$(grep -o "/[^ ]*pb-offsite.sh" /etc/cron.d/pb-offsite | head -1) && grep -q " yucelplast[ ;]" "$S" || sed -i "s/^for n in \(.*\); do/for n in \1 yucelplast; do/" "$S"; grep "for n in" "$S"'
   ```

7. İçerik: SSH tüneliyle tohumlama
   Tünel komutu ayrı terminalde açık kalsın. Yalnız boş PB'ye çalışır (settings kaydı varsa durur). Tünel açıkken panel: http://127.0.0.1:18103/_/
   ```sh
   ssh -N -L 18103:127.0.0.1:8103 root@178.105.148.70
   read -rs "PBPASS?Parola: " && PB_URL=http://127.0.0.1:18103 PB_ADMIN_EMAIL=info@aburakt.com PB_ADMIN_PASSWORD="$PBPASS" bun scripts/seed-remote.ts; unset PBPASS
   ```

8. Cloudflare Pages
   Proje: repo aburakt/yucelplast, kök dizin `site`, build `bun run build`, çıktı `dist`.
   Production ortamı: `PB_URL=https://cms.yucelplast.com`, `PUBLIC_SITE_URL=https://www.yucelplast.com`.
   Preview ortamı (Settings'teki ortam seçicisinden Preview): `CONTENT_SOURCE=fixture`; yoksa PR önizlemeleri kırılır.
   Özel alan adı: www.yucelplast.com (çıplak alan adı www'ya yönlenir).
   Settings > Builds > Deploy hooks: hook oluşturun ve sunucu .env'ine yazın (aşağıdaki satır zsh içindir).
   ```sh
   read -rs "HOOK?Deploy hook URL: " && ssh root@178.105.148.70 "sed -i 's|^CF_PAGES_DEPLOY_HOOK=.*|CF_PAGES_DEPLOY_HOOK=$HOOK|' /opt/pb-yucelplast/.env && systemctl restart pb-yucelplast"; unset HOOK
   ```

9. Önizleme adresi: yucelplast.aburakt.com
   Bazı TR operatörleri *.pages.dev'i engelliyor; müşteri önizlemeyi bu adresten görür (production dalı, noindex). Pages projesi açıldıktan sonra, `cf auth login` yapılmış makineden. Proje adı farklıysa ikinci argümanı değiştirin.
   ```sh
   bash deploy/onizleme-adresi.sh yucelplast yucelplast
   ```

10. GlitchTip: proje, DSN, uptime, otomatik düzeltme (ZORUNLU)
   Müşterinin org'unda `yucelplast` projesi açın; DSN'i Infisical'a, sunucu .env'ine ve tarayıcı hataları için `site/src/lib/monitoring.ts` GLITCHTIP_DSN'e yazın.
   Uptime monitörleri: https://www.yucelplast.com/ ve https://cms.yucelplast.com/api/health
   ZORUNLU, site bu iki adım olmadan yayına alınmaz. 1) Otomatik düzeltme alarmı (ikinci komut): GlitchTip hatayı n8n üzerinden "GlitchTip Website hata düzeltici" routine'ine iletir; routine repoyu bu alarmın adresinden okur. 2) claude.ai/code/routines > "GlitchTip Website hata düzeltici" > Edit > Repositories'e aburakt/yucelplast eklenir; eklenmezse routine "repo rutine eklenmeli" deyip durur.
   ```sh
   read -rs "DSN?GlitchTip DSN: " && ssh root@178.105.148.70 "sed -i 's|^GLITCHTIP_DSN=.*|GLITCHTIP_DSN=$DSN|' /opt/pb-yucelplast/.env && systemctl restart pb-yucelplast"; unset DSN
   read "ORG?GlitchTip org (aburakt, expertup, rlog-media): " && read -rs "GT?GlitchTip API token: " && curl -sf -X POST -H "Authorization: Bearer $GT" -H "Content-Type: application/json" "https://glitchtip.aburakt.com/api/0/projects/$ORG/yucelplast/alerts/" -d '{"name":"Claude otomatik düzeltme","timespanMinutes":1,"quantity":1,"uptime":false,"alertRecipients":[{"recipientType":"webhook","url":"http://n8n:5678/webhook/glitchtip?repo=aburakt/yucelplast"}]}' >/dev/null && echo "alarm eklendi"; unset GT
   ```

11. Son kontrol
   Infisical'da: PB_ENCRYPTION_KEY, superuser parolaları, deploy hook, GlitchTip DSN.
   Marka: pb/pb_hooks/site.js BRAND renkleri (color, ink, paper) sitenin CSS'iyle aynı; site/public/logo.svg varsa BRAND.logo = https://www.yucelplast.com/brand/logo-mail.png; favicon (site/public/favicon.svg ya da .png) varsa BRAND.icon = https://www.yucelplast.com/brand/icon.png. Panelde "Parolamı unuttum" ile markalı e-postayı deneyin (SMTP gerekir).
   Panelde bir kaydı kaydedin; ~45 sn sonra Pages'te yeni build başlamalı. Canlı siteyi verify kontrolleriyle ölçün:
   ```sh
   BASE_URL=https://www.yucelplast.com bun run verify
   ```

## Güncelleme
Hook ya da migration değişince: `rsync -a pb/pb_migrations pb/pb_hooks root@178.105.148.70:/opt/pb-yucelplast/` (hook'lar izlendiği için PB yeniden yüklenir; migration için `systemctl restart pb-yucelplast`).
