const express = require("express")
const rotas = express()
const {listarProdutos, listarCarrinho} = require("./controladores/controllers")

rotas.get("/produtos", listarProdutos)
rotas.get("/carrinho", listarCarrinho)
module.exports = rotas