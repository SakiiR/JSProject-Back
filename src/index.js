import App from "./App";
import config from "./config";
import Room from "./models/Room";
import Message from "./models/Message";

const Koa = require("koa"),
  websockify = require("koa-websocket");
const socket = websockify(new Koa());
const app = new App();

let usernames = {};
let rooms = [];

app.start();

async function getRooms() {
  const roomss = await Room.find({}).select("-password -salt");
  for (var i = 0; i != roomss.length; i++)
    rooms.push({ room: roomss[i], userSockets: [] });
}

getRooms();

// Using routes
socket.ws.use(async ctx => {
  console.log(rooms);
  console.log("weshin");
  // `ctx` is the regular koa context created from the `ws` onConnection `socket.upgradeReq` object.
  // the websocket is added to the context on `ctx.websocket`.
  ctx.websocket.on("message", message => {
    console.log(message);
    // do something with the message from client
    // These are client emit examples
    ctx.websocket.emit("sendChat", "SERVER", "message sent ", {
      currentRoom: {
        _id: "5bc8b6d79f5a3f09cc19fd8d",
        creator: "5bc5e3a8c2a4292f38333c99",
        name: "RoomTest",
        description: "DescriptionTest",
        private: true,
        __v: 0
      },
      from: 4,
      room: 5,
      text: "lol"
    });
    ctx.websocket.emit("addUser", "SERVER", "you have connected to ", {
      username: "test",
      room: {
        _id: "5bc8b6d79f5a3f09cc19fd8d",
        creator: "5bc5e3a8c2a4292f38333c99",
        name: "RoomTest",
        description: "DescriptionTest",
        private: true,
        __v: 0
      },
      text: "lol"
    });
  });
  ctx.websocket.emit("message", "Connexion OK");
  // when the client emits 'adduser', this listens and executes
  ctx.websocket.on("connectUser", async (emitter, message, data) => {
    // store the username in the socket session for this client
    ctx.websocket.username = data.username;
    if (rooms.indexOf(data.room) != -1) {
      // Stores the room joined in the socket session for this client
      ctx.websocket.room = data.room;
      // add the client's username to the global list
      usernames[data.username] = data.username;
      // Send to everyone the new users list
      for (let i = 0; i != rooms.length; i++) {
        for (let j = 0; j != rooms[i].userSockets.length; j++) {
          ctx.websocket.emit(
            "updateUsers",
            "SERVER",
            "User connected",
            usernames
          );
        }
      }
      // Add current user to the socket list of the joined room
      rooms[rooms.indexOf(data.room)].userSockets.push(ctx.websocket);
      // echo to client he has connected
      ctx.websocket.emit(
        "updateChat",
        "SERVER",
        "you have connected to " + data.room.name
      );
      // echo to every users connected to joined room that a user has connected
      for (
        let i = 0;
        i != rooms[rooms.indexOf(data.room)].userSockets.length;
        i++
      ) {
        rooms[rooms.indexOf(data.room)].userSockets[i].emit(
          "updateChat",
          "SERVER",
          data.username + " has connected to this room"
        );
      }
    } else ctx.websocket.emit("error", "SERVER", "Room inexistante");
  });

  // when the client emits 'sendchat', this listens and executes
  // Emitter = ("SERVER" | "CLIENT") Message = "info", Data = {}
  ctx.websocket.on("sendChat", async (emitter, message, data) => {
    if (rooms.indexOf(data.room) != -1) {
      await Message.create(
        {
          from: data.from,
          room: data.room,
          text: data.text
        },
        async (err, message) => {
          if (err) ctx.websocket.emit("error", "SERVER", err);
          // OK, sending an object with sender's username and newly created message entity
          else {
            ctx.websockets.in(socket.room).emit("updateChat", "SERVER", "OK", {
              username: socket.username,
              message: message
            });
          }
        }
      );
    } else ctx.websocket.emit("error", "SERVER", "Room inexistante");
  });

  // When the user switches room, perform this (this listener creates the room if it doesn't exists)
  ctx.websocket.on("switchRoom", async (emitter, message, data) => {
    // echo to current room that the current user has disconnected from the room
    if (rooms.indexOf(ctx.websocket.room) != -1) {
      for (
        let i = 0;
        i != rooms[rooms.indexOf(ctx.websocket.room)].userSockets.length;
        i++
      ) {
        rooms[rooms.indexOf(data.newroom)].userSockets[i].emit(
          "updateChat",
          "SERVER",
          data.username + " disconnected from this room"
        );
      }
    }
    // If the room exists, connect the current user to it
    if (rooms.indexOf(data.newRoom) != -1) {
      // send client to room passed in parameter
      rooms[rooms.indexOf(data.room)].userSockets.push(ctx.websocket);
      // echo to client they've connected
      ctx.websocket.emit(
        "updateChat",
        "SERVER",
        "you have connected to " + data.newRoom.name
      );
      // echo to newRoom that a person has connected to their room
      for (
        let i = 0;
        i != rooms[rooms.indexOf(data.newRoom)].userSockets.length;
        i++
      ) {
        rooms[rooms.indexOf(data.newroom)].userSockets[i].emit(
          "updateChat",
          "SERVER",
          data.username + " has connected to this room"
        );
      }
    } else {
      // If the room is not in the list, it's newly created so we send to everyone that the rooms have been updated
      for (let i = 0; i != rooms.length; i++) {
        for (let j = 0; j != rooms[i].userSockets.length; j++) {
          ctx.websocket.emit(
            "updateRooms",
            "SERVER",
            "Room added",
            data.newRoom
          );
        }
      }
      // And we add it to the room list.
      rooms.push(data.newRoom);
    }
  });

  // when the user disconnects, perform this
  ctx.websocket.on("disconnect", async () => {
    // We put the current user's socket out from the room list.
    delete rooms[rooms.indexOf(ctx.websocket.room)].userSocket[
      rooms[rooms.indexOf(ctx.websocket.room)].userSockets.indexOf(
        ctx.websocket
      )
    ];
    // remove the username from global usernames list
    delete usernames[ctx.websocket.username];
    // Send to everyone the new users list
    for (let i = 0; i != rooms.length; i++) {
      for (let j = 0; j != rooms[i].userSockets.length; j++) {
        ctx.websocket.emit(
          "updateUsers",
          "SERVER",
          "User connected",
          usernames
        );
      }
    }
    console.log("weshout");
  });
});

socket.listen(config.WS_PORT, async () => {
  console.log("#BalanceTonPort: *:" + config.WS_PORT);
});
