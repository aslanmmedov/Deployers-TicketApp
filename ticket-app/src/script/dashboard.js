import { get, patch } from '../services/api/index.js';
import { addNavbarItem, removeNavbarItem } from '../helpers/index.js';

const userId = localStorage.getItem('userLocal'); 

if (userId) {
    removeNavbarItem(document.querySelector(".signin"));
    removeNavbarItem(document.querySelector(".signup"));
    addNavbarItem(document.querySelector(".logout"));
} else {
    addNavbarItem(document.querySelector(".signin"));
    addNavbarItem(document.querySelector(".signup"));
    removeNavbarItem(document.querySelector(".logout"));
}

const loadEvents = async () => {
    document.querySelector("#logoutButton").addEventListener('click', () => {
        localStorage.removeItem('userId');  
        window.location.href = "login.html";
    });

    try {
        const events = await get('/events');
        const user = await get(`/users/${userId}`); 
        const favorites = user.favorites || [];
        const basket = user.basket || [];

        const eventsContainer = document.getElementById('eventsContainer');
        eventsContainer.innerHTML = '';

        events.forEach(event => {
            const eventDiv = document.createElement('div');
            eventDiv.classList.add('event');

            eventDiv.innerHTML = `
                <h3>${event.name}</h3>
                <p>Price: $${event.price}</p>
                <p>Stock: ${event.stock}</p>
                <button class="addToBasketButton" data-event-id="${event.id}">Add to Basket</button>
                <button class="favoriteButton" data-event-id="${event.id}">${favorites.includes(event.id) ? '❤️' : '🤍'}</button>
                <button class="reviewButton" data-event-id="${event.id}">View Reviews</button>
            `;

            
            eventsContainer.appendChild(eventDiv);
        });

        document.querySelectorAll('.favoriteButton').forEach(button => {
            button.addEventListener('click', (event) => {
                const eventId = event.target.getAttribute('data-event-id');
                toggleFavorite(eventId, event.target);
            });
        });

        document.querySelectorAll('.addToBasketButton').forEach(button => {
            button.addEventListener('click', (event) => {
                const eventId = event.target.getAttribute('data-event-id');
                addToBasket(eventId);
            });
        });

        document.querySelectorAll('.reviewButton').forEach(button => {
            button.addEventListener('click', (event) => {
                const eventId = event.target.getAttribute('data-event-id');
                window.location.href = `reviews.html?eventId=${eventId}`;
            });
        });

    } catch (error) {
        console.error("Error loading events:", error);
    }
};

const toggleFavorite = async (eventId, button) => {
    try {
        const user = await get(`/users/${userId}`); 
        let favorites = user.favorites || [];

        if (!favorites.includes(eventId)) {
            favorites.push(eventId);
            button.innerHTML = '❤️';
        } else {
            favorites = favorites.filter(id => id !== eventId);
            button.innerHTML = '🤍'; 
        }

        await patch(`/users/${userId}`, { favorites });
    } catch (error) {
        console.error("Error updating favorites:", error);
    }
};

const addToBasket = async (eventId) => {
    try {
        const user = await get(`/users/${userId}`);
        let basket = user.basket || [];

        const eventIndex = basket.findIndex(item => item.eventId === eventId);
        if (eventIndex !== -1) {
            basket[eventIndex].quantity += 1;
        } else {
            basket.push({ eventId, quantity: 1 });
        }

        await patch(`/users/${userId}`, { basket });
    } catch (error) {
        console.error("Error adding item to basket:", error);
    }
};

document.addEventListener('DOMContentLoaded', loadEvents);