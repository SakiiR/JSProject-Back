import Room from "../models/Room";

const roomMiddleware = async (ctx, next) => {
  try {
    const room_id = ctx.params.id;
    const room = await Room.findOne({ _id: room_id });
    ctx.state.room = room;
  } catch (e) {
    ctx.state.room = null;
  }
  return await next();
};

export default roomMiddleware;
