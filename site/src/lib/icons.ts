// Ürün grubu simgeleri: fotoğrafı olmayan kartta görünür. Adlar pb_migrations/1791800000_init.js ICONS ile aynı
// tutulur (tests/site.test.ts ölçer). 24x24, çizgi (stroke) simgeler; renk currentColor.
export const CATEGORY_ICONS = {
  kutu: "M3.5 7.5 12 3l8.5 4.5v9L12 21l-8.5-4.5zM3.5 7.5 12 12l8.5-4.5M12 12v9M7.8 5.2l8.4 4.6",
  belge: "M6 3h8l4 4v14H6zM14 3v4h4M9 11h6M9 14.5h6M9 18h4",
  imza: "M5 3h10l4 4v14H5zM8 9h7M8 12h5M7.5 18c1.2-1.8 2.2-2.4 2.8-1.6.5.7-.5 1.6.4 1.6.7 0 1.4-1.4 2.2-1.4.6 0 .6.9 1.2.9.5 0 .9-.3 1.4-.7",
  menu: "M5 3.5h12.5a1.5 1.5 0 0 1 1.5 1.5v14a1.5 1.5 0 0 1-1.5 1.5H5zM8 3.5v17M11 8h5M11 11h5M11 14h3",
  kartela: "M8 20.5 3.6 9.2a1 1 0 0 1 .6-1.3l3.6-1.4M8 20.5l3.4-12.2a1 1 0 0 0-.7-1.2L7 6M8 20.5l8.7-8.6a1 1 0 0 0 0-1.4L14 7.8M8 20.5h11a1 1 0 0 0 1-1v-6M8 4h3v3",
  ruhsat: "M4 5h16v14H4zM4 9h16M7 13h4M7 16h6M15 13.5h2.5v2.5H15z",
  bloknot: "M6 4h12v17H6zM9 2.5v3M12 2.5v3M15 2.5v3M9 10h6M9 13h6M9 16h4",
  yillik: "M4 6h16v14H4zM4 10h16M8 3.5v4M16 3.5v4M8 13.5h2M14 13.5h2M8 16.5h2M14 16.5h2",
  ajanda: "M7 3h11a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H7zM7 3a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2M15 3v7l-1.5-1-1.5 1V3",
  klasor: "M5 3h11l3 3v15H5zM9 3v18M13 8h3M13 11h3M7 7v.01M7 17v.01",
  canta: "M3.5 8h17v12h-17zM9 8V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V8M3.5 13h17M11 12v2h2v-2",
} as const

export type IconName = keyof typeof CATEGORY_ICONS
export const ICON_NAMES = Object.keys(CATEGORY_ICONS) as IconName[]
export const isIconName = (v: string): v is IconName => v in CATEGORY_ICONS

/** Arayüz simgeleri (menü, iletişim). */
export const UI_ICONS = {
  phone: "M5 4h3.5l1.5 4-2 1.5a10 10 0 0 0 6.5 6.5l1.5-2 4 1.5V19a1.5 1.5 0 0 1-1.5 1.5A15.5 15.5 0 0 1 3.5 5.5 1.5 1.5 0 0 1 5 4z",
  mail: "M3.5 6h17v12h-17zM3.5 7l8.5 6.5L20.5 7",
  pin: "M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11zM12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z",
  arrow: "M5 12h14M13 6l6 6-6 6",
  burger: "M4 7h16M4 12h16M4 17h16",
  home: "M3.5 11 12 4l8.5 7M6 9.5V20h4.5v-5.5h3V20H18V9.5",
  down: "M6 9l6 6 6-6",
  right: "M9 6l6 6-6 6",
  check: "M5 12.5l4.5 4.5L19 7.5",
  design: "M4 20l4-1 11-11-3-3L5 16zM14 7l3 3M4 20h16",
  factory: "M3 21V10l5 3V10l5 3V10l5 3V4h3v17zM7 17h2M12 17h2M17 17h2",
  people: "M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM2.5 20a6.5 6.5 0 0 1 13 0M16 4.5a3.5 3.5 0 0 1 0 6.5M18.5 14.5A6.5 6.5 0 0 1 21.5 20",
} as const
export type UiIconName = keyof typeof UI_ICONS
