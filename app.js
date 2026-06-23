// ==========================================
// 1. CAMADA MODEL (PERSISTÊNCIA LOCAL)
// ==========================================
const LocalModel = {
    dadosIniciais: [
        { id: "1", nome: "Baía do Sancho", estado: "PE", custo: 5, descricao: "Eleita várias vezes como a melhor praia do mundo, em Fernando de Noronha.", informacoes: "Águas esmeraldas perfeitas para o mergulho.", comercio: ["Quiosque Sancho", "Aluguel Snorkel"], infraestrutura: ["Passarelas de madeira", "Mirante"], imagem_url: "https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?w=700", likes: 12 },
        { id: "2", nome: "Praia dos Carneiros", estado: "PE", custo: 3, descricao: "Famosa por sua igrejinha de São Benedito à beira-mar.", informacoes: "Águas mansas e mornas protegidas por recifes.", comercio: ["Restaurante Bora Bora"], infraestrutura: ["Estacionamento", "Chuveiros"], imagem_url: "https://images.unsplash.com/photo-1540206351-d6465b3ac5c1?w=700", likes: 8 }
    ],

    inicializarBanco() {
        if (!localStorage.getItem('db_praias')) localStorage.setItem('db_praias', JSON.stringify(this.dadosIniciais));
        if (!localStorage.getItem('db_comentarios')) localStorage.setItem('db_comentarios', JSON.stringify({"1":[], "2":[]}));
        if (!localStorage.getItem('db_favoritos')) localStorage.setItem('db_favoritos', JSON.stringify([]));
        if (!localStorage.getItem('db_historico')) localStorage.setItem('db_historico', JSON.stringify([]));
    },
    obterPraias() { this.inicializarBanco(); return JSON.parse(localStorage.getItem('db_praias')); },
    salvarPraias(lista) { localStorage.setItem('db_praias', JSON.stringify(lista)); },
    obterComentarios() { this.inicializarBanco(); return JSON.parse(localStorage.getItem('db_comentarios')); },
    salvarComentarios(obj) { localStorage.setItem('db_comentarios', JSON.stringify(obj)); },
    obterFavoritos() { this.inicializarBanco(); return JSON.parse(localStorage.getItem('db_favoritos')); },
    salvarFavoritos(lista) { localStorage.setItem('db_favoritos', JSON.stringify(lista)); },
    obterHistorico() { this.inicializarBanco(); return JSON.parse(localStorage.getItem('db_historico')); },
    salvarHistorico(lista) { localStorage.setItem('db_historico', JSON.stringify(lista)); }
};

// ==========================================
// 2. CAMADA CONTROLLER - SITE PÚBLICO
// ==========================================
const App = {
    ultimaSecaoAtiva: 'praias',
    inicializar() {
        LocalModel.inicializarBanco();
        if(document.getElementById('lista-praias')) { this.renderizarPraias(); this.renderizarFavoritos(); this.renderizarHistorico(); }
    },
    navegar(secao) {
        if (secao !== 'detalhes') this.ultimaSecaoAtiva = secao;
        document.querySelectorAll('.view-section').forEach(s => s.classList.add('hidden'));
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        if(document.getElementById(`sec-${secao}`)) document.getElementById(`sec-${secao}`).classList.remove('hidden');
        if(document.getElementById(`btn-${secao}`)) document.getElementById(`btn-${secao}`).classList.add('active');
    },
    voltarParaLista() { this.navegar(this.ultimaSecaoAtiva); },
    processarFiltrosEOrdenacao() {
        const termo = document.getElementById('input-busca').value.toLowerCase();
        const criterio = document.getElementById('select-ordenacao').value;
        let lista = LocalModel.obterPraias().filter(p => p.nome.toLowerCase().includes(termo) || p.estado.toLowerCase().includes(termo));
        if (criterio === "az") lista.sort((a,b) => a.nome.localeCompare(b.nome));
        else if (criterio === "mais-gostos") lista.sort((a,b) => (b.likes || 0) - (a.likes || 0));
        else if (criterio === "mais-baratas") lista.sort((a,b) => a.custo - b.custo);
        this.renderizarPraias(lista);
    },
    renderizarPraias(dadosFiltrados = null) {
        const container = document.getElementById('lista-praias');
        if (!container) return;
        container.innerHTML = (dadosFiltrados || LocalModel.obterPraias()).map(p => this.criarCardHTML(p, true)).join('');
    },
    criarCardHTML(praia, daListaGeral = true) {
        const isFav = LocalModel.obterFavoritos().includes(praia.id);
        const totalComents = LocalModel.obterComentarios()[praia.id]?.length || 0;
        return `
            <div class="grid-item">
                <div class="img-container"><img src="${praia.imagem_url}" onclick="App.verDetalhes('${praia.id}')" style="cursor:pointer;"></div>
                <div class="grid-content">
                    <h3>${praia.nome} - ${praia.estado}</h3>
                    <div style="font-size:9pt; margin: 5px 0; color:var(--accent);">👍 ${praia.likes || 0} | 💬 ${totalComents} | ${"💰".repeat(praia.custo)}</div>
                    <p style="font-size:10pt;">${praia.descricao}</p>
                    <div style="margin-top:10px; display:flex; justify-content:space-between;">
                        <button class="btn" onclick="App.verDetalhes('${praia.id}')">Detalhes</button>
                        <button class="btn-fav-toggle" onclick="App.alternarFavorito('${praia.id}', ${daListaGeral})">${isFav ? '❤️' : '🤍'}</button>
                    </div>
                </div>
            </div>`;
    },
    alternarFavorito(id, daListaGeral = true) {
        let favs = LocalModel.obterFavoritos();
        favs = favs.includes(id) ? favs.filter(fId => fId !== id) : [...favs, id];
        LocalModel.salvarFavoritos(favs);
        this.processarFiltrosEOrdenacao(); this.renderizarFavoritos();
        if(!daListaGeral) this.verDetalhes(id);
    },
    verDetalhes(id) {
        const praia = LocalModel.obterPraias().find(p => p.id === id);
        if(!praia) return;
        let hist = LocalModel.obterHistorico();
        hist.unshift({ nome: praia.nome, data: new Date().toLocaleString('pt-BR') });
        LocalModel.salvarHistorico(hist.slice(0, 10)); this.renderizarHistorico();

        const listaComents = LocalModel.obterComentarios()[id] || [];
        document.getElementById('conteudo-detalhes').innerHTML = `
            <h2>${praia.nome} (${praia.estado})</h2>
            <div class="detalhes-container" style="margin-top:15px;">
                <img class="detalhes-img" src="${praia.imagem_url}">
                <div>
                    <p>${praia.descricao} ${praia.informacoes || ''}</p>
                    <h4 style="margin-top:10px;">🏪 Comércio:</h4><div>${praia.comercio?.map(i => `<span class="tag">${i}</span>`).join('')}</div>
                    <h4 style="margin-top:10px;">🛠️ Infraestrutura:</h4><div>${praia.infraestrutura?.map(i => `<span class="tag">${i}</span>`).join('')}</div>
                </div>
            </div>
            <div style="margin-top:20px;">
                <h3>Feedbacks (${listaComents.length})</h3>
                <div>${listaComents.map(c => `<div class="comentario-item"><strong>${c.autor}:</strong> ${c.texto}</div>`).join('')}</div>
                <form onsubmit="App.adicionarComentario(event, '${praia.id}')" style="margin-top:10px;">
                    <input type="text" id="coment-nome" placeholder="Seu nome" required><br>
                    <textarea id="coment-texto" placeholder="Opinião..." required style="margin-top:5px;"></textarea><br>
                    <button type="submit" class="btn" style="margin-top:5px;">Comentar</button>
                </form>
            </div>`;
        this.navegar('detalhes');
    },
    adicionarComentario(e, praiaId) {
        e.preventDefault();
        let coments = LocalModel.obterComentarios();
        if(!coments[praiaId]) coments[praiaId] = [];
        coments[praiaId].unshift({ autor: document.getElementById('coment-nome').value, texto: document.getElementById('coment-texto').value });
        LocalModel.salvarComentarios(coments); this.verDetalhes(praiaId);
    },
    renderizarFavoritos() {
        const container = document.getElementById('lista-favoritos'); if(!container) return;
        const favs = LocalModel.obterPraias().filter(p => LocalModel.obterFavoritos().includes(p.id));
        container.innerHTML = favs.length === 0 ? "<p>Nenhum favorito salvo.</p>" : favs.map(p => this.criarCardHTML(p, false)).join('');
    },
    renderizarHistorico() {
        const container = document.getElementById('lista-historico'); if(!container) return;
        container.innerHTML = LocalModel.obterHistorico().map(h => `<li><span>👀 ${h.nome}</span><small>${h.data}</small></li>`).join('');
    },
    limparHistorico() { LocalModel.salvarHistorico([]); this.renderizarHistorico(); },
    enviarContato(e) { e.preventDefault(); alert('Mensagem Comercial enviada!'); document.getElementById('form-contato').reset(); }
};

// ==========================================
// 3. CAMADA CONTROLLER - PAINEL ADM (CRUD)
// ==========================================
const AppAdmin = {
    login(e) {
        e.preventDefault();
        if(document.getElementById('login-user').value === 'admin' && document.getElementById('login-pass').value === 'admin') {
            sessionStorage.setItem('admin_autenticado', 'true'); this.exibirPainel();
        } else alert('Acesso negado!');
    },
    exibirPainel() {
        document.getElementById('sec-login')?.classList.add('hidden');
        document.getElementById('sec-dashboard')?.classList.remove('hidden');
        document.getElementById('btn-logout')?.classList.remove('hidden');
        this.atualizarTabela();
    },
    logout() { sessionStorage.removeItem('admin_autenticado'); window.location.reload(); },
    atualizarTabela() {
        const corpo = document.getElementById('tabela-corpo-admin'); if(!corpo) return;
        corpo.innerHTML = LocalModel.obterPraias().map(p => `
            <tr>
                <td>#${p.id}</td><td><strong>${p.nome}</strong></td><td>${p.estado}</td><td>${"💰".repeat(p.custo)}</td>
                <td>
                    <button class="btn btn-success" style="padding:4px 8px;" onclick="AppAdmin.carregarParaEditar('${p.id}')">Editar</button>
                    <button class="btn btn-danger" style="padding:4px 8px;" onclick="AppAdmin.excluirRegistro('${p.id}')">Excluir</button>
                </td>
            </tr>`).join('');
    },
    salvarRegistro(e) {
        e.preventDefault();
        let lista = LocalModel.obterPraias(); const id = document.getElementById('crud-id').value;
        const registro = {
            id: id || String(Date.now()),
            nome: document.getElementById('crud-nome').value,
            estado: document.getElementById('crud-estado').value.toUpperCase(),
            custo: parseInt(document.getElementById('crud-custo').value),
            descricao: document.getElementById('crud-desc').value,
            imagem_url: document.getElementById('crud-img').value,
            comercio: document.getElementById('crud-comercio').value.split(',').map(i => i.trim()),
            infraestrutura: document.getElementById('crud-infra').value.split(',').map(i => i.trim()),
            likes: id ? (lista.find(x => x.id === id)?.likes || 0) : 0
        };
        lista = id ? lista.map(item => item.id === id ? registro : item) : [...lista, registro];
        LocalModel.salvarPraias(lista); this.limparFormulario(); this.atualizarTabela();
    },
    carregarParaEditar(id) {
        const p = LocalModel.obterPraias().find(item => item.id === id); if(!p) return;
        document.getElementById('crud-id').value = p.id;
        document.getElementById('crud-nome').value = p.nome;
        document.getElementById('crud-estado').value = p.estado;
        document.getElementById('crud-custo').value = p.custo;
        document.getElementById('crud-desc').value = p.descricao;
        document.getElementById('crud-img').value = p.imagem_url;
        document.getElementById('crud-comercio').value = p.comercio.join(', ');
        document.getElementById('crud-infra').value = p.infrainfrastructure?.join(', ') || p.infraestrutura.join(', ');
        document.getElementById('form-titulo').innerText = "Editar Destino (Update)";
    },
    excluirRegistro(id) {
        if(confirm('Excluir este destino?')) { LocalModel.salvarPraias(LocalModel.obterPraias().filter(i => i.id !== id)); this.atualizarTabela(); }
    },
    limparFormulario() { document.getElementById('form-crud').reset(); document.getElementById('crud-id').value = ''; }
};

App.inicializar();
