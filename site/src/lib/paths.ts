/** Ürün grubunun adresi: üst grup varsa /urunler/<üst>/<slug>/. */
export const categoryPath = (slug: string, parent?: string): string => (parent ? `/urunler/${parent}/${slug}/` : `/urunler/${slug}/`)
