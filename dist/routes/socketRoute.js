"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatSocketHandler = void 0;
// import socketAuth from '../middleware/socketAuth';
const chatSocketHandler = (io) => {
    //   io.use(socketAuth);
    io.on('connection', (socket) => {
        console.log('New client connected', socket.id);
        socket.on('disconnect', () => {
            console.log('Client disconnected', socket.id);
        });
        socket.on('privateMessage', ({ from, message, to }) => {
            // Emit the message to the specific user
            io.to(to).emit('privateMessage', {
                message,
                from: from,
            });
        });
    });
};
exports.chatSocketHandler = chatSocketHandler;
