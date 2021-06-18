const express = require("express")
const rotas = express()
const {listarProdutos} = require("./controladores/controllers")

rotas.get("/produtos", listarProdutos)

module.exports = rotas