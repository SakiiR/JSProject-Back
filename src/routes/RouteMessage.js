import { Types } from "koa-smart";
import Route from "./Route";
import User from "../models/User";
import Room from "../models/Room";
import Message from "../models/Message";
import { compareHash } from "../utils/hash";
import authMiddleware from "../middlewares/Auth";

@Route.Route({
  middlewares: [authMiddleware]
})
class RouteMessage extends Route {
  constructor(params) {
    super({ ...params });
  }

  @Route.Post({
    path: "",
    bodyType: Types.object().keys({
      from: Types.string().required(),
      text: Types.string().required(),
      room: Types.string().required(),
      password: Types.string().required()
    })
  })
  async create(ctx) {
    try {
      const body = this.body(ctx);
      const room = await Room.findOne({ _id: body.room });
      if (room === null) throw "Room not found";
      if (room.private) {
        const matched = compareHash(body.password + room.salt, room.password);
        if (!matched) throw "Bad room password";
      }
      const user = await User.findOne({ _id: body.from });
      if (user === null) throw "User not found";
      const result = await Message.create({
        from: body.from,
        text: body.text,
        room: body.room
      });
      if (result === null)
        return this.send(ctx, 403, "Failed to create the message");
    } catch (err) {
      return this.send(ctx, 404, err, null);
    }
    this.sendOk(ctx, null, "Message sent");
  }

  @Route.Delete({
    path: "/:id"
  })
  async read(ctx) {
    const error = "This message doesn't exist";
    try {
      const message = await Message.findByIdAndRemove(ctx.params.id);
      if (message === null) throw error;
    } catch (err) {
      return this.send(ctx, 404, err, null);
    }
    this.sendOk(ctx, null, "Successfully deleted message");
  }
}

export default RouteMessage;
