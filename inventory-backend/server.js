require('dotenv').config();
const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const TelegramBot = require('node-telegram-bot-api');
const https = require('https'); // Built-in Node.js module for making requests

// Initialize Firebase Admin
const serviceAccount = JSON.parse(process.env.SERVICE_ACCOUNT);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore();

// Initialize Telegram Bot
const token = process.env.TELEGRAM_BOT_TOKEN;
const adminChatId = process.env.TELEGRAM_ADMIN_CHAT_ID;
const bot = new TelegramBot(token, { polling: true });

const app = express();

// Set CORS to allow your GitHub Pages frontend to talk to it!
app.use(cors({ origin: '*' }));
app.use(express.json());

// --- THE WAKE-UP ENDPOINT ---
// This is a tiny endpoint just so the server has something to ping
app.get('/ping', (req, res) => {
    res.status(200).send('Server is awake!');
});

// API Endpoint for Vue to trigger a request
app.post('/api/request-permission', async (req, res) => {
    const { userId, userName } = req.body;

    // 1. Create a request document in Firebase
    const requestRef = await db.collection('requests').add({
        user_id: userId,
        user_name: userName,
        status: 'pending',
        timestamp: admin.firestore.FieldValue.serverTimestamp()
    });

    // 2. Send Telegram Message to Admin with Buttons
    const opts = {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: '✅ Approve', callback_data: `approve_${requestRef.id}` },
                    { text: '❌ Reject/Revoke', callback_data: `revoke_${requestRef.id}` }
                ]
            ]
        }
    };

    bot.sendMessage(adminChatId, `🚨 User *${userName}* is requesting permission to take/use stock.`, { parse_mode: 'Markdown', ...opts });
    
    res.status(200).json({ success: true, requestId: requestRef.id });
});

// Listen for Admin Button Clicks in Telegram
bot.on('callback_query', async (callbackQuery) => {
    const action = callbackQuery.data;
    const msg = callbackQuery.message;
    const [command, requestId] = action.split('_');

    const status = command === 'approve' ? 'true' : 'false';

    // Update Firebase
    await db.collection('requests').doc(requestId).update({ status: status });

    // Update Telegram message so buttons disappear
    bot.editMessageText(`Status updated to: ${status === 'true' ? '✅ Approved' : '❌ Revoked'} for request ID: ${requestId}`, {
        chat_id: msg.chat.id,
        message_id: msg.message_id
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);

    // --- ANTI-SLEEP MECHANISM ---
    // Put your exact Render URL here
    const url = 'https://inventory-management-di-8mso.onrender.com';
    
    // Ping the server every 14 minutes (840,000 milliseconds)
    setInterval(() => {
        https.get(`${url}/ping`, (resp) => {
            if (resp.statusCode === 200) {
                console.log('Anti-sleep ping successful. Server kept awake.');
            } else {
                console.error('Anti-sleep ping failed with status:', resp.statusCode);
            }
        }).on('error', (err) => {
            console.error('Anti-sleep ping error:', err.message);
        });
    }, 14 * 60 * 1000); 
});