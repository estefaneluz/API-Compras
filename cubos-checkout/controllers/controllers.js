const {lerArquivo, escreverNoArquivo} = require("../utils/bibliotecaFS")
const {verificarEstoque, acharProdutoCarrinho, atualizarValoresCarrinho, atualizarEstoque} = require("../utils/utils")

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
    let data = await lerArquivo()
    const {id, quantidade } = req.body

    const produto = await verificarEstoque(data.produtos, id, quantidade)

    if(produto){
        //se o produto já tiver no carrinho: 
        const resultado = await acharProdutoCarrinho(data.carrinho, id, quantidade)
        //caso o produto não esteja: 
        if(resultado===-1){
            const {id: idProduto, estoque, ...outros} = produto
            data.carrinho.produtos.push({"id": idProduto, quantidade, ...outros})
        } 

        data = await atualizarEstoque(data, id, quantidade)
        data = await atualizarValoresCarrinho(data, produto, quantidade)
        await escreverNoArquivo(data)
        res.json(data.carrinho)
        return;
    }
    res.json("Produto não existe ou não tem estoque o suficiente")
}

async function alterarQtdProduto(req, res){
    let data = await lerArquivo()
    const {idProduto} = req.params
    const {quantidade} = req.body

    const index = await acharProdutoCarrinho(data.carrinho, idProduto, quantidade)
    console.log(data.carrinho.produtos[index])
    if(index===-1){
        res.json("O produto informado não está no carrinho.")
        return; 
    }
    const produto = await verificarEstoque(data.produtos, idProduto, quantidade)
    if(!produto){
        res.json("Não há estoque o suficiente do produto.")
        return;
    }

    if(data.carrinho.produtos[index].quantidade < 0){
        res.json("Você não pode remover mais itens do que possui no carrinho.")
        return;
    } else if (data.carrinho.produtos[index].quantidade === 0){
        data.carrinho.produtos.splice(index, 1)
    }

    data = await atualizarEstoque(data, idProduto, quantidade)
    data = await atualizarValoresCarrinho(data, produto, quantidade)
    await escreverNoArquivo(data)
    res.json(data.carrinho)
    
}

async function removerProdutoCarrinho(req, res){
    let data = await lerArquivo()
    const {produtos} = data.carrinho
    const {idProduto} = req.params
    const index = await acharProdutoCarrinho(data.carrinho, idProduto, 0)
    if(index===-1){
        res.json("O produto informado não está no carrinho.")
        return; 
    }
    const produto = produtos[index]
    const quantidade = produto.quantidade * (-1)
    produtos.splice(index, 1)
    data = await atualizarEstoque(data, idProduto, quantidade)
    data = await atualizarValoresCarrinho(data, produto, quantidade)
    await escreverNoArquivo(data)
    res.json(data.carrinho)
}

async function limparCarrinho(req, res){
    const data = await lerArquivo()
    data.carrinho = {
        "produtos": [],
        "subtotal": 0,
        "dataDeEntrega": null,
        "valorDoFrete": 0,
        "totalAPagar": 0
    }

    await escreverNoArquivo(data)
    res.json("A ação foi realizada com sucesso. O carrinho está vazio")
}

module.exports = {listarProdutos, listarCarrinho, adicionarProduto, limparCarrinho, alterarQtdProduto, removerProdutoCarrinho}