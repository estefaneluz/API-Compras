async function verificarEstoque(produtos, id, quantidade){
    return produtos.find(produto => produto.id === parseInt(id) && produto.estoque >= quantidade)
}

async function acharProdutoCarrinho(carrinho, id, quantidade){
    let aux = -1; 
    carrinho.produtos.forEach((produto, i) => {
        if(produto.id === parseInt(id)){
            produto.quantidade+=quantidade
            aux = i
            return;
        }
    });
    return aux
}

async function atualizarEstoque(data, id, quantidade){
    const {produtos} = data
    const produto = await verificarEstoque(produtos, id, 0)
    const i = produtos.indexOf(produto)
    produtos[i].estoque -= quantidade
    return data
}

async function atualizarCarrinho(data, produto, quantidade){
    const {carrinho} = data 
    // const i = produtos.indexOf(produto)
    // produtos[i].estoque -= quantidade
    carrinho.subtotal+= produto.preco * quantidade
    carrinho.dataDeEntrega = carrinho.produtos.length !=0 ? new Date() : null
    carrinho.valorDoFrete = (carrinho.subtotal <= 20000 && carrinho.produtos.length !=0 ) ? 5000 : 0
    carrinho.totalAPagar = carrinho.valorDoFrete + carrinho.subtotal
    return data
}

async function validarCpf(cpf){
    cpf = cpf.split("")
    return cpf.every(char => {
        return !isNaN(char)
    })
}

async function limparCarrinho(data){
    data.carrinho = {
        "produtos": [],
        "subtotal": 0,
        "dataDeEntrega": null,
        "valorDoFrete": 0,
        "totalAPagar": 0
    }
    return data;
}

async function validarUsuario(userInfo){
    const erros = []
    const {type, country, name, documents} = userInfo; 

    if(!type || !country || !name || !documents){
        erros.push("Está faltando dados do cliente. Precisa conter: type, country, name e documents.")
        return erros
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

    return erros
}

module.exports = {verificarEstoque, acharProdutoCarrinho, atualizarEstoque, atualizarCarrinho, limparCarrinho, validarUsuario}