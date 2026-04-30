"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.socketLib = void 0;
const socket_io_1 = require("socket.io");
class SocketLib {
    io = null;
    init(httpServer) {
        this.io = new socket_io_1.Server(httpServer, { cors: { origin: '*' } });
        this.io.on('connection', (socket) => {
            socket.on('error', (error) => {
                console.error(`[Socket Error] Client ${socket.id}: ${error}`);
            });
            socket.on('disconnect', (reason) => {
                if (reason !== 'client namespace disconnect') {
                    console.warn(`[Socket] Client ${socket.id} disconnected: ${reason}`);
                }
            });
        });
    }
    emit(event, data) {
        if (!this.io) {
            return;
        }
        this.io.emit(event, data);
    }
}
exports.socketLib = new SocketLib();
//# sourceMappingURL=socketio.lib.js.map