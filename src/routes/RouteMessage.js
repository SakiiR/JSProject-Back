import Route from "./Route";
import Message from "../models/Message";
import authMiddleware from "../middlewares/Auth";

@Route.Route({
  middlewares: [authMiddleware]
})
class RouteMessage extends Route {
  constructor(params) {
    super({ ...params });
  }

  @Route.Delete({
    path: "/:id"
  })
  async delete(ctx) {
    const user = ctx.state.user;
    const message_id = ctx.params.id;
    const message = await Message.findById(message_id);
    if (message === null) ctx.throw(404, ctx.i18n.__("Message not found!"));
    if (message.from.toString() !== user._id.toString())
      ctx.throw(401, ctx.i18n.__("You don't own this message"));
    const res = await Message.findByIdAndRemove(message_id);
    if (res === null)
      ctx.throw(500, ctx.i18n.__("Can't remove the message... don't know why"));
    ctx.status = 200;
    ctx.body = {
      message: ctx.i18n.__("Message deleted"),
      message_body: message
    };
  }
}

export default RouteMessage;
