const express = require("express")
const rotas = express()
const { listarProdutos, listarCarrinho, adicionarProduto, rotaLimparCarrinho, alterarQtdProduto, removerProdutoCarrinho, finalizarCompra } = require("./controllers/controllers")

rotas.get("/produtos", listarProdutos)
rotas.get("/carrinho", listarCarrinho)
rotas.post("/carrinho/produtos", adicionarProduto)
rotas.patch("/carrinho/produtos/:idProduto", alterarQtdProduto)
rotas.delete("/carrinho/produtos/:idProduto", removerProdutoCarrinho)
rotas.delete("/carrinho", rotaLimparCarrinho)
rotas.post("/carrinho/finalizar-compra", finalizarCompra)

module.exports = rotas