const btnFetch = document.querySelector('.btn-fetch');
const btnSend = document.querySelector('.btn-send');
const dataInput = document.getElementById('dataInput');
const consoleOutput = document.getElementById('console');
const inputDataMSG = document.getElementById('messageInput');
const btnDelete = document.querySelector('.btn-delete');
const idInput = document.getElementById('idInput');
const btnUpdate = document.querySelector('.btn-update');
const loginBtn = document.getElementById('loginBtn');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const toSignupBtn = document.getElementById('toSignupBtn');
const toLoginBtn = document.getElementById('toLoginBtn');
const registerBtn = document.getElementById('registerBtn');
const signupPassword = document.getElementById('signupPassword');
const signupEmail = document.getElementById('signupEmail');

const API_URL = "https://expressapp-jpi3.onrender.com";


// Обработчик для кнопки GET_DATA
btnFetch.addEventListener('click',  async () => {
    const token = localStorage.getItem('authToken'); // Получаем токен из localStorage
    if (!token) {
        consoleOutput.innerHTML += `<span style="color: #ff5555;">// [Error]: No auth token. Log in first.</span><br>`;
        return;
    }
    await fetch('https://expressapp-jpi3.onrender.com/contacts', {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Fetch failed: ${response.status} ${response.statusText}`);
        }
        return response.json();
    })
    .then(data => {
        const prettyData = JSON.stringify(data, null, 2);
        consoleOutput.innerHTML += `<pre style="color: #00f2ff; margin:0;">// [Fetched data]:\n${prettyData}</pre><br>`;
    })
    .catch(error => {
        consoleOutput.innerHTML += `<span style="color: #ff5555;">// [Error]: ${error.message}</span><br>`;
    });

 }
);



// Обработчик для кнопки POST_DATA
btnSend.addEventListener('click', async () => {
    const inputData = dataInput.value.trim();
    const token = localStorage.getItem('authToken'); // Получаем токен из localStorage

    if (!inputData) {
        consoleOutput.innerHTML += `<span style="color: #ff5555;">// [Error]: Input cannot be empty</span><br>`;
        return;
    }
    await fetch('https://expressapp-jpi3.onrender.com/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name: inputData, message: inputDataMSG.value }) // Пример данных, можно расширить
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Send failed: ${response.status} ${response.statusText}`);
        }
        return response.json();
    })
    .then(data => {
        const prettyResp = JSON.stringify(data, null, 2);
        consoleOutput.innerHTML += `<pre style="color: #c300ff; margin:0;">// [Data sent]:\n${prettyResp}</pre><br>`;
    })
    .catch(error => {
        consoleOutput.innerHTML += `<span style="color: #ff5555;">// [Error]: ${error.message}</span><br>`;
    });

    inputDataMSG.value = ""; // Очищаем поле ввода сообщения после отправки
    dataInput.value = ""; // Очищаем поле ввода данных после отправки
});



// Обработчик для кнопки DELETE_DATA
btnDelete.addEventListener('click', async () => {
    const token = localStorage.getItem('authToken'); // Получаем токен из localStorage

   if (!idInput.value.trim()) {
        consoleOutput.innerHTML += `<span style="color: #ff5555;">// [Error]: ID input cannot be empty</span><br>`;
        return;
    }
    await fetch(`https://expressapp-jpi3.onrender.com/contacts/${idInput.value.trim()}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
    } )
    .then(response => {
        if (!response.ok) {
            throw new Error(`Delete failed: ${response.status} ${response.statusText}`);
        }
        return response.json();
    })
    .then(data => {
        const prettyResp = JSON.stringify(data, null, 2);
        consoleOutput.innerHTML += `<pre style="color: #ff559c; margin:0;">// [Delete response]:\n${prettyResp}</pre><br>`;
    })
    .catch(error => {
        consoleOutput.innerHTML += `<span style="color: #ff5555;">// [Error]: ${error.message}</span><br>`;
    });
        idInput.value = ""; // Очищаем поле ввода ID после попытки удаления
});



// Обработчик для кнопки PATCH_DATA
btnUpdate.addEventListener('click', async () => {
    const token = localStorage.getItem('authToken'); // Получаем токен из localStorage

    if (!idInput.value.trim()) {
        consoleOutput.innerHTML += `<span style="color: #ff5555;">// [Error]: ID input cannot be empty</span><br>`;
        return;
    }
    const updatedData = {
        name: dataInput.value.trim() || undefined, // Если поле пустое, не отправляем его
        message: inputDataMSG.value.trim() || undefined // Если поле пустое, не отправляем его
    };
    await fetch(`https://expressapp-jpi3.onrender.com/contacts/${idInput.value.trim()}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(updatedData),
        
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Update failed: ${response.status} ${response.statusText}`);
        }
        return response.json();
    })
    .then(data => {
        const prettyResp = JSON.stringify(data, null, 2);
        consoleOutput.innerHTML += `<pre style="color: #50fa7b; margin:0;">// [Update response]:\n${prettyResp}</pre><br>`;
    }
    )
    .catch(error => {
        consoleOutput.innerHTML += `<span style="color: #ff5555;">// [Error]: ${error.message}</span><br>`;
    });
    idInput.value = ""; // Очищаем поле ввода ID после попытки обновления
    dataInput.value = ""; // Очищаем поле ввода данных после попытки обновления
    inputDataMSG.value = ""; // Очищаем поле ввода сообщения после попытки обновления
});


loginBtn.addEventListener('click', async () => {
    if (emailInput.value.trim() && passwordInput.value.trim()) {
    
    await fetch('https://expressapp-jpi3.onrender.com/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailInput.value.trim(), password: passwordInput.value.trim() })
    })
    .then(response => {
            if (!response.ok) {
                throw new Error(`Login failed: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
    .then(data => {
        localStorage.setItem('authToken', data.token);
        document.querySelector('.login').style.display = 'none';
        document.querySelector('.login-container').style.display = 'none';
    })
    }   
});

registerBtn.addEventListener('click', async () => {
    if (signupEmail.value.trim() && signupPassword.value.trim()) {
        await fetch('https://expressapp-jpi3.onrender.com/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: signupEmail.value.trim(), password: signupPassword.value.trim() })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Registration failed: ${response.status} ${response.statusText}`);
            }
            return response.text();
        })
        .then(data => {
            console.log('Registration successful:', data);
            document.querySelector('.signup-container').style.display = 'none';
            document.querySelector('.login').style.display = 'none';
            consoleOutput.innerHTML += `<pre style="color: #50fa7b; margin:0;">// [Registration successful]:\n${data}</pre><br>`;
        })
        .catch(error => {
            consoleOutput.innerHTML += `<span style="color: #ff5555;">// [Error]: ${error.message}</span><br>`;
        });
    }
});



toSignupBtn.addEventListener('click', () => {
    document.querySelector('.login-container').style.display = 'none';
    document.querySelector('.signup-container').style.display = 'flex';
});

toLoginBtn.addEventListener('click', () => {
    document.querySelector('.signup-container').style.display = 'none';
    document.querySelector('.login-container').style.display = 'flex';
});
