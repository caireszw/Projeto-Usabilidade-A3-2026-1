async function carregarProdutos() {
    const response = await fetch("https://dummyjson.com/products");

    if (!response.ok) {
        throw new Error("Erro ao carregar produtos da API");
    }

    const data = await response.json();

    return data.products;
}
