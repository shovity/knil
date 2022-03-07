const { Server } = require("socket.io")
const { io } = require("socket.io-client")


const knil = (option) => {

    if (typeof option === 'string') {
        option = {
            master: option
        }
    }

    option = Object.assign({
        master: undefined,
        hash: undefined,
    }, option)

    const ins = {}

    if (option.master) {
        ins.io = io(option.master, {
            auth: {
                token: option.master.split('#')[1]
            }
        })

        ins.emit = ins.io.emit.bind(ins.io)
        ins.on = ins.io.on.bind(ins.io)

    } else {
        ins.io = new Server()
        ins.io.listen(8689)

        ins.io.use((socket, next) => {
            if (socket.handshake.auth.token !== option.hash) {
                return next(new Error('invalid hash'))
            }

            next()
        })

        ins.emit = ins.io.sockets.emit.bind(ins.io.sockets)
        ins.nodes = ins.io.sockets.fetchSockets.bind(ins.io.sockets)

        ins.on = (name, handle) => {
            ins.io.on('connection', (socket) => {
                socket.on(name, (data, done) => {
                    handle(data, done, socket)
                })
            })
        }
    }

    return ins
}

module.exports = knil