class Chat {
  constructor(socket){
    this.socket = socket
  }

  sendMessage(msg){
  this.socket.emit('message', {text: msg})
  }

  processCommand(command){
    const words = command.split(' ')
    const parsedCmd = words[0].substring(1, words[0].length).toLowerCase()
    let msg = false

    switch (parsedCmd) {
      case 'join':
        words.shift()
        const room = words.join(' ')
        this.changeRoom(room)
        break
      case 'nick':
        words.shift()
        const name = words.join(' ')
        this.socket.emit('nameAttempt', name)
        break
      default:
        msg = 'Unrecognized command.'
        break
    }
    return msg
  }

}   

module.exports = Chat
