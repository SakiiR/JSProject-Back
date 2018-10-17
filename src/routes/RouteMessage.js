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
  async read(ctx) {
    const user = ctx.state.user;
    const message_id = ctx.params.id;
    const message = await Message.findByIdAndRemove(message_id);
    if (message === null) ctx.throw(404, ctx.i18n.__("Message not found!"));
    if (user._id !== message.from)
      ctx.throw(401, ctx.i18n.__("You don't own this message"));
    ctx.throw(204, ctx.i18n.__("Message deleted"));
  }
}

export default RouteMessage;
