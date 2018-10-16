import { Types } from "koa-smart";
import Route from "./Route";
import Room from "../models/Room";
import Message from "../models/Message";
import { hashPassword, generateSalt, compareHash } from "../utils/hash";
import authMiddleware from "../middlewares/Auth";

@Route.Route({
  middlewares: [authMiddleware]
})
class RouteRoom extends Route {
  constructor(params) {
    super({ ...params });
  }

  @Route.Get({
    path: ""
  })
  async list(ctx) {
    let response = null;
    try {
      const rooms = await Room.find({}).select("-password -salt");
      response = {
        rooms: rooms
      };
    } catch (err) {
      return this.send(ctx, 404, err, null);
    }
    this.sendOk(ctx, response, "Successfully read rooms");
  }

  @Route.Post({
    path: "/:id/join",
    bodyType: Types.object().keys({
      password: Types.string().required()
    })
  })
  async joinRoom(ctx) {
    const error = "Bad Room password";
    try {
      const body = this.body(ctx);
      const room = await Room.findOne({ _id: ctx.params.id });
      if (room === null) throw "Room not found";
      if (room.private) {
        const matched = compareHash(body.password + room.salt, room.password);
        if (!matched) throw error;
      }
    } catch (err) {
      if (typeof err !== "string")
        return this.send(ctx, 401, "Unknown error ...", null);
      return this.send(ctx, 401, err, null);
    }
    this.sendOk(ctx, null, "Successfully connected to the room");
  }

  @Route.Post({
    path: "/:id/messages",
    bodyType: Types.object().keys({
      password: Types.string()
    })
  })
  async post(ctx) {
    const password = this.body(ctx).password;
    try {
      const room = await Room.findOne({ _id: ctx.params.id });
      if (room === null) throw "Room not found";
      if (
        room.private &&
        compareHash(password + room.salt, room.password) === false
      )
        throw "Bad room password";
      const messages = (await Message.find({ room: ctx.params.id })) || [];
      return this.sendOk(
        ctx,
        { messages },
        "Successfully got messages from room " + room.name
      );
    } catch (err) {
      if (typeof err !== "string")
        return this.send(ctx, 401, "Unknown error ...", null);
      return this.send(ctx, 401, err, null);
    }
  }

  @Route.Post({
    path: "",
    bodyType: Types.object().keys({
      name: Types.string().required(),
      description: Types.string().required(),
      private: Types.boolean().required(),
      password: Types.string()
    })
  })
  async create(ctx) {
    try {
      const body = this.body(ctx);
      const creator = ctx.state.user._id;
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
      const result = (await Room.create({
        creator: creator,
        name: body.name,
        description: body.description || "No description for " + body.name,
        private: body.private,
        password: password,
        salt: salt
      })).toObject();
      delete result.password, result.salt;
      if (result === null) throw "Failed to create room ...";
      return this.sendOk(ctx, result, "Room Created!");
    } catch (err) {
      if (typeof err !== "string")
        return this.send(ctx, 401, "Unknown error ...", null);
      return this.send(ctx, 401, err, null);
    }
  }

  @Route.Delete({
    path: "/:id"
  })
  async delete(ctx) {
    let response = {};
    try {
      const rooms = await Room.findByIdAndRemove(ctx.params.id);
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
