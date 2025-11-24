const campoBusca = document.getElementById("campo-busca"); 
const botaoBusca = document.getElementById("botao-busca");
const cardContainer = document.querySelector("main"); // Alterado para selecionar a tag <main>
let dados = [];

async function carregarDados() {
    if (dados.length === 0) {
        try {
            let resposta = await fetch("data.json");
            if (!resposta.ok) {
                throw new Error(`HTTP error! status: ${resposta.status}`);
            }
            dados = await resposta.json();
        } catch (error) {
            console.error("Falha ao buscar dados:", error);
            cardContainer.innerHTML = '<p class="no-results">Erro ao carregar os dados dos pioneiros.</p>';
            return false;
        }
    }
    return true;
}

async function iniciarBusca() {
    if (!(await carregarDados())) {
        return;
    }

    const termoBusca = campoBusca.value.toLowerCase().trim();

    if (termoBusca === "") {
        renderizarCards(dados, ""); // Mostra todos os resultados se a busca estiver vazia
        return; // Encerra a função aqui
    }
    
    const dadosFiltrados = dados.filter(dado =>
        dado.nome.toLowerCase().includes(termoBusca) ||
        dado.descricao.toLowerCase().includes(termoBusca) ||
        (dado.tags && dado.tags.some(tag => tag.toLowerCase().includes(termoBusca)))
    );

    renderizarCards(dadosFiltrados, termoBusca);
}

function gerarTagsHTML(tags) {
    if (!tags || tags.length === 0) return '';
    return `<div class="tag-container">${tags.map(tag => `<span class="tag">${tag}</span>`).join('')}</div>`;
}

function renderizarCards(dados, termoBusca) {
    cardContainer.innerHTML = "";

    if (dados.length === 0) {
        let mensagem = termoBusca 
            ? `Nenhum resultado encontrado para "<strong>${termoBusca}</strong>".` 
            : 'Digite um nome, tecnologia ou área para começar sua busca.';
            
        cardContainer.innerHTML = `<p class="no-results">${mensagem}</p>`;
        return;
    }

    for (let dado of dados) {
        let article = document.createElement("article");
        
        const tagsHTML = gerarTagsHTML(dado.tags);
        
        article.innerHTML = `
            <img src="${dado.imagem}" alt="Imagem de ${dado.nome}">
            <div class="card-content">
                <h2>${dado.nome}</h2> 
                <p>Período: ${dado.periodo}</p>
                <p>${dado.descricao}</p>
                ${tagsHTML} <a href="${dado.link}" target="_blank">Biografia Completa</a>
            </div>
        `;
        cardContainer.appendChild(article);
    }
}

// campoBusca.addEventListener("input", iniciarBusca); // Removido para que a busca não seja acionada a cada digitação
botaoBusca.addEventListener("click", iniciarBusca);
campoBusca.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        iniciarBusca();
    }
});

window.addEventListener('load', () => {
    carregarDados(); // Apenas carrega os dados em segundo plano
    renderizarCards([], ""); // Exibe a mensagem inicial
});
