import socketIO from "socket.io";
import Room from "../models/Room";
import config from "../config";
import { compareHash } from "../utils/hash";
import jwt from "jsonwebtoken";

const initWebsockets = koaApp => {
  koaApp.io = socketIO(koaApp.server, { path: "/ws/socket.io" });

  koaApp.io.of(/^\/ws\/rooms-[a-f0-9]{24}$/).on("connection", client => {
    const newNamespace = client.nsp;

    console.log(`Client connected to ${newNamespace.name}`);
    client.on("authentication", async data => {
      const { token, password: room_password } = data;
      const room_id = newNamespace.name.split("-")[1];

      try {
        const decoded = await jwt.verify(token, config.secret);
        client.username = decoded.username;
        client.authenticated = true;
      } catch (err) {
        console.error("Failed to decode token");
      }

      try {
        const room = await Room.findById(room_id);
        if (room === null) client.disconnect(true);
        if (room.private) {
          console.log(`${room.salt}   ${room_password}    ${room.password}`);
          if (!compareHash(room_password + room.salt, room.password)) {
            client.disconnect(true);
          }
        }
        client.authenticated_room = true;
      } catch (err) {
        console.error("Failed to retrieve room id");
      }
    });

    client.on("new-message", async data => {
      newNamespace.clients((err, clients) => {
        clients.map(client => {
          const socket = newNamespace.connected[client];

          if (socket.authenticated_room) {
            socket.emit("new-message", data);
          }
        });
      });
    });

    client.on("removed-message", async data => {
      newNamespace.clients((err, clients) => {
        clients.map(client => {
          const socket = newNamespace.connected[client];

          if (socket.authenticated_room) {
            socket.emit("removed-message", data);
          }
        });
      });
    });
  });

  koaApp.io.of("/ws/rooms").on("connection", client => {
    console.log("[+] Client connected to /rooms");
    const roomsNamespace = client.nsp;
    client.on("authentication", async data => {
      const { token } = data;

      try {
        const decoded = await jwt.verify(token, config.secret);
        client.username = decoded.username;
        client.authenticated = true;
      } catch (err) {
        console.error("Failed to decode token");
        console.error(err);
      }
    });

    /**
     * Supposed to send the new created room data.
     */
    client.on("new-room", async data => {
      if (client.authenticated) {
        roomsNamespace.clients((err, clients) => {
          clients.map(client => {
            const socket = roomsNamespace.connected[client];

            socket.emit("new-room", data);
          });
        });
      }
    });

    client.on("removed-room", async data => {
      if (client.authenticated) {
        roomsNamespace.clients((err, clients) => {
          clients.map(client => {
            const socket = roomsNamespace.connected[client];

            socket.emit("removed-room", data);
          });
        });
      }
    });
  });

  koaApp.io.listen(config.WS_PORT);
};

export default initWebsockets;
