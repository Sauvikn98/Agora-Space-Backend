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

  io.use((socket, next) => {
    const token = socket.handshake.auth.token;

    if (!token) {
      return next(new Error("Authorization token is missing, access denied"));
    }

    jwt.verify(token, process.env.JWT_TOKEN, async (error, decoded) => {
      if (error) {
        return next(new Error("Invalid Token, access denied"));
      } else {
        const user = await User.findOne({ _id: decoded.user.id });
        if (!user) {
          return next(new Error("User not found, access denied"));
        }
        socket.user = user;
        next();
      }
    });
  });

  const userSockets = {};

  io.on('connection', (socket) => {
    console.log('New client connected', socket.user._id.toString());
    userSockets[socket.user._id.toString()] = socket.id;

    socket.on('joinSpace', async ({ spaceId, notification }) => {
      socket.join(spaceId);
      console.log(`User ${socket.user._id} joined space ${spaceId}`);
      try {
        const spaces = await Space.find({ _id: spaceId, members: socket.user._id });
        const newNotification = await createNotification(notification);
        spaces.forEach((space) => {
          const members = space.members.filter((member) => member.toString() !== socket.user._id.toString());
          members.forEach((member) => {
            const memberId = member.toString();
            const memberSocketId = userSockets[memberId];
            if (memberSocketId) {
              io.to(memberSocketId).emit('newNotification', newNotification);
              console.log(`New notification created for user ${memberId} and the notification is ${newNotification}`);
            } else {
              console.log(`User ${memberId} is not connected`);
            }
          });
        });
      } catch (error) {
        console.error(error);
      }
    });

    {/*socket.on('notification', async (notification) => {
      try {
        // Create a new notification document and save it to the database
        const newNotification = await createNotification(notification);
        // Emit the new notification to all other sockets except for the sender
        socket.broadcast.emit('newNotification12', newNotification);
        console.log('New Notification created:', newNotification);
      } catch (error) {
        console.error(error);
      }
    });
    
  */}

    socket.on('disconnect', () => {
      console.log(`User disconnected`, socket.user._id.toString())
    })

  });

  return io;
}


module.exports = setupSocket;