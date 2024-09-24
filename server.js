const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const port = 8080;

// Conectar ao MongoDB
mongoose.connect('mongodb://localhost:27017/estoque')
    .then(() => console.log('Conectado ao MongoDB'))
    .catch(err => console.error('Erro ao conectar ao MongoDB: ', err));


// Definição dos Schemas
const produtoSchema = new mongoose.Schema({
    nome: String,
    quantidade: Number,
    preco: Number,
    desconto: Number,
});

const usuarioSchema = new mongoose.Schema({
    nome: String,
    cpf: String,
    telefone: String,
    email: String,
    funcao: String,
});

const clienteSchema = new mongoose.Schema({
    nome: String,
    cpf: String,
    email: String,
    data_registro: Date,
});

// Modelos
const Produto = mongoose.model('Produto', produtoSchema);
const Usuario = mongoose.model('Usuario', usuarioSchema);
const Cliente = mongoose.model('Cliente', clienteSchema);

app.use(express.static(path.join(__dirname, 'src')));
app.use(express.json());

// Rotas para Produtos

// Rota para obter todos os produtos
app.get('/api/produtos', async (req, res) => {
    try {
        const produtos = await Produto.find();
        res.json(produtos);
    } catch (err) {
        res.status(500).send('Erro ao buscar produtos: ' + err.message);
    }
});

// Rota para adicionar um novo produto
app.post('/api/produtos', async (req, res) => {
    const { nome, quantidade, preco, desconto } = req.body;
    try {
        const produto = new Produto({ nome, quantidade, preco, desconto });
        await produto.save();
        res.json({ id: produto._id, ...produto._doc }); // Retorne o ID com o restante dos dados
    } catch (err) {
        res.status(500).send('Erro ao adicionar produto: ' + err.message);
    }
});


app.delete('/api/produtos/:id', async (req, res) => {
    const { id } = req.params;
    console.log('ID recebido para deleção:', id); // Para depuração
    try {
        const produto = await Produto.findByIdAndDelete(id);
        if (!produto) {
            return res.status(404).send('Produto não encontrado');
        }
        res.sendStatus(204); // No Content
    } catch (err) {
        console.error('Erro ao deletar produto:', err.message);
        res.status(500).send('Erro ao deletar produto: ' + err.message);
    }
});


// Rota para atualizar um produto
app.put('/api/produtos/:id', async (req, res) => {
    const { id } = req.params;
    const { nome, quantidade, preco, desconto } = req.body;
    try {
        const produto = await Produto.findByIdAndUpdate(id, { nome, quantidade, preco, desconto }, { new: true });
        if (!produto) {
            return res.status(404).send('Produto não encontrado');
        }
        res.json(produto);
    } catch (err) {
        res.status(500).send('Erro ao atualizar produto: ' + err.message);
    }
});

// Rotas para Usuários

// Rota para obter todos os usuários
app.get('/api/usuarios', async (req, res) => {
    try {
        const usuarios = await Usuario.find();
        res.json(usuarios);
    } catch (err) {
        res.status(500).send('Erro ao buscar usuários: ' + err.message);
    }
});

// Rota para adicionar um novo usuário
app.post('/api/usuarios', async (req, res) => {
    const { nome, cpf, telefone, email, funcao } = req.body;
    try {
        const usuario = new Usuario({ nome, cpf, telefone, email, funcao });
        await usuario.save();
        res.json(usuario);
    } catch (err) {
        res.status(500).send('Erro ao adicionar usuário: ' + err.message);
    }
});

// Rota para deletar um usuário
app.delete('/api/usuarios/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await Usuario.findByIdAndDelete(id);
        res.sendStatus(204);
    } catch (err) {
        res.status(500).send('Erro ao deletar usuário: ' + err.message);
    }
});

// Rotas para Clientes

// Rota para obter todos os clientes
app.get('/api/clientes', async (req, res) => {
    try {
        const clientes = await Cliente.find();
        res.json(clientes);
    } catch (err) {
        res.status(500).send('Erro ao buscar clientes: ' + err.message);
    }
});

// Rota para adicionar um novo cliente
app.post('/api/clientes', async (req, res) => {
    const { nome, cpf, email, data_registro } = req.body;
    try {
        const cliente = new Cliente({ nome, cpf, email, data_registro });
        await cliente.save();
        res.json(cliente);
    } catch (err) {
        res.status(500).send('Erro ao adicionar cliente: ' + err.message);
    }
});

// Rota para deletar um cliente
app.delete('/api/clientes/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await Cliente.findByIdAndDelete(id);
        res.sendStatus(204);
    } catch (err) {
        res.status(500).send('Erro ao deletar cliente: ' + err.message);
    }
});

// Iniciar o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
