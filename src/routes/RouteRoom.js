import { Types } from "koa-smart";
import Route from "./Route";
import Room from "../models/Room";
import Message from "../models/Message";
import { hashPassword, generateSalt } from "../utils/hash";
import roomMiddleware from "../middlewares/Room";
import authMiddleware from "../middlewares/Auth";

@Route.Route({
  middlewares: [authMiddleware, roomMiddleware]
})
class RouteRoom extends Route {
  constructor(params) {
    super({ ...params });
  }

  @Route.Get({
    path: ""
  })
  async list(ctx) {
    const rooms =
      (await Room.find({})
        .populate("creator", "username")
        .select("-salt -password")) || [];
    this.sendOk(
      ctx,
      {
        rooms
      },
      ctx.i18n.__("Successfully read rooms")
    );
  }

  @Route.Get({
    path: "/:id/messages",
    bodyType: Types.object().keys({
      password: Types.string()
    })
  })
  async messages(ctx) {
    const room = ctx.state.room;
    const room_id = room._id;
    const messages =
      (await Message.find({ room: room_id })
        .populate("from", "username")
        .populate("room", "name")) || [];

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
      description: Types.string(),
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
      if (password != null) {
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
    delete result.password;
    delete result.salt;
    if (result === null)
      ctx.throw(500, ctx.i18n.__("Failed to create room ..."));
    ctx.body = { data: result, message: ctx.i18n.__("Room created!") };
    ctx.status = 201;
  }

  @Route.Delete({
    path: "/:id"
  })
  async delete(ctx) {
    const { _id: room_id, creator } = ctx.state.room;
    const { user } = ctx.state;
    if (user._id.toString() !== creator._id.toString())
      ctx.throw(401, ctx.i18n.__("You don't own this room!"));
    let result = await Room.findByIdAndDelete(room_id);
    if (result === null) ctx.throw(500, ctx.i18n.__("Room can't be deleted"));
    result = await Message.find({ room: room_id })
      .remove()
      .exec();
    if (result === null)
      ctx.throw(500, ctx.i18n.__("Room's messages can't be deleted"));
    ctx.status = 201;
    ctx.body = { message: ctx.i18n.__("Room deleted"), room: ctx.state.room };
  }

  @Route.Post({
    path: ":id/message",
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
    const message_id = result._id;
    const message = await Message.findById(message_id)
      .populate("from", "username")
      .populate("room", "name");
    if (result === null)
      return this.send(ctx, 500, ctx.i18n.__("Failed to create the message"));
    ctx.status = 201;
    ctx.body = { message: ctx.i18n.__("Message sent"), message_body: message };
  }
}

export default RouteRoom;
