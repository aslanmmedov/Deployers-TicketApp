import { get, post } from '../services/api/index.js';

const form = document.querySelector('.reg-form');
const isAdminCheckbox = document.getElementById('isAdmin');
const errorMessage = document.getElementById('error');

const checkAdminExists = async () => {
    const users = await get('/users');  
    return users.some((user) => user.isAdmin);
};

const checkEmailExists = async (email) => {
    const users = await get('/users');
    return users.some((user) => user.email === email);
};

form.addEventListener('click', async (event) => {
    event.preventDefault();

    const name = document.getElementById('name').value;

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const isAdmin = isAdminCheckbox.checked;

    if (await checkEmailExists(email)) { 
        errorMessage.textContent = 'This email is already registered.';
        return;
    }

    if (isAdmin && (await checkAdminExists())) {
        errorMessage.textContent = 'An admin account already exists.';
    }

    // let passRegex = "^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$"
    
    
    try {
            await post('/users', {
                name,
                email,
                password,
                balance: 300,
                totalSpent: 0,
                isAdmin,
            });
        
        
        alert('Registration successful!');
        window.location.href = 'Login.html';
    } catch (error) {
        errorMessage.textContent = 'Registration failed. Please try again.';
        console.error(error);
    }
});

document.addEventListener('DOMContentLoaded', async () => {
    if (await checkAdminExists()) {
        isAdminCheckbox.disabled = true;
    }
});