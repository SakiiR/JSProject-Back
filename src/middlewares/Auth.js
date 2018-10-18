import jwt from "jsonwebtoken";
import config from "../config";
import User from "../models/User";

const authMiddleware = async (ctx, next = null) => {
  try {
    const token = ctx.request.header.authorization;
    const decoded = await jwt.verify(token, config.secret);
    const user = await User.findOne({ username: decoded.username });
    ctx.state.user = user;
  } catch (e) {
    ctx.state.user = null;
    ctx.throw(401, ctx.i18n.__("Unauthorized"));
  }
  if (next !== null) return await next();
};

export default authMiddleware;
