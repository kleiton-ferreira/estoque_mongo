//estoque/src/js/contato.js

// Pequeno atraso na mensagem do envio para dar tempo de efetivar o envio
function displaySuccessMessage() {
    setTimeout(function() {
        document.getElementById('successMessage').style.display = 'block';
        document.querySelector('form').reset();
    }, 500);
}

// Verificação de autenticação
const isAuthenticated = localStorage.getItem('email') !== null && localStorage.getItem('senha') !== null;
if (!isAuthenticated) {
    window.location.href = './login.html';
}

