import { Types } from "koa-smart";
import Route from "./Route";
import Room from "../models/Room";
import Message from "../models/Message";
import { hashPassword, generateSalt } from "../utils/hash";
import { isAuthenticated, isAuthenticatedRoom } from "../utils/accesses";
import roomMiddleware from "../middlewares/Room";

@Route.Route({
  middlewares: [roomMiddleware],
  accesses: [isAuthenticated]
})
class RouteRoom extends Route {
  constructor(params) {
    super({ ...params });
  }

  @Route.Get({
    path: ""
  })
  async list(ctx) {
    const rooms = (await Room.find({}).select("-password -salt")) || [];
    this.sendOk(
      ctx,
      {
        rooms
      },
      ctx.i18n.__("Successfully read rooms")
    );
  }

  @Route.Post({
    path: "/:id/messages",
    accesses: [isAuthenticatedRoom],
    bodyType: Types.object().keys({
      password: Types.string()
    })
  })
  async messages(ctx) {
    const room = ctx.state.room;
    const room_id = room._id;
    const messages = (await Message.find({ room: room_id })) || [];

    return this.sendOk(
      ctx,
      { messages },
      "Successfully got messages from room " + room.name
    );
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
    const body = this.body(ctx);
    const user_id = ctx.state.user._id;
    const room = await Room.findOne({ name: body.name });
    const { private: priv, password, name, description } = body;
    if (room !== null)
      ctx.throw(409, ctx.i18n.__("This room already exists !"));
    let salt = null;
    let hash = null;
    if (priv === true) {
      if (password !== null) {
        salt = generateSalt();
        hash = await hashPassword(password + salt);
      } else
        ctx.throw(
          403,
          ctx.i18n.__(
            "If the room is private, you must supply a non empty password."
          )
        );
    }
    const result = (await Room.create({
      creator: user_id,
      name: name,
      description:
        description || ctx.i18n.__("No description for room ") + name,
      private: priv,
      password: hash,
      salt: salt
    })).toObject();
    delete result.password, result.salt;
    if (result === null)
      ctx.throw(500, ctx.i18n.__("Failed to create room ..."));
    ctx.throw(201, ctx.i18n.__("Room Created!"));
  }

  @Route.Delete({
    accesses: [isAuthenticatedRoom],
    path: "/:id"
  })
  async delete(ctx) {
    const { _id: room_id } = ctx.state.room;

    const result = await Room.findByIdAndDelete(room_id);
    if (result === null) ctx.throw(500, ctx.i18n.__("Room can't be deleted"));
    ctx.throw(201, ctx.i18n.__("Room deleted"));
  }

  @Route.Post({
    path: ":id/message",
    accesses: [isAuthenticatedRoom],
    bodyType: Types.object().keys({
      text: Types.string().required(),
      password: Types.string()
    })
  })
  async send_message(ctx) {
    const { _id: user_id } = ctx.state.user;
    const { _id: room_id } = ctx.state.room;
    const body = this.body(ctx);
    const message_text = body.text;
    const result = await Message.create({
      from: user_id,
      text: message_text,
      room: room_id
    });
    if (result === null)
      return this.send(ctx, 500, ctx.i18n.__("Failed to create the message"));
    ctx.throw(201, ctx.i18n.__("Message sent"));
  }
}

export default RouteRoom;
