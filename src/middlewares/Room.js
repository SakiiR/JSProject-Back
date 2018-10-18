import { compareHash } from "../utils/hash";
import Room from "../models/Room";

const roomMiddleware = async (ctx, next) => {
  const room_password =
    ctx.request.query.password || ctx.request.body.password || null;
  const room_id = ctx.params.id || null;
  if (room_id === null) return await next();
  const room = await Room.findOne({ _id: room_id });
  if (room === null) ctx.throw(404, ctx.i18n.__("Room not found"));
  if (room.private === true) {
    if (compareHash(room_password + room.salt, room.password) !== true)
      ctx.throw(401, ctx.i18n.__("Invalid room password"));
  }
  ctx.state.room = room;
  return await next();
};

export default roomMiddleware;
