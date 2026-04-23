import "./snake.css"
export function initSnake(container) {
  container.innerHTML = `
    <div class="snake-container">

      <div class="snake-topbar">
        <button id="snake-back">← Back</button>
        <div>
          <div id="snake-score">Score: 0</div>
          <div id="snake-highscore">High Score: 0</div>
        </div>
      </div>

      <canvas id="snake-canvas" width="330" height="330"></canvas>

      <div id="snake-message"></div>

      <div class="snake-controls">
        <button id="snake-start">Start</button>
        <button id="snake-restart">Restart</button>
      </div>

    </div>
  `

  const canvas = container.querySelector("#snake-canvas")
  const ctx = canvas.getContext("2d")

  const scoreEl = container.querySelector("#snake-score")
  const highScoreEl = container.querySelector("#snake-highscore")
  const messageEl = container.querySelector("#snake-message")

  const startBtn = container.querySelector("#snake-start")
  const restartBtn = container.querySelector("#snake-restart")
  const backBtn = container.querySelector("#snake-back")

  let snake, food, dx, dy, interval
  let running = false
  let score = 0

  let highScore = Number(localStorage.getItem("snakeHighScore")) || 0
  highScoreEl.textContent = `High Score: ${highScore}`

  function initGame() {
    snake = [{ x: 150, y: 150 }]
    food = randomFood()
    dx = 10
    dy = 0
    score = 0

    scoreEl.textContent = "Score: 0"
    messageEl.textContent = ""
  }

  function randomFood() {
    return {
      x: Math.floor(Math.random() * 33) * 10,
      y: Math.floor(Math.random() * 33) * 10
    }
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    ctx.fillStyle = "#4caf50"
    snake.forEach(p => ctx.fillRect(p.x, p.y, 10, 10))

    ctx.fillStyle = "red"
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
      scoreEl.textContent = `Score: ${score}`
      food = randomFood()
    } else {
      snake.pop()
    }

    draw()
  }

  function startGame() {
    if (running) return
    initGame()
    running = true
    interval = setInterval(update, 100)
  }

  function gameOver() {
    clearInterval(interval)
    running = false

    if (score > highScore) {
      highScore = score
      localStorage.setItem("snakeHighScore", highScore)
      highScoreEl.textContent = `High Score: ${highScore}`
      messageEl.textContent = "New High Score! 🏆"
    } else {
      messageEl.textContent = "Game Over 💀"
    }
  }

  document.addEventListener("keydown", e => {
    if (!running) return

    if (e.key === "ArrowUp" && dy === 0) { dx = 0; dy = -10 }
    if (e.key === "ArrowDown" && dy === 0) { dx = 0; dy = 10 }
    if (e.key === "ArrowLeft" && dx === 0) { dx = -10; dy = 0 }
    if (e.key === "ArrowRight" && dx === 0) { dx = 10; dy = 0 }
  })

  startBtn.addEventListener("click", startGame)

  restartBtn.addEventListener("click", () => {
    clearInterval(interval)
    running = false
    startGame()
  })

  backBtn.addEventListener("click", () => {
    clearInterval(interval)
    running = false
    container.style.display = "none"
    document.getElementById("menu").style.display = "flex"
  })

  initGame()
  draw()
}