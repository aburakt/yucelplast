import { lower } from "../lib/tr"

// /ara/ sayfasında listeyi yazılan kelimelere göre süzer (her kelime geçmeli). ?q= ile gelinirse kutu dolu açılır.
const form = document.querySelector<HTMLFormElement>("[data-search]")
const input = form?.querySelector<HTMLInputElement>("input[name=q]")
const status = document.querySelector<HTMLElement>("[data-search-status]")
const rows = [...document.querySelectorAll<HTMLElement>("[data-search-text]")]

function apply(): void {
  const words = lower(input?.value ?? "").split(/\s+/).filter(Boolean)
  let shown = 0
  for (const row of rows) {
    const hit = words.every((w) => (row.dataset.searchText ?? "").includes(w))
    row.hidden = !hit
    if (hit) shown++
  }
  if (status) status.textContent = shown ? `${shown} sonuç` : "Sonuç bulunamadı. Başka bir kelime deneyin ya da bize yazın."
}

if (form && input) {
  input.value = new URLSearchParams(location.search).get("q") ?? ""
  input.addEventListener("input", apply)
  form.addEventListener("submit", (e) => {
    e.preventDefault()
    history.replaceState(null, "", input.value ? `?q=${encodeURIComponent(input.value)}` : location.pathname)
    apply()
  })
  apply()
}
