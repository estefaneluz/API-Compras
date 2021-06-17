// importamos a função lerArquivo do arquivo bibliotecaFS
const { lerArquivo } = require('./bibliotecaFS');


// Lendo o que está dentro do arquivo (data.json) 
// depois de ler, dentro da varíavel dadosDoArquivo tem todas as informações do arquivo data.json.
async function test (){
  const dadosDoArquivo = await lerArquivo();
}

test();


