document.getElementById('add-user').addEventListener('click', addUser);
document.getElementById('search-bar').addEventListener('input', searchUser);

async function addUser() {
    const userName = document.getElementById('user-name').value;
    const userCpf = document.getElementById('user-cpf').value;
    const userPhone = document.getElementById('user-phone').value;
    const userEmail = document.getElementById('user-email').value;
    const userRole = document.getElementById('user-role').value;

    if (userName === '' || userCpf === '' || userPhone === '' || userEmail === '' || userRole === '') {
        alert('Por favor, preencha todos os campos.');
        return;
    }

    const newUser = {
        nome: userName,
        cpf: userCpf,
        telefone: userPhone,
        email: userEmail,
        funcao: userRole
    };

    try {
        const response = await fetch('/api/usuarios', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newUser)
        });

        const user = await response.json();
        addUserToTable(user);
    } catch (error) {
        alert('Erro ao adicionar usuário: ' + error.message);
    }

    document.getElementById('user-name').value = '';
    document.getElementById('user-cpf').value = '';
    document.getElementById('user-phone').value = '';
    document.getElementById('user-email').value = '';
    document.getElementById('user-role').value = '';

    updateAlert();
}

function addUserToTable(user) {
    const userList = document.getElementById('user-list');
    const row = document.createElement('tr');

    row.innerHTML = `
        <td>${user._id}</td> <!-- Alterado para _id -->
        <td class="user-name">${user.nome}</td>
        <td>${user.cpf}</td>
        <td>${user.telefone}</td>
        <td>${user.email}</td>
        <td>${user.funcao}</td>
        <td>
            <button onclick="deleteUser('${user._id}', this)">Delete</button> <!-- Alterado para _id -->
        </td>
    `;

    userList.appendChild(row);
}

async function deleteUser(id, button) {
    try {
        const response = await fetch(`/api/usuarios/${id}`, { method: 'DELETE' });
        if (!response.ok) {
            throw new Error('Erro ao deletar usuário: ' + response.statusText);
        }
        button.parentNode.parentNode.remove();
        updateAlert();
    } catch (error) {
        alert('Erro ao deletar usuário: ' + error.message);
    }
}

function searchUser(event) {
    const searchTerm = event.target.value.toLowerCase();
    const userList = document.getElementById('user-list').querySelectorAll('tr');

    userList.forEach(row => {
        const userName = row.querySelector('.user-name').textContent.toLowerCase();
        if (userName.includes(searchTerm)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

function updateAlert() {
    const userList = document.getElementById('user-list').querySelectorAll('tr');
    const alertContainer = document.getElementById('alert-container');
    alertContainer.innerHTML = '';

    if (userList.length === 0) {
        const alert = document.createElement('div');
        alert.className = 'alert';
        alert.textContent = 'Nenhum usuário cadastrado.';
        alertContainer.appendChild(alert);
    }
}

// Carregar usuários na inicialização
async function fetchUsers() {
    try {
        const response = await fetch('/api/usuarios');
        const users = await response.json();
        users.forEach(addUserToTable);
    } catch (error) {
        alert('Erro ao buscar usuários: ' + error.message);
    }
}

// Carregar usuários na inicialização
fetchUsers();
