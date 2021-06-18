const fs = require("fs/promises")
const {lerArquivo} = require("../bibliotecaFS")

async function listarProdutos(req, res){
    const {produtos} = await lerArquivo()
    const produtosEstoque = produtos.filter(produto => produto.estoque > 0)
    res.json(produtosEstoque)
}

module.exports = {listarProdutos}