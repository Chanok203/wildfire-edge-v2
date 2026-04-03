import { Server as HttpServer } from 'http';
import { Server } from 'socket.io';

class SocketLib {
    public io: Server | null = null;

    init(httpServer: HttpServer) {
        this.io = new Server(httpServer, { cors: { origin: '*' } });
        this.io.on('connection', (socket) => {
            socket.on('error', (error) => {
                console.error(`[Socket Error] Client ${socket.id}: ${error}`);
            });
            socket.on('disconnect', (reason) => {
                if (reason !== 'client namespace disconnect') {
                    console.warn(
                        `[Socket] Client ${socket.id} disconnected: ${reason}`,
                    );
                }
            });
        });
    }

    emit(event: string, data: any) {
        if (!this.io) {
            return;
        }

        this.io.emit(event, data);
    }
}

export const socketLib = new SocketLib();