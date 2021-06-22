const {lerArquivo, escreverNoArquivo} = require("../utils/bibliotecaFS")
const {verificarEstoque, acharProdutoCarrinho, atualizarValoresCarrinho, atualizarEstoque, validarCpf, limparCarrinho} = require("../utils/utils")

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
    data = await atualizarValoresCarrinho(data, produto, quantidade)
    await escreverNoArquivo(data)
    res.json(data.carrinho)
}

async function rotaLimparCarrinho(req, res){
    let data = await lerArquivo()
    data = await limparCarrinho(data)

    await escreverNoArquivo(data)
    res.json("A ação foi realizada com sucesso. O carrinho está vazio")
}

async function finalizarCompra(req, res){
    let data = await lerArquivo()
    const {carrinho} = data;
    const {type, country, name, documents} = req.body
    const erros = []
    if(data.carrinho.produtos.length===0){
        res.json("Não há produtos no carrinho")
        return;
    }

    const semEstoque = []
    await carrinho.produtos.forEach(produto => {
        verificarEstoque(data.produtos, produto.id, produto.quantidade).then(resposta => {
            if(!resposta){
                semEstoque.push({
                    id: produto.id,
                    nome: produto.nome
                })
            }
        })
    })

    if(semEstoque.length){
        res.json({
            "mensagem": "Não há estoque o suficiente dos seguintes produtos: ", 
            "produtos": semEstoque})
        return; 
    }

    if(!type || !country || !name || !documents){
        res.json("Está faltando dados do cliente. Precisa conter: type, country, name e documents (com type e number).")
        return;
    }

    if(country.length<2){
        erros.push("Precisa informar a sigla do país.")
    }
    if(type !== 'individual'){
        erros.push("O tipo precisa ser igual a 'individual'.")
    } 
    if(!name.includes(" ")){
        erros.push("Precisa informar o nome e sobrenome.")
    }

    const validarDocuments = documents.some(documento => {
        return (
            documento.hasOwnProperty("type") && documento.hasOwnProperty("number") &&
            documento.type.toLowerCase() === "cpf" && documento.number.length === 11 && validarCpf(documento.number)
        )
    })

    if(!validarDocuments){
        erros.push("Precisa conter um cpf com 11 digitos apenas númericos.")
    }

    if(erros.length>0){
        res.json(erros)
        return;
    }

    await carrinho.produtos.forEach(produto => {
        atualizarEstoque(data, produto.id, produto.quantidade).then(resposta => data = resposta )
    })
    res.json({
        "Mensagem": "Compra efetuada com sucesso!",
        carrinho})

    data = await limparCarrinho(data)

    await escreverNoArquivo(data)
}

module.exports = {listarProdutos, listarCarrinho, adicionarProduto, rotaLimparCarrinho, alterarQtdProduto, removerProdutoCarrinho, finalizarCompra}