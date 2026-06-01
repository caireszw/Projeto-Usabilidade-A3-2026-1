console.log("Catálogo de Produtos iniciado");

let produtos = [];
let favoritos = obterFavoritos();

const templateCard = `
    <div class="col-12 col-sm-6 col-md-4 col-lg-3 col-xl-2 mb-4">
        <div class="card h-100">
            <img src="{{thumbnail}}" class="card-img-top" alt="{{title}}">

            <div class="card-body">
                <div class="fw-bold produto-titulo">{{title}}</div>

                <div class="text-success fw-bold preco mt-2">
                    R$ {{price}}
                </div>

                <div class="text-secondary categoria mb-2">
                    {{category}}
                </div>

                <p class="text-secondary produto-descricao">
                    {{descriptionCurta}}
                </p>

                <div class="d-flex justify-content-between align-items-center btn-favorito">
                    <iconify-icon icon="{{iconeFavorito}}" class="fs-4 {{classeFavorito}}"></iconify-icon>

                    <button class="btn btn-outline-warning btn-sm" onclick="favoritarProduto({{id}})">
                        <iconify-icon icon="mdi:cards-heart-outline" class="me-1"></iconify-icon>
                        {{textoBotao}}
                    </button>
                </div>
            </div>
        </div>
    </div>
`;

const template = Handlebars.compile(templateCard);

async function iniciar() {
    try {
        produtos = await carregarProdutos();

        renderProdutos(produtos);
        renderFavoritos();

        console.log("Produtos carregados:", produtos);
    } catch (erro) {
        console.error(erro);

        document.getElementById("ProductsList").innerHTML = `
            <div class="col-12">
                <p class="mensagem-vazia">Erro ao carregar os produtos.</p>
            </div>
        `;
    }
}

function prepararProduto(produto) {
    const favoritado = favoritos.includes(produto.id);

    return {
        ...produto,
        descriptionCurta: produto.description.length > 70
            ? produto.description.substring(0, 70) + "..."
            : produto.description,
        iconeFavorito: favoritado ? "mdi:cards-heart" : "mdi:cards-heart-outline",
        classeFavorito: favoritado ? "favoritado" : "text-secondary",
        textoBotao: favoritado ? "Desfavoritar" : "Favoritar"
    };
}

function renderProdutos(lista) {
    let contentHtml = "";

    for (let idx in lista) {
        const produto = prepararProduto(lista[idx]);
        contentHtml = contentHtml + template(produto);
    }

    if (lista.length === 0) {
        contentHtml = `
            <div class="col-12">
                <p class="mensagem-vazia">Nenhum produto encontrado.</p>
            </div>
        `;
    }

    document.getElementById("ProductsList").innerHTML = contentHtml;
}

function renderFavoritos() {
    let favoritosHtml = "";

    const produtosFavoritos = produtos.filter(produto =>
        favoritos.includes(produto.id)
    );

    for (let idx in produtosFavoritos) {
        const produto = prepararProduto(produtosFavoritos[idx]);
        favoritosHtml = favoritosHtml + template(produto);
    }

    if (produtosFavoritos.length === 0) {
        favoritosHtml = `
            <div class="col-12">
                <p class="mensagem-vazia">Nenhum produto favoritado ainda.</p>
            </div>
        `;
    }

    document.getElementById("FavoritesList").innerHTML = favoritosHtml;
}

function favoritarProduto(id) {
    if (favoritos.includes(id)) {
        favoritos = favoritos.filter(produtoId => produtoId !== id);
    } else {
        favoritos.push(id);
    }

    salvarFavoritos(favoritos);

    const textoBusca = document.getElementById("campoBusca").value.toLowerCase();

    const produtosFiltrados = produtos.filter(produto =>
        produto.title.toLowerCase().includes(textoBusca)
    );

    renderProdutos(produtosFiltrados);
    renderFavoritos();
}

function buscarProdutos() {
    const textoBusca = document.getElementById("campoBusca").value.toLowerCase();

    const produtosFiltrados = produtos.filter(produto =>
        produto.title.toLowerCase().includes(textoBusca)
    );

    renderProdutos(produtosFiltrados);
}

document.getElementById("campoBusca").addEventListener("input", buscarProdutos);

iniciar();

console.log("ok");
