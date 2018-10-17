import { compareHash } from "../utils/hash";

async function isAuthenticated(ctx) {
  return !(ctx.state.user === null);
}

async function isAuthenticatedRoom(ctx) {
  const room = ctx.state.room;
  const room_password = this.body(ctx).password;

  if (room.private)
    return compareHash(room_password + room.salt, room.password) === true;
  return true;
}

export { isAuthenticated, isAuthenticatedRoom };
