import { NextResponse } from "next/server"

async function onMessage (message) {
    return sendPlainText(message.chat.id, "ad")
}

async function sendPlainText (chatId, text) {
    return (await fetch(apiUrl('sendMessage', {
      chat_id: chatId,
      parse_mode: 'Markdown',
      text
    }))).json()
}

async function onUpdate (update) {
    if ('message' in update) {
      await onMessage(update.message)
    }
  }

export async function POST (request){
    if (request.headers.get('X-Telegram-Bot-Api-Secret-Token') !== process.env.TG_BOT_TOKEN){
        return new NextResponse('Unauthorized', { status: 403 })
    }
    const update = await request.json()
    await onUpdate(update);

    return new NextResponse('Ok')
}

function apiUrl (methodName, params = null) {
    let query = ''
    if (params) {
      query = '?' + new URLSearchParams(params).toString()
    }
    return `https://api.telegram.org/bot${TOKEN}/${methodName}${query}`
}