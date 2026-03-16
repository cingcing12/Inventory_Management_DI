require('dotenv').config();
const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const TelegramBot = require('node-telegram-bot-api');
const https = require('https');

let serviceAccount;
try {
    serviceAccount = JSON.parse(process.env.SERVICE_ACCOUNT);
} catch (error) {
    console.error("🚨 FATAL ERROR: Could not parse SERVICE_ACCOUNT JSON!");
    process.exit(1); 
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore();

const token = process.env.TELEGRAM_BOT_TOKEN;
const adminChatId = process.env.TELEGRAM_ADMIN_CHAT_ID;
const bot = new TelegramBot(token, { polling: true });

const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json());

app.get('/ping', (req, res) => {
    res.status(200).send('Server is awake!');
});

// --- UPDATED ENDPOINT ---
app.post('/api/request-permission', async (req, res) => {
    // 1. Grab all the new details from the frontend
    const { userId, userName, categoryName, qty, message } = req.body;

    const requestRef = await db.collection('requests').add({
        user_id: userId,
        user_name: userName,
        category_name: categoryName,
        qty: qty,
        message: message,
        status: 'pending',
        timestamp: admin.firestore.FieldValue.serverTimestamp()
    });

    const opts = {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: '✅ Approve', callback_data: `approve_${requestRef.id}` },
                    { text: '❌ Reject', callback_data: `revoke_${requestRef.id}` }
                ]
            ]
        }
    };

    // 2. Create a beautiful, detailed Telegram message
    const telegramMessage = `
🚨 *New Stock Request* 🚨

👤 *User:* ${userName}
📦 *Item:* ${categoryName}
🔢 *Quantity:* ${qty}
📝 *Reason:* ${message}
    `;

    bot.sendMessage(adminChatId, telegramMessage, { parse_mode: 'Markdown', ...opts });
    
    res.status(200).json({ success: true, requestId: requestRef.id });
});

bot.on('callback_query', async (callbackQuery) => {
    const action = callbackQuery.data;
    const msg = callbackQuery.message;
    const [command, requestId] = action.split('_');

    const status = command === 'approve' ? 'true' : 'false';

    await db.collection('requests').doc(requestId).update({ status: status });

    bot.editMessageText(
        `${msg.text}\n\n${status === 'true' ? '✅ *APPROVED*' : '❌ *REJECTED*'}`, 
        {
            chat_id: msg.chat.id,
            message_id: msg.message_id,
            parse_mode: 'Markdown'
        }
    );
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Server running on port ${PORT}`);

    const url = 'https://inventory-management-di-8mso.onrender.com';
    setInterval(() => {
        https.get(`${url}/ping`, (resp) => {
            if (resp.statusCode === 200) console.log('Anti-sleep ping successful.');
        }).on('error', () => {
            console.log('Anti-sleep ping sent.');
        });
    }, 14 * 60 * 1000); 
});