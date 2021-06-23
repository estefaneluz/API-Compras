![](https://i.imgur.com/xG74tOh.png)

# Desafio | Back-end - Módulo 2

Você acabou de ser contratado pela melhor empresa de tecnologia do mundo: a **CUBOS**.
Sua primeira tarefa como desenvolvedor é criar uma API para realizar o CHECKOUT (finalização de compra) de produtos comercializados pela **CUBOS**, porém antes de realizarmos esse CHECKOUT, nós precisamos manipular o carrinho de compras e estoque desses produtos. 

Você poderá usar a [API completa](https://desafio-backend-m02.herokuapp.com/produtos) para comparar com a sua. (Veja como utilizar no arquivo 'testes.md')

Seu papel é construir uma RESTful API que permita:

- Adicionar produtos ao carrinho
- Remover produtos do carrinho
- Atualizar quantidades dos produtos no carrinho
- Limpar o carrinho
- Obter os dados do carrinho atual, incluindo:
    - Os produtos que estão no carrinho, com seus dados
    - O subtotal do carrinho (soma total em produtos)
    - O valor do frete
    - O valor total a pagar
- Finalizar a venda (CHECKOUT)
- Manipular estoque subtraindo ou adicionando quantidades de cada produto

## Dicas:

### Manipulação de Arquivos (Biblioteca fs do NodeJS)

- Todas operações (ao adicionar, remover, atualizar um produto no carrinho) devem ser salvas no arquivo `data.json`. Para facilitar, nós iremos te dar um arquivo que faz a leitura e escrita no arquivo `data.json`, ou seja, você precisará simplesmente usar o código que já existe para fazer isso.

Para usar essas duas funções (escreverNoArquivo e lerArquivo), você precisa importar para o seu projeto o arquivo [bibliotecaFS.js](https://github.com/cubos-academy/desafio-backend-modulo2-noturno/blob/master/bibliotecaFS.js)


Veja o exemplo de como usar as funções:
* [Ler do Arquivo:](https://github.com/cubos-academy/desafio-backend-modulo2-noturno/blob/master/exemploLerDoArquivo.js) 
* [Escrever no arquivo](https://github.com/cubos-academy/desafio-backend-modulo2-noturno/blob/master/exemploEscreverNoArquivo.js)

### Estrutura base
Na pasta [cubos-checkout](https://github.com/cubos-academy/desafio-backend-modulo2-noturno/tree/master/cubos-checkout) deixamos a estrutura base para você iniciar o projeto.


## Requisitos obrigatórios
- Sua API deve seguir o padrão REST
- Seu código deve estar organizado, delimitando as responsabilidades de cada arquivo adequadamente. Ou seja, é esperado que ele tenha, no mínimo:
    - Um arquivo index.js
    - Um arquivo de rotas
    - Um pasta com controladores
- Evite códigos duplicados. Antes de copiar e colar, pense se não faz sentido esse pedaço de código estar centralizado numa função.

## Estoque

Para simular o estoque de produtos, que normalmente ficaria num banco de dados, temos um arquivo JSON contendo um array de produtos chamado 'data.json'

## Endpoints obrigatórios

#### `GET` `/produtos`

Essa rota deverá:
- Listar todos os produtos e devolver no formato de `array` de produtos;
- Listar apenas produtos que possuem estoque;
- Filtrar produtos por `categoria`;
- Filtrar produtos por `faixa de preço`;
- Filtrar produtos por `categoria` e por `faixa de preço` ao mesmo tempo.
    
Exemplos:

- `/produtos`
    - Deverá retornar todos os produtos em estoque
- `/produtos?categoria=bazar`
    - Deverá retornar todos os eletrodomésticos que tenham unidades em estoque
- `/produtos?precoInicial=10000&precoFinal=200000`
    - Deverá retornar todos os produtos que tenham unidades em estoque e custem entre 100 e 200 reais
- `/produtos?precoInicial=10000&precoFinal=200000&categoria=bazar`
    - Deverá retornar todos os produtos que tenham unidades em estoque e custem entre 100 e 200 reais e sejam eletrodomésticos

---

#### `GET` `/carrinho`

Esta rota deverá retornar:
- Uma lista (array) contendo os `produtos` que estão no carrinho, com todas as suas informações:
    - id
    - nome
    - preco
    - categoria
    - quantidade
- O `subtotal`, ou seja, o total a pagar em produtos selecionados no carrinho
- A `dataDeEntrega` que é fixada em 15 dias úteis para qualquer entrega;
- O `valorDoFrete`, que segue a seguinte lógica: 
    - Para compras `até` R$ 200,00 o valor do frete é R$ 50,00 e para compras `acima` de R$ 200,00 o frete é GRÁTIS;
- O `totalAPagar` que é a soma do subtotal com o frete.

Exemplos:

Naturalmente, o retorno dessa chamada deve variar de acordo com as possíveis chamadas que tenham sido feitas anteriormente, adicionando ou removendo produtos do carrinho.

- Para um carrinho vazio, a chamada a `/carrinho` deverá retornar
```json=
{
    "produtos": [],
    "subtotal": 0,
    "dataDeEntrega": null,
    "valorDoFrete": 0,
    "totalAPagar": 0
}
```
- Para um carrinho com produtos, a chamada a `/carrinho` deverá retornar um objeto no seguinte **formato**, embora o conteúdo possa variar:
```json=
{
  "subTotal": 1518,
  "dataDeEntrega": "2021-05-21T21:30:27.743Z", //requisicao feita em 21/05/2021
  "valorDoFrete": 5000, // porque a compra é menor que 20000
  "totalAPagar": 6518,
  "produtos": [
    {
      "id": 3,
      "quantidade": 1,
      "nome": "Limpador Cif Multiuso 800g Em Pó",
      "preco": 999,
      "categoria": "Limpeza"
    },
    {
      "id": 5,
      "quantidade": 1,
      "nome": "Biscoito BAUDUCCO Choco Biscuit Leite 80g",
      "preco": 519,
      "categoria": "Bazar"
    }
  ]
}
```

---

---
### `POST` `/carrinho/produtos`

Para esta rota, você deverá:
- Informar `id` do produto e `quantidade` a ser inserida;
- Antes de `adicionar` verificar se o produto tem estoque suficiente para a adição;
- `Retornar` o carrinho, ou seja, a lista de produtos e suas respectivas quantidades, subtotal do carrinho, total a pagar, valor do frete e data de entrega. 

Exemplo, ao passar esse `JSON` no body da requisição...

```json=
{
	"id":11,
	"quantidade":1
}
```
... o retorno deverá ser o carrinho, veja abaixo:
```json=
{
  "subTotal": 1199,
  "dataDeEntrega": "2021-05-19T17:42:11.290Z",
  "valorDoFrete": 5000,
  "totalAPagar": 6199,
  "produtos": [
    {
      "id": 11,
      "quantidade": 1,
      "nome": "Oléo de Canola QUALITÁ Pet 900ml",
      "preco": 1199,
      "categoria": "Oleo"
    }
  ]
}
```

---

### `PATCH` `/carrinho/produtos/:idProduto`

Para esta rota, você deverá deverá:
- Informar o `id` do produto e a `quantidade` a ser alterada;
- Para que a operação funcione, o carrinho deverá já conter algum produto com esse `id`. Caso contrário, a chamada deverá retornar um erro com uma mensagem adequada.
- Caso a quantidade informada seja positiva, esse número produtos será adicionados ao carrinho. Para isso, é necessário que haja estoque suficiente. Nunca deve ser possível ter mais produtos no carrinho do que em estoque.
- Caso a quantidade informada seja negativa, esse número produtos será removido ao carrinho. Caso a quantidade seja maior que o número de itens desse produto no carrinho, a operação deverá retornar erro.
- A chamada deverá retornar o carrinho completo, como no exemplo de `GET /carrinho`

Exemplos

- Para um carrinho como no exemplo de `PATCH /carrinho/produtos/3` a chamada passando os seguintes dados:

```json=
{
    "quantidade": 5
}
```

deverá retornar

```json=
{
  "subTotal": 6513,
  "dataDeEntrega": "2021-05-18T22:30:46.920Z",
  "valorDoFrete": 5000, // porque a compra é menor que 20000
  "totalAPagar": 11513,
  "produtos": [
    {
      "id": 3,
      "quantidade": 6,
      "nome": "Limpador Cif Multiuso 800g Em Pó",
      "preco": 999,
      "categoria": "Limpeza"
    },
    {
      "id": 5,
      "quantidade": 1,
      "nome": "Biscoito BAUDUCCO Choco Biscuit Leite 80g",
      "preco": 519,
      "categoria": "Bazar"
    }
  ]
}
```


---

### `DELETE` `/carrinho/produtos/:idProduto`

Para esta rota, você deverá:
- Informar o `id` do produto a ser excluido do carrinho
- Verificar se existe esse produto no carrinho. Caso não exista, deverá ser retornada uma mensagem de erro adequada
- Caso seja possível, você deverá retornar o carrinho, como no exemplo em `GET /carrinho`

Exemplo:

Para um carrinho como no exemplo de `GET /carrinho` a chamada do metodo `DELETE` para `/produtos/1` deverá retornar:

```json=
{
  "subTotal": 5994,
  "dataDeEntrega": "2021-05-18T22:36:04.749Z", // requisição feita em 18/05/2021
  "valorDoFrete": 5000, // porque a compra é menor que 20000
  "totalAPagar": 10994,
  "produtos": [
    {
      "id": 3,
      "quantidade": 6,
      "nome": "Limpador Cif Multiuso 800g Em Pó",
      "preco": 999,
      "categoria": "Limpeza"
    }
  ]
}
```

---

### `DELETE` `/carrinho`

Nesta rota você deverá limpar o carrinho completamente, removendo todos os produtos. Retorne uma mensagem informando que a operação foi realizada com sucesso.

---

### `POST` `/carrinho/finalizar-compra`

Nesta rota, você deverá, **OBRIGATORIAMENTE**:
- Verificar se o carrinho está vazio. Caso esteja, retorne uma mensagem de erro.
- Verificar se os produtos que estão no carrinho, ainda constam em estoque em quantidades suficientes. Caso não constem, deve-se retornar uma mensagem de erro adequada.
- Verificar se estão sendo recebidos os dados do cliente, no formato abaixo:
```json=
{
      "type": "individual",
      "country": "br",
      "name": "Aardvark Silva",
      "documents": [
        {
          type: "cpf",
          number: "00000000000",
        },
      ],
}
```
- Validar dados do usuário antes da emissão do boleto, ou seja verificar se:
    - O campo country tem dois dígitos
    - O campo type é 'individual' (este e-commerce só atende pessoas físicas)
    - O campo name tem, pelo menos, nome e sobrenome.
    - O campo documents contem um cpf com 11 dígitos apenas numéricos.
- Abater os itens vendidos das quantidades em estoque
- Limpar o carrinho carrinho
- Retornar uma mensagem de erro adequada, caso alguma validação não esteja ok.
- Caso todas as validações estejam ok, você deve retornar:
    - Mensagem de sucesso, 
    - Carrinho (itens, quantidades, subtotal, data de entrega e total a pagar)

# Parte Opcional

### `POST` `carrinho/finalizar-compra`

Além dos itens obrigatórios, neste endpoint, você poderá adicionalmente:
- Integrar verdadeiramente com a `pagar.me`, utilizando o token de desenvolvimento da Cubos Academy `ak_test_rFF3WFkcS9DRdBK7Ocw6QOzOOQEScS`
    - Coloque o vencimento do boleto para 3 dias uteis após a data atual
    - Retorne, em caso de sucesso, o link do boleto com os outros dados.
- Adicionar essa venda em um arquivo de pedidos,  usando o número da transação do PAGARME como id desse pedido
- Permitir aplicarmos cupons de desconto:
    - Inclua no carrinho um query parameter de cupom e retorne o carrinho com uma campo a mais de `descontos`.
    - Lembre de, claro, atualizar o total a pagar

### Relatórios

Em todo e-commerce é interessante ter relatórios de vendas. Crie novos endpoints, pensando em bons nomes e verbos que você julgar adequados, para que seja possível obter as seguintes informações:
- Listar vendas por produto;
```json=
{
  "relatorioProduto": {
    "id": 11,
    "produto": "Oléo de Canola QUALITÁ Pet 900ml",
    "quantidadeVendida": 1,
    "valorAcumuladoEmVendas": 1199
  }
}
```
- Listar vendas por categoria de produto;
```json=
{
  "relatorioCategoria": {
    "categoria": "Bazar",
    "quantidadeVendida": 4,
    "valorAcumuladoEmVendas": 6186
  }
}
```
- Listar vendas em um intervalo de tempo (`dataInicial` e `dataFinal`), esse relatório é exatamente igual aos relatórios por categoria e por produto, a única diferença é que ele filtra por intervalo de duas datas.

Obs.: Os relatórios pode ser filtrados acumulativamente, ou seja, filtrados por produto, categoria e intervalo (`dataInicial` e `dataFinal`) ao mesmo tempo. Caso não seja passado categoria, produto e nem intervalo, o end-point deve retornar todas as vendas realizadas, ex.:
```json=
[
  {
    "id": 12155857,
    "dataVenda": "2021-05-04T01:18:58.422Z",
    "produtos": [
      {
        "id": 3,
        "quantidade": 5,
        "nome": "Limpador Cif Multiuso 800g Em Pó",
        "preco": 999,
        "categoria": "Limpeza"
      },
      {
        "id": 5,
        "quantidade": 1,
        "nome": "Biscoito BAUDUCCO Choco Biscuit Leite 80g",
        "preco": 519,
        "categoria": "Bazar"
      }
    ],
    "valorVenda": 2102.8,
    "linkBoleto": "https://pagar.me"
  },
  {
    "id": 12160050,
    "dataVenda": "2021-05-04T14:34:45.748Z",
    "produtos": [
      {
        "id": 1,
        "quantidade": 1,
        "nome": "Pipoca para Microondas Manteiga YOKI 50g",
        "preco": 169,
        "categoria": "Bazar"
      },
      {
        "id": 9,
        "quantidade": 2,
        "nome": "Arroz Parboilizado Tipo 1 CAMIL Pacote 5kg",
        "preco": 2749,
        "categoria": "Bazar"
      },
      {
        "id": 11,
        "quantidade": 1,
        "nome": "Oléo de Canola QUALITÁ Pet 900ml",
        "preco": 1199,
        "categoria": "Oleo"
      }
    ],
    "valorVenda": 2373.2,
    "linkBoleto": "https://pagar.me"
  }
]
```

Repare que para fazer este item opcional, é necessário primero fazer o item opcional de escrever em um arquivo as vendas realizadas.

## Aulas úteis:

- [Roteador e Controlador](https://plataforma.cubos.academy/curso/61b2921e-a262-4f04-b943-89c4cfb15e5c/data/17/05/2021/aula/9821747f-8d71-47ee-b48f-426997e37ce2/b5b395c1-1c49-4866-a749-8719a176c3c5)
- [Reutilizando validações](https://plataforma.cubos.academy/curso/61b2921e-a262-4f04-b943-89c4cfb15e5c/data/17/05/2021/aula/9821747f-8d71-47ee-b48f-426997e37ce2/8206f90d-d0e5-472d-8e65-331dbe5f0ecd)
- [Adicionando dias úteis com date-fns](https://plataforma.cubos.academy/curso/61b2921e-a262-4f04-b943-89c4cfb15e5c/data/24/05/2021/aula/567d09bf-b527-42fa-b063-63d9ff4743f1/7c3ac2fe-80e1-4646-9e34-8dd8b38f5a0d)
- [async / await](https://plataforma.cubos.academy/curso/61b2921e-a262-4f04-b943-89c4cfb15e5c/data/31/05/2021/aula/e12827a0-8c67-4293-92aa-d5763020a2f7/bfa1c52e-6502-474f-aecf-1cf718deff88)
- [try / catch](https://plataforma.cubos.academy/curso/61b2921e-a262-4f04-b943-89c4cfb15e5c/data/07/06/2021/aula/0304e88c-4ac5-42b8-924e-81216af18f35/f882d693-d529-4fa4-bc19-27464c856582)
- [Criando transações pagarme](https://plataforma.cubos.academy/curso/61b2921e-a262-4f04-b943-89c4cfb15e5c/data/07/06/2021/aula/0304e88c-4ac5-42b8-924e-81216af18f35/9446fc5e-a71f-49b0-a285-62b306d7a0cd)


**LEMBRE-SE**: é melhor feito do quê perfeito!!!


###### tags: `back-end` `módulo 2` `nodeJS` `API REST` `desafio`
