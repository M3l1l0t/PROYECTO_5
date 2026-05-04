export function createButton(text, className, onClick) {
  const btn = document.createElement("button")

  btn.textContent = text

  // base SIEMPRE
  btn.classList.add("btn")

  // clase opcional
  if (className) {
    className.split(" ").forEach(c => btn.classList.add(c))
  }

  btn.addEventListener("click", onClick)

  return btn
}