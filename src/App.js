import { join } from "path";
import { App as AppBase } from "koa-smart";
import config from "./config";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import {
  i18n,
  bodyParser,
  compress,
  cors,
  helmet,
  addDefaultBody,
  handleError,
  logger,
  RateLimit,
  RateLimitStores
} from "koa-smart/middlewares";
import socketIO from "socket.io";
import User from "./models/User";
import Room from "./models/Room";
import { compareHash } from "./utils/hash";

mongoose.Promise = global.Promise;
mongoose.connect(
  config.MONGO_URL,
  { useNewUrlParser: true }
);
mongoose.set("useCreateIndex", true);

// Set Default Option
RateLimit.defaultOptions({
  // in production you should use RateLimitStores.Sequelize or create your own
  // see https://github.com/ysocorp/koa2-ratelimit for more information
  store: new RateLimitStores.Memory() // By default it will create MemoryStore
});

// the starting class must extend appBase, provided by koa-smart
export default class App extends AppBase {
  constructor() {
    super({
      port: config.API_PORT,
      // routeParam is an object and it will be give as parametter to all routes
      // so for example you can give models to all your route so you can access on route
      routeParam: {},
      generateDoc: true, // indicates we want generate documentation automatically
      docPath: join(__dirname, "..", "apidoc")
    });
  }

  async start() {
    // TODO pass all models to all routes.
    // Eg:
    //    const models = await getModels()
    //    this.routeParam.models = models

    // we add the relevant middlewares to our API

    const koaApp = this.koaApp;
    koaApp.io = socketIO(koaApp.server);

    koaApp.io.of(/^\/room-[a-f0-9]{24}$/).on("connection", client => {
      const newNamespace = client.nsp;

      client.on("authentication", async data => {
        const { token, room_password } = data;
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
            if (!compareHash(room.salt + room_password, room.password)) {
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
              socket.emit("new-room", data);
            }
          });
        });
      });
    });

    koaApp.io.of("/rooms").on("connection", client => {
      const roomsNamespace = client.nsp;
      client.on("authentication", async data => {
        const { token } = data;

        try {
          const decoded = await jwt.verify(token, config.secret);
          client.username = decoded.username;
          client.authenticated = true;
        } catch (err) {
          console.error("Failed to decode token");
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

    koaApp.io.listen(4242);

    super.addMiddlewares([
      cors({ credentials: true }), // add cors headers to the requests
      helmet(), // adds various security headers to our API's responses
      bodyParser(), // automatically parses the body of POST/PUT/PATCH requests, and adds it to the koa context
      i18n(this.koaApp, {
        directory: join(__dirname, "locales"),
        locales: ["en", "fr"],
        modes: ["query", "subdomain", "cookie", "header", "tld"],
        extension: ".json"
      }), // allows us to easily localize the API
      async (ctx, next) => {
        try {
          await next();
        } catch (e) {
          ctx.status = e.status || 500;
          ctx.body = {
            message: e.message || e || ctx.i18n.__("Unknown error")
          };
          if (ctx.status === 500) console.error(e);
        }
      },
      logger(), // gives detailed logs of each request made on the API
      addDefaultBody(), // if no body is present, put an empty object "{}" in its place.
      compress({}), // compresses requests made to the API
      RateLimit.middleware({ interval: { min: 1 }, max: 100 }) // this will limit every user to call a maximum of 100 request per minute,
    ]);

    super.mountFolder(join(__dirname, "routes"), "/"); // adds a folder to scan for route files
    return super.start();
  }
}
