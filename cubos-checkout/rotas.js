const express = require("express")
const rotas = express()
const {listarProdutos, listarCarrinho, adicionarProduto} = require("./controladores/controllers")

rotas.get("/produtos", listarProdutos)
rotas.get("/carrinho", listarCarrinho)
rotas.post("/carrinho/produtos", adicionarProduto)
module.exports = rotas