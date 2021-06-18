const fs = require("fs/promises")
const {lerArquivo} = require("../bibliotecaFS")

async function listarProdutos(req, res){
    const {produtos} = await lerArquivo()
    const {categoria, precoInicial, precoFinal} = req.query

    let produtosEstoque = produtos.filter(produto => produto.estoque > 0)

    if(categoria){
        produtosEstoque = produtosEstoque.filter
        (produto => produto.categoria.toLowerCase() === categoria.toLowerCase())
    }
    
    res.json(produtosEstoque)
}

module.exports = {listarProdutos}