export function createScoreboard(lines = []) {
  const box = document.createElement("div")
  box.className = "scoreboard"

  const elements = {}

  lines.forEach(line => {
    const el = document.createElement("div")
    el.textContent = line.label + ": 0"
    box.appendChild(el)
    elements[line.key] = el
  })

  return {
    el: box,
    update(data) {
      Object.keys(data).forEach(key => {
        if (elements[key]) {
          elements[key].textContent = `${key}: ${data[key]}`
        }
      })
    }
  }
}