async function verificarEstoque(produtos, id, quantidade){
    return produtos.find(produto => produto.id === parseInt(id) && produto.estoque >= quantidade)
}

async function acharProdutoCarrinho(carrinho, id, quantidade){
    let aux = -1; 
    carrinho.produtos.forEach((produto, i) => {
        if(produto.id === parseInt(id)){
            produto.quantidade+=quantidade
            aux = i
            return;
        }
    });
    return aux
}

async function atualizarEstoque(data, id, quantidade){
    const {produtos} = data
    const produto = await verificarEstoque(produtos, id, 0)
    const i = produtos.indexOf(produto)
    produtos[i].estoque -= quantidade
    return data
}

async function atualizarValoresCarrinho(data, produto, quantidade){
    const {carrinho} = data 
    // const i = produtos.indexOf(produto)
    // produtos[i].estoque -= quantidade
    carrinho.subtotal+= produto.preco * quantidade
    carrinho.dataDeEntrega = carrinho.produtos.length !=0 ? new Date() : null
    carrinho.valorDoFrete = (carrinho.subtotal <= 20000 && carrinho.produtos.length !=0 ) ? 5000 : 0
    carrinho.totalAPagar = carrinho.valorDoFrete + carrinho.subtotal
    return data
}

async function validarCpf(cpf){
    cpf = cpf.split("")
    return cpf.every(char => {
        return !isNaN(char)
    })
}

async function limparCarrinho(data){
    data.carrinho = {
        "produtos": [],
        "subtotal": 0,
        "dataDeEntrega": null,
        "valorDoFrete": 0,
        "totalAPagar": 0
    }
    return data;
}

module.exports = {verificarEstoque, acharProdutoCarrinho, atualizarEstoque, atualizarValoresCarrinho, validarCpf, limparCarrinho}