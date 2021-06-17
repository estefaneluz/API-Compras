const fs = require('fs');

const fsp = fs.promises;

const ARQUIVO = 'banco/data.json';
const CAMINHO_BANCO = 'banco';

const lerArquivo = async () => {
    try {
        if (fs.existsSync(ARQUIVO)) {
            const arquivo = await fsp.readFile(ARQUIVO, (err, data) => {
                if (err) {
                    return err;
                }
                return data;
            });

            if (arquivo.length > 0) {
                return JSON.parse(arquivo)
            }
        }
        return [];
    } catch (err) {
        return false
    }
};

const escreverNoArquivo = async (data) => {
    try {
        if (!fs.existsSync(CAMINHO_BANCO)) {
            fs.mkdirSync(CAMINHO_BANCO);
        }
        await fsp.writeFile(ARQUIVO, JSON.stringify(data, null, 2));
        return true;
    } catch (err) {
        return false;
    }
};

module.exports = {
    lerArquivo,
    escreverNoArquivo
}