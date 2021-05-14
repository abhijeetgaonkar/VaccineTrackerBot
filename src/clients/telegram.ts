import TelegramBot from "node-telegram-bot-api"
import { sendMessageToBot } from "../services/sendMessage"
import { CacheClient } from "./node-cache"

// replace the value below with the Telegram token you receive from @BotFather
const token = '<authorization token>'

export const chatIds = []

// Create a bot that uses 'polling' to fetch new updates
export const Bot = new TelegramBot(token, {polling: true})

Bot.on('message', (msg) => {
    const chatId = msg.chat.id
    if (!chatIds.includes(chatId)) {
        chatIds.push(chatId)
        CacheClient.set('chatIds', chatIds)
    }
})

// Listener (handler) for telegram's /available event
Bot.onText(/\/available/, (msg, match) => {
    const chatId = msg.chat.id
    if (!chatIds.includes(chatId)) {
        chatIds.push(chatId)
        CacheClient.set('chatIds', chatIds)
    }

    Bot.sendMessage(
        chatId,
        'Choose age',
        {
            reply_markup: {
                inline_keyboard: [[
                    {
                        text: 'Below 45',
                        callback_data: '18'
                    }, {
                        text: 'Above 45',
                        callback_data: '45'
                    }
                ]]
            }
        }
    )
 })

 // Listener (handler) for callback data from /label command
 Bot.on('callback_query', async (callbackQuery,) => {
    const ageLimit = callbackQuery.data
    const chatId = callbackQuery.message.chat.id
    await sendMessageToBot(Number(ageLimit), [chatId])
 })
