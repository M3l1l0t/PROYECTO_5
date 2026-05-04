import "./whacAMole.css"
import { createButton } from "../../components/createButton.js"
import { createTopbar } from "../../components/createTopbar.js"
import { createScoreboard } from "../../components/createScoreboard.js"

export function initWhacAMole(container) {
  container.replaceChildren()

  let score = 0
  let activeIndex = null
  let running = false
  let speed = 900
  let timeoutId = null
  let highScore = Number(localStorage.getItem("wamHighScore")) || 0

  const wrapper = document.createElement("div")
  wrapper.className = "wam-container"

  const scoreboard = createScoreboard([
    { key: "Score", label: "Score" },
    { key: "High Score", label: "High Score" }
  ])

  function updateUI() {
    scoreboard.update({ score, highScore })
  }

  const backBtn = createButton("← Back", "btn-ghost", () => {
    stopGame()
    saveHighScore()
    container.replaceChildren()
    document.querySelector("#menu").style.display = "flex"
  })

  const topbar = createTopbar({
    left: backBtn,
    right: scoreboard.el
  })

  const board = document.createElement("div")
  board.className = "wam-board"

  const holes = []

  for (let i = 0; i < 9; i++) {
    const hole = document.createElement("div")
    hole.className = "wam-hole"

    hole.addEventListener("click", () => {
      if (!running) return

      if (i === activeIndex) {
        score++
        activeIndex = null
        updateUI()
      }
    })

    holes.push(hole)
    board.appendChild(hole)
  }

  function showMole() {
    holes.forEach(h => h.classList.remove("active"))

    activeIndex = Math.floor(Math.random() * holes.length)
    holes[activeIndex].classList.add("active")
  }

  function loop() {
    if (!running) return

    showMole()
    timeoutId = setTimeout(loop, speed)
  }

  function startGame() {
    if (running) return

    speed = 900
    score = 0
    running = true

    updateUI()
    loop()
  }

  function stopGame() {
    running = false
    clearTimeout(timeoutId)
    holes.forEach(h => h.classList.remove("active"))
  }

  function saveHighScore() {
    if (score > highScore) {
      highScore = score
      localStorage.setItem("wamHighScore", highScore)
    }
  }

  const startBtn = createButton("Start", "btn-primary", startGame)
  const restartBtn = createButton("Restart", "btn-primary", () => {
    stopGame()
    startGame()
  })

  const controls = document.createElement("div")
  controls.className = "wam-controls"
  controls.append(startBtn, restartBtn)

  wrapper.append(topbar, board, controls)
  container.appendChild(wrapper)

  updateUI()
}