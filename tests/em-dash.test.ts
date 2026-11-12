// ORTAK (core): template'ten gelir, sitede elle değiştirilmez (bun run core:sync).
import { expect, test } from "bun:test"

// Uzun tire (U+2014) hiçbir yerde kullanılmaz: kod, yorum, üretilen dosya, site metni, belge. Yerine virgül, iki nokta,
// parantez ya da kısa tire. Git'teki bütün metin dosyaları taranır.
const DASH = "\u2014"
const BINARY = /\.(png|jpe?g|webp|avif|gif|ico|woff2?|ttf|otf|mp4|webm|pdf|zip|gz|lockb)$/i

test("uzun tire (U+2014) yok", async () => {
  const files = Bun.spawnSync(["git", "ls-files"]).stdout.toString().split("\n").filter((f) => f && !BINARY.test(f) && f !== "bun.lock")
  const found: string[] = []
  for (const f of files) {
    const file = Bun.file(f)
    if (!(await file.exists())) continue
    const lines = (await file.text()).split("\n")
    lines.forEach((l, i) => { if (l.includes(DASH)) found.push(`${f}:${i + 1}`) })
  }
  expect(found).toEqual([])
})
