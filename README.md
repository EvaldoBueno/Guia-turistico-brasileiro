# 🏖️ Guia PraiasBrasil — Sistema de Gestão de Destinos Costeiros

Plataforma digital corporativa focada no mapeamento, curadoria e gestão do ecossistema costeiro do Brasil. O projeto foi desenvolvido como trabalho final para a disciplina de programaçao para web, aplicando conceitos avançados de arquitetura de software, usabilidade e persistência de dados no ecossistema Front-end.


## 🛠️ Recursos e Funcionalidades

### 🌐 Área Pública (Experiência do Usuário)
* **Apresentação Institucional:** Seção "Sobre Nós" contendo a Missão, Visão e Valores da plataforma corporativa.
* **Catálogo Interativo:** Exibição dinâmica dos destinos costeiros utilizando Cards visuais responsivos.
* **Busca Avançada:** Filtro em tempo real por nome do destino ou sigla do estado.
* **Ordenação Inteligente:** Classificação por ordem alfabética (A-Z), preferência de curtidas ou menor custo.
* **Sistema de Favoritos (Engajamento):** Permite favoritar destinos e visualizá-los em uma aba exclusiva (salvo via `localStorage`).
* **Histórico de Navegação:** Registro automático dos últimos 10 destinos visualizados pelo usuário, com data e hora.
* **Módulo de Feedback:** Seção de comentários dinâmicos na página de detalhes de cada praia.
* **Formulário de Contato:** Validação nativa de dados para suporte e parcerias.

### 🔑 Área Administrativa (Módulo Operacional)
* **Autenticação de Segurança:** Tela de login restrita para administradores do sistema (Simulado via `sessionStorage`).
* **CRUD Completo de Serviços:**
    * **Create:** Cadastro de novas praias com validação de campos, tags de infraestrutura, comércio e URL de imagem.
    * **Read:** Tabela administrativa listando todos os dados do banco.
    * **Update:** Edição ágil de destinos diretamente pela tabela operacional.
    * **Delete:** Exclusão segura de registros com pop-up de confirmação.

---

## 📐 Arquitetura do Projeto (Padrão MVC)

O ecossistema do projeto foi estruturado seguindo rigorosamente o padrão **MVC (Model-View-Controller)** de forma desacoplada no ambiente Client-Side:

* **Model (Camada de Dados):** Centralizado no objeto `LocalModel` dentro do arquivo `app.js`. É o responsável por gerenciar toda a persistência de dados local simulada através da API `localStorage` do navegador.
* **View (Camada de Interface):** Representada pelos arquivos `index.html` (portal público) e `admin.html` (painel administrativo), estruturados de forma semântica e estilizados pelo arquivo `estilo.css`.
* **Controller (Camada de Lógica):** Mapeado nos objetos literais `App` e `AppAdmin` (em `app.js`), que interceptam as ações do usuário (cliques, digitação, envios de formulário), processam as regras de negócio e comandam a atualização da View.

---

## 💻 Tecnologias Utilizadas

* **HTML5:** Estruturação semântica das seções e views.
* **CSS3:** Design responsivo adaptável a dispositivos móveis e desktops, utilizando variáveis nativas (`:root`) para paleta de cores náutica.
* **JavaScript Vanilla (ES6+):** Lógica de programação pura, manipulação assíncrona do DOM e controle de estado do sistema.
* **Web Storage API:** Utilização de `localStorage` para persistência dos dados e `sessionStorage` para controle de sessão do administrador.

---

## 👥 Desenvolvedor
* **Nome:** evaldo bueno
* **Curso:** analise e desenvolvimento de sistemas
