import jwt from "jsonwebtoken";
import config from "../config";
import User from "../models/User";

const authMiddleware = async (ctx, next) => {
  try {
    const token = ctx.request.header.authorization;
    if (token == null) throw "Token not specified";
    try {
      const decoded = await jwt.verify(token, config.secret);
      const user = await User.findOne({ username: decoded.username });
      if (user === null) throw "error";
    } catch (err) {
      throw "Invalid token";
    }
  } catch (err) {
    if (typeof err === "string") {
      ctx.status = 401;
      ctx.body = { message: err };
      return null;
    } else console.log(err);
  }
  return await next();
};

export default authMiddleware;
