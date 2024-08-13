import { Server, Socket } from 'socket.io';
// import socketAuth from '../middleware/socketAuth';

export const chatSocketHandler = (io: Server) => {
//   io.use(socketAuth);

  io.on('connection', (socket: Socket) => {
    console.log('New client connected', socket.id);

    socket.on('disconnect', () => {
      console.log('Client disconnected',socket.id);
    });

    socket.on('privateMessage', ({from,message, to }) => {
      // Emit the message to the specific user
      io.to(to).emit('privateMessage', {
        message,
        from: from,
      });
    });
  });
};
