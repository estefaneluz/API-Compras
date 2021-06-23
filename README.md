#### Desafio | Back-end | Módulo 2 | Cubos Academy

# API Checkout de Compras 🛒🛍️

**OBSERVAÇÃO!!** ⚠️⚠️

- Para a integração com a **pagar.me** (API Externa) funcionar, precisa substituir a váriavel **api_key** em "cubos-checkout > services > pagarme.js" pelo token de desenvolvimento.  

**Tecnologias:** ⚙️🔧

- Node.js 
- Express
- Axios
- Biblioteca Data-fns 

**Essa API é capaz de:** 

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
- Gerar um boleto através da API fornecida pela **Pagar.me**
