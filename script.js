// Estado inicial
let saldo = 0;
let totalEntradas = 0;
let totalSaidas = 0;

const elSaldo = document.getElementById('saldo');
const elEntradas = document.getElementById('total-entradas');
const elSaidas = document.getElementById('total-saidas');
const txList = document.getElementById('tx-list');

// Botões principais
document.getElementById('btn-pagar').addEventListener('click', () => {
  alert('Sistema indisponível. Tente novamente mais tarde.');
});
document.getElementById('btn-investir').addEventListener('click', () => {
  alert('Sistema indisponível. Tente novamente mais tarde.');
});

// PIX modal
const modal = document.getElementById('pix-modal');
document.getElementById('btn-pix').addEventListener('click', () => {
  modal.classList.remove('hidden');
});
modal.querySelector('.close-modal').addEventListener('click', () => {
  modal.classList.add('hidden');
});

// Alternar abas
modal.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    modal.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    modal.querySelectorAll('.form').forEach(f => f.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById(`form-${tab.dataset.target}`)
      .classList.add('active');
  });
});

// Helpers
function formatMoney(v) {
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function nowId() {
  const d = new Date();
  return `${d.getFullYear()}${(d.getMonth()+1).toString().padStart(2,'0')}`
    + `${d.getDate().toString().padStart(2,'0')}`
    + `${d.getHours().toString().padStart(2,'0')}`
    + `${d.getMinutes().toString().padStart(2,'0')}`
    + `${d.getSeconds().toString().padStart(2,'0')}`;
}

function addTransaction({ tipo, valor, entrada }) {
  // remover mensagem de lista vazia
  const empty = txList.querySelector('.empty');
  if (empty) empty.remove();

  const li = document.createElement('li');
  const icone = document.createElement('img');
  icone.src = entrada ? 'assets/_icon _receber_.png' : 'assets/icon _enviar_.png';
  icone.alt = entrada ? 'Entrada' : 'Saída';
  icone.style.height = '1.2rem';
  icone.style.marginRight = '0.5rem';

  const date = new Date();
  li.innerHTML = `
    <div style="flex:1">
      <strong>${entrada ? 'Entrada' : 'Saída'}</strong>
      <div>${date.toLocaleDateString()} ${date.toLocaleTimeString()}</div>
      <div>${tipo}</div>
    </div>
    <div>
      <strong>${formatMoney(valor)}</strong><br/>
      <small>ID: ${nowId()}</small>
    </div>
  `;
  li.prepend(icone);
  txList.prepend(li);
}

// Formulário RECEBER
document.getElementById('form-receber').addEventListener('submit', e => {
  e.preventDefault();
  const cpf = document.getElementById('cpf-receber').value.trim();
  const valor = parseFloat(document.getElementById('valor-receber').value);
  const err = document.getElementById('error-receber');

  if (!cpf || isNaN(valor) || valor <= 0) {
    err.style.display = 'block';
    return;
  }
  err.style.display = 'none';

  saldo += valor;
  totalEntradas += valor;
  elSaldo.textContent = formatMoney(saldo);
  elEntradas.textContent = formatMoney(totalEntradas);

  addTransaction({ tipo: 'Transferência recebida', valor, entrada: true });
  alert('Transação realizada com sucesso');
  e.target.reset();
});

// Formulário TRANSFERIR
document.getElementById('form-transferir').addEventListener('submit', e => {
  e.preventDefault();
  const chave = document.getElementById('chave-transferir').value.trim();
  const valor = parseFloat(document.getElementById('valor-transferir').value);
  const err = document.getElementById('error-transferir');

  if (!chave || isNaN(valor) || valor <= 0) {
    err.style.display = 'block';
    return;
  }
  if (valor > saldo) {
    alert('Saldo insuficiente!');
    return;
  }
  err.style.display = 'none';

  saldo -= valor;
  totalSaidas += valor;
  elSaldo.textContent = formatMoney(saldo);
  elSaidas.textContent = formatMoney(totalSaidas);

  addTransaction({ tipo: 'Transferência enviada', valor, entrada: false });
  alert('Transação realizada com sucesso');
  e.target.reset();
});
