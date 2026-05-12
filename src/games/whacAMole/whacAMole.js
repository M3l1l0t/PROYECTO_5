import "./whacAMole.css"
import { createButton } from "../../components/createButton.js"
import { createTopbar } from "../../components/createTopbar.js"
import { createScoreboard } from "../../components/createScoreboard.js"

export function initWhacAMole(container) {
  container.replaceChildren()

  let score = 0
  let highScore = Number(localStorage.getItem("wamHighScore")) || 0

  let activeIndex = null
  let running = false
  let speed = 1000
  let timeoutId = null

  let timeLeft = 30
  let timerId = null

  const wrapper = document.createElement("div")
  wrapper.className = "wam-container"

  const message = document.createElement("div")
  message.className = "wam-message"

  const scoreboard = createScoreboard([
    { key: "score", label: "Score" },
    { key: "highScore", label: "High Score" }
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
        updateUI()

        hole.classList.add("hit")

        const pop = document.createElement("div")
        pop.textContent = "+1"
        pop.className = "wam-pop"
        hole.appendChild(pop)

        setTimeout(() => pop.remove(), 400)
        setTimeout(() => hole.classList.remove("hit"), 150)

        activeIndex = null

        // dificultad controlada
        speed = Math.max(700, speed - 10)
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

    score = 0
    speed = 1000
    timeLeft = 30
    running = true

    updateUI()

    message.textContent = `Time: ${timeLeft}s`

    loop()

    timerId = setInterval(() => {
      timeLeft--
      message.textContent = `Time: ${timeLeft}s`

      if (timeLeft <= 0) {
        endGame()
      }
    }, 1000)
  }

  function endGame() {
    running = false

    clearTimeout(timeoutId)
    clearInterval(timerId)

    holes.forEach(h => h.classList.remove("active"))

    saveHighScore()

    message.textContent = `Game Over 💀 Score: ${score}`

    updateUI()
  }

  function stopGame() {
    running = false
    clearTimeout(timeoutId)
    clearInterval(timerId)
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

  wrapper.append(topbar, board, message, controls)
  container.appendChild(wrapper)

  updateUI()
}
