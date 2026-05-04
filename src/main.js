import { initTicTacToe } from "./games/ticTacToe/ticTacToe.js"
import { initSnake } from "./games/snake/snake.js"
import { initWhacAMole } from "./games/whacAMole/whacAMole.js"

import { createButton } from "./components/createButton.js"

const app = document.querySelector("#app")
const menu = document.querySelector("#menu")

const games = {
  tictactoe: initTicTacToe,
  snake: initSnake,
  whac: initWhacAMole
}

function clearApp() {
  app.replaceChildren()
}

function showGame(game) {
  menu.style.display = "none"
  app.style.display = "flex"

  clearApp()

  games[game](app)
}

function goMenu() {
  menu.style.display = "flex"
  app.style.display = "none"
  clearApp()
}

// =====================
// MENU BUILDER (REFACTORED)
// =====================
function buildMenu() {
  menu.replaceChildren()

  const title = document.createElement("h1")
  title.textContent = "Arcade Games"
  title.className = "title"

  const subtitle = document.createElement("p")
  subtitle.textContent = "Choose your game"
  subtitle.className = "subtitle"

  const buttons = document.createElement("div")
  buttons.className = "menu-buttons"

  const tttBtn = createButton("Tic Tac Toe", "btn-primary", () => {
    showGame("tictactoe")
  })

  const snakeBtn = createButton("Snake", "btn-primary", () => {
    showGame("snake")
  })

  const whacBtn = createButton("Whac-A-Mole", "btn-primary", () => {
    showGame("whac")
  })

  buttons.append(tttBtn, snakeBtn, whacBtn)

  menu.append(title, subtitle, buttons)
}

// =====================
// INIT
// =====================
function init() {
  buildMenu()
  goMenu()
}

init()