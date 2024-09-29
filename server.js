// Importando as bibliotecas necessárias
const express = require('express'); // Framework para criar o servidor HTTP
const mongoose = require('mongoose'); // Biblioteca para modelar dados e interagir com o MongoDB
const path = require('path'); // Módulo para trabalhar com caminhos de arquivos

// Criando a aplicação Express
const app = express();
const port = 8080; // Definindo a porta do servidor

// Conectando ao banco de dados MongoDB
mongoose.connect('mongodb://localhost:27017/estoque') // Conectando ao MongoDB no localhost, porta padrão 27017, e banco de dados 'estoque'
    .then(() => console.log('Conectado ao MongoDB')) // Sucesso na conexão
    .catch(err => console.error('Erro ao conectar ao MongoDB: ', err)); // Capturando e exibindo erro caso a conexão falhe

// Definição dos Schemas de Produtos, Usuários e Clientes
// Schemas são a estrutura de dados que será armazenada no MongoDB

// Schema de Produto
const produtoSchema = new mongoose.Schema({
    nome: String,
    quantidade: Number,
    preco: Number,
    desconto: Number,
});

// Schema de Usuário
const usuarioSchema = new mongoose.Schema({
    nome: String,
    cpf: String,
    telefone: String,
    email: String,
    funcao: String,
});

// Schema de Cliente
const clienteSchema = new mongoose.Schema({
    nome: String,
    cpf: String,
    email: String,
    data_registro: Date,
});

// Criação dos modelos baseados nos Schemas definidos acima
const Produto = mongoose.model('Produto', produtoSchema); // Modelo Produto
const Usuario = mongoose.model('Usuario', usuarioSchema); // Modelo Usuario
const Cliente = mongoose.model('Cliente', clienteSchema); // Modelo Cliente

// Configurando middleware para servir arquivos estáticos e interpretar requisições JSON
app.use(express.static(path.join(__dirname, 'src'))); // Serve os arquivos estáticos da pasta 'src' (ex.: HTML, CSS, JS)
app.use(express.json()); // Habilita o servidor para receber e processar dados em formato JSON no corpo das requisições

// Rotas para Produtos

// Rota GET para obter todos os produtos
app.get('/api/produtos', async (req, res) => {
    try {
        const produtos = await Produto.find(); // Busca todos os produtos no MongoDB
        res.json(produtos); // Retorna a lista de produtos em formato JSON
    } catch (err) {
        res.status(500).send('Erro ao buscar produtos: ' + err.message); // Retorna erro em caso de falha
    }
});

// Rota POST para adicionar um novo produto
app.post('/api/produtos', async (req, res) => {
    const { nome, quantidade, preco, desconto } = req.body; // Extrai os dados do corpo da requisição
    try {
        const produto = new Produto({ nome, quantidade, preco, desconto }); // Cria uma nova instância de Produto
        await produto.save(); // Salva o novo produto no MongoDB
        res.json({ id: produto._id, ...produto._doc }); // Retorna o produto salvo, incluindo o ID gerado pelo MongoDB
    } catch (err) {
        res.status(500).send('Erro ao adicionar produto: ' + err.message); // Retorna erro se houver falha ao salvar
    }
});

// Rota DELETE para remover um produto por ID
app.delete('/api/produtos/:id', async (req, res) => {
    const { id } = req.params; // Obtém o ID do produto da URL
    console.log('ID recebido para deleção:', id); // Loga o ID para depuração
    try {
        const produto = await Produto.findByIdAndDelete(id); // Deleta o produto pelo ID
        if (!produto) {
            return res.status(404).send('Produto não encontrado'); // Retorna erro se o produto não for encontrado
        }
        res.sendStatus(204); // Retorna status 204 (No Content) indicando sucesso sem conteúdo
    } catch (err) {
        console.error('Erro ao deletar produto:', err.message); // Loga o erro no console
        res.status(500).send('Erro ao deletar produto: ' + err.message); // Retorna erro caso a deleção falhe
    }
});

// Rota PUT para atualizar um produto por ID
app.put('/api/produtos/:id', async (req, res) => {
    const { id } = req.params; // Obtém o ID do produto da URL
    const { nome, quantidade, preco, desconto } = req.body; // Obtém os dados atualizados do corpo da requisição
    try {
        const produto = await Produto.findByIdAndUpdate(id, { nome, quantidade, preco, desconto }, { new: true }); // Atualiza o produto no banco de dados
        if (!produto) {
            return res.status(404).send('Produto não encontrado'); // Retorna erro se o produto não for encontrado
        }
        res.json(produto); // Retorna o produto atualizado em formato JSON
    } catch (err) {
        res.status(500).send('Erro ao atualizar produto: ' + err.message); // Retorna erro em caso de falha na atualização
    }
});

// Rotas para Usuários

// Rota GET para obter todos os usuários
app.get('/api/usuarios', async (req, res) => {
    try {
        const usuarios = await Usuario.find(); // Busca todos os usuários no MongoDB
        res.json(usuarios); // Retorna a lista de usuários em formato JSON
    } catch (err) {
        res.status(500).send('Erro ao buscar usuários: ' + err.message); // Retorna erro em caso de falha
    }
});

// Rota POST para adicionar um novo usuário
app.post('/api/usuarios', async (req, res) => {
    const { nome, cpf, telefone, email, funcao } = req.body; // Extrai os dados do corpo da requisição
    try {
        const usuario = new Usuario({ nome, cpf, telefone, email, funcao }); // Cria uma nova instância de Usuario
        await usuario.save(); // Salva o novo usuário no MongoDB
        res.json(usuario); // Retorna o usuário salvo em formato JSON
    } catch (err) {
        res.status(500).send('Erro ao adicionar usuário: ' + err.message); // Retorna erro em caso de falha ao salvar
    }
});

// Rota DELETE para remover um usuário por ID
app.delete('/api/usuarios/:id', async (req, res) => {
    const { id } = req.params; // Obtém o ID do usuário da URL
    try {
        await Usuario.findByIdAndDelete(id); // Deleta o usuário pelo ID
        res.sendStatus(204); // Retorna status 204 (No Content) indicando sucesso
    } catch (err) {
        res.status(500).send('Erro ao deletar usuário: ' + err.message); // Retorna erro em caso de falha
    }
});

// Rotas para Clientes

// Rota GET para obter todos os clientes
app.get('/api/clientes', async (req, res) => {
    try {
        const clientes = await Cliente.find(); // Busca todos os clientes no MongoDB
        res.json(clientes); // Retorna a lista de clientes em formato JSON
    } catch (err) {
        res.status(500).send('Erro ao buscar clientes: ' + err.message); // Retorna erro em caso de falha
    }
});

// Rota POST para adicionar um novo cliente
app.post('/api/clientes', async (req, res) => {
    const { nome, cpf, email, data_registro } = req.body; // Extrai os dados do corpo da requisição
    try {
        const cliente = new Cliente({ nome, cpf, email, data_registro }); // Cria uma nova instância de Cliente
        await cliente.save(); // Salva o novo cliente no MongoDB
        res.json(cliente); // Retorna o cliente salvo em formato JSON
    } catch (err) {
        res.status(500).send('Erro ao adicionar cliente: ' + err.message); // Retorna erro em caso de falha ao salvar
    }
});

// Rota DELETE para remover um cliente por ID
app.delete('/api/clientes/:id', async (req, res) => {
    const { id } = req.params; // Obtém o ID do cliente da URL
    try {
        await Cliente.findByIdAndDelete(id); // Deleta o cliente pelo ID
        res.sendStatus(204); // Retorna status 204 (No Content) indicando sucesso
    } catch (err) {
        res.status(500).send('Erro ao deletar cliente: ' + err.message); // Retorna erro em caso de falha
    }
});

// Inicia o servidor na porta definida
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`); // Exibe mensagem quando o servidor começa a rodar
});
