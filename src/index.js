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

// Using routes
socket.ws.use(async ctx => {
  const roomss = await Room.find({});
  for (var i = 0; i != roomss.length; i++) rooms.push(roomss[i]);
  console.log("weshin");
  // `ctx` is the regular koa context created from the `ws` onConnection `socket.upgradeReq` object.
  // the websocket is added to the context on `ctx.websocket`.
  ctx.websocket.on("message", message => {
    // do something with the message from client
    console.log(message);
  });
  ctx.websocket.emit("message", "Connexion OK");
  // when the client emits 'adduser', this listens and executes
  ctx.websocket.on("addUser", async (username, room) => {
    // store the username in the socket session for this client
    ctx.websocket.username = username;
    // store the room name in the socket session for this client
    if (rooms.indexOf(room) != -1) {
      ctx.websocket.room = room;
      // add the client's username to the global list
      usernames[username] = username;
      // send client to room 1
      ctx.websocket.join(room);
      // echo to client they've connected
      ctx.websocket.emit(
        "updateChat",
        "SERVER",
        "you have connected to " + room
      );
      // echo to room 1 that a person has connected to their room
      ctx.websocket.broadcast
        .to(room)
        .emit("updateChat", "SERVER", username + " has connected to this room");
      ctx.websocket.emit("updateRooms", rooms, room);
    } else ctx.websocket.emit("error", "Room inexistante");
  });

  // when the client emits 'sendchat', this listens and executes
  ctx.websocket.on("sendChat", async () => {
    await Message.create(
      {
        id_sender: ctx.req.body.id_sender,
        id_room: ctx.req.body.id_room,
        content: ctx.req.body.content,
        status: "active"
      },
      async (err, message) => {
        if (err)
          return ctx.res
            .status(500)
            .send(
              "There was a problem adding the information to the database."
            );
        else {
          ctx.res.status(200).send(message);
          ctx.websockets
            .in(socket.room)
            .emit("updateChat", socket.username, message);
        }
      }
    );
  });

  ctx.websocket.on("switchRoom", async newroom => {
    // leave the current room (stored in session)
    ctx.websocket.leave(socket.room);
    // join new room, received as function parameter
    ctx.websocket.join(newroom);
    ctx.websocket.emit(
      "updateChat",
      "SERVER",
      "you have connected to " + newroom
    );
    // sent message to OLD room
    ctx.websocket.broadcast
      .to(socket.room)
      .emit("updateChat", "SERVER", socket.username + " has left this room");
    // update socket session room title
    ctx.websocket.room = newroom;
    ctx.websocket.broadcast
      .to(newroom)
      .emit("updateChat", "SERVER", socket.username + " has joined this room");
    ctx.websocket.emit("updateRooms", rooms, newroom);
  });

  // when the user disconnects.. perform this
  ctx.websocket.on("disconnect", async () => {
    // remove the username from global usernames list
    delete usernames[ctx.websocket.username];
    // update list of users in chat, client-side
    ctx.websockets.emit("updateUsers", usernames);
    // echo globally that this client has left
    ctx.websocket.broadcast.emit(
      "updateChat",
      "SERVER",
      ctx.websocket.username + " has disconnected"
    );
    ctx.websocket.leave(ctx.websocket.room);
    console.log("weshout");
  });
});

socket.listen(config.WS_PORT, async () => {
  console.log("#BalanceTonPort: *:" + config.WS_PORT);
});
