import { describe, expect, test } from "bun:test"
import { readFileSync } from "node:fs"
import { join } from "node:path"
import content from "../site/src/data/content.json"
import { ICON_NAMES, UI_ICONS } from "../site/src/lib/icons"

// SİTEYE ÖZEL: simge listesi şemayla aynı, örnek içerik tutarlı.
const ROOT = join(import.meta.dir, "..")

describe("ürün grupları", () => {
  test("arayüz simgesi grup simgesiyle aynı adı taşımaz (Icon önce grup simgesine bakar)", () => {
    expect(Object.keys(UI_ICONS).filter((n) => (ICON_NAMES as string[]).includes(n))).toEqual([])
  })
  test("her grup simgesinin eski siteden çizimi ve CSS sınıfı var (site/public/icons, CategoryIcon)", () => {
    const css = readFileSync(join(ROOT, "site", "src", "styles", "global.css"), "utf8")
    for (const n of ICON_NAMES) {
      expect(readFileSync(join(ROOT, "site", "public", "icons", `${n}.svg`), "utf8")).toStartWith("<svg")
      expect(css).toContain(`.i-${n} { --ico: url("/icons/${n}.svg"); }`)
    }
  })
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
