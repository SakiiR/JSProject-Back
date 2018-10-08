import { Types } from "koa-smart";
import Route from "./Route";
import Room from "../models/Room";
import Message from "../models/Message";
import { hashPassword, generateSalt } from "../utils/hash";
import authMiddleware from "../middlewares/Auth";

@Route.Route({
  middlewares: [authMiddleware]
})
class RouteRoom extends Route {
  constructor(params) {
    super({ ...params });
  }

  @Route.Get({
    path: "/rooms/"
  })
  async list(ctx) {
    let response = null;
    const error = "No room found";
    try {
      const rooms = await Room.find({});
      if (rooms === null) throw error;
      response = {
        rooms: rooms
      };
    } catch (err) {
      return this.send(ctx, 404, err, null);
    }
    this.sendOk(ctx, response, "Successfully read rooms");
  }

  @Route.Get({
    path: "/rooms/:id/messages"
  })
  async get(ctx) {
    let response = null;
    const error = "No message found";
    try {
      const messages = await Message.find({ room: ctx.params.id });
      if (messages === null) throw error;
      response = {
        messages: messages
      };
    } catch (err) {
      return this.send(ctx, 404, err, null);
    }
    this.sendOk(
      ctx,
      response,
      "Successfully read messages from room " + ctx.params.id
    );
  }

  @Route.Post({
    path: "/rooms/",
    bodyType: Types.object().keys({
      creator: Types.number()
        .integer()
        .required(),
      name: Types.string().required(),
      description: Types.string().required()
    })
  })
  async create(ctx) {
    try {
      const body = this.body(ctx);
      const room = await Room.findOne({ name: body.name });
      if (room !== null) throw "This room already exists !";
      let salt = "";
      let password = "";
      if (body.private === true) {
        if (body.password !== null) {
          salt = generateSalt();
          password = await hashPassword(body.password + salt);
        } else
          return this.send(
            ctx,
            403,
            "If the room is private, you must supply a non empty password."
          );
      }
      const result = await Room.create({
        creator: body.creator,
        name: body.name,
        description: body.description,
        private: body.private,
        password: password,
        salt: salt
      });
      if (result === null) return this.send(ctx, 403, "Failed to create room");
    } catch (err) {
      return this.send(ctx, 401, err, null);
    }
    this.sendOk(ctx, null, "Room created");
  }

  @Route.Delete({
    path: "/rooms/:id"
  })
  async delete(ctx) {
    let response = {};
    try {
      const rooms = await Room.findByIdAndRemove({ id: ctx.params.id });
      if (rooms === null)
        return this.send(ctx, 403, "Failed to retrieve room to delete");
      response["rooms"] = rooms;
    } catch (err) {
      return this.send(ctx, 404, err, null);
    }
    this.sendOk(ctx, response, "Successfully deleted room");
  }
}

export default RouteRoom;
