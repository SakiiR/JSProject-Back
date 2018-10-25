import { Types } from "koa-smart";
import jwt from "jsonwebtoken";
import Route from "./Route";
import User from "../models/User";
import config from "../config";
import { hashPassword, generateSalt, compareHash } from "../utils/hash";

class RouteAuth extends Route {
  constructor(params) {
    super({ ...params });
  }

  @Route.Post({
    path: "/login",
    bodyType: Types.object().keys({
      username: Types.string().required(),
      password: Types.string().required()
    })
  })
  async authenticate(ctx) {
    const body = this.body(ctx);
    const user = await User.findOne({ username: body.username });
    if (user === null) ctx.throw(401, ctx.i18n.__("Bad username or password"));
    const matched = compareHash(body.password + user.salt, user.password);
    if (matched !== true)
      ctx.throw(401, ctx.i18n.__("Bad username or password"));
    const token = jwt.sign({ username: user.username }, config.secret, {
      expiresIn: "1h"
    });
    this.sendOk(
      ctx,
      {
        user: {
          token,
          username: user.username
        }
      },
      ctx.i18n.__("Successfully generated your token")
    );
  }

  @Route.Post({
    path: "/register",
    bodyType: Types.object().keys({
      username: Types.string().required(),
      password: Types.string().required()
    })
  })
  async register(ctx) {
    const body = this.body(ctx);
    const user = await User.findOne({ username: body.username });
    if (user !== null) ctx.throw(409, ctx.i18n.__("User already exists"));
    const salt = generateSalt();
    const result = await User.create({
      username: body.username,
      password: await hashPassword(body.password + salt),
      salt: salt
    });
    if (result === null)
      ctx.throw(500, ctx.i18n.__("Failed to create the user"));
    ctx.status = 201;
    ctx.body = {
      message: ctx.i18n.__("User Created")
    };
  }
}

export default RouteAuth;
