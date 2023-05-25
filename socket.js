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

    socket.on('checkMembership', (data) => {
      const { userId } = data; // Assuming you have implemented user authentication and have access to the user ID

      // Retrieve all spaces from the database
      Space.find({}, (err, spaces) => {
        if (err) {
          // Handle error
          console.error(err);
          return;
        }

        // Iterate over each space and check if the user is a member
        spaces.forEach((space) => {
          const { _id } = space;
          const isMember = space.members.includes(userId);

          if (isMember) {
            socket.join(_id); // Join the space channel
            console.log(`Socket ${socket.id} joined space ${_id}`);
          } else {
            console.log(`Socket ${socket.id} is not a member of space ${_id}`);
          }
        });
      });
    });

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
        io.to(spaceId).emit('newPostNotification', {
          post: post,
          user: socket.id // Replace with the appropriate user information
        });
        console.log(post)
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