const express = require("express")
const rotas = express()
const {listarProdutos, listarCarrinho, adicionarProduto, limparCarrinho, alterarQtdProduto, removerProdutoCarrinho} = require("./controllers/controllers")

rotas.get("/produtos", listarProdutos)
rotas.get("/carrinho", listarCarrinho)
rotas.post("/carrinho/produtos", adicionarProduto)
rotas.patch("/carrinho/produtos/:idProduto", alterarQtdProduto)
rotas.delete("/carrinho/produtos/:idProduto", removerProdutoCarrinho)
rotas.delete("/carrinho", limparCarrinho)

module.exports = rotas