//registro_login.js

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            const role = document.getElementById('login-role').value;

            // Simulação de login com dados armazenados no localStorage
            const storedEmail = localStorage.getItem('email');
            const storedPassword = localStorage.getItem('senha');
            const storedRole = localStorage.getItem('role');

            if (email === storedEmail && password === storedPassword && role === storedRole) {
                if (storedRole === 'admin') {
                    window.location.href = '../view/menu_adm.html';
                } else {
                    window.location.href = '../view/usario.html';
                }
            } else {
                alert('Credenciais ou função inválidas.');
            }
        });
    }

    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('register-email').value;
            const password = document.getElementById('register-password').value;
            const confirmPassword = document.getElementById('confirm-password').value;
            const role = document.getElementById('register-role').value;
    
            if (password !== confirmPassword) {
                alert('As senhas não coincidem. Por favor, tente novamente.');
                return;
            }
    
            // Armazenamento de dados de registro no localStorage
            localStorage.setItem('email', email);
            localStorage.setItem('senha', password);
            localStorage.setItem('role', role);
    
            alert('Registro feito com sucesso! Por favor, faça o login.');
            window.location.href = './view/login.html';
        });
    }
    
});
