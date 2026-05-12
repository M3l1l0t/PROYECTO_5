import "./snake.css"
import { createButton } from "../../components/createButton.js"
import { createTopbar } from "../../components/createTopbar.js"
import { createScoreboard } from "../../components/createScoreboard.js"

export function initSnake(container) {
  container.replaceChildren()

  let snake, food, dx, dy, interval
  let running = false
  let score = 0

  let highScore = Number(localStorage.getItem("snakeHighScore")) || 0

  const wrapper = document.createElement("div")
  wrapper.className = "snake-container"

  const scoreBox = createScoreboard([
    { key: "score", label: "Score" },
    { key: "highScore", label: "High Score" }
  ])

  function updateScoreUI() {
    scoreBox.update({ score, highScore })
  }

  const backBtn = createButton("← Back", "btn-ghost", () => {
    stopGame()
    document.removeEventListener("keydown", handleKey)
    container.replaceChildren()
    document.querySelector("#menu").style.display = "flex"
  })

  const topbar = createTopbar({
    left: backBtn,
    right: scoreBox.el
  })

  const canvas = document.createElement("canvas")
  const size = Math.min(330, window.innerWidth - 40)
  canvas.width = size
  canvas.height = size

  const ctx = canvas.getContext("2d")

  const message = document.createElement("div")

  function randomFood() {
    let f
    do {
      f = {
        x: Math.floor(Math.random() * 33) * 10,
        y: Math.floor(Math.random() * 33) * 10
      }
    } while (snake.some(s => s.x === f.x && s.y === f.y))
    return f
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    ctx.fillStyle = "#4caf50"
    snake.forEach(p => ctx.fillRect(p.x, p.y, 10, 10))

    ctx.fillStyle = "#ff5252"
    ctx.fillRect(food.x, food.y, 10, 10)
  }

  function update() {
    const head = { x: snake[0].x + dx, y: snake[0].y + dy }

    if (
      head.x < 0 || head.y < 0 ||
      head.x >= canvas.width || head.y >= canvas.height ||
      snake.some(s => s.x === head.x && s.y === head.y)
    ) {
      gameOver()
      return
    }

    snake.unshift(head)

    if (head.x === food.x && head.y === food.y) {
      score++
      food = randomFood()
    } else {
      snake.pop()
    }

    updateScoreUI()
    draw()
  }

  function startGame() {
    if (running) return

    snake = [{ x: 150, y: 150 }]
    dx = 10
    dy = 0
    score = 0

    food = randomFood()

    running = true
    interval = setInterval(update, 100)

    updateScoreUI()
  }

  function stopGame() {
    running = false
    clearInterval(interval)
  }

  function gameOver() {
    stopGame()

    if (score > highScore) {
      highScore = score
      localStorage.setItem("snakeHighScore", highScore)
    }

    message.textContent = "Game Over 💀"
    updateScoreUI()
  }

  const startBtn = createButton("Start", "btn-primary", startGame)
  const restartBtn = createButton("Restart", "btn-primary", () => {
    stopGame()
    startGame()
  })

  const controls = document.createElement("div")
  controls.className = "snake-controls"
  controls.append(startBtn, restartBtn)

  function handleKey(e) {
    if (!running) return

    if (e.key === "ArrowUp" && dy === 0) { dx = 0; dy = -10 }
    if (e.key === "ArrowDown" && dy === 0) { dx = 0; dy = 10 }
    if (e.key === "ArrowLeft" && dx === 0) { dx = -10; dy = 0 }
    if (e.key === "ArrowRight" && dx === 0) { dx = 10; dy = 0 }
  }

  document.addEventListener("keydown", handleKey)

  const canvasWrapper = document.createElement("div")
  canvasWrapper.className = "snake-canvas-wrapper"

  canvasWrapper.appendChild(canvas)

  wrapper.append(topbar, canvasWrapper, message, controls)
  container.appendChild(wrapper)

  updateScoreUI()
  draw()
}
