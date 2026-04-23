export function renderHeader() {
  const header = document.createElement('header');

  header.innerHTML = `
    <h1>🎮 Mini Juegos 🎮</h1>
    <nav id="game-selector"></nav>
  `;

  return header;
}