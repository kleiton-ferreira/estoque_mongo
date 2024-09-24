//estoque/src/js/inventario.js

let productId = 1; // Variável global para armazenar o próximo ID do produto

document.getElementById('add-product').addEventListener('click', addProduct);
document.getElementById('generate-report').addEventListener('click', generateReport);
document.getElementById('search-bar').addEventListener('input', searchProduct);
document.getElementById('product-list').addEventListener('input', updateValues);

async function addProduct() {
    const productName = document.getElementById('product-name').value;
    const productQuantity = document.getElementById('product-quantity').value;
    const productPrice = document.getElementById('product-price').value;
    let productDiscount = document.getElementById('product-discount').value;

    if (productDiscount === '') {
        productDiscount = 0;
    }

    if (productName === '' || productQuantity === '' || productPrice === '') {
        alert('Por favor, preencha todos os campos obrigatórios.');
        return;
    }

    if (productQuantity < 0 || productPrice < 0 || productDiscount < 0) {
        alert('Quantidade, preço e desconto não podem ser negativos.');
        return;
    }

    const newProduct = {
        nome: productName,
        quantidade: parseInt(productQuantity),
        preco: parseFloat(productPrice),
        desconto: parseFloat(productDiscount)
    };

    try {
        const response = await fetch('/api/produtos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newProduct)
        });

        const product = await response.json();
        addProductToTable(product);
    } catch (error) {
        alert('Erro ao adicionar produto: ' + error.message);
    }

    document.getElementById('product-name').value = '';
    document.getElementById('product-quantity').value = '';
    document.getElementById('product-price').value = '';
    document.getElementById('product-discount').value = '';

    updateAlert();
}

function addProductToTable(product) {
    const productList = document.getElementById('product-list');
    const row = document.createElement('tr');

    const discountAmount = (parseFloat(product.preco) * parseFloat(product.desconto)) / 100;
    const discountedPrice = parseFloat(product.preco) - discountAmount;
    const totalPrice = (discountedPrice * parseFloat(product.quantidade)).toFixed(2);

    row.innerHTML = `
        <td>${product._id}</td>
        <td class="product-name">${product.nome}</td>
        <td><input type="number" value="${product.quantidade}" class="quantity-input"></td>
        <td><input type="number" value="${parseFloat(product.preco).toFixed(2)}" class="price-input" data-original-price="${product.preco}" data-discount="${product.desconto}"></td>
        <td>R$<span class="total-price">${totalPrice}</span></td>
        <td><input type="number" value="${product.desconto}" class="discount-input"></td>
        <td>
            <button onclick="deleteProduct('${product._id}', this)">Delete</button>
        </td>
    `;

    productList.appendChild(row);
    checkLowStock(row);
}

async function deleteProduct(id, button) {
    try {
        const response = await fetch(`/api/produtos/${id}`, { method: 'DELETE' });
        if (!response.ok) {
            throw new Error('Erro ao deletar produto: ' + response.statusText);
        }
        button.parentNode.parentNode.remove();
        updateAlert();
    } catch (error) {
        alert('Erro ao deletar produto: ' + error.message);
    }
}


async function updateValues(event) {
    if (event.target.classList.contains('quantity-input') || 
        event.target.classList.contains('price-input') || 
        event.target.classList.contains('discount-input')) {

        const row = event.target.parentNode.parentNode;
        const productId = row.cells[0].textContent;
        let quantity = parseFloat(row.querySelector('.quantity-input').value);
        let price = parseFloat(row.querySelector('.price-input').value);
        let discount = parseFloat(row.querySelector('.discount-input').value);

        let alertMessage = '';

        // Verificação e ajuste dos valores
        if (quantity < 0) {
            alertMessage += 'A quantidade não pode ser negativa. ';
            row.querySelector('.quantity-input').value = 0;
            quantity = 0;
        }

        if (price < 0) {
            alertMessage += 'O preço não pode ser negativo. ';
            row.querySelector('.price-input').value = 0;
            price = 0;
        }

        if (discount < 0) {
            alertMessage += 'O desconto não pode ser negativo. ';
            row.querySelector('.discount-input').value = 0;
            discount = 0;
        }

        // Exibir alerta apenas se houver mensagens
        if (alertMessage !== '') {
            alert(alertMessage);
            return; // Adiciona um return para não continuar se houver alert
        }

        const discountAmount = (price * discount) / 100;
        const discountedPrice = price - discountAmount;
        const totalPrice = (discountedPrice * quantity).toFixed(2);
        row.querySelector('.total-price').textContent = `${totalPrice}`;

        try {
            const response = await fetch(`/api/produtos/${productId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    nome: row.querySelector('.product-name').textContent,
                    quantidade: quantity,
                    preco: price,
                    desconto: discount 
                })
            });

            if (!response.ok) {
                throw new Error('Erro ao atualizar produto');
            }

            // Apenas atualiza a tabela sem alertas
            checkLowStock(row);
            updateAlert();
        } catch (error) {
            alert(error.message);
        }
    }
}


function checkLowStock(row) {
    const quantity = row.querySelector('.quantity-input').value;
    if (quantity < 10) {
        row.style.backgroundColor = '#ffcccc';
    } else {
        row.style.backgroundColor = '';
    }
}

function showAlert(message) {
    const alertContainer = document.getElementById('alert-container');
    const alert = document.createElement('div');
    alert.className = 'alert';
    alert.textContent = message;
    alertContainer.appendChild(alert);
}

function clearAlerts() {
    const alertContainer = document.getElementById('alert-container');
    alertContainer.innerHTML = '';
}

function updateAlert() {
    const productList = document.getElementById('product-list').querySelectorAll('tr');
    let hasLowStock = false;

    productList.forEach(row => {
        const quantity = row.querySelector('.quantity-input').value;
        if (quantity < 10) {
            hasLowStock = true;
        }
    });

    clearAlerts();
    if (hasLowStock) {
        showAlert('Atenção: Estoque baixo');
    }
}

async function fetchProducts() {
    try {
        const response = await fetch('/api/produtos');
        const products = await response.json();
        products.forEach(addProductToTable);
    } catch (error) {
        alert('Erro ao buscar produtos: ' + error.message);
    }
}

function generateReport() {
    const productList = document.getElementById('product-list').querySelectorAll('tr');
    const reportData = [];

    productList.forEach(row => {
        const productId = row.cells[0].textContent;
        const productName = row.cells[1].textContent;
        const quantity = row.querySelector('.quantity-input').value;
        const price = row.querySelector('.price-input').value;
        const totalPrice = row.querySelector('.total-price').textContent.replace('R$', '');
        const discount = row.querySelector('.discount-input').value; // Obtemos o desconto diretamente da input
        const lowStock = quantity < 10 ? 'Sim' : 'Não';

        reportData.push({ 
            productId, 
            productName, 
            quantity, 
            price, 
            totalPrice, 
            discount, 
            lowStock 
        });
    });

    localStorage.setItem('reportData', JSON.stringify(reportData));
    window.location.href = './relatorio.html';
}


function searchProduct() {
    const searchTerm = document.getElementById('search-bar').value.toLowerCase();
    const productList = document.getElementById('product-list').querySelectorAll('tr');

    productList.forEach(row => {
        const productName = row.querySelector('.product-name').textContent.toLowerCase();
        if (productName.includes(searchTerm)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

// Logout
document.getElementById('logout-button').addEventListener('click', () => {
    localStorage.removeItem('email');
    localStorage.removeItem('senha');
    window.location.href = './login.html';
});

// Navegação para a página de contato
document.getElementById('contact-button').addEventListener('click', () => {
    window.location.href = '../view/contato.html';
});

// Carregar produtos na inicialização
fetchProducts();
