const express = require("express")
const rotas = express()

rotas.get("/produtos", (req, res)=>{
    res.send("ola")
})

module.exports = rotas