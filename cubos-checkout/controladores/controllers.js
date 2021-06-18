const fs = require("fs/promises")
const {lerArquivo, escreverNoArquivo} = require("../bibliotecaFS")

async function listarProdutos(req, res){
    const {produtos} = await lerArquivo()
    const {categoria, precoInicial, precoFinal} = req.query

    let produtosEstoque = produtos.filter(produto => produto.estoque > 0)

    if(categoria){
        produtosEstoque = produtosEstoque.filter
        (produto => produto.categoria.toLowerCase() === categoria.toLowerCase())
    }

    if(precoInicial){
        produtosEstoque = produtosEstoque.filter
        (produto => produto.preco >= precoInicial)
    }

    if(precoFinal){
        produtosEstoque = produtosEstoque.filter
        (produto => produto.preco <= precoFinal)
    }

    res.json(produtosEstoque)
}

async function listarCarrinho(req, res){
    const {carrinho} = await lerArquivo()
    res.json(carrinho)
}

async function adicionarProduto(req, res){
    const {produtos, carrinho} = await lerArquivo()
    const {id, quantidade } = req.body

    const produto = produtos.find(produto => produto.id === parseInt(id) && produto.estoque >= quantidade)
    const index = produtos.indexOf(produto)

    if(produto){
        produtos[index].estoque -= quantidade
        carrinho.produtos.push(produto)
        carrinho.subtotal+= produto.preco * quantidade
        //falta adicionar a data
        carrinho.valorDoFrete += carrinho.subtotal <= 20000 ? 5000 : 0
        carrinho.totalAPagar = carrinho.valorDoFrete + carrinho.subtotal
        res.json(carrinho)
        //atualizar no arquivo dps
        return;
    }
    res.json("Produto não existe ou não tem estoque o suficiente")
}

module.exports = {listarProdutos, listarCarrinho, adicionarProduto}