// Galeri fotoğrafını büyütür: a[data-lightbox] bağlantıları aynı grupta (data-lightbox değeri) sırayla gezilir.
// JS yoksa bağlantı büyük görseli doğrudan açar. Esc kapatır (dialog), oklar gezdirir, arka plana tıklamak kapatır.
const dialog = document.getElementById("lightbox") as HTMLDialogElement | null
if (dialog) {
  const img = dialog.querySelector<HTMLImageElement>(".lb-img")!
  const caption = dialog.querySelector<HTMLElement>(".lb-caption")!
  let items: HTMLAnchorElement[] = []
  let index = 0

  const show = (i: number) => {
    index = (i + items.length) % items.length
    const a = items[index]
    img.src = a.href
    img.alt = a.querySelector("img")?.alt ?? ""
    caption.textContent = items.length > 1 ? `${index + 1} / ${items.length}` : ""
    dialog.classList.toggle("single", items.length < 2)
  }

  document.addEventListener("click", (e) => {
    const a = (e.target as Element).closest<HTMLAnchorElement>("a[data-lightbox]")
    if (!a || e.metaKey || e.ctrlKey || e.shiftKey) return
    e.preventDefault()
    items = [...document.querySelectorAll<HTMLAnchorElement>(`a[data-lightbox="${a.dataset.lightbox}"]`)]
    show(items.indexOf(a))
    dialog.showModal()
  })

  dialog.addEventListener("click", (e) => {
    const t = e.target as Element
    const act = t.closest<HTMLElement>("[data-lb]")?.dataset.lb
    if (act === "close" || t === dialog) dialog.close()
    else if (act === "prev") show(index - 1)
    else if (act === "next") show(index + 1)
  })

  dialog.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") show(index - 1)
    else if (e.key === "ArrowRight") show(index + 1)
  })

  dialog.addEventListener("close", () => {
    img.removeAttribute("src")
    items[index]?.focus()
  })
}
