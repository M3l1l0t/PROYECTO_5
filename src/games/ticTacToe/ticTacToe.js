import "./ticTacToe.css"

export function initTicTacToe(container) {
  container.innerHTML = `
    <div class="ttt-container">

      <button id="ttt-back">← Back</button>

      <div class="ttt-board">
        ${Array(9).fill("").map(() => `<div class="ttt-cell"></div>`).join("")}
      </div>

      <div>
        <div id="ttt-message"></div>
        <div id="ttt-highscore">Best: 0</div>
      </div>

      <button id="ttt-reset">Restart</button>

    </div>
  `

  const cells = container.querySelectorAll(".ttt-cell")
  const message = container.querySelector("#ttt-message")
  const highScoreEl = container.querySelector("#ttt-highscore")

  let turn = "X"
  let gameOver = false

  let highScore = Number(localStorage.getItem("tttHighScore")) || 0
  highScoreEl.textContent = `Best: ${highScore}`

  function getBoard() {
    return Array.from(cells).map(c => c.textContent)
  }

  function checkWinner() {
    const b = getBoard()

    const patterns = [
      [0,1,2],[3,4,5],[6,7,8],
      [0,3,6],[1,4,7],[2,5,8],
      [0,4,8],[2,4,6]
    ]

    for (let p of patterns) {
      const [a,b1,c] = p
      if (b[a] && b[a] === b[b1] && b[a] === b[c]) return b[a]
    }

    return null
  }

  cells.forEach(cell => {
    cell.addEventListener("click", () => {
      if (cell.textContent || gameOver) return

      cell.textContent = turn

      const winner = checkWinner()

      if (winner) {
        message.textContent = `${winner} wins! 🎉`

        if (winner === "X") {
          highScore++
          localStorage.setItem("tttHighScore", highScore)
          highScoreEl.textContent = `Best: ${highScore}`
        }

        gameOver = true
        return
      }

      turn = turn === "X" ? "O" : "X"
    })
  })

  container.querySelector("#ttt-reset").addEventListener("click", () => {
    cells.forEach(c => c.textContent = "")
    turn = "X"
    gameOver = false
    message.textContent = ""
  })

  container.querySelector("#ttt-back").addEventListener("click", () => {
    container.style.display = "none"
    document.getElementById("menu").style.display = "flex"
  })
}