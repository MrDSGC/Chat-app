const Chat = require('./chat')

class ChatUI {
  constructor(socket){
    this.chat = new Chat(socket)
  }
}
