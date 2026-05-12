import "./ticTacToe.css"
import { createButton } from "../../components/createButton.js"
import { createTopbar } from "../../components/createTopbar.js"
import { createScoreboard } from "../../components/createScoreboard.js"

export function initTicTacToe(container) {
  container.replaceChildren()

  // =====================
  // STATE
  // =====================
  let turn = "X"
  let gameOver = false

  let scores = JSON.parse(localStorage.getItem("tttScores")) || {
    X: 0,
    O: 0,
    draws: 0
  }

  // =====================
  // ROOT
  // =====================
  const wrapper = document.createElement("div")
  wrapper.className = "ttt-container"

  // =====================
  // SCOREBOARD (reutilizable)
  // =====================
  const scoreboard = createScoreboard([
    { key: "X", label: "X" },
    { key: "O", label: "O" },
    { key: "draws", label: "Draws" }
  ])

  function updateScore() {
    scoreboard.update(scores)
  }

  updateScore()

  // =====================
  // BACK BUTTON
  // =====================
  const backBtn = createButton("← Back", "btn-ghost", () => {
    container.replaceChildren()
    document.querySelector("#menu").style.display = "flex"
  })

  // =====================
  // TOPBAR
  // =====================
  const topbar = createTopbar({
    left: backBtn,
    right: scoreboard.el
  })

  // =====================
  // BOARD
  // =====================
  const board = document.createElement("div")
  board.className = "ttt-board"

  const cells = []

  for (let i = 0; i < 9; i++) {
    const cell = document.createElement("div")
    cell.className = "ttt-cell"

    cell.addEventListener("click", () => {
      if (cell.textContent || gameOver) return

      cell.textContent = turn

      const result = checkWinner()

      if (result) {
        result.line.forEach(i => cells[i].classList.add("winner"))

        scores[result.player]++
        gameOver = true
        message.textContent = `${result.player} wins 🎉`
        save()
        updateScore()
        return
      }

      if (isDraw()) {
        scores.draws++
        gameOver = true
        message.textContent = "Draw 🤝"
        save()
        updateScore()
        return
      }

      turn = turn === "X" ? "O" : "X"
    })

    cells.push(cell)
    board.appendChild(cell)
  }

  // =====================
  // MESSAGE
  // =====================
  const message = document.createElement("div")
  message.id = "ttt-message"

  // =====================
  // RESET
  // =====================
  const resetBtn = createButton("Restart", "btn-primary", reset)

  function reset() {
    cells.forEach(c => {
      c.textContent = ""
      c.classList.remove("winner")
    })

    turn = "X"
    gameOver = false
    message.textContent = ""
  }

  // =====================
  // LOGIC
  // =====================
  function getBoard() {
    return cells.map(c => c.textContent)
  }

  function checkWinner() {
    const b = getBoard()

    const patterns = [
      [0,1,2],[3,4,5],[6,7,8],
      [0,3,6],[1,4,7],[2,5,8],
      [0,4,8],[2,4,6]
    ]

    for (const [a,b1,c] of patterns) {
      if (b[a] && b[a] === b[b1] && b[a] === b[c]) {
        return { player: b[a], line: [a,b1,c] }
      }
    }

    return null
  }

  function isDraw() {
    return getBoard().every(c => c !== "")
  }

  function save() {
    localStorage.setItem("tttScores", JSON.stringify(scores))
  }

  // =====================
  // RENDER
  // =====================
  wrapper.append(topbar, board, message, resetBtn)
  container.appendChild(wrapper)
}
