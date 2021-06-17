// importamos a função escreverNoArquivo do arquivo bibliotecaFS
const { escreverNoArquivo } = require('./bibliotecaFS');


// dadosDoArquivo => é a varíavel que você utilizou para manipular os dados dos produtos e carrinho
// depois de manipular, ou seja, por exemplo trocar a quantidade de um produto 
// você precisa fazer as alterações
//  para isso basta você passar o conteúdo das alterações para a função escreverNoArquivo
async function test() {
    await escreverNoArquivo(dadosDoArquivo);  
}
  
test();
