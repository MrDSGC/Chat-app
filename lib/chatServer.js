const io = require('socket.io');

let chat
let guestNum = 1   

const nickNames = {}
let namesUsed = []

const chatServer = {
  assignGuestName (socket, guestNumber, nickNames, namesUsed) {
    const name = `Guest_${guestNumber}`
    nickNames[socket.id] = name
    socket.emit('nameResult', {
      success: true,
      name
    })
    namesUsed.push(name)
    return guestNumber + 1
  },
  handleClientDisconnection (socket) {
    socket.on('disconnect', () => {
      const nameIdx = namesUsed.indexOf(nickNames[socket.id])
      delete nickNames[socket.id]
      namesUsed = [
        ...namesUsed.slice(0, nameIdx),
        ...namesUsed.slice(nameIdx + 1)
      ]
    })
  },
  handleNameChangeAttempts (socket, nickNames, namesUsed) {
    socket.on('nameAttempt', (name) => {
      if (name.toLowerCase().startsWith('guest')) {
        socket.emit('nameResult', {
          success: false,
          message: 'Names cannot begin with "Guest"'
        })
      } else {
        if (!namesUsed.includes(name)) {
          const prevName = nickNames[socket.id]
          const prevNameIdx = namesUsed.indexOf(prevName)
          nickNames[socket.id] = name
          namesUsed = [
            ...namesUsed.slice(0, prevNameIdx),
            ...namesUsed.slice(prevNameIdx + 1),
            name
          ]
          socket.emit('nameResult', {
            success: true,
            name
          })
          socket.broadcast.emit('message', {
            text: `${prevName} is now known as ${name}.`
          })
        } else {
          socket.emit('nameResult', {
            success: false,
            message: 'That name is already in use.'
          })
        }
      }
    })
  },
  handleMessageBroadcast (socket) {
    socket.on('message', (message) => {
      socket.broadcast.emit('message', {
        text: `${nickNames[socket.id]}: ${message.text}`
      })
    })
  },
  listen (server) {
    chat = io(server)

    chat.on('connection', (socket) => {
      guestNum = this.assignGuestName(
        socket, guestNum, nickNames, namesUsed
      )

      this.handleNameChangeAttempts(socket, nickNames, namesUsed)
      this.handleMessageBroadcast(socket, nickNames)
      this.handleClientDisconnection(socket)
    })
  }
}



module.exports = chatServer
