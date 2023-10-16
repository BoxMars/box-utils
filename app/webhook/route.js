import { NextResponse } from "next/server"

async function commands_help(){
  const commands_list=(await (await fetch(apiUrl('getMyCommands'))).json())['result']
  let text='Please send me some commands.\n\n'
  for (let i=0; i<commands_list.length;i++){
    text+='\t/'+commands_list[i]['command']+" - "+ commands_list[i]['description']+"\n"
  }
  return text
}

async function umbusCommand(message){
  const bus_info=await (await fetch('https://tools.boxz.dev/api/umbus',
  { cache: 'no-cache' })).json()
  console.log(bus_info)
  let text=""
  bus_info['infoList'].map(info=>{
    text+=info+'\n'
  })
  bus_info['busCurStatue'].map(t_bus=>{
    text+="\n"+t_bus['bus']+'\n'
    if (t_bus['curStatue'].includes('-')){
      const t_bus_list=t_bus['curStatue'].split('-')
      text+='🛫*'+t_bus_list[0]+"*\n"
      text+="🛬*"+t_bus_list[1]+'*\n'

    }
    else{
      text+="🚏*"+t_bus['curStatue']+"*\n\n"
    }
  })
  return sendPlainText(message.chat.id,text)

}

async function onMessage (message) {
  const commands_help_text=await commands_help()
  if (!('entities' in message)){
    return sendPlainText(message.chat.id, commands_help_text)
  }

  const commands=message['entities'].map(
    (entity)=>{
      return message.text.substr(entity.offset,entity.length).replace("/","").trim()
    }
  )
  if (commands.length===0){
    return sendPlainText(message.chat.id, commands_help_text)
  }
  console.log(commands)
  for (let i=0;i<commands.length;i++){
    if (commands[i]==='umbus'){
      await umbusCommand(message)
    }
  }
}


export async function POST (request){
    // console.log(request)
    if (request.headers.get('X-Telegram-Bot-Api-Secret-Token') !== process.env.TG_BOT_SECRET){
        return new NextResponse('Unauthorized', { status: 403 })
    }
    const update = await request.json()
    await onUpdate(update);

    return new NextResponse('Ok')
}

async function onUpdate (update) {
  if ('message' in update) {
    await onMessage(update.message)
  }
}

async function sendPlainText (chatId, text) {
  return (await fetch(apiUrl('sendMessage', {
    chat_id: chatId,
    parse_mode: 'Markdown',
    text
  }))).json()
}

function apiUrl (methodName, params = null) {
    let query = ''
    if (params) {
      query = '?' + new URLSearchParams(params).toString()
    }
    return `https://api.telegram.org/bot${process.env.TG_BOT_TOKEN}/${methodName}${query}`
}