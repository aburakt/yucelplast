#!/usr/bin/env bash
# Siteyi <ad>.aburakt.com altında açar: bazı TR operatörleri *.pages.dev'i engelliyor, müşteri önizlemeyi bu adresten görür.
#   bash deploy/onizleme-adresi.sh <ad> <pages-projesi>      ör. bash deploy/onizleme-adresi.sh merve mervekaderli
# Yaptığı: Pages projesine (hangi hesapta olursa) özel alan adı, aburakt.com'da proxied CNAME → <proje>.pages.dev,
# aburakt.com'daki "onizleme-noindex" Transform Rule'una bu adı ekler (X-Robots-Tag: noindex, nofollow).
# Token istemez: `cf` CLI oturumunu kullanır (cf auth login). CF_API_TOKEN verilirse onu kullanır.
# Tekrar çalıştırmak güvenli: var olan atlanır, başka yere bakan DNS kaydına dokunulmaz. Adres production dalını gösterir.
set -uo pipefail
ZONE=aburakt.com
RULE_REF=onizleme-noindex
[[ $# -eq 2 ]] || { echo "kullanım: bash deploy/onizleme-adresi.sh <ad> <pages-projesi>"; exit 1; }
SUB=$1 PROJ=$2 HOST=$1.$ZONE
[[ $SUB =~ ^[a-z0-9]([a-z0-9-]*[a-z0-9])?$ ]] || { echo "ad yalnız küçük harf, rakam ve tire: $SUB"; exit 1; }
command -v python3 >/dev/null || { echo "python3 gerekli"; exit 1; }

T=${CF_API_TOKEN:-}
if [[ -z $T ]]; then
  cf auth whoami >/dev/null 2>&1 || { echo "cf oturumu yok: cf auth login"; exit 1; }  # token'ı tazeler
  for CFG in "$HOME/Library/Preferences/cloudflare/config/default.json" "${XDG_CONFIG_HOME:-$HOME/.config}/cloudflare/config/default.json"; do
    [[ -f $CFG ]] && { T=$(python3 -c "import json,sys;print(json.load(open(sys.argv[1]))['oauth_token'])" "$CFG"); break; }
  done
  [[ -n $T ]] || { echo "cf token'ı bulunamadı; CF_API_TOKEN verin"; exit 1; }
fi
API=https://api.cloudflare.com/client/v4
api() { if [[ -n ${3:-} ]]; then curl -sS -X "$1" "$API$2" -H "Authorization: Bearer $T" -H "Content-Type: application/json" --data "$3"
        else curl -sS -X "$1" "$API$2" -H "Authorization: Bearer $T"; fi; }
py() { python3 -c "import json,sys;d=json.load(sys.stdin);$1"; }

Z=$(api GET "/zones?name=$ZONE" | py "r=d.get('result') or [];print(r[0]['id'] if r else '')")
[[ -n $Z ]] || { echo "$ZONE bölgesi görünmüyor (oturum aBurakt hesabını görmeli)"; exit 1; }

# Projeyi oturumun gördüğü hesaplarda ara
ACC= TARGET=
for a in $(api GET "/accounts?per_page=50" | py "print(' '.join(x['id'] for x in d.get('result') or []))"); do
  s=$(api GET "/accounts/$a/pages/projects/$PROJ" | py "r=d.get('result') or {};print(r.get('subdomain','') if d.get('success') else '')")
  [[ -n $s ]] && { ACC=$a TARGET=$s; break; }
done
[[ -n $ACC ]] || { echo "Pages projesi bulunamadı: $PROJ (cf oturumu o hesabı görüyor mu?)"; exit 1; }
echo "== $HOST -> $PROJ ($TARGET)"

cur=$(api GET "/zones/$Z/dns_records?name=$HOST" | py "r=d['result'];print(r[0]['type']+' '+r[0]['content'] if r else '')")
if [[ -z $cur ]]; then
  api POST "/zones/$Z/dns_records" "{\"type\":\"CNAME\",\"name\":\"$HOST\",\"content\":\"$TARGET\",\"proxied\":true,\"comment\":\"onizleme: $PROJ\"}" \
    | py "print('  DNS eklendi' if d['success'] else '  DNS HATA', d.get('errors') or '')"
elif [[ $cur == "CNAME $TARGET" ]]; then echo "  DNS zaten var"
else echo "  ! DNS başka yere bakıyor ($cur), dokunulmadı"; exit 1; fi

have=$(api GET "/accounts/$ACC/pages/projects/$PROJ/domains" | py "print(next((x['status'] for x in d['result'] if x['name']=='$HOST'),''))")
if [[ -n $have ]]; then echo "  Pages alan adı zaten var ($have)"
else api POST "/accounts/$ACC/pages/projects/$PROJ/domains" "{\"name\":\"$HOST\"}" \
    | py "print('  Pages eklendi:', d['result']['status']) if d['success'] else print('  Pages HATA', d['errors'])"; fi

# noindex kuralı: fazdaki diğer kurallar korunur, bu kuralın ad listesine HOST eklenir
RS=$(api GET "/zones/$Z/rulesets/phases/http_response_headers_transform/entrypoint")
BODY=$(RS="$RS" HOST="$HOST" REF="$RULE_REF" python3 - <<'PY'
import json, os, re
d = json.loads(os.environ["RS"])
rules = (d.get("result") or {}).get("rules") or []
host, ref = os.environ["HOST"], os.environ["REF"]
hosts = {host}
for r in rules:
    if r.get("ref") == ref:
        hosts |= set(re.findall(r'"([^"]+)"', r.get("expression", "")))
keep = [{k: v for k, v in r.items() if k not in ("id", "version", "last_updated")} for r in rules if r.get("ref") != ref]
expr = "(http.host in {" + " ".join(f'"{h}"' for h in sorted(hosts)) + "})"
keep.append({"ref": ref, "description": "onizleme alt alan adlari: noindex", "expression": expr, "action": "rewrite",
             "action_parameters": {"headers": {"X-Robots-Tag": {"operation": "set", "value": "noindex, nofollow"}}}})
print(json.dumps({"rules": keep}))
PY
)
api PUT "/zones/$Z/rulesets/phases/http_response_headers_transform/entrypoint" "$BODY" \
  | py "print('  noindex kuralı: tamam' if d['success'] else '  noindex HATA', d.get('errors') or '')"

# Doğrulama (sertifika birkaç dakika sürebilir; pending görürseniz tekrar çalıştırın)
st=$(api GET "/accounts/$ACC/pages/projects/$PROJ/domains/$HOST" | py "r=d.get('result') or {};print(r.get('status'))")
hd=$(curl -sI -m 15 "https://$HOST/" 2>/dev/null)
code=$(awk 'NR==1{print $2}' <<<"$hd"); xr=$(grep -i '^x-robots-tag' <<<"$hd" | tr -d '\r')
echo "  pages=$st http=${code:-yok} ${xr:-noindex YOK}"
