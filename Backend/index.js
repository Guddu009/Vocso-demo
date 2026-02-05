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
    console.log("Firebase Admin initialized for project:", serviceAccount.project_id);
} catch (error) {
    console.warn("Firebase Admin could not be initialized. Push notifications will be mocked. Please provide firebase-admin.json.");
}

let messages = [];
let USER_TOKENS = {}; // Store { username: fcmToken } in memory

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

app.post('/api/save-token', (req, res) => {
    const { username, fcmToken } = req.body;
    if (!username || !fcmToken) {
        return res.status(400).json({ error: "Username and fcmToken are required" });
    }
    USER_TOKENS[username] = fcmToken;
    console.log(`Token saved for ${username}: ${fcmToken}`);
    res.status(200).json({ message: "Token saved successfully" });
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
        // We now get the recipient's token from our storage
        // For simplicity in this demo, we can notify everyone except the sender
        // or a specific recipient if 'recipient' is provided in data.

        const recipient = data.recipient; // UI should pass this
        const fcmToken = recipient ? USER_TOKENS[recipient] : data.fcmToken;

        console.log(`--- New Message from ${data.sender} ---`);
        console.log(`Text: ${data.text}`);
        console.log(`Recipient: ${recipient || 'Not specified'}`);
        console.log(`Recipient Token Found: ${fcmToken ? 'Yes' : 'No'}`);

        if (fcmToken && admin.apps.length > 0) {
            const payload = {
                notification: {
                    title: data.sender, // WhatsApp style: Sender name as title
                    body: data.text,
                },
                token: fcmToken,
                data: {
                    screen: 'Chat',
                    sender: data.sender,
                    message: data.text,
                },
                android: {
                    priority: 'high',
                    notification: {
                        channelId: 'chat-messages',
                        tag: 'chat', // Groups notifications from the same sender
                        color: '#075E54', // WhatsApp brand color
                    }
                },
                apns: {
                    payload: {
                        aps: {
                            sound: 'default',
                            'content-available': 1,
                        }
                    }
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
