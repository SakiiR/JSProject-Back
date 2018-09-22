import { Types } from 'koa-smart';
import jwt from "jsonwebtoken";
import Route from './Route';
import User from '../models/User';
import Token from '../models/Token';
import config from "../config";
import { hashPassword, generateSalt, compareHash } from '../utils/hash';

export default class RouteAuth extends Route {
	constructor(params) {
		super({ ...params });
	}

	async function isAuthorized(ctx) {
	    token = Token.findOne({value: ctx.headers.authorization});
	    if (token === null)
	    	return false;
	    return true;
    }

	@Route.Post({
		path: '/login',
		bodyType: Types.object().keys({
			username: Types.string().required(),
			password: Types.string().required(),
		})
	})
	async authenticate(ctx) {
		let response = null;
		const error = 'Bad Username or Password';
		try {
			const body = this.body(ctx);
			const user = await User.findOne({ username: body.username });
			if (user === null) throw error;
			const matched = compareHash(body.password + user.salt, user.password);
			if (!matched) throw error;
			const token = jwt.sign({ username: user.username }, config.secret, {
				expiresIn: "1h"
			});
			const result = await Token.create({ value: token });
			console.log("Result: " + result);
			response = {
				user: {
					token,
					username: user.username
				}
			};
		} catch (err) {
			return this.send(ctx, 401, err, null);
		}
		this.sendOk(ctx, response, "Successfully generated your token");
	}

	@Route.Post({
		path: '/register',
		bodyType: Types.object().keys({
			username: Types.string().required(),
			password: Types.string().required(),
		})
	})
	async register(ctx) {
		try {
			const body = this.body(ctx);
			const user = await User.findOne({username: body.username});
			if (user !== null)
				throw "Username is already taken!";
			const salt = generateSalt();
			const result = await User.create({ username: body.username, password: await hashPassword(body.password + salt), salt: salt });
			console.log("Result: ", result);
		} catch (err) {
			return this.send(ctx, 401, err, null);
		}
		this.sendOk(ctx, null, "User created");
	}

	@Route.Get({
		accesses: [isAuthorized],
		path: '/logout',
		bodyType: Types.object().keys({
			username: Types.string().required(),
			password: Types.string().required(),
		})
	})
	async logout(ctx) {
		let response = null;
		const error = 'Bad token';
		try {
			const body = this.body(ctx);
			const token = await Token.findOneAndRemove({ value: ctx.headers.authorization });
			if (token === null) throw error;
		} catch (err) {
			return this.send(ctx, 401, err, null);
		}
		this.sendOk(ctx, null, "Successfully deleted your token");
	}
}
