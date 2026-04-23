import "./whacAMole.css"
export function initWhacAMole(container) {
  container.innerHTML = `
    <div class="wam-container">

      <div class="wam-topbar">
        <button id="wam-back">← Back</button>
        <div>
          <div id="wam-score">Score: 0</div>
          <div id="wam-highscore">High Score: 0</div>
        </div>
      </div>

      <div class="wam-board">
        ${Array(9).fill("").map(() => `<div class="wam-hole"></div>`).join("")}
      </div>

      <div id="wam-message"></div>

      <div class="wam-controls">
        <button id="wam-start">Start</button>
        <button id="wam-restart">Restart</button>
      </div>

    </div>
  `

  const holes = container.querySelectorAll(".wam-hole")
  const scoreEl = container.querySelector("#wam-score")
  const highScoreEl = container.querySelector("#wam-highscore")
  const messageEl = container.querySelector("#wam-message")

  let score = 0
  let activeIndex = null
  let running = false

  let speed = 900
  const minSpeed = 500
  let timeoutId = null

  let highScore = Number(localStorage.getItem("wamHighScore")) || 0
  highScoreEl.textContent = `High Score: ${highScore}`

  function showMole() {
    holes.forEach(h => h.classList.remove("active"))

    activeIndex = Math.floor(Math.random() * holes.length)
    holes[activeIndex].classList.add("active")
  }

  function updateSpeed() {
    if (score > 0 && score % 3 === 0) {
      speed = Math.max(minSpeed, speed - 80)
    }
  }

  function loop() {
    if (!running) return

    showMole()

    timeoutId = setTimeout(loop, speed)
  }

  function startGame() {
    if (running) return

    score = 0
    speed = 900
    scoreEl.textContent = "Score: 0"
    messageEl.textContent = ""

    running = true
    loop()
  }

  function stopGame() {
    running = false
    clearTimeout(timeoutId)
    holes.forEach(h => h.classList.remove("active", "hit"))
  }

  holes.forEach((hole, i) => {
    hole.addEventListener("click", () => {
      if (!running) return

      if (i === activeIndex) {
        score++
        scoreEl.textContent = `Score: ${score}`

        updateSpeed()

        hole.classList.add("hit")
        setTimeout(() => hole.classList.remove("active", "hit"), 150)

        activeIndex = null
      }
    })
  })

  container.querySelector("#wam-start").addEventListener("click", startGame)

  container.querySelector("#wam-restart").addEventListener("click", () => {
    stopGame()
    startGame()
  })

  container.querySelector("#wam-back").addEventListener("click", () => {
    stopGame()

    if (score > highScore) {
      highScore = score
      localStorage.setItem("wamHighScore", highScore)
    }

    container.style.display = "none"
    document.getElementById("menu").style.display = "flex"
  })
}