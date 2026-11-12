// Ana sayfadaki "Rakamlarla Yücel Plast" sayıları görünür olunca 0'dan sayılır (eski sitedeki gibi).
// Sayı HTML'de hazır yazılı; betik yoksa ya da hareket azaltılmışsa olduğu gibi kalır.
const fmt = new Intl.NumberFormat("tr")
const els = document.querySelectorAll<HTMLElement>("[data-count]")
if (els.length && !matchMedia("(prefers-reduced-motion: reduce)").matches && "IntersectionObserver" in window) {
  const run = (el: HTMLElement) => {
    const to = Number(el.dataset.count)
    const start = performance.now()
    const step = (now: number) => {
      const p = Math.min((now - start) / 1400, 1)
      el.textContent = fmt.format(Math.round(to * (1 - (1 - p) ** 3)))
      if (p < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue
      io.unobserve(e.target)
      run(e.target as HTMLElement)
    }
  }, { threshold: 0.4 })
  els.forEach((el) => io.observe(el))
}
