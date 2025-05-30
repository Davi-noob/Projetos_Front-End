function getColumnClass(columnId) {
  switch(columnId) {
    case 'emAberto': return 'em-aberto-card';
    case 'bid': return 'bid-card';
    case 'emAndamento': return 'em-andamento-card';
    case 'entregue': return 'entregue-card';
    default: return '';
  }
}

function saveToLocalStorage() {
  const state = [];
  document.querySelectorAll('.column').forEach(column => {
    column.querySelectorAll('.card').forEach(card => {
      state.push({
        id: card.id,
        text: card.querySelector('span').textContent,
        column: column.id
      });
    });
  });
  localStorage.setItem('kanbanState', JSON.stringify(state));
}

function loadFromLocalStorage() {
  const state = JSON.parse(localStorage.getItem('kanbanState')) || [];
  state.forEach(item => {
    const column = document.getElementById(item.column);
    if (column) {
      const card = document.createElement('div');
      card.className = `card ${getColumnClass(item.column)}`;
      card.id = item.id;
      card.draggable = true;

      const textSpan = document.createElement('span');
      textSpan.textContent = item.text;
      card.appendChild(textSpan);

      const removeBtn = document.createElement('button');
      removeBtn.className = 'remove-btn';
      removeBtn.textContent = 'X';
      removeBtn.onclick = () => {
        card.remove();
        saveToLocalStorage();
      };
      card.appendChild(removeBtn);

      card.addEventListener('dragstart', e => {
        e.dataTransfer.setData('id', card.id);
      });

      column.appendChild(card);
    }
  });
}

function addTask() {
  const taskText = document.getElementById('taskInput').value.trim();
  const selectedColumn = document.getElementById('columnSelect').value;

  if (!taskText) return;

  const card = document.createElement('div');
  card.className = `card ${getColumnClass(selectedColumn)}`;
  card.id = `card-${Date.now()}`;
  card.draggable = true;

  const textSpan = document.createElement('span');
  textSpan.textContent = taskText;
  card.appendChild(textSpan);

  const removeBtn = document.createElement('button');
  removeBtn.className = 'remove-btn';
  removeBtn.textContent = 'X';
  removeBtn.onclick = () => {
    card.remove();
    saveToLocalStorage();
  };
  card.appendChild(removeBtn);

  card.addEventListener('dragstart', e => {
    e.dataTransfer.setData('id', card.id);
  });

  document.getElementById(selectedColumn).appendChild(card);
  document.getElementById('taskInput').value = '';
  saveToLocalStorage();
}

document.querySelectorAll('.column').forEach(column => {
  column.addEventListener('dragover', e => e.preventDefault());

  column.addEventListener('drop', e => {
    e.preventDefault();
    const cardId = e.dataTransfer.getData('id');
    const draggedCard = document.getElementById(cardId);

    if (draggedCard) {
      draggedCard.className = `card ${getColumnClass(column.id)}`;
      column.appendChild(draggedCard);
      saveToLocalStorage();
    }
  });
});

window.onload = loadFromLocalStorage;
