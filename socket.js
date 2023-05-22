const socketio = require('socket.io');
const { createNotification } = require("./controller/NotificationController")
const { User, Space } = require("./models")
const jwt = require("jsonwebtoken");
require("dotenv").config();

function setupSocket(server) {
  const io = socketio(server, {
    cors: {
      origin: "*"
    }
  });

  io.on("connection", (socket) => {
    console.log("New socket connected", socket.id)
    
    socket.on('joinSpaceChannel', (spaceId) => {
      socket.join(spaceId)
      console.log(`User joined ${spaceId} space channel`);


      // Emit 'joinedSpace' event to the joined space channel
      socket.to(spaceId).emit('joinedSpace', {
        message: 'A user has joined the space channel.',
        user: socket.id, // Replace with the appropriate user information
        spaceId: spaceId
      });

      // Emit 'leftSpace' event to the joined space channel
      socket.on('disconnect', () => {
        socket.to(spaceId).emit('leftSpace', {
          message: 'A user has left the space channel.',
          user: socket.id, // Replace with the appropriate user information
          spaceId: spaceId
        });
      });

      // Emit 'postComment' event to the joined space channel
      socket.on('postComment', (comment) => {
        socket.to(spaceId).emit('postComment', {
          comment: comment,
          user: socket.id // Replace with the appropriate user information
        });
      });

      // Emit 'commentReply' event to the joined space channel
      socket.on('commentReply', (reply) => {
        socket.to(spaceId).emit('commentReply', {
          reply: reply,
          user: socket.id // Replace with the appropriate user information
        });
      });

      // Emit 'commentMention' event to the joined space channel
      socket.on('commentMention', (mention) => {
        socket.to(spaceId).emit('commentMention', {
          mention: mention,
          user: socket.id // Replace with the appropriate user information
        });
      });

      // Emit 'newPost' event to the joined space channel
      socket.on('newPost', (post) => {
        socket.to(spaceId).emit('newPost', {
          post: post,
          user: socket.id // Replace with the appropriate user information
        });
      });
    })

    socket.on('leaveSpaceChannel', (spaceId) => {
      socket.leave(spaceId)
      console.log(`User left ${spaceId} space channel`)
    })

    socket.on('joinUserChannel', (userId) => {
      socket.join(userId)
    })

    socket.on('leaveUserChannel', (userId) => {
      socket.leave(userId)
    })

  });

  return io;
}


module.exports = setupSocket;