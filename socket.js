const socketio = require('socket.io');
require("dotenv").config();

function setupSocket(server) {
  const io = socketio(server, {
    cors: {
      origin: "*"
    }
  });


  io.on('connection', (socket) => {
    console.log(socket.id)
    socket.on('joinSpaceChannel', (space) => {
      console.log(space._id)
      socket.join(space._id);
      
      socket.on('joinedSpace', (userId) => {
      io.to(space._id).emit('newMember', {msg: `${userId} has joined the space ${space._id}`});
      })

      socket.on('leftSpace', (userId) => {
        console.log(userId)
        io.to(space._id).emit('memberLeft', {msg: `${userId} has left the space ${space._id}`});
        })
      

    });

    socket.on('joinUser', (userId) => {
      socket.join(userId);
    });

    socket.on('notification', notification => {
      console.log(notification);
    });

  });

  return io;
}


module.exports = setupSocket;