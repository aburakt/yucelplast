import { describe, expect, test } from "bun:test"
import { readFileSync } from "node:fs"
import { join } from "node:path"
import content from "../site/src/data/content.json"
import { ICON_NAMES } from "../site/src/lib/icons"

// SİTEYE ÖZEL: simge listesi şemayla aynı, örnek içerik tutarlı.
const ROOT = join(import.meta.dir, "..")

describe("ürün grupları", () => {
  test("simgeler migration ICONS ile aynı", () => {
    const migration = readFileSync(join(ROOT, "pb/pb_migrations/1791800000_init.js"), "utf8")
    const icons = JSON.parse(/const ICONS = (\[[^\]]*\])/.exec(migration)![1]!) as string[]
    expect(icons).toEqual(ICON_NAMES)
  })
  test("örnek içerikte her grubun simgesi geçerli, alt grubun üstü var ve üst grup değil", () => {
    const slugs = new Map(content.categories.map((c) => [c.slug, c]))
    for (const c of content.categories) {
      expect(ICON_NAMES as string[]).toContain(c.icon)
      const parent = "parent" in c ? (c.parent as string) : undefined
      if (parent) {
        expect(slugs.has(parent)).toBe(true)
        expect("parent" in slugs.get(parent)!).toBe(false)
      }
    }
  })
  test("örnek içerikte test sayfası ve sahte fiyat yok", () => {
    const text = JSON.stringify({ ...content, redirects: [] })
    expect(text).not.toMatch(/kutuzz|zz kutu|\d+\s*TL|Stokta/i)
  })
  test("eski test sayfası yeni adrese yönlenir", () => {
    expect(content.redirects).toContainEqual({ from: "/urunler/kutu-uretimi/miknatisli-kutuzz", to: "/urunler/kutu-uretimi/miknatisli-kutu/", code: "301" })
  })
})
