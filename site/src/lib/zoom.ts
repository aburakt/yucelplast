import { getImage } from "astro:assets"
import { isRemoteRaster, remoteDims } from "./image"
import type { Img } from "./types"

/** Lightbox'ta açılan büyük görsel: en çok 1600 px WebP, asıl boyuttan büyütülmez. */
export async function zoomUrl(img: Img): Promise<string> {
  if (typeof img.src !== "string") {
    const width = Math.min(1600, img.src.width)
    return (await getImage({ src: img.src, width, format: "webp", quality: 82 })).src
  }
  if (!isRemoteRaster(img.src)) return img.src
  const { width, height } = await remoteDims(img.src, 1600)
  return (await getImage({ src: img.src, width, height, format: "webp", quality: 82 })).src
}
