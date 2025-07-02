// Estado global simulado
const state = {
  votacoes: [
    {
      id: 1,
      titulo: 'Praça ou quadra no terreno?',
      descricao: 'Ajude a decidir o futuro do terreno da rua B. O que a comunidade precisa mais?',
      tempo: '3 dias',
      opcoes: ['Praça', 'Quadra', 'Jardim', 'Estacionamento'],
      votos: [60, 40, 10, 5],
      local: 'Rua B, Vila Nova',
      imagens: [],
      bairro: 'Vila Nova',
      status: 'em andamento',
    },
    {
      id: 2,
      titulo: 'Qual escola precisa de reforma?',
      descricao: 'Vote na escola que mais precisa de melhorias estruturais.',
      tempo: '1 dia',
      opcoes: ['Escola A', 'Escola B', 'Escola C'],
      votos: [30, 50, 20],
      local: 'Bairro Central',
      imagens: [],
      bairro: 'Central',
      status: 'em andamento',
    }
  ],
  projetos: [
    {
      id: 1,
      nome: 'Mutirão de Limpeza',
      descricao: 'Vamos juntos limpar a praça do bairro!',
      status: 'em andamento',
      tipo: 'mutirao',
      fotos: ['https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=facearea&w=80&h=80'],
      apoiadores: 12,
      comentarios: [
        {usuario: 'Ana', texto: 'Estarei lá!'},
        {usuario: 'João', texto: 'Ótima iniciativa!'}
      ]
    },
    {
      id: 2,
      nome: 'Vaquinha para brinquedos',
      descricao: 'Ajude a renovar o parquinho das crianças.',
      status: 'pendente',
      tipo: 'vaquinha',
      fotos: [],
      apoiadores: 5,
      comentarios: []
    }
  ],
  marcadores: [
    {id: 1, tipo: 'problema', titulo: 'Buraco na rua A', descricao: 'Buraco perigoso próximo ao ponto de ônibus.', situacao: 'novo', local: 'Rua A', cor: 'laranja'},
    {id: 2, tipo: 'projeto', titulo: 'Plantio de árvores', descricao: 'Mutirão para plantar árvores na praça.', situacao: 'em andamento', local: 'Praça Central', cor: 'verde'},
    {id: 3, tipo: 'votacao', titulo: 'Nova iluminação', descricao: 'Votação aberta para escolher novo sistema de iluminação.', situacao: 'em votação', local: 'Rua C', cor: 'azul'}
  ],
  usuario: {
    nome: 'Marcos Silva',
    bairro: 'Vila Nova',
    foto: 'https://randomuser.me/api/portraits/men/32.jpg',
    nivel: 'Ouro',
    votos: 12,
    projetos: 3,
    problemas: 2,
    bio: 'Morador e entusiasta da comunidade.',
    pontos: 1200,
    config: { idioma: 'pt-BR', notificacoes: true, privacidade: 'pública' }
  },
  notificacoes: [
    {id: 1, texto: 'Nova votação: Praça ou quadra?', lida: false},
    {id: 2, texto: 'Mutirão de limpeza sábado!', lida: false},
    {id: 3, texto: 'Você ganhou um selo de Engajamento!', lida: true}
  ],
  gamificacao: {
    nivel: 'Ouro',
    pontos: 1200,
    selos: ['Engajamento', 'Apoiador', 'Líder Comunitário']
  }
};

// Utilitários
function closeModal() {
  document.getElementById('modal').style.display = 'none';
}
function openModal(content) {
  const modal = document.getElementById('modal');
  modal.innerHTML = `<div class='modal-content'>${content}<button class='btn btn-danger' onclick='closeModal()'>Fechar</button></div>`;
  modal.style.display = 'flex';
}
window.closeModal = closeModal; // para onclick inline

// Telas
const pages = {
  home: () => `
    <div class="card card-enquete">
      <div class="card-title"><i data-lucide="flame"></i>Enquete do dia</div>
      <div style="font-size:1.2rem;font-weight:bold;margin-bottom:0.7rem;">${state.votacoes[0].titulo}</div>
      <div id="enquete-opcoes" style="display:flex;gap:0.7rem;flex-wrap:wrap;">
        ${state.votacoes[0].opcoes.map((op,i)=>`<button class="btn btn-enquete" data-idx="${i}">${op}</button>`).join('')}
      </div>
      <div style="color:#fff; font-size:0.95rem;">⏳ Faltam ${state.votacoes[0].tempo}</div>
    </div>
    <div class="card card-feed-votacoes">
      <div class="card-title"><i data-lucide="bar-chart-2"></i>Votações em andamento</div>
      ${state.votacoes.map(v=>`
        <div class="feed-item-votacao">
          <div>
            <div style="font-weight:bold;">${v.titulo}</div>
            <div class="chip primary">${v.tempo} restantes</div>
          </div>
          <div style="min-width:120px;">
            <div class="progress-bar"><div class="progress-bar-inner" style="width:${Math.round((v.votos[0]/(v.votos.reduce((a,b)=>a+b,0)||1))*100)}%"></div></div>
            <button class="btn btn-outline btn-sm" onclick="showVotacaoDetail(${v.id})">Votar</button>
          </div>
        </div>
      `).join('')}
    </div>
    <div class="card card-feed-projetos">
      <div class="card-title"><i data-lucide="handshake"></i>Projetos ativos</div>
      <div class="feed-projetos-list">
        ${state.projetos.filter(p=>p.status==='em andamento').map(p=>`
          <div class="feed-item-projeto">
            <img src="${p.fotos[0]||'https://placehold.co/48x48'}" class="feed-projeto-img"/>
            <div style="flex:1;">
              <div style="font-weight:bold;">${p.nome}</div>
              <div class="chip success">🟢 Em andamento</div>
              <div class="progress-bar"><div class="progress-bar-inner" style="width:${Math.min(p.apoiadores*10,100)}%"></div></div>
              <button class="btn btn-success btn-sm" onclick="showProjetoDetail(${p.id})">Apoiar</button>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
    <div class="card card-feed-avisos">
      <div class="card-title"><i data-lucide="megaphone"></i>Avisos importantes</div>
      <div style="display:flex;flex-direction:column;gap:0.5em;">
        <div class="chip danger">Mutirão de limpeza sábado às 9h</div>
        <div class="chip primary">Nova votação sobre iluminação pública</div>
        <div class="chip">Evento: Feira de Saúde domingo</div>
      </div>
    </div>
    <div class="card card-gamificacao">
      <div class="card-title"><i data-lucide="award"></i>Seu Engajamento</div>
      <div style="display:flex;align-items:center;gap:1rem;">
        <div style="font-size:2.2rem;">🥇</div>
        <div>
          <div><b>Nível:</b> ${state.gamificacao.nivel}</div>
          <div><b>Pontos:</b> ${state.gamificacao.pontos}</div>
          <div>Selos: ${state.gamificacao.selos.map(s=>`<span style='margin-right:0.3rem;'>🏅${s}</span>`).join('')}</div>
        </div>
      </div>
      <div style="margin-top:0.7rem;">
        <div class="progress-bar"><div class="progress-bar-inner" style="width:${Math.min(state.gamificacao.pontos/15,100)}%"></div></div>
      </div>
    </div>
    <div class="card card-feed-ranking">
      <div class="card-title"><i data-lucide="trending-up"></i>Ranking dos bairros</div>
      <ol style="margin-left:1.2rem;">
        <li><span class="chip primary">Vila Nova 🥇</span></li>
        <li><span class="chip">Central 🥈</span></li>
        <li><span class="chip">Jardim das Flores 🥉</span></li>
      </ol>
    </div>
    <div class="card card-feed-eventos">
      <div class="card-title"><i data-lucide="calendar"></i>Próximos eventos</div>
      <div style="display:flex;flex-direction:column;gap:0.5em;">
        <div class="chip primary">Mutirão de limpeza - Sábado 9h</div>
        <div class="chip">Feira de Saúde - Domingo 14h</div>
        <div class="chip">Reunião do Conselho - Segunda 19h</div>
      </div>
    </div>
    <div class="card card-feed-atividades">
      <div class="card-title"><i data-lucide="activity"></i>Atividades recentes</div>
      <div class="timeline">
        <div class="timeline-item"><span class="chip success">Hoje</span> Você apoiou o projeto <b>Mutirão de Limpeza</b></div>
        <div class="timeline-item"><span class="chip">Ontem</span> Você votou em <b>Praça ou quadra no terreno?</b></div>
        <div class="timeline-item"><span class="chip">2 dias</span> Comentou: "Ótima iniciativa!" em <b>Mutirão de Limpeza</b></div>
      </div>
    </div>
  `,
  mapa: () => `
    <div class="card">
      <div class="card-title"><i data-lucide="map-pin"></i>Mapa da Comunidade</div>
      <div style="height:200px; background:#e5e7eb; border-radius:12px; display:flex; align-items:center; justify-content:center; color:#aaa; position:relative;">
        <div style="position:absolute;left:30px;top:60px;cursor:pointer;" onclick="showMarkerDetail(1)">🟠</div>
        <div style="position:absolute;left:120px;top:100px;cursor:pointer;" onclick="showMarkerDetail(2)">🟢</div>
        <div style="position:absolute;left:200px;top:40px;cursor:pointer;" onclick="showMarkerDetail(3)">🔵</div>
        <span>[Mapa ilustrativo]</span>
      </div>
      <div style="margin-top:1rem;">
        <button class="btn btn-primary" onclick="openCreateMarkerModal()"><i data-lucide="plus"></i>Adicionar marcador</button>
        <button class="btn btn-outline" onclick="openFilterModal()"><i data-lucide="filter"></i>Filtros</button>
      </div>
    </div>
    <div class="card">
      <div class="card-title"><i data-lucide="alert-circle"></i>Problemas recentes</div>
      <ul>
        ${state.marcadores.filter(m=>m.tipo==='problema').map(m=>`<li>${m.titulo} <span style="color:var(--primary)">🟠</span></li>`).join('')}
      </ul>
    </div>
  `,
  votar: () => `
    <div class="card">
      <div class="card-title"><i data-lucide="bar-chart-2"></i>Votações Populares</div>
      ${state.votacoes.map(v=>`
        <div style="margin-bottom:1.2rem;">
          <strong>${v.titulo}</strong>
          <div style="font-size:0.95rem; color:var(--secondary);">⏳ Faltam ${v.tempo}</div>
          <button class="btn btn-outline" onclick="showVotacaoDetail(${v.id})">Ver detalhes</button>
        </div>
      `).join('')}
      <button class="btn btn-primary" onclick="openCreateVotacaoModal()"><i data-lucide="plus"></i>Criar votação</button>
    </div>
  `,
  projetos: () => `
    <div class="card">
      <div class="card-title"><i data-lucide="handshake"></i>Projetos Comunitários</div>
      ${state.projetos.map(p=>`
        <div style="display:flex;align-items:center;gap:0.7rem;margin-bottom:1rem;">
          <img src="${p.fotos[0]||'https://placehold.co/60x60'}" alt="Projeto" style="width:60px;height:60px;border-radius:12px;object-fit:cover;">
          <div>
            <strong>${p.nome}</strong>
            <div style="color:${p.status==='em andamento'?'var(--success)':'var(--danger)'};font-size:0.9rem;">${p.status==='em andamento'?'🟢 Em andamento':'🔴 Pendente'}</div>
            <button class="btn btn-success" style="margin-top:0.3rem;" onclick="showProjetoDetail(${p.id})">Ver detalhes</button>
          </div>
        </div>
      `).join('')}
      <button class="btn btn-primary" onclick="openCreateProjetoModal()"><i data-lucide="plus"></i>Novo projeto</button>
    </div>
  `,
  perfil: () => `
    <div class="card" style="align-items:center;">
      <img src="${state.usuario.foto}" class="avatar" style="width:70px;height:70px;">
      <div style="font-family:var(--font-title);font-size:1.2rem;font-weight:bold;">${state.usuario.nome}</div>
      <div style="color:var(--secondary);font-size:1rem;">${state.usuario.bairro}</div>
      <div style="margin:0.5rem 0;">${state.usuario.bio}</div>
      <div style="margin:1rem 0;width:100%;">
        <div style="font-size:0.95rem;">Engajamento <span style="float:right;">${state.usuario.nivel} 🥇</span></div>
        <div style="background:var(--primary);height:8px;border-radius:4px;width:90%;margin-bottom:0.5rem;"></div>
        <div style="font-size:0.95rem;">Votações <span style="float:right;">${state.usuario.votos}</span></div>
        <div style="background:var(--secondary);height:8px;border-radius:4px;width:60%;margin-bottom:0.5rem;"></div>
        <div style="font-size:0.95rem;">Projetos <span style="float:right;">${state.usuario.projetos}</span></div>
        <div style="background:var(--success);height:8px;border-radius:4px;width:30%;"></div>
        <div style="font-size:0.95rem;">Problemas mapeados <span style="float:right;">${state.usuario.problemas}</span></div>
        <div style="background:var(--danger);height:8px;border-radius:4px;width:20%;"></div>
      </div>
      <div style="margin-bottom:1rem;">
        <span style="font-size:0.95rem;">Selos: ${state.gamificacao.selos.map(s=>`<span style='margin-right:0.3rem;'>🏅${s}</span>`).join('')}</span>
      </div>
      <button class="btn btn-secondary" onclick="openConfigModal()">Configurações</button>
    </div>
    <div class="card">
      <div class="card-title"><i data-lucide="activity"></i>Atividades</div>
      <ul>
        <li>Votações participadas: ${state.usuario.votos}</li>
        <li>Projetos criados: ${state.usuario.projetos}</li>
        <li>Problemas mapeados: ${state.usuario.problemas}</li>
      </ul>
    </div>
  `
};

// Funções de detalhes e modais
window.showVotacaoDetail = function(id) {
  const v = state.votacoes.find(v=>v.id===id);
  openModal(`
    <div class='card'>
      <div class='card-title'><i data-lucide="bar-chart-2"></i>${v.titulo}</div>
      <div>${v.descricao}</div>
      <div style='margin:0.7rem 0;'>
        ${v.opcoes.map((op,i)=>`<button class='btn btn-outline' onclick='vote(${id},${i})'>${op}</button>`).join('')}
      </div>
      <div style='color:var(--secondary); font-size:0.95rem;'>⏳ Faltam ${v.tempo}</div>
      <div style='margin:1rem 0;'>
        <div style='font-weight:bold;'>Resultados:</div>
        ${v.opcoes.map((op,i)=>{
          const total = v.votos.reduce((a,b)=>a+b,0);
          const pct = total ? Math.round((v.votos[i]/total)*100) : 0;
          return `<div>${op} <span style='float:right;'>${pct}%</span></div><div style='background:${i%2===0?'var(--primary)':'var(--secondary)'};height:8px;border-radius:4px;width:${pct}%;margin-bottom:0.5rem;'></div>`;
        }).join('')}
      </div>
      <button class='btn btn-secondary' onclick='alert("Compartilhar link da votação!")'><i data-lucide="share-2"></i>Compartilhar</button>
      <button class='btn btn-outline' onclick='alert("Ver no mapa!")'><i data-lucide="map"></i>Ver no mapa</button>
    </div>
  `);
  lucide.createIcons();
}
window.vote = function(votacaoId, opcaoIdx) {
  const v = state.votacoes.find(v=>v.id===votacaoId);
  v.votos[opcaoIdx]++;
  showVotacaoDetail(votacaoId);
}
window.showProjetoDetail = function(id) {
  const p = state.projetos.find(p=>p.id===id);
  openModal(`
    <div class='card'>
      <div class='card-title'><i data-lucide="handshake"></i>${p.nome}</div>
      <div>${p.descricao}</div>
      <div style='margin:0.7rem 0;'>
        <img src='${p.fotos[0]||'https://placehold.co/120x80'}' style='width:120px;height:80px;border-radius:12px;object-fit:cover;'>
      </div>
      <div>Status: <b>${p.status==='em andamento'?'🟢 Em andamento':'🔴 Pendente'}</b></div>
      <div>Apoiadores: <b>${p.apoiadores}</b></div>
      <button class='btn btn-success' onclick='alert("Apoiado!")'>Apoiar</button>
      <button class='btn btn-secondary' onclick='alert("Compartilhar projeto!")'>Compartilhar</button>
      <div style='margin-top:1rem;'>
        <div style='font-weight:bold;'>Comentários:</div>
        <ul>${p.comentarios.map(c=>`<li><b>${c.usuario}:</b> ${c.texto}</li>`).join('')}</ul>
        <input type='text' id='comentario-projeto' placeholder='Comente...' style='width:80%;padding:0.3rem;border-radius:8px;border:1px solid #eee;margin-top:0.5rem;'>
        <button class='btn btn-outline' onclick='addComentarioProjeto(${id})'>Enviar</button>
      </div>
    </div>
  `);
  lucide.createIcons();
}
window.addComentarioProjeto = function(id) {
  const input = document.getElementById('comentario-projeto');
  if(input.value.trim()) {
    state.projetos.find(p=>p.id===id).comentarios.push({usuario: state.usuario.nome, texto: input.value});
    showProjetoDetail(id);
  }
}
window.showMarkerDetail = function(id) {
  const m = state.marcadores.find(m=>m.id===id);
  openModal(`
    <div class='card'>
      <div class='card-title'><i data-lucide="map-pin"></i>${m.titulo}</div>
      <div>${m.descricao}</div>
      <div>Local: <b>${m.local}</b></div>
      <div>Situação: <b>${m.situacao}</b></div>
      <button class='btn btn-success' onclick='alert("Apoiado!")'>Apoiar</button>
      <button class='btn btn-danger' onclick='alert("Denunciado!")'>Denunciar</button>
      <button class='btn btn-outline' onclick='alert("Comentar!")'>Comentar</button>
    </div>
  `);
  lucide.createIcons();
}
window.openCreateVotacaoModal = function() {
  openModal(`
    <div class='card'>
      <div class='card-title'><i data-lucide="plus"></i>Criar Votação</div>
      <input type='text' id='nova-votacao-titulo' placeholder='Pergunta' style='width:100%;padding:0.5rem;margin-bottom:0.5rem;'>
      <input type='text' id='nova-votacao-opcoes' placeholder='Opções (separadas por vírgula)' style='width:100%;padding:0.5rem;margin-bottom:0.5rem;'>
      <input type='text' id='nova-votacao-local' placeholder='Localização' style='width:100%;padding:0.5rem;margin-bottom:0.5rem;'>
      <button class='btn btn-primary' onclick='criarVotacao()'>Publicar</button>
    </div>
  `);
  lucide.createIcons();
}
window.criarVotacao = function() {
  const titulo = document.getElementById('nova-votacao-titulo').value;
  const opcoes = document.getElementById('nova-votacao-opcoes').value.split(',').map(s=>s.trim()).filter(Boolean);
  const local = document.getElementById('nova-votacao-local').value;
  if(titulo && opcoes.length>1 && local) {
    state.votacoes.push({id:Date.now(),titulo,descricao:'',tempo:'7 dias',opcoes,votos:opcoes.map(()=>0),local,imagens:[],bairro:state.usuario.bairro,status:'em andamento'});
    closeModal();
    showPage('votar');
  }
}
window.openCreateMarkerModal = function() {
  openModal(`
    <div class='card'>
      <div class='card-title'><i data-lucide="plus"></i>Criar Marcador</div>
      <input type='text' id='novo-marcador-titulo' placeholder='Título' style='width:100%;padding:0.5rem;margin-bottom:0.5rem;'>
      <input type='text' id='novo-marcador-desc' placeholder='Descrição' style='width:100%;padding:0.5rem;margin-bottom:0.5rem;'>
      <input type='text' id='novo-marcador-local' placeholder='Endereço ou GPS' style='width:100%;padding:0.5rem;margin-bottom:0.5rem;'>
      <select id='novo-marcador-tipo' style='width:100%;padding:0.5rem;margin-bottom:0.5rem;'>
        <option value='problema'>Problema</option>
        <option value='projeto'>Projeto</option>
        <option value='votacao'>Votação</option>
      </select>
      <button class='btn btn-primary' onclick='criarMarcador()'>Publicar</button>
    </div>
  `);
  lucide.createIcons();
}
window.criarMarcador = function() {
  const titulo = document.getElementById('novo-marcador-titulo').value;
  const descricao = document.getElementById('novo-marcador-desc').value;
  const local = document.getElementById('novo-marcador-local').value;
  const tipo = document.getElementById('novo-marcador-tipo').value;
  if(titulo && descricao && local) {
    state.marcadores.push({id:Date.now(),tipo,titulo,descricao,situacao:'novo',local,cor:tipo==='problema'?'laranja':tipo==='projeto'?'verde':'azul'});
    closeModal();
    showPage('mapa');
  }
}
window.openCreateProjetoModal = function() {
  openModal(`
    <div class='card'>
      <div class='card-title'><i data-lucide="plus"></i>Novo Projeto</div>
      <input type='text' id='novo-projeto-nome' placeholder='Nome do projeto' style='width:100%;padding:0.5rem;margin-bottom:0.5rem;'>
      <input type='text' id='novo-projeto-desc' placeholder='Descrição' style='width:100%;padding:0.5rem;margin-bottom:0.5rem;'>
      <button class='btn btn-primary' onclick='criarProjeto()'>Publicar</button>
    </div>
  `);
  lucide.createIcons();
}
window.criarProjeto = function() {
  const nome = document.getElementById('novo-projeto-nome').value;
  const descricao = document.getElementById('novo-projeto-desc').value;
  if(nome && descricao) {
    state.projetos.push({id:Date.now(),nome,descricao,status:'em andamento',tipo:'mutirao',fotos:[],apoiadores:0,comentarios:[]});
    closeModal();
    showPage('projetos');
  }
}
window.openFilterModal = function() {
  openModal(`
    <div class='card'>
      <div class='card-title'><i data-lucide="filter"></i>Filtros</div>
      <div>Filtrar por tipo e situação (simulado)</div>
      <button class='btn btn-outline' onclick='closeModal()'>Aplicar</button>
    </div>
  `);
  lucide.createIcons();
}
window.openConfigModal = function() {
  openModal(`
    <div class='card'>
      <div class='card-title'><i data-lucide="settings"></i>Configurações</div>
      <div>
        <label>Idioma: <select id='config-idioma'><option value='pt-BR'>Português</option><option value='en'>English</option></select></label>
        <br><label><input type='checkbox' id='config-notif' ${state.usuario.config.notificacoes?'checked':''}/> Notificações</label>
        <br><label>Privacidade: <select id='config-priv'><option value='pública'>Pública</option><option value='privada'>Privada</option></select></label>
      </div>
      <button class='btn btn-primary' onclick='salvarConfig()'>Salvar</button>
    </div>
  `);
  lucide.createIcons();
}
window.salvarConfig = function() {
  state.usuario.config.idioma = document.getElementById('config-idioma').value;
  state.usuario.config.notificacoes = document.getElementById('config-notif').checked;
  state.usuario.config.privacidade = document.getElementById('config-priv').value;
  closeModal();
  showPage('perfil');
}

// Notificações
function renderNotificacoes() {
  return `
    <div class='card'>
      <div class='card-title'><i data-lucide="bell"></i>Notificações</div>
      <ul>
        ${state.notificacoes.map(n=>`<li style='${n.lida?'color:#aaa;':'font-weight:bold;'}'>${n.texto}</li>`).join('')}
      </ul>
    </div>
  `;
}
window.showNotificacoes = function() {
  openModal(renderNotificacoes());
  lucide.createIcons();
}

document.querySelector('.notif-btn').addEventListener('click', showNotificacoes);

document.getElementById('fab-btn').addEventListener('click', () => {
  openCreateVotacaoModal();
});

// Função utilitária para animação de confete
function confettiAnimation(target) {
  const confetti = document.createElement('div');
  confetti.className = 'confetti';
  confetti.innerHTML = '🎉';
  confetti.style.position = 'absolute';
  confetti.style.left = '50%';
  confetti.style.top = '50%';
  confetti.style.transform = 'translate(-50%, -50%) scale(2)';
  confetti.style.fontSize = '2.5rem';
  confetti.style.pointerEvents = 'none';
  confetti.style.opacity = '1';
  confetti.style.transition = 'opacity 1s, transform 1s';
  target.appendChild(confetti);
  setTimeout(() => {
    confetti.style.opacity = '0';
    confetti.style.transform = 'translate(-50%, -80%) scale(2.5)';
  }, 100);
  setTimeout(() => {
    confetti.remove();
  }, 1200);
}

// Função para destaque animado
function animateHighlight(el) {
  el.classList.add('highlight-anim');
  setTimeout(() => el.classList.remove('highlight-anim'), 600);
}

// Após renderizar a Home
function afterHomeRender() {
  document.querySelectorAll('.btn-enquete').forEach(btn => {
    btn.addEventListener('click', function() {
      animateHighlight(this);
      confettiAnimation(this.parentElement);
      this.disabled = true;
      this.innerHTML = 'Votado!';
      setTimeout(() => {
        this.innerHTML = 'Obrigado!';
      }, 800);
    });
  });
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mousedown', () => animateHighlight(btn));
  });
}

// Navegação SPA
function showPage(page) {
  const main = document.getElementById('main-content');
  main.innerHTML = pages[page]();
  lucide.createIcons();
  document.getElementById('fab-btn').style.display = (page === 'perfil') ? 'none' : 'flex';
  if(page === 'home') afterHomeRender();
}
document.querySelectorAll('.bottom-nav button').forEach(btn => {
  btn.addEventListener('click', function() {
    document.querySelectorAll('.bottom-nav button').forEach(b => b.classList.remove('active'));
    this.classList.add('active');
    showPage(this.dataset.page);
  });
});

// Modal container
if(!document.getElementById('modal')) {
  const modal = document.createElement('div');
  modal.id = 'modal';
  modal.style = 'display:none;position:fixed;top:0;left:0;width:100vw;height:100vh;background:rgba(0,0,0,0.18);align-items:center;justify-content:center;z-index:100;';
  document.body.appendChild(modal);
}

// Inicialização
showPage('home'); 