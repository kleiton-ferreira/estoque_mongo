// recuperar_senha.js

document.addEventListener('DOMContentLoaded', () => {
    const recoverForm = document.getElementById('recover-form');

    if (recoverForm) {
        recoverForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('recover-email').value;

            // Simulação de envio de email de recuperação de senha
            const storedEmail = localStorage.getItem('email');

            if (email === storedEmail) {
                alert(`Um email de recuperação de senha foi enviado para ${email}.`);
            } else {
                alert('Email não encontrado. Verifique o email inserido.');
            }
        });
    }
});
