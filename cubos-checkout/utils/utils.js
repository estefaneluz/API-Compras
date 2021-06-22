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

async function atualizarValoresCarrinho(data, produto, quantidade){
    const {produtos, carrinho} = data 
    const i = produtos.indexOf(produto)
    produtos[i].estoque -= quantidade
    carrinho.subtotal+= produto.preco * quantidade
    carrinho.dataDeEntrega = carrinho.produtos.length !=0 ? new Date() : null
    carrinho.valorDoFrete = (carrinho.subtotal <= 20000 && carrinho.produtos.length !=0 ) ? 5000 : 0
    carrinho.totalAPagar = carrinho.valorDoFrete + carrinho.subtotal
    return data
}

module.exports = {verificarEstoque, acharProdutoCarrinho, atualizarValoresCarrinho}