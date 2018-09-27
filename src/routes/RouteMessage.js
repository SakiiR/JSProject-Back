import { Types } from "koa-smart";
import Route from "./Route";
import User from "../models/User";
import Room from "../models/Room";
import Message from "../models/Message";
import authMiddleware from "../middlewares/Auth";

@Route.Route({
  middlewares: [authMiddleware]
})
class RouteMessage extends Route {
  constructor(params) {
    super({ ...params });
  }

  @Route.Post({
    path: "/messages/",
    bodyType: Types.object().keys({
      from: Types.number()
        .integer()
        .required(),
      text: Types.string().required(),
      room: Types.number()
        .integer()
        .required()
    })
  })
  async create(ctx) {
    try {
      const body = this.body(ctx);
      const room = await Room.findOne({ id: ctx.params.room });
      if (room !== null) throw "Room not found";
      const user = await User.findOne({ id: ctx.params.room });
      if (user !== null) throw "User not found";
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
    path: "/messages/:id"
  })
  async read(ctx) {
    const error = "This message doesn't exist";
    try {
      const message = await Message.findByIdAndRemove({ id: ctx.params.id });
      if (message === null) throw error;
    } catch (err) {
      return this.send(ctx, 404, err, null);
    }
    this.sendOk(ctx, null, "Successfully deleted message");
  }
}

export default RouteMessage;
