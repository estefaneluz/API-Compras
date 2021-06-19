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

async function acharProdutoCarrinho(carrinho, id, quantidade){
    let aux; 
    carrinho.produtos.forEach(produto => {
        if(produto.id === parseInt(id)){
            produto.quantidade+=quantidade
            aux = true
        }
    });
    if(!aux) return false
}

async function adicionarProduto(req, res){
    const {produtos, carrinho} = await lerArquivo()
    const {id, quantidade } = req.body

    const produto = produtos.find(produto => produto.id === parseInt(id) && produto.estoque >= quantidade)
    const index = produtos.indexOf(produto)

    if(produto){
        produtos[index].estoque -= quantidade
        carrinho.subtotal+= produto.preco * quantidade
        carrinho.dataDeEntrega = new Date()
        carrinho.valorDoFrete = carrinho.subtotal <= 20000 ? 5000 : 0
        carrinho.totalAPagar = carrinho.valorDoFrete + carrinho.subtotal

        //se o produto já tiver no carrinho: 
        const resultado = await acharProdutoCarrinho(carrinho, id, quantidade)
        //caso o produto não esteja: 
        if(resultado === false){
            const {idProduto, estoque, ...outros} = produto
            carrinho.produtos.push({"id": idProduto, quantidade, ...outros})
        } 

        await escreverNoArquivo({produtos, carrinho})
        res.json(carrinho)
        return;
    }
    res.json("Produto não existe ou não tem estoque o suficiente")
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

module.exports = {listarProdutos, listarCarrinho, adicionarProduto, limparCarrinho}