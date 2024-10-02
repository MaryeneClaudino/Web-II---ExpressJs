const express = require('express');
const app = express();
const port = 3000;
const tokenCorreto = "123Mudar";

// 1. ** Instalação e Configuração do Express.js **
app.get('/', function (req, res) {
    res.send("Seja Bem Vindo!").end();
});

// 2. ** Rotas Dinâmicas **
app.get('/ola/:nome', (req, res) => {
    let nome_usuario = req.params.nome;
    res.send(`Olá, ${nome_usuario}!`).end();
}
);

// 3. ** Middleware de Autenticação Fake **
const verificaToken = (req, res, next) => {
    const token = req.headers['authorization'].split(' ')[1];

    if (token != undefined && token != null && token == tokenCorreto) {
        next();
    } else {
        return res.status(401).send("Não Autorizado").end();
    }
};

app.get('/rota-protegida', verificaToken, (req, res) => {
    res.send(`Acessou rota protegida!`).end();
}
);

//Comando para testar rota pelo terminal!
// curl -X GET -H "Authorization: Bearer 123Mudar" http://localhost:3000/rota-protegida

// 4. ** Manipulação de Dados com Query Params **
const usuarios = [
    { nome: "Mary", cpf: "111.111.111-11", telefone: "53911111111" },
    { nome: "Rafa", cpf: "222.222.222-22", telefone: "53922222222" },
    { nome: "Alex", cpf: "333.333.333-33", telefone: "53933333333" },
    { nome: "Manu", cpf: "444.444.444-44", telefone: "53944444444" },
    { nome: "Can", cpf: "555.555.555-55", telefone: "53955555555" }
]

app.get('/usuarios', (req, res) => {
    const nome = req.query.nome;
    const cpf = req.query.cpf;
    const telefone = req.query.telefone;

    let listaFiltrada = "";
    let error = "Erro ao filtrar a lista. Você deve passar apenas um parâmetro (nome, telefone ou cpf) e com apenas um valor."

    if ((nome != undefined && nome != null) && (cpf == null || cpf == undefined) && (telefone == null || telefone == undefined)) {
        listaFiltrada = usuarios.filter(usuario => usuario.nome === nome);
    } else if ((nome == undefined && nome == null) && (cpf != null || cpf != undefined) && (telefone == null || telefone == undefined)) {
        listaFiltrada = usuarios.filter(usuario => usuario.cpf === cpf);
    } else if ((nome == undefined && nome == null) && (cpf == null || cpf == undefined) && (telefone != null || telefone != undefined)) {
        listaFiltrada = usuarios.filter(usuario => usuario.telefone === telefone);
    } else {
        listaFiltrada = error;
    }

    if (listaFiltrada == "") {
        listaFiltrada = error;
    }

    res.send(listaFiltrada).end();
});

// 5. ** Receber Dados com POST **
app.use(express.json());
app.post('/produtos', (req, res) => {
    const produtos = req.body;
    const id = Math.floor(Math.random() * 100);
    produtos.id = id;

    res.send(produtos).end();
}
);

// 6. ** Validação de Dados com Middleware **
const verificaDados = (req, res, next) => {
    const { nome, email } = req.body;
    if ((nome != undefined || nome != null) && (email != undefined || email != null)) {
        next();
    } else {
        res.status(400).send('É necessário informar o nome e email!').end();
    }
};

app.post('/valida-dados', verificaDados, (req, res) => {
    res.send('Nome e email recebidos com sucesso!').end();
});

app.get('/rota-com-erro', (req, res, next) => {
    try {
        throw new Error('Erro na rota!');
    } catch (ex) {
        next(ex);
    }
}
);

// 7. ** Gerenciamento de Erros Globais **
app.use((err, req, res, next) => {
    res.status(500).send('Algo deu errado: ' + err).end();
});

//Definindo a porta que irá testar as rotas
app.listen(port, function () {
    console.log(`Servidor rodando em http://localhost:${port}`);
});