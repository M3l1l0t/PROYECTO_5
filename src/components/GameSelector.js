export function renderGameSelector(onSelectGame) {
  const nav = document.createElement('div');

  const games = [
    { id: 'tic', name: 'Tres en raya' },
    { id: 'snake', name: 'Snake' },
    { id: 'whac', name: 'Whac-a-mole' }
  ];

  nav.innerHTML = games.map(game => `
    <button data-game="${game.id}">
      ${game.name}
    </button>
  `).join('');

  nav.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', () => {

      // quitar active a todos
      nav.querySelectorAll('button').forEach(b => b.classList.remove('active'));

      // activar actual
      btn.classList.add('active');

      console.log("🎮 Juego:", btn.dataset.game); // DEBUG

      onSelectGame(btn.dataset.game);
    });
  });

  return nav; 
}