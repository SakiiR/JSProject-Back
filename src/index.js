import App from "./App";
import config from "./config";
import Room from "./models/Room";

const Koa = require("koa"),
  websockify = require("koa-websocket");
const socket = websockify(new Koa());
const app = new App();

let usernames = {};
let rooms = [];

app.start();

// Returns an array containing all the rooms in database
async function getRooms() {
  const roomss = await Room.find({}).select("-password -salt");
  for (let i = 0; i != roomss.length; i++)
    rooms.push({ room: roomss[i], userSockets: [] });
}

getRooms();

// Returns the position of the room in rooms array if it exists.
async function isRoomAvailable(roomId) {
  for (let i = 0; i != rooms.length; i++) {
    if (rooms[i].room._id == roomId) {
      return i;
    }
  }
  return -1;
}

// Using routes
socket.ws.use(async ctx => {
  console.log("weshin");
  // `ctx` is the regular koa context created from the `ws` onConnection `socket.upgradeReq` object.
  // the websocket is added to the context on `ctx.websocket`.
  ctx.websocket.on("message", async (emitter, message) => {
    if (emitter == "CLIENT") console.log(message);
    // do something with the message from client
    // These are client emit examples
    // This is to emit after a successful call of POST Auth/login
    // with the room to connect to as well as the username in data parameters.
    // await ctx.websocket.emit(
    //   "connectUser",
    //   "CLIENT",
    //   "connection",
    //   {
    //     username: "test",
    //     room: {
    //       _id: "5bc8b6d79f5a3f09cc19fd8d",
    //       creator: "5bc5e3a8c2a4292f38333c99",
    //       name: "RoomTest",
    //       description: "DescriptionTest",
    //       private: true,
    //       __v: 0
    //     }
    //   }
    // );
    // This is to emit after a successful call of POST Message, from is the id of the sender
    // room is the id of the room and text is the message itself.
    // await ctx.websocket.emit("sendChat", "CLIENT", "message sent", {
    //   from: 5bc5e3a8c2a4292f38333c99,
    //   room: 5bc8b6d79f5a3f09cc19fd8d,
    //   text: "lol"
    // });
    // This is to emit when switching room, newRoom is the room object to connect to
    // await ctx.websocket.emit("switchRoom", "CLIENT", "message sent", {
    //   newRoom: {
    //       _id: "5bc8b6d79f5a3f09cc19fd8d",
    //       creator: "5bc5e3a8c2a4292f38333c99",
    //       name: "RoomTest",
    //       description: "DescriptionTest",
    //       private: true,
    //       __v: 0
    //     }
    // });
    // This is to emit disconnecting
    // await ctx.websocket.emit("disconnect", "CLIENT", "disconnection");
  });
  ctx.websocket.emit("message", "SERVER", "Connexion OK");
  // when the client emits 'adduser', this listens and executes
  ctx.websocket.on("connectUser", async (emitter, message, data) => {
    // store the username in the socket session for this client
    ctx.websocket.username = data.username;
    let pos = await isRoomAvailable(data.room._id);
    if (pos > -1) {
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
      // echo to every users connected to joined room that a user has connected
      for (let i = 0; i != rooms[pos].userSockets.length; i++) {
        rooms[pos].userSockets[i].emit(
          "updateChat",
          "SERVER",
          data.username + " has connected to this room"
        );
      }
      // Add current user to the socket list of the joined room
      rooms[pos].userSockets.push(ctx.websocket);
      ctx.websocket.index = rooms[pos].userSockets.length - 1;
      // echo to client he has connected
      ctx.websocket.emit(
        "updateChat",
        "SERVER",
        "you have connected to " + data.room.name
      );
    } else ctx.websocket.emit("error", "SERVER", "Room inexistante");
  });

  // when the client emits 'sendchat', this listens and executes
  // Emitter = ("SERVER" | "CLIENT") Message = "info", Data = {}
  ctx.websocket.on("sendChat", async (emitter, message, data) => {
    let pos = -1;
    if (ctx.websocket.room != undefined)
      pos = await isRoomAvailable(ctx.websocket.room._id);
    if (pos > -1) {
      for (let i = 0; i != rooms[pos].userSockets.length; i++) {
        // Send "username:message" to every users connected to the current room
        rooms[pos].userSockets[i].emit(
          "updateChat",
          "SERVER",
          ctx.websocket.username + ":" + data.text
        );
      }
    } else ctx.websocket.emit("error", "SERVER", "Room inexistante");
  });

  // When the user switches room, perform this (this listener creates the room if it doesn't exists)
  ctx.websocket.on("switchRoom", async (emitter, message, data) => {
    let pos = -1;
    let posNewRoom = -1;
    if (ctx.websocket.room != undefined) {
      pos = await isRoomAvailable(ctx.websocket.room._id);
      posNewRoom = await isRoomAvailable(data.newRoom._id);
    }
    // If the current room exists
    if (pos > -1) {
      // echo to current room that the current user has disconnected from the room
      for (let i = 0; i != rooms[pos].userSockets.length; i++) {
        rooms[pos].userSockets[i].emit(
          "updateChat",
          "SERVER",
          data.username + " disconnected from this room"
        );
      }
      // Delete the current context from the current room userSocket list
      delete rooms[pos].userSockets[ctx.websocket.index];
    }
    // If the new room exists, connect the current user to it
    if (posNewRoom == -1) {
      //  If the room is not in the list, it's newly created so we add it to the list.
      rooms.push(data.newRoom);
      // and we send to everyone that the rooms have been updated
      for (let i = 0; i != rooms.length; i++) {
        for (let j = 0; j != rooms[i].userSockets.length; j++) {
          ctx.websocket.emit("updateRooms", "SERVER", "Room added", rooms);
        }
      }
      // We add the new room to the current context
      ctx.websocket.room = data.newRoom;
    }
    // echo to newRoom that a person has connected to their room
    for (let i = 0; i != rooms[posNewRoom].userSockets.length; i++) {
      rooms[posNewRoom].userSockets[i].emit(
        "updateChat",
        "SERVER",
        data.username + " has connected to this room"
      );
    }
    // send client to room passed in parameter
    rooms[posNewRoom].userSockets.push(ctx.websocket);
    // and stores the index of the userSocket to delete it when switching room
    ctx.websocket.index = rooms[posNewRoom].userSockets.length;
    // echo to client they've connected
    ctx.websocket.emit(
      "updateChat",
      "SERVER",
      "you have connected to " + data.newRoom.name
    );
  });

  // when the user disconnects, perform this
  ctx.websocket.on("disconnect", async () => {
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
    if (ctx.websocket.room != undefined) {
      let pos = await isRoomAvailable(ctx.websocket.room._id);
      // We put the current user's socket out from the room list.
      delete rooms[pos].userSocket[ctx.websocket.index];
      // If the current user is connected to a room, we tell to the room that he has disconnected
      if (pos != -1) {
        for (let i = 0; i != rooms[pos].userSockets.length; i++) {
          rooms[pos].userSockets[i].emit(
            "updateChat",
            "SERVER",
            ctx.websocket.username + " disconnected from this room"
          );
        }
      }
    }
    // Finally, we close the current socket
    ctx.websocket.close();
    console.log("weshout");
  });
});

socket.listen(config.WS_PORT, async () => {
  console.log("#Websocket port: *:" + config.WS_PORT);
});
