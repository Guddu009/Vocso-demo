const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const admin = require('firebase-admin');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Firebase Admin Setup
// Note: Users should provide their own firebase-admin.json
try {
    const serviceAccount = require('./firebase-admin.json');
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
    console.log("Firebase Admin initialized");
} catch (error) {
    console.warn("Firebase Admin could not be initialized. Push notifications will be mocked. Please provide firebase-admin.json.");
}

let messages = [];

// Hardcoded users for demo
const HARDCODED_USERS = {
    "user1": "pass123",
    "user2": "pass123"
};

// API Endpoints
app.get('/api/messages', (req, res) => {
    res.json(messages);
});

app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ error: "Username and password are required" });
    }

    if (HARDCODED_USERS[username] === password) {
        res.status(200).json({ message: "Login successful", username });
    } else {
        res.status(401).json({ error: "Invalid username or password" });
    }
});

// Socket.io logic
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('send_message', async (data) => {
        const newMessage = {
            id: Date.now().toString(),
            text: data.text,
            sender: data.sender,
            timestamp: new Date().toISOString()
        };
        messages.push(newMessage);

        // Broadcast to all clients
        io.emit('receive_message', newMessage);

        // Send Push Notification via FCM
        if (data.fcmToken && admin.apps.length > 0) {
            const payload = {
                notification: {
                    title: `New message from ${data.sender}`,
                    body: data.text,
                },
                token: data.fcmToken,
                data: {
                    screen: 'Chat'
                }
            };

            try {
                await admin.messaging().send(payload);
                console.log("Push notification sent");
            } catch (error) {
                console.error("Error sending push notification:", error);
            }
        }
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
