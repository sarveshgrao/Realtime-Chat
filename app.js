// Replace with your Firebase config
let firebaseConfig = {
    apiKey: "AIzaSyBurJE6WGdbpLjYDhThGJDWXoEVoHcVJP0",
    authDomain: "diesel-freehold-399509.firebaseapp.com",
    databaseURL: "https://diesel-freehold-399509-default-rtdb.firebaseio.com",
    projectId: "diesel-freehold-399509",
    storageBucket: "diesel-freehold-399509.appspot.com",
    messagingSenderId: "401061178313",
    appId: "1:401061178313:web:dfb68e525e478de5a15618"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

var database = firebase.database();
var messagesRef = database.ref("messages");

function sendMessage() {
    var messageInput = document.getElementById("message-input");
    var messageText = messageInput.value.trim();

    if (messageText !== "") {
        messagesRef.push({
            text: messageText,
            timestamp: firebase.database.ServerValue.TIMESTAMP
        });

        messageInput.value = "";
    }
}

function displayMessage(key, text, timestamp) {
    var chatMessages = document.getElementById("chat-messages");
    var messageElement = document.createElement("div");
    var timestampString = new Date(timestamp).toLocaleTimeString();

    messageElement.innerHTML = `
        <p>${text}
        <button class="delete-button float-right" onclick="deleteMessage('${key}')">Delete</button>
        <span class="timestamp float-right">${timestampString}</span>
        </p>
    `;

    messageElement.setAttribute("data-key", key);
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function deleteMessage(key) {
    var confirmDelete = confirm("Are you sure you want to delete this message?");

    if (confirmDelete) {
        messagesRef.child(key).remove()
            .then(function () {
                // No need to manually refresh, child_removed event will handle it
            })
            .catch(function (error) {
                console.error("Error deleting message:", error);
            });
    }
}

messagesRef.on("child_added", function (snapshot) {
    var message = snapshot.val();
    displayMessage(snapshot.key, message.text, message.timestamp);
});

messagesRef.on("child_removed", function (snapshot) {
    var deletedMessageElement = document.querySelector(`[data-key="${snapshot.key}"]`);

    if (deletedMessageElement) {
        deletedMessageElement.remove();
    }
});

