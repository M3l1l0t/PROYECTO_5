import { initTicTacToe } from "./games/ticTacToe/ticTacToe.js"
import { initSnake } from "./games/snake/snake.js"
import { initWhacAMole } from "./games/whacAMole/whacAMole.js"

const app = document.querySelector("#app")
const menu = document.querySelector("#menu")

function showGame(game) {
  menu.style.display = "none"
  app.style.display = "flex"
  app.innerHTML = ""

  const games = {
    tictactoe: initTicTacToe,
    snake: initSnake,
    whac: initWhacAMole
  }

  games[game](app)
}

function goMenu() {
  menu.style.display = "flex"
  app.style.display = "none"
}

function setupMenuButtons() {
  document.querySelector("#goTtt")
    .addEventListener("click", () => showGame("tictactoe"))

  document.querySelector("#goSnake")
    .addEventListener("click", () => showGame("snake"))

  document.querySelector("#goWhac")
    .addEventListener("click", () => showGame("whac"))
}

function init() {
  setupMenuButtons()
  goMenu()
}

init()