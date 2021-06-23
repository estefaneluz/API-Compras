const { lerArquivo, escreverNoArquivo } = require("../utils/bibliotecaFS");
const instanciaAxios = require("../services/pagarme");
const fs = require("fs/promises");
const { add } = require("date-fns");
const {
  verificarEstoque,
  acharProdutoCarrinho,
  atualizarCarrinho,
  atualizarEstoque,
  limparCarrinho,
  validarUsuario,
  formatarCarrinho,
  formatarPedido,
} = require("../utils/utils");

async function listarProdutos(req, res) {
  const { produtos } = await lerArquivo();
  const { categoria, precoInicial, precoFinal } = req.query;

  let produtosEstoque = produtos.filter((produto) => produto.estoque > 0);
  //tirar esses if, ver se sem eles funciona
  if (categoria) {
    produtosEstoque = produtosEstoque.filter(
      (produto) => produto.categoria.toLowerCase() === categoria.toLowerCase()
    );
  }

  if (precoInicial) {
    produtosEstoque = produtosEstoque.filter(
      (produto) => produto.preco >= precoInicial
    );
  }

  if (precoFinal) {
    produtosEstoque = produtosEstoque.filter(
      (produto) => produto.preco <= precoFinal
    );
  }

  res.status(200).json(produtosEstoque);
}

async function listarCarrinho(req, res) {
  const { carrinho } = await lerArquivo();
  const carrinhoFormatado = await formatarCarrinho(carrinho);
  res.status(200).json(carrinhoFormatado);
}

async function adicionarProduto(req, res) {
  let data = await lerArquivo();
  const { id, quantidade } = req.body;

  const produto = await verificarEstoque(data.produtos, id, quantidade);

  if (!produto) {
    res
      .status(404)
      .json({ mensagem: "Produto não existe ou não tem estoque o suficiente" });
    return;
  }
  //se o produto já tiver no carrinho:
  const resultado = await acharProdutoCarrinho(data.carrinho, id, quantidade);
  //caso o produto não esteja:
  if (resultado === -1) {
    const { id: idProduto, estoque, ...outros } = produto;
    data.carrinho.produtos.push({ id: idProduto, quantidade, ...outros });
  }

  data = await atualizarCarrinho(data, produto, quantidade);
  await escreverNoArquivo(data);

  const carrinhoFormatado = await formatarCarrinho(data.carrinho);
  res.status(201).json(carrinhoFormatado);
}

async function alterarQtdProduto(req, res) {
  let data = await lerArquivo();
  const { idProduto } = req.params;
  const { quantidade } = req.body;

  const index = await acharProdutoCarrinho(
    data.carrinho,
    idProduto,
    quantidade
  );
  if (index === -1) {
    res
      .status(404)
      .json({ mensagem: "O produto informado não está no carrinho." });
    return;
  }
  const produto = await verificarEstoque(data.produtos, idProduto, quantidade);
  if (!produto) {
    res
      .status(404)
      .json({ mensagem: "Não há estoque o suficiente do produto." });
    return;
  }

  if (data.carrinho.produtos[index].quantidade < 0) {
    res.status(400).json({
      mensagem: "Você não pode remover mais itens do que possui no carrinho.",
    });
    return;
  } else if (data.carrinho.produtos[index].quantidade === 0) {
    data.carrinho.produtos.splice(index, 1);
  }

  data = await atualizarCarrinho(data, produto, quantidade);
  await escreverNoArquivo(data);

  const carrinhoFormatado = await formatarCarrinho(data.carrinho);
  res.status(200).json(carrinhoFormatado);
}

async function removerProdutoCarrinho(req, res) {
  let data = await lerArquivo();
  const { produtos } = data.carrinho;
  const { idProduto } = req.params;
  const index = await acharProdutoCarrinho(data.carrinho, idProduto, 0);
  if (index === -1) {
    res
      .status(404)
      .json({ mensagem: "O produto informado não está no carrinho." });
    return;
  }
  const produto = produtos[index];
  const quantidade = produto.quantidade * -1;
  produtos.splice(index, 1);
  data = await atualizarCarrinho(data, produto, quantidade);
  await escreverNoArquivo(data);

  const carrinhoFormatado = await formatarCarrinho(data.carrinho);
  res.status(200).json(carrinhoFormatado);
}

async function rotaLimparCarrinho(req, res) {
  let data = await lerArquivo();
  data = await limparCarrinho(data);

  await escreverNoArquivo(data);
  res.status(200).json({
    mensagem: "A ação foi realizada com sucesso. O carrinho está vazio.",
  });
}

async function finalizarCompra(req, res) {
  const pedidos = await fs.readFile("./data/pedidos.json");
  let data = await lerArquivo();
  const { carrinho } = data;

  if (data.carrinho.produtos.length === 0) {
    res.status(404).json({ mensagem: "Não há produtos no carrinho." });
    return;
  }

  const semEstoque = [];
  await carrinho.produtos.forEach((produto) => {
    verificarEstoque(data.produtos, produto.id, produto.quantidade).then(
      (resposta) => {
        if (!resposta) {
          semEstoque.push({
            id: produto.id,
            nome: produto.nome,
          });
        }
      }
    );
  });

  if (semEstoque.length) {
    res.status(404).json({
      mensagem: "Não há estoque o suficiente dos seguintes produtos: ",
      produtos: semEstoque,
    });
    return;
  }

  const erros = await validarUsuario(req.body);

  if (erros.length > 0) {
    res.status(400).json({
      mensagem: "Os dados do usuário precisam ser preenchidos corretamente.",
      erros: erros,
    });
    return;
  }

  try {
    await carrinho.produtos.forEach((produto) => {
      atualizarEstoque(data, produto.id, produto.quantidade).then(
        (resposta) => (data = resposta)
      );
    });
    const dataBoleto = add(new Date(), {
      days: 3,
    });

    const pedido = await instanciaAxios.post("transactions", {
      customer: req.body,
      amount: carrinho.totalAPagar,
      payment_method: "boleto",
      boleto_expiration_date: dataBoleto,
    });

    const boleto = pedido.data;

    Object.keys(boleto).forEach((prop) => {
      if (boleto[prop] === null) {
        delete boleto[prop];
      }
    });

    const carrinhoFormatado = await formatarCarrinho(carrinho);
    const pedidoFormatado = await formatarPedido(boleto);

    const jsonPedidos = JSON.parse(pedidos);
    jsonPedidos.push({
      carrinho: carrinhoFormatado,
      boleto: pedidoFormatado,
    });

    res.status(200).json({
      mensagem: "Compra efetuada com sucesso!",
      carrinho: carrinhoFormatado,
      boleto: boleto,
    });

    fs.writeFile("./data/pedidos.json", JSON.stringify(jsonPedidos));
    data = await limparCarrinho(data);
    await escreverNoArquivo(data);
  } catch (error) {
    if (!error.response) {
      res.status(500).json({ error: error });
      return;
    }
    const { data, status } = error.response;
    res
      .status(status)
      .json({
        erro: `${data.errors[0].parameter_name} - ${data.errors[0].message}`,
      });
  }
}

module.exports = {
  listarProdutos,
  listarCarrinho,
  adicionarProduto,
  rotaLimparCarrinho,
  alterarQtdProduto,
  removerProdutoCarrinho,
  finalizarCompra,
};
