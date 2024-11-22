const stompClient = new StompJs.Client({
    brokerURL: 'ws://localhost:8080/gs-guide-websocket',
    debug: (str) => console.log(str), // Debug logs for troubleshooting
    reconnectDelay: 5000 // Auto-reconnect after 5 seconds
});

// WebSocket connection events
stompClient.onConnect = (frame) => {
    setConnected(true);
    console.log('Connected: ' + frame);
    stompClient.subscribe('/topic/greetings', (response) => {
        const data = JSON.parse(response.body);

        if (data.file) {
            const videoBlob = new Blob([base64ToArrayBuffer(data.file)], { type: 'video/mp4' });
            const videoUrl = URL.createObjectURL(videoBlob);

            // Create and display the video element
            const videoElement = document.createElement('video');
            videoElement.src = videoUrl;
            videoElement.controls = true;
            videoElement.style.width = '100%';
            document.getElementById("greetings").appendChild(videoElement);
        }

        if (data.message) {
            showGreeting(data.message);
        }
    });
};

stompClient.onWebSocketError = (error) => {
    console.error('WebSocket error: ', error);
};

stompClient.onStompError = (frame) => {
    console.error('Broker error: ' + frame.headers['message']);
    console.error('Details: ' + frame.body);
};

// Update UI connection state
function setConnected(connected) {
    $("#connect").prop("disabled", connected);
    $("#disconnect").prop("disabled", !connected);
    if (connected) {
        $("#conversation").show();
    } else {
        $("#conversation").hide();
    }
    $("#greetings").html("");
}

// Connect to WebSocket
function connect() {
    stompClient.activate();
}

// Disconnect from WebSocket
function disconnect() {
    stompClient.deactivate();
    setConnected(false);
    console.log("Disconnected");
}

// Send message or video
function sendMessage() {
    const messageInput = $("#message").val().trim();
    const fileInput = $("#file")[0];
    const file = fileInput.files[0];

    if (!messageInput && !file) {
        alert("Please enter a message or select a video file.");
        return;
    }

    const payload = {
        userId: "user123",
        message: messageInput || "Uploaded a video", // Fallback message if only a video is sent
        file: null,
        createdDate: new Date().toISOString()
    };

    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            payload.file = event.target.result.split(',')[1]; // Remove data URL prefix

            // Publish message with video
            stompClient.publish({
                destination: "/app/message",
                body: JSON.stringify(payload)
            });
        };
        reader.readAsDataURL(file);
    } else {
        // Publish message without video
        stompClient.publish({
            destination: "/app/message",
            body: JSON.stringify(payload)
        });
    }
}

// Display a message in the UI
function showGreeting(message) {
    const row = `<tr><td>${message}</td></tr>`;
    $("#greetings").append(row);
}

// Convert Base64 string to ArrayBuffer
function base64ToArrayBuffer(base64) {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
}

// Attach event listeners
$(document).ready(() => {
    $("#connect").click(() => connect());
    $("#disconnect").click(() => disconnect());
    $("#send").click(() => sendMessage());
});
