const socket = io('http://localhost:3005');

// Get user name and validate input
let userName = '';
while (!userName) {
    userName = prompt("Enter Your Name To Join").trim(); // Ensure the name is not empty
}

console.log("Entered name:", userName); // Check if it's printing

// Emit event to server when user joins
socket.emit('new-user-joined', userName);

// Send message event
const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector('.container');
var audio = new Audio('news-ting-6832.mp3');

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value;

    if (message.trim() !== '') { // Check if the message is not empty
        append(`You: ${message}`, 'right');
        socket.emit('send', message);
        messageInput.value = ''; // Clear the input field
    }
});

// Listen for 'user-joined' event from server and append message
socket.on('user-joined', (userName) => {
    append(`${userName} has joined the chat`, 'left' , 'joining');
});

// Receive messages from others
socket.on('receive', (data) => {
    append(`${data.name}: ${data.message}`, 'left');
});

// When the user left the chat
socket.on('left', (data) => {
    append(`${data.name} left the chat`, 'left' , 'leaving');
});

const append = (message, position, specialClass = '') => {
    const messageElement = document.createElement('div');
    messageElement.innerHTML = message.replace(/(\w+):/, '<b>$1:</b>'); // Bold the name
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    if (specialClass) {
        messageElement.classList.add(specialClass); // Add special class if provided
    }
    messageContainer.append(messageElement);
    if (position == "left") {
        audio.play();
    }
};

